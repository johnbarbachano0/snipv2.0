const { Users, ActiveSocket } = require("../models");

module.exports = function (io) {
  io.on("connection", async (socket) => {
    const userId = socket?.handshake?.auth?.userId;
    await updateUser(userId, socket.id, true);
    const displayName = await findUser(userId);
    const initOnlineUsers = [
      ...(await getOnlineUsers()),
      { UserId: userId, status: true, displayName },
    ];

    console.log(`Connected UserId: ${userId} with SocketId: ${socket.id}`);

    //Connected emit
    io.sockets.emit(
      "receive_message",
      connMessage("joined", displayName, userId)
    );
    io.sockets.emit("online_users", false, initOnlineUsers);

    //Send Message listener
    socket.on("send_message", async (data) => {
      console.log(data.receiveId);
      if (data?.receiveId === 0) {
        io.sockets.emit("receive_message", { ...data, isSent: true }, false);
      } else {
        console.log(data);
        const rcvSocketId = await getSocketId(data.receiveId);
        const sndSocketId = await getSocketId(data.userId);

        io.sockets.to(rcvSocketId.socketId).emit(
          "receive_message",
          {
            ...data,
            isSent: true,
          },
          true
        );
        io.sockets.to(sndSocketId.socketId).emit(
          "receive_message",
          {
            ...data,
            isSent: true,
          },
          true
        );
      }
    });

    //Disconnect listener
    socket.on("disconnect", async () => {
      socket.disconnect();
      await updateUser(userId, null, false);
      const msg = `Disconnected UserId: ${userId} with SocketId: ${socket.id}`;
      console.log(msg);
      io.sockets.emit(
        "receive_message",
        connMessage("left", displayName, userId)
      );
      io.sockets.emit("online_users", true, {
        UserId: userId,
        status: false,
        displayName,
      });
    });
  });
};

const connMessage = (type, displayName, receiveId) => ({
  createdAt: new Date(Date.now()).toISOString(),
  userId: 0,
  user: "chatbot",
  message: `${displayName} ${type} the chat.`,
  isSent: true,
  type: 0, // type: 1 === join/left chat
  receiveId,
});

const updateUser = (userId, socketId, status) => {
  return ActiveSocket.findAll({ where: { UserId: userId } })
    .then((result) => {
      if (result?.length > 0) {
        ActiveSocket.update(
          { status, socketId },
          { where: { UserId: userId } }
        );
      } else {
        ActiveSocket.create({ UserId: userId, socketId, status });
      }
      return result;
    })
    .catch((error) => console.log(error));
};

const findUser = (userId) => {
  return Users.findOne({ where: { id: userId } })
    .then((result) => {
      var returnName;
      if (result?.dataValues?.name) {
        returnName = result?.dataValues?.name;
      } else {
        returnName = result?.dataValues?.username;
      }
      return returnName;
    })
    .catch((error) => console.log(error));
};

const getOnlineUsers = async () =>
  ActiveSocket.findAll({
    where: { status: true },
    include: {
      model: Users,
      as: "User",
      required: true,
      attributes: ["username", "name"],
    },
    attributes: ["UserId", "status"],
  }).then((result) =>
    result.map((user) => ({
      UserId: user.UserId,
      status: user.status,
      displayName: user.User.name || user.User.username,
    }))
  );

const getSocketId = (UserId) =>
  ActiveSocket.findOne({
    where: { status: true, UserId },
    attributes: ["socketId"],
  });
