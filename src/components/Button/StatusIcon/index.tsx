import { FilterStatus } from "@/types/FilterStatus";
import { CircleDashed, CircleCheck } from "lucide-react-native";

type StatusIconProps = {
  status: FilterStatus;
};

export function StatusIcon({ status }: StatusIconProps) {
  return status === FilterStatus.DONE ? (
    <CircleCheck size={18} color="#2C46B1" />
  ) : (
    <CircleDashed size={18} color="#000000" />
  );
}
