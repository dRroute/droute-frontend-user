// SignUpScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  Colors,
  commonStyles,
  Fonts,
  screenWidth,
  Sizes,
} from "../../constants/styles";
import { ButtonWithLoader, otpFields } from "../../components/commonComponents";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/thunk/authThunk";
import { showSnackbar } from "../../redux/slice/snackbarSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VerificationScreen = ({ navigation, route }) => {
  const { data, otp } = route?.params;
  const dispatch = useDispatch();
  const [otpInput, setOtpInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const VerifyOTP = async () => {
    setIsLoading(true);
    // alert(otpInput);
    try {
      if (otpInput === otp) {

        console.log("OTP is correct, proceeding with registration data:", data);
        const response = await dispatch(register(data));

        console.log("Response in verification ", response?.payload);

        if (register.fulfilled.match(response)) {
          await AsyncStorage.setItem(
            "user_id",
            String(response?.payload?.data?.driverId)
          );

          const savedId = await AsyncStorage.getItem("user_id");
          console.log("driver id saved in storage", savedId);

          await dispatch(
            showSnackbar({
              message: response?.payload?.message,
              type: "success",
              time: 2000,
            })
          );
          // navigation.navigate("InstructionToComplete");
        } else {
          await dispatch(
            showSnackbar({
              message: response?.payload?.message,
              type: "error",
              time: 5000,
            })
          );
        }
      } else {
        await dispatch(
          showSnackbar({
            message: "Entered Incorrect OTP",
            type: "error",
            time: 2000,
          })
        );
      }
    } catch (e) {
      await dispatch(
        showSnackbar({
          message: e.message || "Registration Failed Unexpected Error",
          type: "error",
          time: 2000,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/transparentIcon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={{ ...Fonts.whiteColor14Medium }}>
              Please check your email
            </Text>
            <Text style={{ ...Fonts.whiteColor10Medium, marginTop: 5 }}>
              (Kindly check your spam folder as well)
            </Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Verify OTP</Text>

            {otpFields(otpInput, setOtpInput)}
            {ButtonWithLoader("Submit", "Processing...", isLoading, VerifyOTP)}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  logoContainer: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    width: 200,
    height: 200,
  },
  formContainer: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.blackColor,
    marginBottom: 20,
  },
  signUpButton: {
    ...commonStyles.button,
    marginTop: 10,
    marginBottom: 30,
  },

  signUpButtonText: {
    ...commonStyles.buttonText,
  },
});

export default VerificationScreen;
