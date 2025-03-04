import React, { useState, useEffect } from "react";
import { fetchBooks } from "@/actions";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Book } from "@/types";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Search } from "lucide-react-native";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchBook = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { query } = useLocalSearchParams();

  useEffect(() => {
    const initialSearchTerm = query;
    if (initialSearchTerm) {
      setSearchTerm(query as string);
      handleSearch(query as string);
    }
  }, [query]);

  const handleSearch = async (query = searchTerm) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetchBooks(query, 10);
      setSearchResults(response || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      className="flex-row p-4 border-b border-gray-700"
      onPress={() => router.push(`/(tabs)/${item.id}`)}
    >
      <Image
        source={{
          uri:
            item.volumeInfo.imageLinks?.thumbnail ||
            "https://via.placeholder.com/128x192",
        }}
        className="w-20 h-30 rounded-md"
        resizeMode="cover"
      />
      <ThemedView className="flex-1 ml-4">
        <ThemedText className="text-lg font-semibold">
          {item.volumeInfo.title}
        </ThemedText>
        <ThemedText>
          {item.volumeInfo.authors?.join(", ") || "Unknown Author"}
        </ThemedText>
        <ThemedText numberOfLines={2} className=" mt-2">
          {item.volumeInfo.description}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <ThemedView className="h-screen">
        <ThemedView className="p-4 flex-row items-center">
          <TextInput
            autoFocus
            className="flex-1 bg-gray-800 p-3 rounded-l-md text-white"
            placeholder="Search books..."
            placeholderTextColor="gray"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={() => handleSearch()}
          />
          <TouchableOpacity
            className="bg-blue-500 p-2.5 rounded-r-md"
            onPress={() => handleSearch()}
          >
            <Search size={24} color="white" />
          </TouchableOpacity>
        </ThemedView>

        {loading ? (
          <ThemedView className="flex-1 mt-24 justify-center items-center">
            <ActivityIndicator size="large" color="#0000ff" />
          </ThemedView>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
              <ThemedView className="flex-1 justify-center items-center p-4">
                <ThemedText>
                  {searchTerm.trim()
                    ? "No results found."
                    : "Enter a search term."}
                </ThemedText>
              </ThemedView>
            )}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
};

export default SearchBook;
