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

var metadata = new grpc.Metadata();
metadata.add('user', 'userid1');
var call = client.chatStream(metadata);

call.on("data", (data) => {
  console.log(`${data.sender} ==> ${data.content}`);
});


rl.on("line", function (line) {
  if (line === "quit") {
    call.end();
    rl.close();
  } else {
    call.write({
      recipient: "userid2",
      content: line,
      timestamp: new Date().toISOString(),
    });
  }
});

console.log("Enter your messages below:");