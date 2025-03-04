import { Button } from "@/components/Button";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "@/providers/AuthProvider";
import { Redirect, router } from "expo-router";
import { Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const { session, isLoading } = useSession();
  if (session) return <Redirect href={"/(tabs)/home"} />;
  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1">
        <Image
          source={require("@/assets/images/welcome.png")}
          className="w-[84%] h-4/5 mx-auto"
          resizeMode="contain"
        />

        <Button
          className="py-4 rounded-full items-center mx-2 mb-10"
          onPress={() => router.push("/(auth)/login")}
        >
          <Text className="text-lg font-medium">Get Started</Text>
        </Button>
      </ThemedView>
    </SafeAreaView>
  );
}
