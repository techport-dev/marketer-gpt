"use client";

import React from "react";
import MessageItem from "./MessageItem";
import EmptyMessage from "./EmptyMessage";
import { useSelector } from "@/lib/redux/store";
import { selectAiResponse } from "@/lib/redux/slices/aiResponse/selectors";
import { Card, CardContent } from "@/components/ui/card";

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
    content = <MessageItem message={data} status="Finished" />;
  } else if (
    !isLoading &&
    !isError &&
    (data === null || data?.content === "")
  ) {
    content = (
      <div className="flex items-center justify-center h-full">
        <EmptyMessage />
      </div>
    );
  } else if (!isLoading && isError) {
    content = <div>Something went wrong</div>;
  }

  return (
    <div>
      <Card className="max-h-[60vh]">
        <CardContent className="h-full p-0">{content}</CardContent>
      </Card>
    </div>
  );
};

export default Messages;
