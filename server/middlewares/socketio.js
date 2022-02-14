const { Users } = require("../models");

module.exports = function (io) {
  io.on("connection", async (socket) => {
    const userId = socket?.handshake?.auth?.userId;
    const userDetails = await findUser(userId);
    //console.log(`UserId: ${userId} with SocketId: ${socket.id}`);
    updateUser(userId, socket.id, true);

    socket.on("join_room", async (data) => {
      //console.log("join");
      socket.join(data.roomId);
      //console.log(
      //   `UserID:${data.userId}, SocketId:${socket.id} joined room: ${data.roomId}`
      // );
      const user = await findUser(data.userId);
      io.sockets.in(data.roomId).emit("receive_message", {
        createdAt: new Date(Date.now()),
        userId: 0,
        user: "chatbot",
        roomId: "global_room",
        message: `${user} joined the room.`,
        isSent: true,
      });
    });

    socket.on("send_message", (data) => {
      //console.log(`UserId: ${data.userId} sent:`);
      //console.log(data);
      io.sockets
        .in(data.roomId)
        .emit("receive_message", { ...data, isSent: true });
    });

    socket.on("disconnect", async () => {
      //console.log("User Disconnected", socket.id);
      socket.to("global_room").emit("receive_message", {
        createdAt: new Date(Date.now()),
        userId: 0,
        user: "chatbot",
        roomId: "global_room",
        message: `${userDetails} left the room.`,
        isSent: true,
      });
      socket.disconnect();
      updateUser(userId, null, false);
    });
  });
};

const updateUser = (userId, socketId, socketStatus) => {
  Users.update({ socketStatus, socketId }, { where: { id: userId } }).catch(
    (error) => console.log(error)
  );
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
