const router = require("express").Router();
const {
  getChatById,
  deleteChat,
} = require("../../controllers/ChatsController");

router.get("/:chatId", getChatById);
router.delete("/:chatId", deleteChat);

module.exports = router;
