import React from "react";
import { useAuth } from "../hooks/useAuth";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Auth ─────────────────────────────────────────────────────────────────
import LoginScreen           from "../screens/Auth/login/Login.Screen";
import RegisterScreen        from "../screens/Auth/register/Register.Screen";
import ForgotPasswordScreen  from "../screens/Auth/forgotPassword/ForgotPassword.Screen";
import OtpVerificationScreen from "../screens/Auth/otpVerification/OtpVerification.Screen";
import ResetPasswordScreen   from "../screens/Auth/resetPassword/ResetPassword.Screen";

// ─── Home ─────────────────────────────────────────────────────────────────
import HomeScreen            from "../screens/Home/home/Home.Screen";

// ─── Discovery ────────────────────────────────────────────────────────────
import ExploreScreen         from "../screens/Discovery/explore/Explore.Screen";
import PlaceDetailScreen     from "../screens/Discovery/placeDetail/PlaceDetail.Screen";

// ─── Events ───────────────────────────────────────────────────────────────
import EventListScreen       from "../screens/Event/eventList/EventList.Screen";
import EventDetailScreen     from "../screens/Event/eventDetail/EventDetail.Screen";

// ─── Travel Planning ──────────────────────────────────────────────────────
import ItineraryScreen       from "../screens/TravelPlanning/itinerary/Itinerary.Screen";
import CreatePlanScreen      from "../screens/TravelPlanning/createPlan/CreatePlan.Screen";
import ItineraryDetailScreen from "../screens/TravelPlanning/itineraryDetail/ItineraryDetail.Screen";
import ScheduleScreen        from "../screens/TravelPlanning/schedule/Schedule.Screen";
import CalendarScreen        from "../screens/TravelPlanning/calendar/CalendarScreen";

// ─── Social ───────────────────────────────────────────────────────────────
import FeedScreen            from "../screens/Social/feed/Feed.Screen";

// ─── Messaging ────────────────────────────────────────────────────────────
import ChatListScreen        from "../screens/Messaging/chatList/ChatList.Screen";
import ChatRoomScreen        from "../screens/Messaging/chatRoom/ChatRoom.Screen";

// ─── Notifications ────────────────────────────────────────────────────────
import NotificationScreen    from "../screens/Notification/notification/Notification.Screen";

// ─── Profile ──────────────────────────────────────────────────────────────
import ProfileScreen         from "../screens/Profile/profile/Profile.Screen";

// ─── Review ───────────────────────────────────────────────────────────────
import WriteReviewScreen     from "../screens/Review/writeReview/WriteReview.Screen";

// ─── Admin ────────────────────────────────────────────────────────────────
import AdminDashboardScreen  from "../screens/Admin/dashboard/AdminDashboard.Screen";

// ─── Theme ────────────────────────────────────────────────────────────────
import { COLORS } from "../constants/theme";
import { EventDTO } from "../dto/event/event.DTO";

// ────────────────────────────────────────────────────────────────────────────
//  Route param types (khớp với BE data model)
// ────────────────────────────────────────────────────────────────────────────
export type RootStackParamList = {
  // Auth
  SignIn:          undefined;
  SignUp:          undefined;
  ForgotPassword:  undefined;
  OtpVerification: { email: string };
  ResetPassword:   { email: string; otp: string };

  // Tabs
  MainTabs: undefined;

  // Discovery
  PlaceDetail: { placeId: number; initialTab?: "info" | "reviews" | "events" };

  // Events — truyền toàn bộ EventDTO vì BE không có GET /events/{id}
  EventDetail: { event: EventDTO };

  // Review — attractionId (path param cho BE)
  WriteReview: { attractionId: number };

  // Travel
  Itinerary:       undefined;
  ItineraryDetail: { itineraryId: number };
  CreatePlan:      undefined;
  Schedule:        { attraction?: any };
  Calendar:        undefined;

  // Messaging
  ChatRoom: { chatId: number; chatName: string; chatType: "one_to_one" | "group" };

  // Misc
  Notification:   undefined;
  Profile:        undefined;
  AdminDashboard: undefined;
};

