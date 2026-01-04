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
import { Colors, commonStyles, Fonts, Sizes } from "../../constants/styles";
import {
  authInput,
  authPassword,
  ButtonWithLoader,
  circularLoader,
} from "../../components/commonComponents";
import MyStatusBar from "../../components/myStatusBar";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../../redux/slice/snackbarSlice";
import { signIn } from "../../redux/thunk/authThunk";
import AsyncStorage from "@react-native-async-storage/async-storage";
const SignInScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [emailOrPhone, setEmailOrPhone] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState(null);

  const [secureText, setSecureText] = useState(true);
  const validateForm = (data) => {
    if (!data.emailOrPhone || !data.password) {
      return "Please Enter Login Credential First";
    }
  };
  const handleSignIn = async () => {

    const data = {
      emailOrPhone: emailOrPhone,
      password: password,
      role: "user",
    };
    const validationError = validateForm(data);

    if (validationError) {
      console.log("error catched");
      await dispatch(
        showSnackbar({ message: validationError, type: "error", time: 5000 })
      );
      return;
    }
    setIsLoading(true);
    try {
      const response = await dispatch(signIn(data));
      if (signIn.fulfilled.match(response)) {
        await AsyncStorage.setItem(
          "user_id",
          String(response?.payload?.data?.userId)
        );

        const savedId = await AsyncStorage.getItem("user_id");
        console.log("driver id saved in storage", savedId);
        await dispatch(
          showSnackbar({
            message: response?.payload?.message,
            type: "success",
            time: 5000,
          })
        );
      } else{
         await dispatch(
          showSnackbar({
            message: response?.payload?.message,
            type: "error",
            time: 5000,
          })
        );
      }
    } catch (e) {
      await dispatch(
        showSnackbar({ message: validationError, type: "error", time: 3000 })
      );
    } finally {
      setIsLoading(false);
    }
  };
  // Handle navigation to sign in
  const navigateToSignUp = () => {
    navigation.navigate("SignUpScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
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
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Sign In</Text>
            {authInput(
              "Email Id or Mobile Number",
              emailOrPhone,
              setEmailOrPhone,
              "Enter Email Id or Mobile Number",
              "email"
            )}
            {authPassword(
              "Password",
              password,
              setPassword,
              "Enter Password",
              secureText,
              setSecureText
            )}

            <TouchableOpacity
              style={styles.forgetPassLink}
              onPress={() => navigation.navigate("ForgetPassword")}
            >
              <Text style={styles.signInText}>
                Forgot Password ?{" "}
                <Text style={styles.signInHighlight}>Click here</Text>
              </Text>
            </TouchableOpacity>
            {ButtonWithLoader(
              "Sign In",
              "Processing...",
              isLoading,
              handleSignIn
            )}

            <TouchableOpacity
              style={styles.signInLink}
              onPress={navigateToSignUp}
            >
              <Text style={styles.signInText}>
                Are You New User?{" "}
                <Text style={styles.signInHighlight}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
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
  },
  signUpButtonText: {
    ...commonStyles.buttonText,
  },
  signInLink: {
    marginTop: 20,
    alignItems: "center",
  },
  forgetPassLink: {
    marginBottom: 20,
    alignItems: "flex-end",
  },

  signInText: {
    fontSize: 14,
    color: Colors.blackColor,
  },
  signInHighlight: {
    color: Colors.primaryColor,
    fontWeight: "bold",
  },
});

export default SignInScreen;
