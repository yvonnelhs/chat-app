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
    console.log("test")

    call.on('data', async (data) => {
      console.log(data)
      const { sender, recipient, content } = data;
      console.log(`Received message from ${sender}: ${data.content}`)
      
      // Save message to DB
      try {
        await messagesCollection.insertOne(data);
        console.log("Message saved:", content);
      } catch (error) {
        console.error("Error saving message:", error);
      }

      if (STREAM_LIST.has(recipient)) {
        const recipientStream = STREAM_LIST.get(recipient);
        recipientStream.write(data);
      } else {
        console.log("recipient not online")
      }

      if (!STREAM_LIST.has(sender)) {
        STREAM_LIST.set(sender, call);
      }
    })
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
