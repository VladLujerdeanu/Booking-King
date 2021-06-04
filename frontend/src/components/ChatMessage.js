import React from "react";

const ChatMessage = (props) => {
  const { message, sender } = props;

  const messageClass = sender ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <p>{message}</p>
    </div>
  );
};

export default ChatMessage;
