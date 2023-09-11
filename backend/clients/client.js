const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "../src/protos/chat.proto";
const SERVER_URI = "localhost:9090";

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

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
    recipient: '64eec06c11298840da9e1dbc',
    content: line,
    timestamp: new Date().toISOString(),
  };

  client.sendDirectMessage(message, metadata, (error, response) => {
    if (!error) {
      console.log('Message sent successfully');
    } else {
      console.error('Error sending message:', error);
    }
  });
});

rl.on('close', () => {
  console.log('Client closed.');
});