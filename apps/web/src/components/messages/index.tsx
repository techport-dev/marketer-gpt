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
        <MessageItem
          message={{
            msg: "Generating response...",
          }}
          status="Loading"
        />
      </>
    );
  } else if (!isLoading && !isError && data && data.content) {
    // Assign JSX to content properly
    content = <MessageItem message={data} status="Finished" />;
  } else if (
    !isLoading &&
    !isError &&
    (data === null || data?.content === "")
  ) {
    // Adjusted this condition to check for data being null or data.content being an empty string
    content = <EmptyMessage />;
  } else if (!isLoading && isError) {
    content = <div>Something went wrong</div>;
  }

  return <section>{content}</section>;
};

export default Messages;
