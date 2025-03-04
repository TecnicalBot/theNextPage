import { fetchBooks } from "@/actions";
import Books from "@/components/Books";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Image } from "react-native";

export default function HomeScreen() {
  const {
    data: books,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["krishna", "javascript"],
    queryFn: () => fetchBooks("javascript,krishna,computer,linux", 40),
  });
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={{
            uri: "https://res.cloudinary.com/dsmmztudq/image/upload/v1740362381/1714491717037_nelmfw.jpg",
          }}
          className="absolute w-full h-full"
        />
      }
    >
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : books ? (
        <ThemedView>
          <Books books={books.slice(0, 10)} title="Recents" />
          <Books books={books.slice(10, 20)} title="Computer" />
          <Books books={books.slice(20, 30)} title="Programming" />
          <Books books={books.slice(30, 40)} title="Linux" />
        </ThemedView>
      ) : (
        <ThemedView className="flex justify-center items-center">
          <ThemedText type="title" className="text-red-500">
            Something went wrong!
          </ThemedText>
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}
