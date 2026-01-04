import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { Provider, useDispatch, useSelector } from "react-redux";
import BottomNavigationBar from "./components/bottomNavigationBar";
import MyStatusBar from "./components/myStatusBar";
import Snackbar from "./components/snackbar";
import store from "./redux/store/store";
import ForgetPassword from "./screens/auth/forgetPassword";
import SignInScreen from "./screens/auth/signIn";
import SignUpScreen from "./screens/auth/signUp";
import VerificationScreen from "./screens/auth/verificationScreen";
import ChatScreen from "./screens/chatScreen/chatScreen";
import Home from "./screens/home/home";
import AllNearestJourney from "./screens/journey/allNearestJourney";
import AllSearchedJourneyList from "./screens/journey/allSearchedJourneyList";
import LocationPickerScreen from "./screens/journey/locationPicker";
import SearchVehicleForm from "./screens/journey/searchVehicleForm";
import VehicleAndParcelDetail from "./screens/journey/vehicleAndParcelDetail";
import OnboardingScreen from "./screens/onBoardingScreens/onBoardingScreen";
import AllOrders from "./screens/orders/allOrders";
import PendingRequests from "./screens/orders/pendingRequests";
import RequestDetailScreen from "./screens/orders/requestDetailScreen";
import ChangePassword from "./screens/profile/changePassword";
import EditProfile from "./screens/profile/editProfile";
import PrivacyPolicyScreen from "./screens/profile/privacyPolicy";
import TermsAndConditionsScreen from "./screens/profile/termsAndCondition";
import AllSupportTickets from "./screens/support/allSupportTickets";
import HelpScreen from "./screens/support/helpScreen";

import { selectUser } from "./redux/selector/authSelector";
import UserHome from "./screens/home/userHome";
import AllSavedParcels from "./screens/journey/allSavedParcels";
import SearchJourneyByName from "./screens/journey/searchJourneyByName";
import VehicleDetail from "./screens/journey/vehicleDetail";
import AddAddress from "./screens/orders/addAddress";
import AllReviewScreen from "./screens/orders/allReviewScreen";
import OrderDetailScreen from "./screens/orders/orderDetailScreen";
import PaymentGatewayScreen from "./screens/orders/paymentGateway";
import PendingAccountScreen from "./screens/profile/pendingAccountScreen";

const Stack = createStackNavigator();

function AppNavigator() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    console.log("User changed:", user);
  }, [user]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen
              name="VerificationScreen"
              component={VerificationScreen}
            />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
          </>
        ) : user?.status === 'ACTIVE' ? (
          <>
            <Stack.Screen
              name="BottomNavigationBar"
              component={BottomNavigationBar}
            />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddAddress" component={AddAddress} />
            <Stack.Screen
              name="VehicleAndParcelDetail"
              component={VehicleAndParcelDetail}
            />
            <Stack.Screen name="VehicleDetail" component={VehicleDetail} />
            <Stack.Screen name="UserHome" component={UserHome} />
            <Stack.Screen
              name="SearchVehicleForm"
              component={SearchVehicleForm}
            />
            <Stack.Screen
              name="AllSearchedJourneyList"
              component={AllSearchedJourneyList}
            />
            <Stack.Screen
              name="PrivacyPolicyScreen"
              component={PrivacyPolicyScreen}
            />
            <Stack.Screen
              name="TermsAndConditionsScreen"
              component={TermsAndConditionsScreen}
            />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="PendingRequests" component={PendingRequests} />
            <Stack.Screen name="AllOrders" component={AllOrders} />
             <Stack.Screen name="AllSavedParcels" component={AllSavedParcels} />
             <Stack.Screen name="SearchJourneyByName" component={SearchJourneyByName} />

            <Stack.Screen
              name="OrderDetailScreen"
              component={OrderDetailScreen}
            />
            <Stack.Screen
              name="PaymentGatewayScreen"
              component={PaymentGatewayScreen}
            />
            <Stack.Screen name="AllReviewScreen" component={AllReviewScreen} />
            <Stack.Screen
              name="LocationPickerScreen"
              component={LocationPickerScreen}
            />
            <Stack.Screen
              name="AllNearestJourney"
              component={AllNearestJourney}
            />
            <Stack.Screen
              name="RequestDetailScreen"
              component={RequestDetailScreen}
            />
            <Stack.Screen
              name="AllSupportTickets"
              component={AllSupportTickets}
            />
            <Stack.Screen name="HelpScreen" component={HelpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="PendingAccountScreen" component={PendingAccountScreen} />
            <Stack.Screen name="HelpScreen" component={HelpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <MyStatusBar />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
            <View style={styles.container}>
              <Snackbar />
              <AppNavigator />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
});