import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { ReadableStream } from 'web-streams-polyfill';
(globalThis as any).ReadableStream = ReadableStream;

import { Button, StyleSheet, TextInput } from 'react-native';
import { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatAnthropic } from "@langchain/anthropic";
import { type BaseMessage, HumanMessage } from "@langchain/core/messages";

export default function HomeScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<BaseMessage[]>([]);
  
  // Placeholder for local chat model or one that doesn't require secrets
  const model = new ChatAnthropic({
    model: "claude-3-5-sonnet-20240620",
    apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY
  });
  const sendMessage = async () => {
    if (!input) {
      return;
    }
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a parrot named Polly. Respond to all queries as a talking parrot would."],
      ["placeholder", "{messages}"]
    ]);
    const originalInput = input;
    setInput("");
    const newMessages = [...messages, new HumanMessage(originalInput)];
    setMessages(newMessages);
    try {
      const chain = prompt.pipe(model);
      // Anthropic/OpenAI wrappers do not support streaming in React Native yet
      const response = await chain.invoke({
        messages: newMessages
      });
      setMessages((prevMessages) => [...prevMessages, response]);
    } catch (e) {
      setMessages((prevMessages) => prevMessages.slice(0, -1));
      setInput(originalInput);
    }
  }
  return (
    <ThemedView style={styles.screen}>
      <ThemedView style={styles.messagesContainer}>
        {messages.map((message, i) => {
          return (
            <ThemedView style={message._getType() === "human" ? styles.humanMessage : styles.aiMessage} key={i}>
              <ThemedText>
                {typeof message.content === "string" ? message.content : JSON.stringify(message.content)}
              </ThemedText>
            </ThemedView>
          );
        })}
      </ThemedView>
      <TextInput
        style={styles.messageInput}
        placeholder="Ask a question..."
        value={input}
        onChangeText={setInput}
        onSubmitEditing={() => {
          if (input === "") {
            return;
          }
          sendMessage();
        }}
      />
      <Button title="Send" onPress={sendMessage} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    paddingTop: 64,
    padding: 8,
  },
  messageInput: {
    height: 24,
    fontSize: 18,
  },
  messagesContainer: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  humanMessage: {
    marginTop: 8,
    marginLeft: "auto",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    backgroundColor: "#d8d8d8",
  },
  aiMessage: {
    marginTop: 8,
    marginRight: "auto",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    backgroundColor: "#218aff",
  }
});
