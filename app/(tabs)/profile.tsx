import { Button } from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getLibrary, removeBookFromLibrary, wait } from "@/lib/utils";
import { useSession } from "@/providers/AuthProvider";
import { Book } from "@/types";
import { IUser } from "@/types/user";
import { router, useFocusEffect } from "expo-router";
import { TrashIcon } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const [library, setLibrary] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser>();

  const { session, signOut } = useSession();
  const getCurrentUser = async () => {
    const res = await fetch("/getCurrentUser", {
      method: "POST",
      body: JSON.stringify({ session }),
    });
    const currentUser = await res.json();
    setUser(currentUser);
  };

  useEffect(() => {
    getCurrentUser();
  }, [session]);

  const fetchLibrary = async () => {
    setLoading(true);
    const userLibrary = await getLibrary();
    setLibrary(userLibrary);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchLibrary();
    }, [])
  );

  const handleRemoveBook = async (bookId: string) => {
    const success = await removeBookFromLibrary(bookId);
    if (success) {
      const updatedLibrary = library.filter((book: Book) => book.id !== bookId);
      setLibrary(updatedLibrary);
    } else {
      alert("Failed to remove book.");
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      className="flex-row p-4 border-b border-gray-700 items-center"
      onPress={() => router.push(`/${item.id}`)}
    >
      <Image
        source={{
          uri: item.thumbnail,
        }}
        width={40}
        height={60}
        className="w-20 h-30 rounded-md"
        resizeMode="contain"
      />
      <ThemedView className="flex-1 ml-4">
        <ThemedText className="text-lg font-semibold" numberOfLines={1}>
          {item.title}
        </ThemedText>
        <ThemedText className="text-gray-300" numberOfLines={1}>
          {item.authors?.join(", ") || "Unknown Author"}
        </ThemedText>
      </ThemedView>
      <TouchableOpacity
        onPress={() => handleRemoveBook(item.id)}
        className="ml-2"
      >
        <TrashIcon size={24} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    signOut();
    router.replace("/(auth)/welcome");
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ThemedView className="items-center flex flex-row gap-5 py-10 pl-4">
        <Image
          source={{
            uri: `https://ui-avatars.com/api/?name=${user?.name}&format=png`,
          }}
          className="w-16 h-16 rounded-full"
          resizeMode="cover"
          width={64}
          height={64}
        />

        <ThemedView>
          <ThemedText className="text-2xl font-bold">{user?.name}</ThemedText>
          <ThemedText className="text-gray-400">{user?.email}</ThemedText>
        </ThemedView>
      </ThemedView>
      <Button onPress={handleLogout} className="mx-4">
        Logout
      </Button>
      <ThemedText className="text-xl font-semibold p-4">
        My Collection
      </ThemedText>

      {loading ? (
        <ThemedView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </ThemedView>
      ) : (
        <FlatList
          data={library}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <ThemedView className="flex-1 justify-center items-center p-4">
              <ThemedText className="text-gray-400">
                Your collection is empty.
              </ThemedText>
            </ThemedView>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
