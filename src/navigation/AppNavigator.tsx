import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';

export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const EmptyScreen = () => null;

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={EmptyScreen} />
        <Stack.Screen name="Register" component={EmptyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

