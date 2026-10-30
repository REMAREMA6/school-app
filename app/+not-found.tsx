import { Link, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function NotFound() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-lg font-bold text-foreground">Page not found</Text>
      <Link href="/" className="mt-4 text-primary">
        Go home
      </Link>
    </View>
  );
}
