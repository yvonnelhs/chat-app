const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "chat.proto";
const SERVER_URI = "localhost:9090";

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// Create a gRPC client
const client = new protoDescriptor.ChatService(
  SERVER_URI,
  grpc.credentials.createInsecure()
);

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var call = client.chatStream();

call.on("data", (data) => {
  console.log(`${data.sender} ==> ${data.content}`);
});

rl.on("line", function (line) {
  if (line === "quit") {
    call.end();
    rl.close();
  } else {
    call.write({
      sender: "userid2",
      recipient: "userid1",
      content: line,
      timestamp: new Date().toISOString(),
    });
  }
});

console.log("Enter your messages below:");
