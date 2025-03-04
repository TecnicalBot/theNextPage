import { cn } from "@/lib/utils";
import { TextInput, TextInputProps } from "react-native";
import { ThemedView } from "./ThemedView";

interface InputProps extends TextInputProps {
  variant?: "default" | "outline" | "error";
  className?: string;
}

export function Input({
  variant = "default",
  className,
  ...props
}: InputProps) {
  return (
    <ThemedView className="w-full">
      <TextInput
        className={cn(
          "px-4 py-2 rounded-md text-black placeholder-gray-400",
          "border border-gray-300 focus:border-black focus:ring-1 focus:ring-black",
          variant === "outline" && "border border-black",
          variant === "error" &&
            "border border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
    </ThemedView>
  );
}