export type MainTabParamList = {
  Home:     undefined;
  Explore:  undefined;
  Events:   undefined;
  Feed:     undefined;
  Messages: undefined;
};

// ────────────────────────────────────────────────────────────────────────────
//  Navigators
// ────────────────────────────────────────────────────────────────────────────
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<MainTabParamList>();

// ────────────────────────────────────────────────────────────────────────────
//  Custom Tab Bar
// ────────────────────────────────────────────────────────────────────────────
const TAB_ITEMS: {
  name: keyof MainTabParamList;
  icon: string;
  iconFocused: string;
}[] = [
  { name: "Home",     icon: "home-outline",       iconFocused: "home"       },
  { name: "Explore",  icon: "compass-outline",     iconFocused: "compass"    },
  { name: "Events",   icon: "calendar-outline",    iconFocused: "calendar"   },
  { name: "Feed",     icon: "people-outline",      iconFocused: "people"     },
  { name: "Messages", icon: "chatbubbles-outline", iconFocused: "chatbubbles"},
];

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[tabStyles.tabBar, { paddingBottom: insets.bottom || 8 }]}>
      {state.routes.map((route: any, index: number) => {
        const meta      = TAB_ITEMS[index];
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            key={route.key}
            style={tabStyles.tabItem}
            onPress={() => { if (!isFocused) navigation.navigate(route.name); }}
            activeOpacity={0.7}
          >
            <View style={[tabStyles.iconWrapper, isFocused && tabStyles.iconWrapperActive]}>
              <Ionicons
                name={(isFocused ? meta.iconFocused : meta.icon) as any}
                size={22}
                color={isFocused ? COLORS.primary : COLORS.muted}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  tabItem:          { flex: 1, alignItems: "center", justifyContent: "center" },
  iconWrapper:      { width: 42, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  iconWrapperActive:{ backgroundColor: COLORS.primary + "22" },
});

// ────────────────────────────────────────────────────────────────────────────
//  Main Tab Navigator
// ────────────────────────────────────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      id="main-tabs"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"     component={HomeScreen}     />
      <Tab.Screen name="Explore"  component={ExploreScreen}  />
      <Tab.Screen name="Events"   component={EventListScreen} />
      <Tab.Screen name="Feed"     component={FeedScreen}     />
      <Tab.Screen name="Messages" component={ChatListScreen} />
    </Tab.Navigator>
  );
}

// ─── Root Navigator ────────────────────────────────────────────────────────────
export default function AppNavigator() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        id="root-stack"
        screenOptions={{ headerShown: false }}
        initialRouteName={isSignedIn ? "MainTabs" : "SignIn"}
      >
        {!isSignedIn ? (
          <>
            <Stack.Screen name="SignIn" component={LoginScreen} />
            <Stack.Screen name="SignUp"           component={RegisterScreen}       />
            <Stack.Screen name="ForgotPassword"   component={ForgotPasswordScreen} />
            <Stack.Screen name="OtpVerification"  component={OtpVerificationScreen} />
            <Stack.Screen name="ResetPassword"    component={ResetPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />

            <Stack.Screen name="PlaceDetail"
              component={PlaceDetailScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen name="EventDetail"
              component={EventDetailScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen name="WriteReview"
              component={WriteReviewScreen}
              options={{ animation: "slide_from_bottom" }}
            />
            <Stack.Screen name="Itinerary"
              component={ItineraryScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen name="Schedule"
              component={ScheduleScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen name="Calendar"
              component={CalendarScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen name="ItineraryDetail"
              component={ItineraryDetailScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen name="CreatePlan"
              component={CreatePlanScreen}
              options={{ animation: "slide_from_bottom" }}
            />
            <Stack.Screen name="ChatRoom"
              component={ChatRoomScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen name="Notification"
              component={NotificationScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen name="Profile"
              component={ProfileScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen name="AdminDashboard"
              component={AdminDashboardScreen}
              options={{ animation: "slide_from_right" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
