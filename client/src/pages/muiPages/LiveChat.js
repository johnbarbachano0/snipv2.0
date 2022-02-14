import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Loading from "../../components/Loading";
import NavBar from "../../components/muiComponents/NavBar";
import Chat from "../../components/muiComponents/LiveChat/Chat";
import { io } from "socket.io-client";
require("dotenv").config();

const styles = {
  container: {
    margin: "auto",
    marginTop: 7.25,
    width: "100%",
  },
};

function LiveChat() {
  const page = "livechat";
  const [loading, setLoading] = useState(false);
  const userObj = JSON?.parse(sessionStorage?.user);
  // eslint-disable-next-line no-unused-vars
  const [roomData, setRoomData] = useState({
    userId: userObj.id,
    roomId: "global_room",
    user: userObj?.name || userObj?.username,
  });
  const [messageList, setMessageList] = useState([]);
  const room = { userId: userObj.id, roomId: "global_room" };
  const socket = useRef(null);

  //Event Listeners
  //Initial SocketIO connection
  useEffect(() => {
    //console.log("io connect");
    socket.current = io(process.env.REACT_APP_SERVER, {
      auth: {
        userId: userObj?.id,
      },
    });
    return () => socket.current.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Joining global room
  useEffect(() => {
    socket.current.emit("join_room", room);
    return () => socket.current.removeAllListeners("receive_message");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //For listening on new chat message on joined rooms
  useEffect(() => {
    socket.current.on("receive_message", (newMsg) => {
      setMessageList((prev) => {
        const filtered = prev.filter(
          (msg) =>
            msg.message === newMsg.message && msg.createdAt === newMsg.createdAt
        );
        if (prev.length === 0) return [newMsg];
        if (filtered.length === 0) return [...prev, newMsg];
        return prev.map((msg) => {
          if (
            msg?.message === newMsg?.message &&
            msg?.userId === newMsg?.userId
          ) {
            return newMsg;
          }
          return msg;
        });
      });
    });
    return () => socket.current.removeAllListeners("receive_message");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //console.log(messageList);
  }, [messageList]);

  //Functions
  const handleSend = async (values) => {
    handleLoading(true);
    await socket.current.emit("send_message", values);
    setMessageList((prev) => [...prev, values]);
    handleLoading(false);
  };

  const handleLoading = (value) => {
    setLoading(value);
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
        <Chat
          roomData={roomData}
          loading={loading}
          onSend={handleSend}
          messageList={messageList}
        />
      </Box>
    </>
  );
}

export default LiveChat;
