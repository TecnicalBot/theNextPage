import AsyncStorage from "@react-native-async-storage/async-storage";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export function hashPassword(password: string) {
  return password;
}

export function comparePassword(password: string, hashedPassword: string) {
  return password;
}

export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result?.toString() || "";
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export interface LibraryBook {
  id: string;
  thumbnail?: string;
  title: string;
  authors?: string[];
}

export const addBookToLibrary = async (book: LibraryBook): Promise<boolean> => {
  try {
    const storedLibrary = await AsyncStorage.getItem("library");
    let library: LibraryBook[] = storedLibrary ? JSON.parse(storedLibrary) : [];

    if (!library.some((b) => b.id === book.id)) {
      library.push(book);
      await AsyncStorage.setItem("library", JSON.stringify(library));
      return true; // Indicate success
    }
    return false; // Book already exists
  } catch (error) {
    console.error("Error adding book to library:", error);
    return false; // Indicate failure
  }
};

export const removeBookFromLibrary = async (
  bookId: string
): Promise<boolean> => {
  try {
    const storedLibrary = await AsyncStorage.getItem("library");
    if (storedLibrary) {
      let library: LibraryBook[] = JSON.parse(storedLibrary);
      library = library.filter((book) => book.id !== bookId);
      await AsyncStorage.setItem("library", JSON.stringify(library));
      return true; // Indicate success
    }
    return false; // Library doesn't exist or book not found
  } catch (error) {
    console.error("Error removing book from library:", error);
    return false; // Indicate failure
  }
};

export const getLibrary = async (): Promise<LibraryBook[]> => {
  try {
    const storedLibrary = await AsyncStorage.getItem("library");
    return storedLibrary ? JSON.parse(storedLibrary) : [];
  } catch (error) {
    console.error("Error getting library:", error);
    return []; // Return empty array on error
  }
};

export const isBookInLibrary = async (bookId: string): Promise<boolean> => {
  try {
    const storedLibrary = await AsyncStorage.getItem("library");
    if (storedLibrary) {
      const library: LibraryBook[] = JSON.parse(storedLibrary);
      return library.some((book) => book.id === bookId);
    }
    return false; // Library doesn't exist
  } catch (error) {
    console.error("Error checking if book is in library:", error);
    return false; // Assume not in library on error
  }
};

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
