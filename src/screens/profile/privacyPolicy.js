import { ScrollView, Text, View, Linking } from "react-native";
import React from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import { commonAppBar } from "../../components/commonComponents";

const privacyPoliciesList = {
  "Information We Collect (Your Information)":
    "We collect information during your usage of the platform, when you avail products or services, or when you visit our websites or mobile applications, either as a registered user or otherwise.",

  "Your Personal Information":
    "Full name, email ID, phone number, and other sensitive personal data or information. For drivers or vendors: PAN, Aadhaar, and vehicle-related documentation. This information is collected when you create an account or register for our services.",

  "Your Non-Personal Information":
    "Vehicle Information: Registration Number, Model, Year of Manufacture, Odometer Reading, Current Range, and Location. Third-Party Information: User ID and signup method (e.g., Facebook, Google) from linked social accounts. This includes public data, profile info, or other information shared with your consent. We may also combine this with data received from our partners or analytics providers.",
};

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {commonAppBar("Privacy Policy", navigation)}
        <ScrollView showsVerticalScrollIndicator={false}>
          {privacyPolicyInfo()}
        </ScrollView>
      </View>
    </View>
  );

  function privacyPolicyInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text style={{ fontSize: 12, marginBottom: 10, textAlign: "justify" }}>
          Droute and its affiliates, subsidiaries, and associate companies
          (hereinafter referred to individually and/or collectively as “Droute”)
          are committed to protecting the privacy of users accessing, using, or
          availing services on any of Droute’s websites, mobile sites, or
          mobile applications (collectively referred to as the “Platform”) or
          otherwise doing business with Droute. This Privacy Policy outlines how
          we collect, use, store, process, transfer, share, and protect your
          information when you visit our platform, use our services, or interact
          with us. This policy is an electronic record under the Information
          Technology Act, 2000 and the rules made thereunder (as amended), and
          does not require any physical signature or seal. In this document,
          “We” / “Us” / “Our” refers to Droute, and “You” / “Your” / “Yourself”
          refers to users of the platform. Undefined terms will carry the same
          meaning as defined in our Terms of Service.
        </Text>
        {Object.entries(privacyPoliciesList).map(
          ([title, description], index, array) => (
            <View key={index} style={{ marginBottom: Sizes.fixPadding }}>
              <Text style={{ ...Fonts.blackColor16Regular, fontWeight: "700" }}>
                {title}:
              </Text>
              <Text
                style={{ ...Fonts.blackColor16Regular, textAlign: "justify" }}
              >
                {description}
                {index === array.length - 1 ? (
                  <Text
                    // onPress={() => Linking.openURL("")}
                    style={{ color: "blue", marginLeft: 5 }}
                  >
                    {" "}
                    see more
                  </Text>
                ) : null}
              </Text>
            </View>
          )
        )}
      </View>
    );
  }
};

export default PrivacyPolicyScreen;
