import { Button } from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { wait } from "@/lib/utils";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/schema/user"; // Create this schema
import { router } from "expo-router";

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>();
  const { colorScheme } = useColorScheme();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      const res = await fetch("/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        setSuccess(false);
        setLoading(false);
        return;
      }

      setSuccess(true);
      await wait(1000);
      router.push(`/(auth)/verifyOtp?email=${data.email}`);
    } catch (error) {
      console.error("Forgot password error:", error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView className="flex-1 justify-center px-6 bg-white dark:bg-black">
      <ThemedText className="text-3xl font-bold text-center mb-6">
        Forgot Password
      </ThemedText>

      {/* Email Input */}
      <TextInput
        autoFocus
        className="w-full p-4 border rounded-lg text-base dark:text-white dark:border-gray-600"
        placeholder="Email"
        placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#888"}
        onChangeText={(text) => setValue("email", text)}
        {...register("email")}
      />
      {errors.email && (
        <ThemedText className="text-red-500 text-sm mt-1">
          {errors.email.message}
        </ThemedText>
      )}

      {/* Submit Button */}
      <Button
        className="py-4 rounded-full items-center mt-6"
        onPress={handleSubmit(onSubmit)}
      >
        {loading
          ? "Sending OTP..."
          : success
          ? "OTP Sent."
          : success === false
          ? "Failed to Send OTP."
          : "Send OTP"}
      </Button>
    </ThemedView>
  );
}
