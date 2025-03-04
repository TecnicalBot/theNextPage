import { Text } from "react-native";
import { cn } from "@/lib/utils";

interface LabelProps {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string; // Mimics ShadCN but is optional in React Native
}

export function Label({ children, className }: LabelProps) {
  return (
    <Text className={cn("text-sm font-medium text-gray-700", className)}>
      {children}
    </Text>
  );
}
