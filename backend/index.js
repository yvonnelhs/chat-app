const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const mongoUtil = require("./src/utils/mongoUtil");

app.use(bodyParser.json());
app.use(cors());

(async () => {
  try {
    await mongoUtil.connectToServer();
    const ChatsController = require("./src/controllers/ChatsController");
    const UsersController = require("./src/controllers/UsersController");
    const ChatListController = require("./src/controllers/ChatListController");
    const grpcServer = require("./src/services/grpcServer");

    const chatsRouter = require("./src/router/api/chatsRouter");
    const usersRouter = require("./src/router/api/usersRouter");
    const chatListRouter = require("./src/router/api/chatListRouter");
    app.use("/api/chats", chatsRouter);
    app.use("/api/users", usersRouter);
    app.use("/api/chat-list", chatListRouter);

    const PORT = process.env.PORT || 9000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
})();
