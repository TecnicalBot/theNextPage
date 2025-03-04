import { fetchBookData } from "@/actions";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { addBookToLibrary, isBookInLibrary } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import {
  ArrowLeft,
  BookmarkCheck,
  BookmarkPlus,
  BookOpen,
  EllipsisVertical,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const reviews = [
  {
    profile_image: "https://randomuser.me/api/portraits/women/45.jpg",
    name: "Emily Johnson",
    rating: 5,
    review:
      "Absolutely loved this book! The storytelling was immersive, and the characters felt so real.",
  },
  {
    profile_image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Michael Smith",
    rating: 4,
    review:
      "Great read! The pacing was a bit slow in the middle, but the ending made up for it.",
  },
  {
    profile_image: "https://randomuser.me/api/portraits/women/12.jpg",
    name: "Sophia Martinez",
    rating: 3,
    review:
      "Interesting concept, but I felt like the characters lacked depth. Still, a decent read.",
  },
  {
    profile_image: "https://randomuser.me/api/portraits/men/27.jpg",
    name: "James Wilson",
    rating: 5,
    review:
      "An absolute masterpiece! I couldn't put the book down and finished it in one sitting.",
  },
  {
    profile_image: "https://randomuser.me/api/portraits/women/20.jpg",
    name: "Olivia Brown",
    rating: 2,
    review:
      "Not what I expected. The plot had potential, but the execution fell flat for me.",
  },
  {
    profile_image: "https://randomuser.me/api/portraits/men/5.jpg",
    name: "Daniel Lee",
    rating: 4,
    review:
      "Enjoyed this book a lot! The twists and turns kept me engaged till the very end.",
  },
  {
    profile_image: "https://randomuser.me/api/portraits/women/33.jpg",
    name: "Mia Anderson",
    rating: 5,
    review:
      "A beautiful and emotional journey. Highly recommend it to everyone!",
  },
  {
    profile_image: "https://randomuser.me/api/portraits/men/18.jpg",
    name: "Ethan Thomas",
    rating: 3,
    review:
      "It was okay. The writing style was good, but I couldn't really connect with the story.",
  },
  {
    profile_image: "https://randomuser.me/api/portraits/women/7.jpg",
    name: "Ava Harris",
    rating: 4,
    review:
      "A well-written book with great character development. Would love to read more from this author.",
  },
  {
    profile_image: "https://randomuser.me/api/portraits/men/22.jpg",
    name: "William Roberts",
    rating: 1,
    review:
      "Disappointed. The plot was predictable, and I struggled to finish it.",
  },
];

export default function BookDetail() {
  const { bookId } = useLocalSearchParams();
  const [inLibrary, setInLibrary] = useState(false);
  const { data, error, isLoading } = useQuery({
    queryKey: ["bookdata", bookId],
    queryFn: () => fetchBookData(bookId as string),
  });

  const checkBookInLibrary = async () => {
    if (bookId) {
      const isInLibrary = await isBookInLibrary(bookId as string);
      setInLibrary(isInLibrary);
    }
  };

  useEffect(() => {
    checkBookInLibrary();
  }, [bookId]);

  const handleAddToLibrary = async () => {
    if (inLibrary) return;
    if (data) {
      console.log(data.volumeInfo.imageLinks?.thumbnail);
      const success = await addBookToLibrary({
        id: data.id,
        title: data.volumeInfo.title,
        thumbnail: data.volumeInfo.imageLinks?.thumbnail,
        authors: data.volumeInfo.authors,
      });

      if (success) {
        setInLibrary(true);
      }
    }
  };
  return (
    <ThemedView>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          ListHeaderComponent={
            <SafeAreaView className="flex-1">
              <ScrollView className="w-full py-2 px-4">
                {/* Header */}
                <View className="w-full flex flex-row justify-between items-center mb-4">
                  <Pressable onPress={() => router.back()}>
                    <ArrowLeft color={"white"} size={32} />
                  </Pressable>
                  <EllipsisVertical color={"white"} size={28} />
                </View>

                {/* Book Cover */}
                <View className="items-center mb-6">
                  <Image
                    source={{
                      uri:
                        data?.volumeInfo.imageLinks?.thumbnail ||
                        "https://via.placeholder.com/180x260",
                    }}
                    resizeMode="cover"
                    className="w-[180px] h-[260px] rounded-lg shadow-lg"
                  />
                </View>

                {/* Buttons */}
                <View className="flex flex-row justify-center mb-6">
                  <Pressable
                    onPress={handleAddToLibrary}
                    className="flex flex-row px-5 py-3 bg-blue-500 rounded-lg items-center mr-4 shadow-md"
                  >
                    {inLibrary ? (
                      <BookmarkCheck color={"white"} size={24} />
                    ) : (
                      <BookmarkPlus color={"white"} size={24} />
                    )}
                    <Text className="font-semibold text-white text-lg ml-2">
                      {inLibrary ? "In Library" : "Library"}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => router.push(`/(root)/content`)}
                    className="flex flex-row px-5 py-3 bg-blue-500 rounded-lg items-center shadow-md"
                  >
                    <BookOpen color={"white"} size={24} />
                    <Text className="font-semibold text-white text-lg ml-2">
                      Read
                    </Text>
                  </Pressable>
                </View>

                {/* Book Info */}
                <ThemedText
                  type="subtitle"
                  className="text-left font-bold text-2xl mb-2"
                >
                  {data?.volumeInfo.title}
                </ThemedText>
                <ThemedText
                  numberOfLines={4}
                  className="text-left text-gray-300 mb-4"
                >
                  {data?.volumeInfo.description}
                </ThemedText>

                {/* Author */}
                <ThemedView className="py-3 flex flex-row items-center">
                  <Image
                    source={{
                      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        data?.volumeInfo.authors?.[0] || "Unknown"
                      )}&background=random`,
                    }}
                    className="w-12 h-12 rounded-full mr-3"
                    resizeMode="cover"
                  />
                  <ThemedText className="text-left text-lg text-gray-200">
                    {data?.volumeInfo.authors?.[0] || "Unknown"}
                  </ThemedText>
                </ThemedView>

                {/* Reviews Header */}
                <ThemedText
                  type="subtitle"
                  className="mt-6 text-left font-semibold text-xl pt-4"
                >
                  Reviews
                </ThemedText>
                {/* Add your review components here */}
              </ScrollView>
            </SafeAreaView>
          }
          data={reviews}
          keyExtractor={(review) => review.profile_image}
          renderItem={({ item }) => (
            <ThemedView className="my-4 px-4">
              <ThemedView className="flex flex-row">
                <Image
                  source={{ uri: item.profile_image }}
                  className="w-10 h-10 rounded-full mr-2"
                  resizeMode="cover"
                />
                <ThemedText>{item.name}</ThemedText>
              </ThemedView>
              <ThemedView className="ml-12">
                <ThemedText>{"⭐".repeat(item.rating)}</ThemedText>
                <ThemedText>{item.review}</ThemedText>
              </ThemedView>
            </ThemedView>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </ThemedView>
  );
}
