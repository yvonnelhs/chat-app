const router = require("express").Router();
const {
  getUserById,
  findUserByUsername,
} = require("../../controllers/UsersController");

router.get("/id/:userId", getUserById);
router.get("/username/:username", findUserByUsername);

module.exports = router;
