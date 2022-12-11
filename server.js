const express = require("express");
const mongoose = require("mongoose");
const app = express();
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const conversationRoute = require("./routes/Conversations");
const MessageRoute = require("./routes/Message");
const ueerRoute = require("./routes/Auth");
const allUeerRoute = require("./routes/Users");
const path = require("path");
const io = require("socket.io")(server, { cors: { origgin: "*" } });

dotenv.config();
app.use(express());
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL, () => {
  console.log("database connected");
});
app.use("/auth", ueerRoute);
app.use("/conversation", conversationRoute);
app.use("/message", MessageRoute);
app.use("/allusers", allUeerRoute);

const ___dirname1 = path.resolve();
app.use(express.static(path.join(___dirname1, "/client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(___dirname1, "client", "build", "index.html"));
});

let user = [];
let uu = "";
let userList = [];

const addUsers = (userid, socketid) => {
  !user.some((userid) => user.userid === userid) &&
    user.push({ userid, socketid });
};
const removeUser = (socketid) => {
  user = user.filter((user) => user.socketid !== socketid);
};

const getUser = (recieverId) => {
  uu = user.find((u) => u.userid === recieverId);
  return uu;
};

const addUserList = (uid, uname, sid) => {
  !userList.some((u) => u?.uid === uid) && userList.push({ uid, uname, sid });
};

const filterUserList = (sid) => {
  userList = userList.filter((u) => u.sid !== sid);
};

io.on("connection", (socket) => {
  socket.on("sendId", (userId) => {
    addUsers(userId, socket.id);
    io.emit("getUsers", user);
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
    filterUserList(socket.id);
    io.emit("getUsers", user);
    io.emit("filteredUsers", userList);
  });
  socket.on("sendMessage", ({ senderId, recieverId, text }) => {
    const singleUser = getUser(recieverId);
    const receiverSocketId = singleUser?.socketid;
    socket.broadcast.emit("getMessage", {
      senderId,
      text,
      recieverId,
      receiverSocketId,
    });
  });
  socket.on("sendUserData", (userData) => {
    addUserList(userData.user._id, userData?.user.name, socket.id);
    io.emit("userList", userList);
  });
  socket.on("newUser", (newUser) => {
    socket.broadcast.emit("newuser", newUser.newUser);
  });
});

server.listen(process.env.PORT || 8000, () => {
  console.log("server is running at 8000");
});
