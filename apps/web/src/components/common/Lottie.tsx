"use client";
import React, { FC } from "react";
import { PlaybackOptions } from "@dotlottie/player-component";
import { cn } from "@/lib/utils";

type LottiePropsType = {
  src: string;
  playbackOptions?: PlaybackOptions;
  controls?: boolean;
  className?: string;
};

const Lottie: FC<LottiePropsType> = ({
  src,
  className = "w-full",
  ...props
}) => {
  return (
    <div className={`${cn("h-full", className)}`}>
      <dotlottie-player
        className="w-full h-full"
        src={"https://assets2.lottiefiles.com/dotlotties/dlf10_oehbsgal.lottie"}
        autoplay={props.playbackOptions?.autoplay}
        defaultTheme={props.playbackOptions?.defaultTheme}
        direction={props.playbackOptions?.direction}
        hover={props.playbackOptions?.hover}
        intermission={props.playbackOptions?.intermission}
        loop={props.playbackOptions?.loop}
        playMode={props.playbackOptions?.playMode}
        speed={props.playbackOptions?.speed}
        controls={props.controls}
      />
    </div>
  );
};

export default Lottie;
