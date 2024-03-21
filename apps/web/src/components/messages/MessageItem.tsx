import { cn } from "@/lib/utils";
import React, { FC } from "react";
import Markdown from "markdown-to-jsx";
import { Skeleton } from "@/components/ui/skeleton";

type MessageItemProps = {
  className?: string;
  message: {
    role?: string;
    content?: string;
    msg: string;
  };
  status?: "Loading" | "Typing" | "Finished";
};

const MessageItem: FC<MessageItemProps> = ({ className, message, status }) => {
  let content = null;

  switch (status) {
    case "Loading":
      content = (
        <div className="w-full h-20 space-y-2">
          {/* <PluseLoader color="#000" size={10} /> */}
          <Skeleton className="h-4 w-[500px]" />
          <Skeleton className="h-4 w-[500px]" />
          <Skeleton className="h-4 w-[500px]" />
        </div>
      );
      break;

    // case "Typing":
    //   content = (
    //     <div className="prose max-w-full break-words relative">
    //       <Markdown>{message?.content || ""}</Markdown>
    //       <span className="blinking-cursor">▋</span>
    //     </div>
    //   );
    //   break;

    case "Finished":
      content = (
        <div className="prose max-w-full break-words">
          <Markdown
            options={{
              forceBlock: true,
            }}
          >
            {message?.content || ""}
          </Markdown>
        </div>
      );
      break;

    default:
      content = (
        <div className="prose max-w-full break-words">
          <Markdown
            options={{
              forceBlock: true,
            }}
          >
            {message?.content || ""}
          </Markdown>
        </div>
      );
  }

  return (
    <div className={`${cn("w-full my-3", className)}`}>
      <div className="px-4 py-2 text-base md:gap-6">
        <div className="flex flex-1 text-base mx-auto gap-3 md:px-3 lg:px-1 xl:px-5 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] border rounded-md py-3">
          <div className="flex-shrink-0 flex flex-col relative items-end ">
            <div>
              <div className="pt-0.5 ">
                <div className="w-full">
                  {/* <Avatar size="35" round name="Techport Gpt" /> */}
                  {/* <Image src={botSvg} width={36} height={36} alt="botIcon" /> */}
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex w-full flex-col lg:w-[calc(100%-115px)] ">
            <div>
              <h3 className="font-bold mb-2">{message.msg}</h3>
            </div>
            <div className="flex-col gap-1 md:gap-3">
              <div className="flex flex-grow flex-col max-w-full ">
                {/* {image?.url && (
                  <div className="mb-3">
                    <Image
                      src={image?.url}
                      alt="message image"
                      width="500"
                      height="650"
                      // sizes="100vw"
                      // className="w-full h-auto"
                      placeholder="blur"
                      blurDataURL={image?.blurData}
                      loading="lazy"
                    />
                  </div>
                )} */}

                <div className="min-h-[20px] flex flex-col items-start gap-3 whitespace-pre-wrap break-words overflow-x-auto">
                  {content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
