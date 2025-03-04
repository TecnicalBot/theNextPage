import { Button } from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { wait } from "@/lib/utils";
import { useSession } from "@/providers/AuthProvider";
import { loginSchema } from "@/schema/user";
import { IUser } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, TextInput } from "react-native";

export default function LoginScreen() {
  const { signIn } = useSession();
  const [success, setSuccess] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const { colorScheme } = useColorScheme();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: IUser) => {
    const res = await fetch("/login", {
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
    signIn(data.email);
    await wait(1000);
    router.replace("/(tabs)/home");
  };

  return (
    <ThemedView className="flex-1 justify-center px-6 bg-white dark:bg-black">
      <ThemedText className="text-3xl font-bold text-center mb-6">
        Login
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

      {/* Forgot Password */}
      <Pressable
        className="self-end my-2"
        onPress={() => router.push("/(auth)/forgetPassword")}
      >
        <ThemedText className="text-blue-600 dark:text-blue-400 text-md">
          Forgot Password?
        </ThemedText>
      </Pressable>

      {/* Login Button */}
      <Button
        className="py-4 rounded-full items-center mb-10"
        onPress={handleSubmit(onSubmit)}
      >
        {loading
          ? "Logging in..."
          : success
          ? "Logged In."
          : success === false
          ? "Login Failed."
          : "Login"}
      </Button>

      {/* Sign-up Link */}
      <ThemedView className="flex-row justify-center my-4">
        <ThemedText className="text-gray-600 text-md  dark:text-gray-300">
          Don't have an account?
        </ThemedText>
        <Pressable onPress={() => router.push("/(auth)/signup")}>
          <ThemedText className="text-blue-600 text-md dark:text-blue-400 ml-1">
            Sign Up
          </ThemedText>
        </Pressable>
      </ThemedView>

      {/* Continue with Google */}
      <Button className="py-4 rounded-full items-center mb-10">
        Continue with Google
      </Button>
    </ThemedView>
  );
}
