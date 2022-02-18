import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Loading from "../../components/Loading";
import NavBar from "../../components/muiComponents/NavBar";
import Chat from "../../components/muiComponents/LiveChat/Chat";
import { io } from "socket.io-client";
import UsersBox from "../../components/muiComponents/LiveChat/UsersBox";
require("dotenv").config();

const styles = {
  container: {
    margin: "auto",
    marginTop: 7.25,
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
};

function LiveChat() {
  const page = "livechat";
  const [loading, setLoading] = useState(false);
  const userObj = JSON?.parse(sessionStorage?.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const room = {
    userId: userObj.id,
    user: userObj?.name || userObj?.username,
  };
  // eslint-disable-next-line no-unused-vars
  const [roomData, setRoomData] = useState(room);
  const [chatWith, setChatWith] = useState({
    userId: 0,
    displayName: "chatbot",
  });
  const [chatWithPrivateChats, setChatWithPrivateChats] = useState([]);
  const [globalChat, setglobalChat] = useState([]);
  const [privateChat, setprivateChat] = useState([]);
  const socket = useRef(null);

  //Event Listeners
  //Initial SocketIO connection
  useEffect(() => {
    handleConnect();
    return () => socket.current.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //For listening on new chat message on joined rooms
  useEffect(() => {
    handleReceiveMsg();
    return () => socket.current.removeAllListeners("receive_message");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleOnlineUsers();
    return () => socket.current.removeAllListeners("online_users");
  }, []);

  useEffect(() => {
    setChatWithPrivateChats(getUserPrivateChat(chatWith.userId, userObj.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatWith, privateChat]);

  useEffect(() => {
    onlineUsers.filter((user) => user.userId === chatWith.userId).length ===
      0 &&
      setChatWith({
        userId: 0,
        displayName: "chatbot",
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineUsers]);

  //Functions

  const handleConnect = () => {
    socket.current = io(process.env.REACT_APP_SERVER, {
      auth: { userId: userObj?.id },
    });
    handleOnlineUsers();
  };

  const handleOnlineUsers = () => {
    socket.current.on("online_users", (isUpdate, data) => {
      if (isUpdate) {
        setOnlineUsers((prevOnlineUsers) =>
          prevOnlineUsers
            .map((user) =>
              user.UserId === data.UserId ? { ...user, ...data } : user
            )
            .filter((user) => user.status !== false)
        );
      } else {
        setOnlineUsers(data);
      }
    });
  };

  const handleReceiveMsg = () => {
    socket.current.on("receive_message", (newMsg, isPm) => {
      !isPm && setglobalChat((prev) => receiveFilter(prev, newMsg));
      isPm && setprivateChat((prev) => receiveFilter(prev, newMsg));
    });
  };

  const receiveFilter = (prev, newMsg) => {
    const filtered = prev?.filter(
      (msg) =>
        msg.message === newMsg.message && msg.createdAt === newMsg.createdAt
    );
    if (prev?.length === 0) return [newMsg];
    if (filtered?.length === 0) return [...prev, newMsg];
    return prev?.map((msg) => {
      if (msg?.message === newMsg?.message && msg?.userId === newMsg?.userId) {
        return newMsg;
      }
      return msg;
    });
  };

  const handleSend = async (values) => {
    handleLoading(true);
    await socket.current.emit("send_message", values);
    values.receiveId === 0 && setglobalChat((prev) => [...prev, values]);
    values.receiveId !== 0 && setprivateChat((prev) => [...prev, values]);
    handleLoading(false);
  };

  const handleLoading = (value) => {
    setLoading(value);
  };

  const getUserPrivateChat = (receiveId, userId) => {
    return privateChat.filter(
      (msg) =>
        (msg.receiveId === receiveId && msg.userId === userId) ||
        (msg.receiveId === userId && msg.userId === receiveId)
    );
  };
  return (
    <>
      <NavBar isLoading={loading} page={page} />

      {loading && (
        <Box className="center">
          <Loading type="cubes" color="#1DB9C3" height="10rem" width="10rem" />
        </Box>
      )}

      <Box sx={styles.container}>
        <UsersBox onlineUsers={onlineUsers} setChatWith={setChatWith} />
        <Chat
          roomData={roomData}
          onlineUsers={onlineUsers}
          chatWith={chatWith}
          loading={loading}
          onSend={handleSend}
          messageList={
            chatWith.userId === 0 ? globalChat : chatWithPrivateChats
          }
          sx={{ flex: 1 }}
        />
      </Box>
    </>
  );
}

export default LiveChat;
