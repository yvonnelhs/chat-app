const dotenv = require("dotenv");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const MongoClient = require("mongodb").MongoClient;

dotenv.config();

async function main() {
  const PROTO_PATH = "chat.proto";
  const SERVER_URI = "0.0.0.0:9090";

  const packageDefinition = protoLoader.loadSync(PROTO_PATH);
  const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

  const client = new MongoClient(process.env.DB_URI);
  await client.connect();
  const db = client.db("chatAppDB");
  const messagesCollection = db.collection("messages");

  const STREAM_LIST = new Map();

  const chatStream = async (call) => {
    const client = call.metadata.get("user")[0];
    console.log("user: " + client);
    STREAM_LIST.set(client, call);

    call.on("data", async (data) => {
      console.log(data);
      const { recipient, content, timestamp } = data;
      const sender = call.metadata.get("user")[0];

      // Save message to DB
      try {
        message = {
          ...data,
          sender,
        };
        await messagesCollection.insertOne(message);
        console.log("Message saved:", message);
      } catch (error) {
        console.error("Error saving message:", error);
      }

      console.log(STREAM_LIST.keys());
      if (STREAM_LIST.has(recipient)) {
        outgoingMessage = {
          sender,
          content,
          timestamp,
        };
        const recipientStream = STREAM_LIST.get(recipient);
        recipientStream.write(outgoingMessage);
      } else {
        console.log("recipient not online");
      }
    });
  };

  const server = new grpc.Server();

  server.addService(protoDescriptor.ChatService.service, {
    chatStream,
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
