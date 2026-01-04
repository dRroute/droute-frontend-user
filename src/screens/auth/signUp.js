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
import { Colors, commonStyles, Fonts } from "../../constants/styles";
import { authInput, authPassword, ButtonWithLoader } from "../../components/commonComponents";
import MyStatusBar from "../../components/myStatusBar";
import { showSnackbar } from "../../redux/slice/snackbarSlice";
import { useDispatch, useSelector } from "react-redux";
import { sendOTP } from "../../redux/thunk/authThunk";
import { selectAuthErrorMessage } from "../../redux/selector/authSelector";
import AsyncStorage from "@react-native-async-storage/async-storage";
const SignUpScreen = ({ navigation }) => {
  const [userType, setUserType] = useState("user");
  const [email, setEmail] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [mobileNumber, setMobileNumber] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  const dispatch = useDispatch();
  const authErrorMessage = useSelector(selectAuthErrorMessage);
 const [isLoading,setIsLoading]=useState(false);
  const validateForm = (data) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (
      !data.email ||
      !data.contactNo ||
      !data.password ||
      !data.confirmPassword ||
      !data.fullName
    ) {
      return "Please fill in all fields";
    }
    if (!mobileRegex.test(data.contactNo)) {
      return "Please Enter a Valid Mobile Number";
    }
    if (!emailRegex.test(data.email)) {
      return "Please Enter a Valid Email id";
    }
    if (data.password !== data.confirmPassword) {
      return "Passwords  and confirmPassword do not match";
    }
    if (!strongPasswordRegex.test(data.password)) {
      return "Password must be 8–20 characters long and include at least one letter and one number";
    }
    if (!nameRegex.test(data.fullName)) {
      return "Please Enter a Valid Name";
    }
  };

  const handleSignUp = async () => {
 
   
    const data = {
      fullName: fullName,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      contactNo: mobileNumber,
      role: "user",
    };
    const validationError = validateForm(data);
    if (validationError) {
      console.log("error catched");
      dispatch(
        showSnackbar({ message: validationError, type: "error", time: 5000 })
      );
      return;
    }
     setIsLoading(true);
    //Calling.. OTP thunk
   try{
    const response = await dispatch(sendOTP({ email: data.email }));
    console.log('response = ', response?.payload?.data);
    if (response?.payload?.statusCode == 200 || response?.payload?.statusCode == 201) {
      const otp =response?.payload?.data;
      await dispatch(
        showSnackbar({
          message: response?.payload?.message,
          type: "success",
          time: 2000,
        })
      );
       await AsyncStorage.setItem(
          "user_id",
          String(response?.payload?.data?.userId)
        );
    
       navigation.navigate("VerificationScreen", { data ,otp});
    } else {
      await dispatch(
        showSnackbar({
          message: response?.payload?.message||"Failed to send OTP",
          type: "error",
          time: 2000,
        })
       
      );
      
    }
  }catch (e){
    dispatch(
        showSnackbar({ message:e.message, type: "error", time: 3000 })
 );
  }finally{
    setIsLoading(false);
   } 
  };

  const navigateToSignIn = () => {
    navigation.navigate("SignInScreen");
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
            <Text style={styles.title}>Sign Up</Text>

            {authInput(
              "Full Name",
              fullName,
              setFullName,
              "Enter Full Name",
              "default"
            )}
            {authInput(
              "Email",
              email,
              setEmail,
              "Enter Email Id Here",
              "email"
            )}
            {authInput(
              "Mobile Number",
              mobileNumber,
              setMobileNumber,
              "Enter Mobile Number Here",
              "number"
            )}
            {authPassword(
              "Password",
              password,
              setPassword,
              "Enter Password",
              secureText,
              setSecureText
            )}
            {authPassword(
              "Confirm Password",
              confirmPassword,
              setConfirmPassword,
              "Confirm your Password",
              secureConfirmText,
              setSecureConfirmText
            )}
              {ButtonWithLoader("Sign Up","Processing...",isLoading,handleSignUp)}
           

            <TouchableOpacity
              style={styles.signInLink}
              onPress={navigateToSignIn}
            >
              <Text style={styles.signInText}>
                Already Have an Account?{" "}
                <Text style={styles.signInHighlight}>Sign In</Text>
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
    marginTop: 10,
  },
  signUpButtonText: {
    ...commonStyles.buttonText,
  },
  signInLink: {
    marginTop: 20,
    alignItems: "center",
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

export default SignUpScreen;
