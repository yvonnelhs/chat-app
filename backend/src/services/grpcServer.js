const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const crypto = require("crypto");
const mongoUtil = require("../utils/mongoUtil");

async function main() {
  const PROTO_PATH = "src/protos/chat.proto";
  const SERVER_URI = "0.0.0.0:9090";

  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

  const db = mongoUtil.getDb();
  const CHATS_COLLECTION = db.collection("chats");
  const CHAT_LIST_COLLECTION = db.collection("chatList");

  const DIRECT_STREAM_LIST = new Map();

  const generateChatId = (participants) => {
    const sortedParticipants = participants.sort().join("-");
    return crypto.createHash("sha256").update(sortedParticipants).digest("hex");
  };

  const updateChatAndUser = async (sender, recipient, data, chatId) => {
    const { content, timestamp } = data;
    const newMessage = { sender, content, timestamp };

    if (await CHATS_COLLECTION.findOne({ _id: chatId })) {
      const filterChat = { _id: chatId };
      const updateChat = { $push: { messages: newMessage } };

      const filterChatList = {
        _id: { $in: [sender, recipient] },
        "chat_list.chat_id": chatId,
      };
      const updateChatList = {
        $set: {
          "chat_list.$.timestamp": timestamp,
          "chat_list.$.last_message": content,
        },
      };

      await Promise.all([
        CHATS_COLLECTION.updateOne(filterChat, updateChat),
        CHAT_LIST_COLLECTION.updateMany(filterChatList, updateChatList),
      ]);
    } else {
      await CHATS_COLLECTION.insertOne({
        _id: chatId,
        type: "direct",
        group_name: null,
        participants: [sender, recipient],
        created_at: new Date().toISOString(),
        messages: [newMessage],
      });

      const filter = { _id: { $in: [sender, recipient] } };

      const update = {
        $addToSet: {
          chat_list: {
            chat_id: chatId,
            last_message: content,
            timestamp,
          },
        },
      };

      await CHAT_LIST_COLLECTION.updateMany(filter, update);
    }
  };

  const sendDirectMessage = async (call, callback) => {
    const sender = call.metadata.get("user")[0];
    console.log(sender + " sends a message!");
    console.log(call.request);

    const { recipient, content, timestamp } = call.request;
    const chatId = generateChatId([sender, recipient]);
    await updateChatAndUser(sender, recipient, call.request, chatId);

    if (DIRECT_STREAM_LIST.has(recipient)) {
      outgoingMessage = {
        sender,
        content,
        timestamp,
        chatId,
      };
      const recipientStream = DIRECT_STREAM_LIST.get(recipient);
      recipientStream.write(outgoingMessage);

      callback(null, {
        error: 0,
        msg: "Success",
      });
    } else {
      console.log("recipient not online");
    }
  };

  const receiveDirectMessage = async (call) => {
    const user = call.metadata.get("user")[0];
    DIRECT_STREAM_LIST.set(user, call);
    console.log(user + " joins");

    call.on("data", (incomingMessage) => {
      console.log(
        `Received message from ${incomingMessage.sender}: ${incomingMessage.content}`
      );
    });

    call.on("cancelled", () => {
      console.log(`Client ${user} has disconnected.`);
      DIRECT_STREAM_LIST.delete(user); // Remove the stream when the client disconnects
    });
  };

  const server = new grpc.Server();

  server.addService(protoDescriptor.ChatService.service, {
    sendDirectMessage,
    receiveDirectMessage,
  });

  server.bindAsync(
    SERVER_URI,
    grpc.ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        console.log(err);
      } else {
        server.start();
      }
    }
  );
}

main().catch((err) => console.error("Error:", err));
