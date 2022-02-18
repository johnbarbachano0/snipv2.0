import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/system";
import MessageBox from "./MessageBox";
import useWindowDimensions from "../../useWindowDimension";
import { Capitalize } from "../../MiscJavascript";
import ChatIcon from "@mui/icons-material/ChatBubbleRounded";

// style
const styles = {
  container: {
    width: "100%",
    borderRadius: 0,
  },
  header: {
    color: "white",
    backgroundColor: "#144550",
    textAlign: "center",
    padding: 0.5,
  },
  contents: {
    width: "100%",
    minHeight: 300,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  actions: {
    display: "flex",
    flex: 1,
    width: "100%",
  },
  sendBtn: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingTop: 1,
    paddingBottom: 1,
  },
  messageTextField: {
    autocapitalize: "sentences",
    padding: 8.5,
  },
  chat: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#144550",
    textAlign: "center",
    color: "white",
    padding: 0.5,
  },
};

const CustomTextField = styled(TextField)(() => ({
  "& fieldset": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    autoCapitalize: "on",
  },
}));

function Chat({ roomData, loading, onSend, messageList, chatWith }) {
  const { height } = useWindowDimensions();
  const isMessagesEmpty = messageList?.length === 0;
  const [fieldValues, setFieldValues] = useState({});
  const submitEl = useRef(null);
  const chatboxEl = useRef(null);
  const messagesEndRef = useRef(null);

  //EventListeners
  //Enter to submit
  useEffect(() => {
    const unsubscribe = document.addEventListener("keydown", handleKeyPress);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyPress = (e) => {
    e.key === "Enter" && submitEl?.current?.click();
    chatboxEl?.current?.focus();
  };

  useEffect(() => {
    scrollToBottom();
    return () => scrollToBottom;
  }, [messageList]);

  const scrollToBottom = () => {
    messagesEndRef?.current.scrollIntoView({ behavior: "smooth" });
  };

  //Functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldValues((prev) => ({ ...prev, [name]: Capitalize(value) }));
  };

  const handleSend = () => {
    if (fieldValues?.message && fieldValues.message !== "") {
      onSend({
        ...fieldValues,
        createdAt: new Date(Date.now()).toISOString(),
        userId: roomData.userId,
        user: roomData.user,
        isSent: false,
        type: 1, // type: 1 === global chat
        receiveId: chatWith.userId,
      });
      setFieldValues({});
    }
  };

  const ChatComponent = () => {
    return (
      <Box sx={styles.chat}>
        <ChatIcon />
        <Typography>
          {chatWith.userId === 0 ? "Everyone" : `@${chatWith.displayName}`}
        </Typography>
      </Box>
    );
  };

  return (
    <Card sx={styles.container}>
      <CardHeader component={ChatComponent} sx={styles.header} />
      <CardContent
        sx={{
          height: height - 162.5,
          maxHeight: height,
          overflowY: "scroll",
        }}
      >
        <Box
          sx={{
            ...styles.contents,
            justifyContent: isMessagesEmpty ? "center" : "flex-end",
          }}
        >
          {isMessagesEmpty ? (
            <Typography>No messages yet...</Typography>
          ) : (
            messageList.map((list, index) => {
              const isSameUser = list.userId === roomData.userId;
              const isChatbot = list.userId === 0;
              return (
                <MessageBox
                  key={index}
                  list={list}
                  isSameUser={isSameUser}
                  isChatbot={isChatbot}
                  onSend={onSend}
                />
              );
            })
          )}
          <div ref={messagesEndRef} />
        </Box>
      </CardContent>
      <CardActions>
        <Box sx={styles.actions}>
          <CustomTextField
            color="secondary"
            name="message"
            variant="outlined"
            placeholder="Message..."
            onChange={handleChange}
            value={fieldValues?.message || ""}
            autoFocus
            required
            fullWidth={true}
            sx={styles.actions}
            ref={chatboxEl}
          />
          <LoadingButton
            onClick={handleSend}
            endIcon={<SendIcon sx={{ fontSize: 14 }} />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
            disableElevation
            sx={styles.sendBtn}
            ref={submitEl}
          >
            Send
          </LoadingButton>
        </Box>
      </CardActions>
    </Card>
  );
}

export default Chat;
