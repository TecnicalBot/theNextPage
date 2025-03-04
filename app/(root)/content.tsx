import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { X } from "lucide-react-native";
import {
  deleteAsync,
  documentDirectory,
  EncodingType,
  writeAsStringAsync,
} from "expo-file-system";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { blobToBase64 } from "@/lib/utils";
import { useSession } from "@/providers/AuthProvider";

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
    document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
    return false;
});
 document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    const text = selection.toString();
    if (text) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        const placeholder = document.getElementById('placeholder');
        // Set a default width to ensure the element is rendered
        placeholder.style.width = '100px';
        // Measure the width after setting a default
        const placeholderWidth = placeholder.getBoundingClientRect().width;
        const offsetX = placeholderWidth / 2;

        // Optional: Adjust Y position
        const buttonHeight = 30;
        const offsetY = buttonHeight + 5;

        // Use the middle of the selection for X
        const selectionCenterX = rect.left + window.scrollX;

        window.ReactNativeWebView.postMessage(
            JSON.stringify({
                text,
                x: (selectionCenterX/2) - offsetX + 10,
                y: (rect.top / 2) + window.scrollY - offsetY + 16,
            })
        );
    }
});
        document.addEventListener('mouseup', () => {
            const selection = window.getSelection();
            if (!selection.toString()) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ clear: true }));
            }
        });
    </script>
</head>
<body class="px-6 py-4 h-screen bg-[#151718] dark:bg-[#151718] text-[#ECEDEE]">
<div id="placeholder" style="position: absolute; visibility: hidden; width: 100px;"></div>
    <div class="px-6 py-4 h-screen">
        <h1 class="text-4xl md:text-6xl text-center font-bold text-blue-600 mb-4">The Wisdom of Krishna</h1>
        <p class="text-xl md:text-3xl leading-relaxed mb-4">
            Lord Krishna, the divine incarnation, is revered as the supreme being, 
            whose teachings transcend the material world. His wisdom, delivered through 
            the Bhagavad Gita, addresses the eternal struggle between good and evil, 
            urging individuals to fulfill their duties with devotion, detachment, and love.
        </p>
        <p class="text-xl md:text-3xl leading-relaxed mb-4">
            Krishna's message, that of devotion (bhakti), knowledge (jnana), and selfless 
            action (karma), has inspired millions across generations. He emphasized that 
            the path to liberation (moksha) lies in surrendering to the divine will, 
            serving humanity, and understanding the interconnectedness of all beings.
        </p>
        <p class="text-xl md:text-3xl leading-relaxed mb-4">
            "I am the source of all spiritual and material worlds. Everything emanates 
            from me. The wise who know this, engage in my devotional service and worship 
            me with all their hearts," said Krishna in the Bhagavad Gita, affirming his 
            omnipresence and supreme power.
        </p>
        <p class="text-xl md:text-3xl leading-relaxed mb-4">
            As a child, Krishna's playful and mischievous nature was adored by his 
            devotees. His miracles, such as lifting the Govardhan Hill to protect his 
            followers from a storm, exemplify his divine powers. Yet, his teachings 
            remained grounded in the values of love, compassion, and righteousness.
        </p>
        <p class="text-xl md:text-3xl leading-relaxed mb-4">
            Krishna's teachings also urge individuals to live a life of righteousness 
            (dharma), where every action is a means of spiritual elevation. In every 
            moment, he guides his devotees to cultivate an understanding of their true 
            nature, beyond the physical body, to realize the self as eternal and boundless.
        </p>
    </div>
</body>
</html>
`;

export default function BookDetail() {
  const { session: email } = useSession();
  const [selection, setSelection] = useState<string>();
  const [position, setPosition] = useState<Record<string, number>>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>("");
  const [selectedOpt, setSelectedOpt] = useState<string>("");
  const [genImage, setGenImage] = useState<string>("");

  function handleMessage(event: WebViewMessageEvent) {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.clear) {
      setSelection(undefined);
      setPosition(undefined);
    } else {
      setSelection(data.text);
      setPosition({ x: data.x, y: data.y });
    }
  }

  async function onTranslate() {
    setSelectedOpt("Translate");

    if (!selection) return;
    console.log(selection);
    setModalVisible(true);
    const response = await fetch("/translate", {
      method: "POST",
      body: JSON.stringify({ text: selection, email }),
    });
    const data = await response.json();
    console.log(data);
    setTranslatedText(data);
  }

  async function onImagine() {
    setSelectedOpt("Imagine");
    if (!selection) return;
    setModalVisible(true);
    const response = await fetch("/imagine", {
      method: "POST",
      body: JSON.stringify({ text: selection, email }),
    });
    const blob = await response.blob();
    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const fileUri = `${documentDirectory}${uniqueId}.png`;
    await writeAsStringAsync(fileUri, await blobToBase64(blob), {
      encoding: EncodingType.Base64,
    });
    setGenImage(fileUri);
  }

  function hideModal() {
    setModalVisible(false);
    if (genImage) deleteAsync(genImage);
    setTranslatedText("");
    setGenImage("");
  }

  return (
    <SafeAreaView className="flex-1">
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
      />

      {selection && position && (
        <View
          className="absolute flex-row bg-blue-500 rounded"
          style={{ left: position.x, top: position.y }}
        >
          <TouchableOpacity
            className="justify-center items-center px-4 py-2"
            onPress={onTranslate}
          >
            <Text className="text-white text-xs">Translate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="justify-center items-center px-4 py-2"
            onPress={onImagine}
          >
            <Text className="text-white text-xs">Imagine</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={isModalVisible} animationType="slide">
        <ThemedView className="flex-1 p-4">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-3xl font-bold text-center">
              {selectedOpt}
            </ThemedText>
            <TouchableOpacity onPress={hideModal}>
              <X color={"white"} size={24} />
            </TouchableOpacity>
          </View>
          {translatedText ? (
            <ThemedText className="text-base">{translatedText}</ThemedText>
          ) : genImage ? (
            <Image
              source={{ uri: genImage }}
              className="w-full h-[400px] object-cover"
            />
          ) : (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </ThemedView>
      </Modal>
    </SafeAreaView>
  );
}
