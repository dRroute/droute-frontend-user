import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { fullImageContainer } from "../../components/commonComponents";
import { showFullImageFunction } from "../../utils/commonMethods";
import { logoutUser } from "../../redux/slice/authSlice";
import { selectUser } from "../../redux/selector/authSelector";

const image =
  "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg";
const Profile = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLogoutSheet, setshowLogoutSheet] = useState(false);
  const [avatar, setAvatar] = useState(image);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <ScrollView style={{ flex: 1 }}>
        {/* {header()} */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 50,
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 2.0,
          }}
        >
          {profileInfoWithOptions()}
        </ScrollView>
      </ScrollView>
      {logoutSheet()}
    </View>
  );

  function profileInfoWithOptions() {
    return (
      <View style={styles.profileInfoWithOptionsWrapStyle}>
        <TouchableOpacity
          onPress={() => {
            showFullImageFunction(image, setSelectedImage, setModalVisible);
          }}
          style={{ alignItems: "center" }}
        >
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.userImageStyle} />
          ) : (
            <View style={styles.userIconStyle}>
              <Icon name="person-off" size={60} color="#e0e0eb" />
            </View>
          )}
        </TouchableOpacity>

        <View
          style={{
            alignItems: "center",
            marginTop: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding,
          }}
        >
          <Text style={{ ...Fonts.blackColor18SemiBold }}>
            {user?.fullName}
          </Text>
          <Text style={{ ...Fonts.grayColor16Medium }}>
            +91 {user?.contactNo}
          </Text>
        </View>
        <View>
          {profileOption({
            option: "Edit Profile",
            iconName: "person",
            onPress: () => navigation.navigate("EditProfile"),
          })}

          {profileOption({
            option: "Terms & Conditions",
            iconName: "list-alt",
            onPress: () => navigation.navigate("TermsAndConditionsScreen"),
          })}

          {profileOption({
            option: "Privacy Policy",
            iconName: "privacy-tip",
            onPress: () => navigation.navigate("PrivacyPolicyScreen"),
          })}
          {profileOption({
            option: "Raised Tickets",
            iconName: "confirmation-number",
            onPress: () => navigation.navigate("AllSupportTickets"),
          })}
          {profileOption({
            option: "Saved Parcel ",
            iconName: "all-inbox",
            onPress: () => navigation.navigate("AllSavedParcels"),
          })}
          {profileOption({
            option: "Help & Support",
            iconName: "help",
            onPress: () => navigation.navigate("HelpScreen"),
          })}
          {logoutInfo()}
        </View>
        {fullImageContainer(modalVisible, setModalVisible, selectedImage)}
      </View>
    );
  }

  function logoutInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setshowLogoutSheet(true);
        }}
        style={{
          ...commonStyles.rowSpaceBetween,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={{ ...commonStyles.rowAlignCenter, flex: 1 }}>
          <View style={styles.optionIconWrapper}>
            <MaterialIcons name="logout" size={24} color={Colors.redColor} />
          </View>
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.redColor18Medium,
              marginLeft: Sizes.fixPadding * 1.5,
              flex: 1,
            }}
          >
            Logout
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={15.0}
          color={Colors.redColor}
        />
      </TouchableOpacity>
    );
  }

  function profileOption({ option, iconName, onPress }) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={{
          ...commonStyles.rowSpaceBetween,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={{ ...commonStyles.rowAlignCenter, flex: 1 }}>
          <View style={styles.optionIconWrapper}>
            <MaterialIcons
              name={iconName}
              size={24}
              color={Colors.primaryColor}
            />
          </View>
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.blackColor14Medium,
              marginLeft: Sizes.fixPadding * 1.5,
              flex: 1,
            }}
          >
            {option}
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={15.0}
          color={Colors.primaryColor}
        />
      </TouchableOpacity>
    );
  }

  function logoutSheet() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLogoutSheet}
        onRequestClose={() => setshowLogoutSheet(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.bodyBackColor,
              borderTopLeftRadius: Sizes.fixPadding * 3.0,
              borderTopRightRadius: Sizes.fixPadding * 3.0,
              paddingTop: Sizes.fixPadding * 2,
            }}
          >
            {/* <Text style={styles.logoutTextStyle}>Logout</Text> */}
            <Text
              style={{
                textAlign: "center",
                ...Fonts.blackColor14Medium,
                marginBottom: Sizes.fixPadding * 4,
                marginHorizontal: Sizes.fixPadding * 2.0,
              }}
            >
              Are you sure you want to log out?
            </Text>
            <View
              style={{
                ...commonStyles.rowAlignCenter,
                marginTop: Sizes.fixPadding,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setshowLogoutSheet(false)}
                style={{
                  ...styles.cancelButtonStyle,
                  ...styles.sheetButtonStyle,
                }}
              >
                <Text style={{ ...Fonts.blackColor14Medium }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  dispatch(logoutUser());
                  setshowLogoutSheet(false);
                  console.log(
                    "User logged out successfully in profileScreen and navigating to Signin"
                  );
                }}
                style={{
                  ...styles.logoutButtonStyle,
                  ...styles.sheetButtonStyle,
                }}
              >
                <Text style={{ ...Fonts.whiteColor14Medium }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};

export default Profile;

const styles = StyleSheet.create({
  userImageStyle: {
    width: screenWidth / 4.0,
    height: screenWidth / 4.0,
    borderRadius: screenWidth / 4.0 / 2.0,
    marginTop: -Sizes.fixPadding * 5.0,
    borderColor: Colors.whiteColor,
    borderWidth: 2.0,
  },
  userIconStyle: {
    width: screenWidth / 4.0,
    height: screenWidth / 4.0,
    borderRadius: screenWidth / 4.0 / 2.0,
    marginTop: -Sizes.fixPadding * 5.0,
    borderColor: "#e0e0eb",
    borderWidth: 2.0,
    backgroundColor: Colors.whiteColor,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfoWithOptionsWrapStyle: {
    backgroundColor: Colors.whiteColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
  },
  optionIconWrapper: {
    width: 46.0,
    height: 46.0,
    borderRadius: 23.0,
    backgroundColor: "rgba(87, 88, 88, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetButtonStyle: {
    flex: 1,
    ...commonStyles.shadow,
    borderTopWidth: Platform.OS == "ios" ? 0 : 1.0,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical:
      Platform.OS == "ios" ? Sizes.fixPadding + 3.0 : Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopColor: Colors.extraLightGrayColor,
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
  },
  logoutButtonStyle: {
    borderTopColor: Colors.primaryColor,
    backgroundColor: Colors.primaryColor,
    borderBottomRightRadius: Sizes.fixPadding - 5.0,
  },
});
