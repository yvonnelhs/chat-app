const dotenv = require("dotenv");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const crypto = require("crypto");
const { MongoClient, ObjectId } = require("mongodb");

dotenv.config();

async function main() {
  const PROTO_PATH = "chat.proto";
  const SERVER_URI = "0.0.0.0:9090";

  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

  const client = new MongoClient(process.env.DB_URI);
  await client.connect();
  const db = client.db("chatAppDB");
  const CHATS_COLLECTION = db.collection("chats");
  const USERS_COLLECTION = db.collection("users");

  const DIRECT_STREAM_LIST = new Map();

  const generateChatId = (participants) => {
    const sortedParticipants = participants.sort().join("-");
    return crypto.createHash("sha256").update(sortedParticipants).digest("hex");
  };

  const updateChatAndUser = async (sender, recipient, data) => {
    console.log("=== IN CREATE FUNCTION ===");
    console.log(`userids: ${sender}, ${recipient}`);

    const chatId = generateChatId([sender, recipient]);
    const { content, timestamp } = data;
    const newMessage = {
      sender,
      content,
      timestamp,
    };

    if (await CHATS_COLLECTION.findOne({ _id: chatId })) {
      console.log("chat exists already");

      const filterChat = { _id: chatId };
      const updateChat = { $push: { messages: newMessage } };

      const filterUser = {
        _id: { $in: [new ObjectId(sender), new ObjectId(recipient)] },
        "chats.chat_id": chatId,
      };
      const updateUser = {
        $set: {
          "chats.$.timestamp": timestamp,
          "chats.$.last_message": content,
        },
      };

      await Promise.all([
        CHATS_COLLECTION.updateOne(filterChat, updateChat),
        USERS_COLLECTION.updateMany(filterUser, updateUser),
      ]);
    } else {
      console.log("Creating a new chat ...");

      await CHATS_COLLECTION.insertOne({
        _id: chatId,
        type: "direct",
        group_name: null,
        participants: [sender, recipient],
        created_at: new Date().toISOString(),
        messages: [newMessage],
      });

      const filter = {
        _id: { $in: [new ObjectId(sender), new ObjectId(recipient)] },
      };

      const update = {
        $addToSet: {
          chats: {
            chat_id: chatId,
            last_message: content,
            timestamp,
          },
        },
      };

      await USERS_COLLECTION.updateMany(filter, update);
    }
  };

  const sendDirectMessage = async (call) => {
    const client = call.metadata.get("user")[0];
    console.log(client + " joins!");
    DIRECT_STREAM_LIST.set(client, call);

    call.on("data", async (data) => {
      console.log(data);

      const sender = call.metadata.get("user")[0];
      const { recipient, content, timestamp } = data;
      await updateChatAndUser(sender, recipient, data);

      if (DIRECT_STREAM_LIST.has(recipient)) {
        outgoingMessage = {
          sender,
          content,
          timestamp,
        };
        const recipientStream = DIRECT_STREAM_LIST.get(recipient);
        recipientStream.write(outgoingMessage);
      } else {
        console.log("recipient not online");
      }
    });
  };

  const server = new grpc.Server();

  server.addService(protoDescriptor.ChatService.service, {
    sendDirectMessage,
    // sendGroupMessage,
  });

  server.bindAsync(
    SERVER_URI,
    grpc.ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        console.log(err);
      } else {
        server.start();
        console.log("Server is running!");
      }
    }
  );
}

main().catch((err) => console.error("Error:", err));
