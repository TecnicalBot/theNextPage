import { Button } from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { wait } from "@/lib/utils";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema } from "@/schema/user"; // Create this schema
import { router, useLocalSearchParams } from "expo-router";

export default function VerifyOtpScreen() {
  const { email } = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>();
  const { colorScheme } = useColorScheme();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyOtpSchema),
  });

  const onSubmit = async (data: { otp: string }) => {
    setLoading(true);
    try {
      const res = await fetch("/verifyOtp", {
        // Replace with your API endpoint
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
      await wait(1000); // Simulate network delay
      router.replace(`/(auth)/changePassword?email=${email}`); // Redirect to change password screen
    } catch (error) {
      console.error("Verify OTP error:", error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView className="flex-1 justify-center px-6 bg-white dark:bg-black">
      <ThemedText className="text-3xl font-bold text-center mb-6">
        Verify OTP
      </ThemedText>

      {/* OTP Input */}
      <TextInput
        autoFocus
        className="w-full p-4 border rounded-lg text-base dark:text-white dark:border-gray-600"
        placeholder="Enter 6-digit OTP"
        placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#888"}
        keyboardType="numeric"
        maxLength={6}
        onChangeText={(text) => setValue("otp", text)}
        {...register("otp")}
      />
      {errors.otp && (
        <ThemedText className="text-red-500 text-sm mt-1">
          {errors.otp.message}
        </ThemedText>
      )}

      {/* Submit Button */}
      <Button
        className="py-4 rounded-full items-center mt-6"
        onPress={handleSubmit(onSubmit)}
      >
        {loading
          ? "Verifying..."
          : success
          ? "Verified."
          : success === false
          ? "Verification Failed."
          : "Verify OTP"}
      </Button>
    </ThemedView>
  );
}
