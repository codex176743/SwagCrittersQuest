import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

const RefreshIcon = ({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex justify-center items-center cursor-pointer"
      onClick={onClick}
    >
      <RefreshCw
        strokeWidth={3}
        className={`w-8 h-8 text-green-500 ${loading ? "animate-spin" : ""}`}
      />
    </div>
  );
};

export default RefreshIcon;
