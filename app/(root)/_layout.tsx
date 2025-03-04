import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="content" options={{ headerShown: false }} />
      <Stack.Screen name="planUpgrade" options={{ headerShown: false }} />
    </Stack>
  );
}
