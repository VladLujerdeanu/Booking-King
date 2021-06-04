import React, { useState, useRef } from "react";
import ChatMessage from "./ChatMessage";

const ChatRoom = () => {
  const dummy = useRef();
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState([]);
  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    setMessages((oldMessages) => [...oldMessages, formValue]);
    setSender((oldSender) => [...oldSender, true]);
    dummy.current.scrollIntoView({ behavior: "smooth" });
    setFormValue("");

    await fetch(`http://localhost:8080/"${formValue.replace(/ /g, "_")}"`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMessages((oldMessages) => [...oldMessages, data.text]);
        setSender((oldSender) => [...oldSender, false]);
      });

    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main>
        {messages &&
          messages.map((msg, id) => (
            <ChatMessage key={id} message={msg} sender={sender[id]} />
          ))}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Ask Booking King"
        />

        <button type="submit" disabled={!formValue}>
          🕊️
        </button>
      </form>
    </>
  );
};

export default ChatRoom;
