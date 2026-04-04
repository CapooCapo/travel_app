import React, { useEffect } from "react";
import "./global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from './src/context/AuthContext';
import { ScheduleProvider } from './src/context/ScheduleContext';
import AppNavigator from "./src/navigation/AppNavigator";
import { LocalNotificationService } from "./src/services/LocalNotification.Service";

/**
 * ⚡ App Entry Point - Clean Architecture Approach
 * 
 * - Trách nhiệm: Root Providers & Khởi tạo toàn cục.
 * - Logic nghiệp vụ: Đã chuyển vào các Service/Hook (SoC).
 */
export default function App() {
    
    // 1. Khởi tạo dịch vụ thông báo (Global Initializations)
    useEffect(() => {
        LocalNotificationService.requestPermissions();
    }, []);

    return (
        <AuthProvider>
            <ScheduleProvider>
                <SafeAreaProvider>
                    <AppNavigator />
                </SafeAreaProvider>
            </ScheduleProvider>
        </AuthProvider>
    );
}