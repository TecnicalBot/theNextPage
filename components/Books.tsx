import { Camera, ChevronRight, HomeIcon } from "lucide-react-native";
import { FlatList, useColorScheme } from "react-native";
import BookCard from "./BookCard";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Book } from "@/types";
import { Link } from "expo-router";

interface BooksProps {
  books: Book[];
  title: string;
}

export default function Books({ books, title }: BooksProps) {
  const colorScheme = useColorScheme();
  const color = colorScheme == "dark" ? "white" : "black";

  return (
    <ThemedView>
      <ThemedView className="w-full mx-4 my-4 flex flex-row justify-between">
        <ThemedText type="subtitle" className="text-lg">
          {title}
        </ThemedText>
        <Link href={`/(tabs)/search?query=${title}`} className="mr-4">
          {" "}
          <ChevronRight color={color} size={24} />
        </Link>
      </ThemedView>
      <FlatList
        className="space-x-4"
        horizontal
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookCard bookItem={item} key={item.id} />}
      />
    </ThemedView>
  );
}
