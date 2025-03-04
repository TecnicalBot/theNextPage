import { Text, type TextProps } from "react-native";
import { cn } from "@/lib/utils";
import { useColorScheme } from "nativewind";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  className?: string;
};

export function ThemedText({
  lightColor,
  darkColor,
  type = "default",
  className,
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      className={cn(
        "text-black dark:text-white",
        type === "default" && "text-base leading-6",
        type === "defaultSemiBold" && "text-base leading-6 font-semibold",
        type === "title" && "text-3xl font-bold leading-8",
        type === "subtitle" && "text-xl font-bold",
        type === "link" && "text-base leading-7 text-blue-600",
        className
      )}
      {...rest}
    />
  );
}
