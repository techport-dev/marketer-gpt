import Lottie from "lottie-react";
import botEmptyFile from "@public/lottiefiles/bot-empty.json";

const EmptyMessage = () => {
  return (
    <div className="max-w-3xl">
      <Lottie className="w-full" animationData={botEmptyFile} loop={true} />
    </div>
  );
};

export default EmptyMessage;
