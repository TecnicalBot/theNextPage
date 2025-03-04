import { Book } from "@/types";
import { Link } from "expo-router";
import { Image } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface BookCardProps {
  bookItem: Book;
}

export default function BookCard({ bookItem }: BookCardProps) {
  return (
    <Link href={`/(tabs)/${bookItem.id}`} className="mx-4 w-36">
      <ThemedView className="w-full">
        <Image
          resizeMode="cover"
          source={{
            uri:
              bookItem.volumeInfo.imageLinks?.thumbnail ||
              "https://via.placeholder.com/120x160",
          }}
          width={120}
          height={160}
        />
        <ThemedView className="w-full">
          <ThemedText
            numberOfLines={2}
            type="defaultSemiBold"
            className="truncate"
          >
            {bookItem.volumeInfo.title}
          </ThemedText>
          <ThemedText numberOfLines={1} className="text-xs">
            {bookItem.volumeInfo.authors}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </Link>
  );
}
