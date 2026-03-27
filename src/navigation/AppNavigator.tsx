import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Auth ───────────────────────────────────────────────────────────────────
import LoginScreen          from "../screens/Auth/login/Login.Screen";
import RegisterScreen        from "../screens/Auth/register/Register.Screen";
import ForgotPasswordScreen  from "../screens/Auth/forgotPassword/ForgotPassword.Screen";

// ─── Home ───────────────────────────────────────────────────────────────────
import HomeScreen            from "../screens/Home/home/Home.Screen";

// ─── Discovery ──────────────────────────────────────────────────────────────
import ExploreScreen         from "../screens/Discovery/explore/Explore.Screen";
import PlaceDetailScreen     from "../screens/Discovery/placeDetail/PlaceDetail.Screen";

// ─── Events ─────────────────────────────────────────────────────────────────
import EventListScreen       from "../screens/Event/eventList/EventList.Screen";
import EventDetailScreen     from "../screens/Event/eventDetail/EventDetail.Screen";
import CreateEventScreen     from "../screens/Event/createEvent/CreateEvent.Screen";

// ─── Travel Planning ────────────────────────────────────────────────────────
import ItineraryScreen       from "../screens/TravelPlanning/itinerary/Itinerary.Screen";
import CreatePlanScreen      from "../screens/TravelPlanning/createPlan/CreatePlan.Screen";

// ─── Social ─────────────────────────────────────────────────────────────────
import FeedScreen            from "../screens/Social/feed/Feed.Screen";

// ─── Messaging ──────────────────────────────────────────────────────────────
import ChatListScreen        from "../screens/Messaging/chatList/ChatList.Screen";
import ChatRoomScreen        from "../screens/Messaging/chatRoom/ChatRoom.Screen";

// ─── Notifications ──────────────────────────────────────────────────────────
import NotificationScreen    from "../screens/Notification/notification/Notification.Screen";

// ─── Profile ────────────────────────────────────────────────────────────────
import ProfileScreen         from "../screens/Profile/profile/Profile.Screen";

// ─── Review ─────────────────────────────────────────────────────────────────
import WriteReviewScreen     from "../screens/Review/writeReview/WriteReview.Screen";

// ─── Admin ──────────────────────────────────────────────────────────────────
import AdminDashboardScreen  from "../screens/Admin/dashboard/AdminDashboard.Screen";

// ─── Theme ──────────────────────────────────────────────────────────────────
import { COLORS, FONTS } from "../constants/theme";

// ────────────────────────────────────────────────────────────────────────────
//  Route param types
// ────────────────────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  SignIn:         undefined;
  SignUp:         undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home:         undefined;
  Explore:      undefined;
  Events:       undefined;
  Feed:         undefined;
  Messages:     undefined;
};

export type RootStackParamList = {
  // Auth
  SignIn:         undefined;
  SignUp:         undefined;
  ForgotPassword: undefined;

  // Main tabs (nested)
  MainTabs: undefined;

  // Detail screens (full-screen, no tab bar)
  PlaceDetail:       { placeId: number };
  EventDetail:       { eventId: number };
  CreateEvent:       undefined;
  WriteReview:       { targetId: number; targetType: "place" | "event" };
  Itinerary:         undefined;
  ItineraryDetail:   { itineraryId: number };
  CreatePlan:        undefined;
  ChatRoom:          { chatId: number; chatName: string; chatType: "one_to_one" | "group" };
  Notification:      undefined;
  Profile:           undefined;
  AdminDashboard:    undefined;
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
  label: string;
}[] = [
  { name: "Home",     icon: "home-outline",          iconFocused: "home",          label: "Home"     },
  { name: "Explore",  icon: "compass-outline",        iconFocused: "compass",       label: "Explore"  },
  { name: "Events",   icon: "calendar-outline",       iconFocused: "calendar",      label: "Events"   },
  { name: "Feed",     icon: "people-outline",         iconFocused: "people",        label: "Social"   },
  { name: "Messages", icon: "chatbubbles-outline",    iconFocused: "chatbubbles",   label: "Messages" },
];

function CustomTabBar({ state, descriptors, navigation }: any) {
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
            onPress={() => {
              if (!isFocused) navigation.navigate(route.name);
            }}
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
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 42, height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapperActive: {
    backgroundColor: COLORS.primary + "22",
  },
});

// ────────────────────────────────────────────────────────────────────────────
//  Main Tab Navigator (shown after login)
// ────────────────────────────────────────────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home"     component={HomeScreen}     />
      <Tab.Screen name="Explore"  component={ExploreScreen}  />
      <Tab.Screen name="Events"   component={EventListScreen}/>
      <Tab.Screen name="Feed"     component={FeedScreen}     />
      <Tab.Screen name="Messages" component={ChatListScreen} />
    </Tab.Navigator>
  );
}

// ────────────────────────────────────────────────────────────────────────────
//  Root Navigator
// ────────────────────────────────────────────────────────────────────────────
export default function AppNavigator() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isSignedIn ? "MainTabs" : "SignIn"}
      >
        {/* ── Auth screens ── */}
        {!isSignedIn ? (
          <>
            <Stack.Screen name="SignIn"          component={LoginScreen}         />
            <Stack.Screen name="SignUp"           component={RegisterScreen}      />
            <Stack.Screen name="ForgotPassword"   component={ForgotPasswordScreen}/>
          </>
        ) : (
          <>
            {/* ── Tabs ── */}
            <Stack.Screen name="MainTabs" component={MainTabs} />

            {/* ── Detail / modal screens ── */}
            <Stack.Screen
              name="PlaceDetail"
              component={PlaceDetailScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="EventDetail"
              component={EventDetailScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="CreateEvent"
              component={CreateEventScreen}
              options={{ animation: "slide_from_bottom" }}
            />
            <Stack.Screen
              name="WriteReview"
              component={WriteReviewScreen}
              options={{ animation: "slide_from_bottom" }}
            />
            <Stack.Screen
              name="Itinerary"
              component={ItineraryScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="CreatePlan"
              component={CreatePlanScreen}
              options={{ animation: "slide_from_bottom" }}
            />
            <Stack.Screen
              name="ChatRoom"
              component={ChatRoomScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="Notification"
              component={NotificationScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboardScreen}
              options={{ animation: "slide_from_right" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
