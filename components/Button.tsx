import { Pressable } from "react-native";
import { cn } from "@/lib/utils";
import { ThemedText } from "./ThemedText";
import { useColorScheme } from "nativewind";

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

export function Button({
  children,
  onPress,
  variant = "default",
  className,
}: ButtonProps) {
  const { colorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "px-4 py-2 rounded-lg font-medium items-center justify-center",
        variant === "default" &&
          (colorScheme === "dark" ? "bg-white " : "bg-black"),
        variant === "outline" &&
          (colorScheme === "dark"
            ? "border border-white "
            : "border border-black "),
        variant === "ghost" &&
          (colorScheme === "dark" ? "bg-transparent " : "bg-transparent "),
        className
      )}
    >
      <ThemedText className="text-center text-white dark:text-black">
        {children}
      </ThemedText>
    </Pressable>
  );
}
