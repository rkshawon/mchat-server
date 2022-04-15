const io = require("socket.io")(9000,{
    cors:{
        origin:'http://localhost:3000',
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

let user = []
let uu = ""
let userList = []

const addUsers=((userid, socketid)=>{
    !user.some((userid) => user.userid === userid) && user.push({userid, socketid})
})
const removeUser = (socketid)=>{
    user = user.filter((user) => user.socketid !== socketid)
}

const getUser = (recieverId)=>{
    uu = user.find((u)=> u.userid === recieverId)
    return uu
}

const addUserList = (uid, uname, sid)=>{
    !userList.some(u=> u?.uid === uid ) && userList.push({uid, uname, sid})
}

const filterUserList = ((sid)=>{
    userList = userList.filter((u)=> u.sid !== sid)
})

io.on("connection", (socket) => {
    socket.on("sendId", userId=>{
        addUsers(userId, socket.id)
        //console.log( "user connected", user)
        io.emit("getUsers", user)
    })
    socket.on("disconnect", () => {
        removeUser(socket.id)
        filterUserList(socket.id)
        //console.log("user Disconnected", socket.id)
        io.emit("getUsers", user)
        io.emit("filteredUsers", userList)
    })
    socket.on("sendMessage", ({senderId, recieverId, text})=>{
        const singleUser = getUser(recieverId)
        //console.log('tttt',singleUser?.socketid, text);
        const receiverSocketId = singleUser?.socketid
        socket.broadcast.emit("getMessage", {
            senderId,
            text,
            recieverId,
            receiverSocketId,
        })
        //console.log(text, 'text', senderId, recieverId, singleUser);
    })
    socket.on("sendUserData",(userData)=>{
        //console.log   (userData.user?.name);
        addUserList(userData.user._id, userData?.user.name, socket.id)
        io.emit("userList", userList)
    })
    socket.on("newUser", (newUser)=>{
        //console.log(newUser.newUser);
        socket.broadcast.emit("newuser", newUser.newUser)
    })
})
