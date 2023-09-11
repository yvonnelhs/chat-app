const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

var _db;

module.exports = {
  connectToServer: async function () {
    return new Promise((resolve, reject) => {
      if (_db) {
        console.warn("Database is already connected.");
        resolve(_db);
      } else {
        const client = new MongoClient(process.env.DB_URI);
        client
          .connect()
          .then((client) => {
            console.log("Connected to MongoDB.");
            _db = client.db("chatAppDB");
            resolve(_db);
          })
          .catch((error) => {
            console.error("Error connecting to MongoDB:", error);
            reject(error);
          });
      }
    });
  },

  getDb: function () {
    if (!_db) {
      throw new Error("Database is not connected.");
    }
    return _db;
  },
};
