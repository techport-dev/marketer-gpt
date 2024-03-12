import { cn } from "@/lib/utils";
import React, { FC } from "react";
import Image from "next/image";
import Avatar from "react-avatar";
import PluseLoader from "react-spinners/PulseLoader";
import Markdown from "markdown-to-jsx";

type MessageItemProps = {
  className?: string;
  role: string;
  image?:
    | {
        url: string;
        blurData?: string;
      }
    | undefined;
  aiStatus: string;
  text: string;
};

const MessageItem: FC<MessageItemProps> = ({
  className,
  role,
  image,
  aiStatus,
  text,
}) => {
  let content = null;

  switch (aiStatus) {
    case "Loading":
      content = (
        <>
          <PluseLoader />
        </>
      );
      break;

    case "Typing":
      content = (
        <div className="prose max-w-full break-words relative">
          <Markdown>{text}</Markdown>
          <span className="blinking-cursor">▋</span>
        </div>
      );
      break;

    case "Finished":
      content = (
        <div className="prose max-w-full break-words">
          <Markdown
            options={{
              forceBlock: true,
            }}
          >
            {text}
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
            {text}
          </Markdown>
        </div>
      );
  }

  return (
    <div className={`${cn("w-full my-3", className)}`}>
      <div className="px-4 py-2 text-base md:gap-6">
        <div className="flex flex-1 text-base mx-auto gap-3 md:px-3 lg:px-1 xl:px-5 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
          <div className="flex-shrink-0 flex flex-col relative items-end">
            <div>
              <div className="pt-0.5">
                <div className="w-full">
                  {role === "user" ? (
                    <Avatar size="35" round name="Arifuzzaman Nishan" />
                  ) : (
                    <Avatar size="35" round name="Techport Gpt" />
                    // <Image src={botSvg} width={36} height={36} alt="botIcon" />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex w-full flex-col lg:w-[calc(100%-115px)]">
            <div>
              {role === "user" ? (
                <h3 className="font-bold mb-2">You</h3>
              ) : (
                <h3 className="font-bold mb-2">TechportGPT</h3>
              )}
            </div>
            <div className="flex-col gap-1 md:gap-3">
              <div className="flex flex-grow flex-col max-w-full ">
                {image?.url && (
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
                )}

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
