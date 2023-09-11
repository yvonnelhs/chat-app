const mongoUtil = require("../utils/mongoUtil");
const db = mongoUtil.getDb();

const CHATS_COLLECTION = db.collection("chats");

async function getChatById(req, res) {
  try {
    const chatId = req.params.chatId;
    const chat = await CHATS_COLLECTION.findOne({
      _id: chatId,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteChat(req, res) {
  try {
    const chatId = req.params.chatId;
    const result = await CHATS_COLLECTION.deleteOne({
      _id: chatId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getChatById,
  deleteChat,
};
