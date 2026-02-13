import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/login/Login.Screen';
import RegisterScreen from '../screens/Auth/register/Register.Screen';
import ForgotPasswordScreen from '../screens/Auth/forgotPassword/ForgotPassword.Screen';


export type RootStackParamList = {
  SignIn: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const EmptyScreen = () => null;

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="SignUp" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

