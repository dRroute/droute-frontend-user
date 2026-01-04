import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Image,
  View,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";


import { Overlay } from "@rneui/themed";
import {
  circularLoader,
  commonAppBar,
  inputBox,
  reUsableOverlayWithButton,
  textArea,
} from "../../components/commonComponents";
import { selectAuthloader, selectUser } from "../../redux/selector/authSelector";
import { useSelector } from "react-redux";

const HelpScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [description, setDescription] = useState("");

  const [showEmergencyDialog, setshowEmergencyDialog] = useState(false);
  const [emergencyQuery, setEmergencyQuery] = useState("");
  const [charCount, setCharCount] = useState(120);

const user=useSelector(selectUser);
const isLoading=useSelector(selectAuthloader);

  const time = 2000;
  const handleEmergencyQueryChange = (text) => {
    if (text.length <= 100) {
      setEmergencyQuery(text);
      setCharCount(100 - text.length);
    }
  };
  const handleSubmit=()=>{

  const data ={

  }


    console.log("Handle submit called");
  }


  const submitEmegencyQuery = () => {
    console.log("submitEmegencyQuery called");
    setshowEmergencyDialog(false);
  };
  const cancelEmegencyQuery = () => {
    console.log("cancelEmegencyQuery called");
    setshowEmergencyDialog(false);
    setEmergencyQuery("");
  };




  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      {commonAppBar("Help & Support", navigation)}
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
        >
          {helpImage()}
          {talkingInfo()}

          {inputBox?.(
            mobileNumber,
            setMobileNumber,
            "Enter Your Contact Number",
            "Mobile Number",
            false,
            "phone-pad"
          )}
          {inputBox?.(
            email,
            setEmail,
            "Enter Your Email Id",
            "Email Id",
            false,
            "default"
          )}
          {inputBox?.(
            title,
            setTitle,
            "Enter Title or Subject of Query",
            "Title",
            false,
            "default"
          )}
          {textArea?.(
            description,
            setDescription,
            "Describe Your Query....",
            "Description",
            false, 
          )}
          <TouchableOpacity
            style={{ ...commonStyles.button, marginBottom: 50 }}
            onPress={handleSubmit}
          >
            <Text style={{ ...commonStyles.buttonText }}>Submit</Text>
          </TouchableOpacity>
          {reUsableOverlayWithButton(
            emergencyQueryInput,
            submitEmegencyQuery,
            cancelEmegencyQuery,
            showEmergencyDialog,
            setshowEmergencyDialog
          )}
          {circularLoader(isLoading)}
        </ScrollView>
      </View>
    </View>
  );

  function talkingInfo() {
    return (
      <View
        style={{
          marginVertical: Sizes.fixPadding,
        }}
      >
        <Text style={{ ...Fonts.blackColor12Bold }}>
          Talk to our support team
        </Text>
        <Text style={{ ...Fonts.grayColor12Regular }}>
          Fill the form below and our support team will be in touch with you
          shortly. Or In case of Emergency,{" "}
          <Text
            onPress={() => setshowEmergencyDialog(true)}
            style={{
              ...Fonts.grayColor12SemiBold,
              color: "blue",
              textDecorationLine: "underline",
            }}
          >
            Click Here
          </Text>
        </Text>
      </View>
    );
  }

  function helpImage() {
    return (
      <Image
        source={require("../../../assets/images/help.png")}
        style={styles.helpImageStyle}
      />
    );
  }
  function emergencyQueryInput() {
  return (
    <>
      <Text
        style={{
          ...Fonts.blackColor18Medium,
          textAlign: "center",
          color: Colors.primaryColor,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        Write Query In Short
      </Text>
      <Text
        style={{
          color: charCount > 30 ? "green" : "red",
          fontSize: 10,
          textAlign: "center",
          fontFamily: "YourFontFamily-Regular",
        }}
      >
        {charCount} characters left
      </Text>
      <View
        style={{
          padding: 5,
          margin: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 4,
        }}
      >
        <TextInput
          placeholder="Describe Your Query Here.."
          value={emergencyQuery}
          onChangeText={handleEmergencyQueryChange}
          style={{
            ...Fonts.blackColor12Medium,
            paddingTop: Sizes.fixPadding,
            paddingHorizontal: Sizes.fixPadding,
            textAlignVertical: "top",
            height: 100,
          }}
          placeholderTextColor={Colors.grayColor}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.extraLightGrayColor}
          multiline
        />
      </View>
    </>
  );
 }



};

export default HelpScreen;

const styles = StyleSheet.create({
  helpImageStyle: {
    width: "100%",
    height: screenWidth / 1.5,
    resizeMode: "contain",
    marginVertical: Sizes.fixPadding,
    // backgroundColor:"teal"
  },

});
