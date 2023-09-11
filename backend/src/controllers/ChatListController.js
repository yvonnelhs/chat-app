const mongoUtil = require("../utils/mongoUtil");
const db = mongoUtil.getDb();

const CHAT_LIST_COLLECTION = db.collection("chatList");

async function getChatListById(req, res) {
  try {
    const chatListId = req.params.chatListId;
    const chatList = await CHAT_LIST_COLLECTION.findOne({
      _id: chatListId,
    });

    if (!chatList) {
      return res.status(404).json({ message: "Chat list not found" });
    }

    return res.status(200).json(chatList);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getChatListById,
};
