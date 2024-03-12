"use client";

import React from "react";
import MessageItem from "./MessageItem";
import EmptyMessage from "./EmptyMessage";

const Messages = () => {
  return (
    <section>
      {/* <MessageItem role="user" text="hiii" aiStatus="Finished" />
      <MessageItem role="assistance" text="hlw" aiStatus="Loading" /> */}
      <EmptyMessage />
    </section>
  );
};

export default Messages;
