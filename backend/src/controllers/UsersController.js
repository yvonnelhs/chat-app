const { ObjectId } = require("mongodb");
const mongoUtil = require("../utils/mongoUtil");
const db = mongoUtil.getDb();

const USERS_COLLECTION = db.collection("users");

async function getUserById(req, res) {
  try {
    const userId = req.params.userId;
    const user = await USERS_COLLECTION.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function findUserByUsername(req, res) {
  const { username } = req.params;
  
  try {
    const user = await USERS_COLLECTION.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getUserById,
  findUserByUsername
};
