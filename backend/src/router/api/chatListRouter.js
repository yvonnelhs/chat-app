const router = require("express").Router();
const { getChatListById, updateChatAsDeleted } = require("../../controllers/ChatListController");

router.get("/:chatListId", getChatListById);

module.exports = router;
