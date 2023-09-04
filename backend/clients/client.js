const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "../chat.proto";
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
const user = '64eeb583b054c74a26153c37'
metadata.add('user', user);

const receiveStream = client.receiveDirectMessage({}, metadata);

receiveStream.on("data", (incomingMessage) => {
  console.log(`Received message from ${incomingMessage.sender}: ${incomingMessage.content}`);
});

receiveStream.on('end', () => {
  console.log('Server stream ended.');
});

rl.on("line", (line) => {
  if (line === "quit") {
    rl.close();
    client.close();
    receiveStream.cancel();
    return;
  }

  const message = {
    recipient: '64eeb5c8b054c74a26153c38', // Replace with the actual recipient ID
    content: line,
    timestamp: new Date().toISOString(),
  };

  // Send the message using a unary request
  client.sendDirectMessage(message, metadata, (error, response) => {
    if (!error) {
      console.log('Message sent successfully');
    } else {
      console.error('Error sending message:', error);
    }
  });
});

// Handle readline close event
rl.on('close', () => {
  console.log('Client closed.');
});