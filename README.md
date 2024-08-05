# LangChain.js + React Native Example

This project showcases the use of [LangChain.js](https://github.com/langchain-ai/langchainjs/) on mobile devices. It's a simple proof of concept built in React Native that allows you to send messages back and forth with an LLM, which has been prompted to take on the persona of a talking parrot named Polly.

![Example conversation](/.github/static/reactnative.gif)

For demo purposes, the app uses an Anthropic model and requires a secret key, but you could swap this for e.g. a model running locally on device in the future.

## Get started

This app uses [Expo](https://expo.dev). You can set it up with the following instructions:

1. Install dependencies

```bash
npm install
```

2. Set environment variables

Sign up for an [Anthropic](https://console.anthropic.com/) account and retrieve your API key. Then create a file named `.env` and paste your key:

```ini
EXPO_PUBLIC_ANTHROPIC_API_KEY="YOUR_ANTHROPIC_KEY"
```

2. Start the app

```bash
npx expo start
```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

Most of the app is boilerplate code created automatically by the `create-expo-app` command. You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Technical notes

### Polyfills

To make LangChain.js support React Native, this app uses the following polyfills:

```json
{
  "react-native-get-random-values": "^1.11.0",
  "react-native-url-polyfill": "^2.0.0",
  "web-streams-polyfill": "^3" 
}
```

It then initializes them in `app/(tabs)/index.tsx` as follows:

```js
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { ReadableStream } from 'web-streams-polyfill';
(globalThis as any).ReadableStream = ReadableStream;
```

Note that we add [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) as a global.

It may be possible to support LangChain.js with a different set of polyfills.

### Streaming

The [`@langchain/anthropic`](https://www.npmjs.com/package/@langchain/anthropic) package used to call Anthropic wraps the official Anthropic SDK, which does [not yet support streaming](https://github.com/anthropics/anthropic-sdk-typescript?tab=readme-ov-file#requirements). Therefore, this app does not currently stream responses.

However, it should be possible to support streaming with a local model.

## Thank you!

Thanks for reading!

This is an early prototype. If you have any questions or comments, please open an issue or DM me on X [@hacubu](https://x.com/hacubu).
