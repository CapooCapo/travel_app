import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from "./src/navigation/AppNavigator";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function App() {
    return (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <AuthProvider>
                <SafeAreaProvider>
                    <AppNavigator />
                </SafeAreaProvider>
            </AuthProvider>
        </ClerkProvider>
    );
}





