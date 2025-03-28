
import { useContext } from "react";
import { ThresholdContext } from "./ThresholdProvider";
import { ThresholdContextType } from "./types";

export const useThresholds = (): ThresholdContextType => {
  const context = useContext(ThresholdContext);
  if (!context) {
    throw new Error("useThresholds must be used within a ThresholdProvider");
  }
  return context;
};
