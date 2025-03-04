import { Button } from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { wait } from "@/lib/utils";
import { signupSchema } from "@/schema/user";
import { IUser } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Pressable, TextInput } from "react-native";

export default function SignupScreen() {
  const { colorScheme } = useColorScheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: IUser) => {
    setLoading(true);
    const res = await fetch("/signUp", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      setLoading(false);
      setSuccess(false);
      return;
    }

    setLoading(false);
    setSuccess(true);
    await wait(1000);
    router.push("/(auth)/login");
  };

  return (
    <ThemedView className="flex-1 justify-center px-6 bg-white dark:bg-black">
      <ThemedText className="text-3xl font-bold text-center mb-6">
        Sign Up
      </ThemedText>

      {/* Name Input */}
      <TextInput
        autoFocus
        className="w-full p-4 border rounded-lg text-base dark:text-white dark:border-gray-600"
        placeholder="Name"
        placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#888"}
        onChangeText={(text) => setValue("name", text)}
        {...register("name")}
      />
      {errors.name && (
        <ThemedText className="text-red-500 text-sm mt-1">
          {errors.name.message}
        </ThemedText>
      )}

      {/* Email Input */}
      <TextInput
        className="w-full p-4 border rounded-lg text-base mt-4 dark:text-white dark:border-gray-600"
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

      {/* Password Input */}
      <ThemedView className="w-full flex-row items-center p-4 border rounded-lg mt-4 dark:border-gray-600">
        <TextInput
          className="flex-1 text-base dark:text-white"
          placeholder="Password"
          placeholderTextColor={colorScheme === "dark" ? "#ccc" : "#888"}
          secureTextEntry={!showPassword}
          onChangeText={(text) => setValue("password", text)}
          {...register("password")}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeOff
              size={20}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          ) : (
            <Eye size={20} color={colorScheme === "dark" ? "white" : "black"} />
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
              size={20}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          ) : (
            <Eye size={20} color={colorScheme === "dark" ? "white" : "black"} />
          )}
        </Pressable>
      </ThemedView>
      {errors.confirmPassword && (
        <ThemedText className="text-red-500 text-sm mt-1">
          {errors.confirmPassword.message}
        </ThemedText>
      )}

      {/* Signup Button */}
      <Button
        className="py-4 rounded-full items-center mt-6"
        onPress={handleSubmit(onSubmit)}
      >
        {loading
          ? "Signing up..."
          : success
          ? "Signed Up."
          : success === false
          ? "Sign Up Failed."
          : "Sign Up"}
      </Button>

      {/* Login Link */}
      <ThemedView className="flex-row justify-center my-4">
        <ThemedText className="text-gray-600 text-md dark:text-gray-300">
          Already have an account?
        </ThemedText>
        <Pressable onPress={() => router.push("/(auth)/login")}>
          <ThemedText className="text-blue-600 text-md dark:text-blue-400 ml-1">
            Login
          </ThemedText>
        </Pressable>
      </ThemedView>

      {/* Continue with Google */}
      <Button className="py-4 rounded-full items-center">
        Continue with Google
      </Button>
    </ThemedView>
  );
}
