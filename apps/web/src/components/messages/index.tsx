"use client";

import React from "react";
import MessageItem from "./MessageItem";
import EmptyMessage from "./EmptyMessage";
import { useSelector } from "@/lib/redux/store";
import { selectAiResponse } from "@/lib/redux/slices/aiResponse/selectors";

const Messages = () => {
  const { isLoading, isError, data } = useSelector(selectAiResponse);

  let content = null;

  if (isLoading) {
    content = (
      <>
        {data.map((message, index) => (
          <MessageItem key={index} message={message} status="Finished" />
        ))}
        <MessageItem
          message={{
            msg: "Generating response...",
          }}
          status="Loading"
        />
      </>
    );
  } else if (!isLoading && !isError && data.length > 0) {
    content = data.map((message, index) => (
      <MessageItem key={index} message={message} status="Finished" />
    ));
  } else if (!isLoading && !isError && data.length === 0) {
    content = <EmptyMessage />;
  } else if (!isLoading && isError) {
    content = <div>Something went wrong</div>;
  }

  return <section>{content}</section>;
};

export default Messages;
