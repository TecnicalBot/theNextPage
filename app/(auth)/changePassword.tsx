import { Button } from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { wait } from "@/lib/utils";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput, Pressable } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "@/schema/user"; // Create this schema
import { router, useLocalSearchParams } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";

export default function ChangePasswordScreen() {
  const { email } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>();
  const { colorScheme } = useColorScheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    try {
      const res = await fetch("/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, email }),
      });

      if (!res.ok) {
        setSuccess(false);
        setLoading(false);
        return;
      }

      setSuccess(true);
      await wait(1000);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Change password error:", error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView className="flex-1 justify-center px-6 bg-white dark:bg-black">
      <ThemedText className="text-3xl font-bold text-center mb-6">
        Change Password
      </ThemedText>

      {/* New Password Input */}
      <ThemedView className="w-full flex-row items-center p-4 border rounded-lg mt-4 dark:border-gray-600">
        <TextInput
          className="flex-1 text-base dark:text-white"
          placeholder="New Password"
          placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#888"}
          secureTextEntry={!showPassword}
          onChangeText={(text) => setValue("password", text)}
          {...register("password")}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeOff
              className="text-gray-600 dark:text-gray-200"
              size={20}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          ) : (
            <Eye
              className="text-gray-600 dark:text-gray-200"
              size={20}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          )}
        </Pressable>
      </ThemedView>
      {errors.password && (
        <ThemedText className="text-red-500 text-sm mt-1">
          {errors.password.message}
        </ThemedText>
      )}

      {/* Confirm Password Input */}
      <ThemedView className="w-full flex-row items-center p-4 border rounded-lg mt-4 dark:border-gray-600">
        <TextInput
          className="flex-1 text-base dark:text-white"
          placeholder="Confirm Password"
          placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#888"}
          secureTextEntry={!showConfirmPassword}
          onChangeText={(text) => setValue("confirmPassword", text)}
          {...register("confirmPassword")}
        />
        <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          {showConfirmPassword ? (
            <EyeOff
              className="text-gray-600 dark:text-gray-200"
              size={20}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          ) : (
            <Eye
              className="text-gray-600 dark:text-gray-200"
              size={20}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          )}
        </Pressable>
      </ThemedView>
      {errors.confirmPassword && (
        <ThemedText className="text-red-500 text-sm mt-1">
          {errors.confirmPassword.message}
        </ThemedText>
      )}

      {/* Submit Button */}
      <Button
        className="py-4 rounded-full items-center mt-6"
        onPress={handleSubmit(onSubmit)}
      >
        {loading
          ? "Changing Password..."
          : success
          ? "Password Changed."
          : success === false
          ? "Failed to Change Password."
          : "Change Password"}
      </Button>
    </ThemedView>
  );
}
