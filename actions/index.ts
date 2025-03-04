import { Book, BookData } from "@/types";

export async function fetchBooks(
  query: string,
  maxResults: number
): Promise<Book[]> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${process.env.EXPO_PUBLIC_API_KEY}&maxResults=${maxResults}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Error: ${res}`);
  }

  const data = await res.json();
  return data.items as Book[];
}

export async function fetchBookData(id: string): Promise<BookData> {
  const url = `https://www.googleapis.com/books/v1/volumes/${id}?key=${process.env.EXPO_PUBLIC_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error: ${res}`);
  }
  const data = await res.json();
  return data;
}
