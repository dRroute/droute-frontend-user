import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Linking,
} from "react-native";
import React from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import { commonAppBar } from "../../components/commonComponents";

const termsAndConditionsObject = {
  Safety:
    "Both users and drivers are expected to prioritize safety during the pickup, transit, and delivery of goods. Droute is not liable for accidents caused by user or driver negligence.",
  Damage:
    "Drivers are responsible for ensuring the safety of the goods in their possession. In case of damage due to mishandling or negligence, liability may be assigned to the responsible party.",
  "Limited Liability":
    "Droute acts as a platform and holds no responsibility for direct or indirect losses (financial or otherwise) arising from delivery delays, vehicle issues, or user-driver disputes.",
  "Fair Usage":
    "Users and drivers must not misuse the platform for activities outside the intended logistics and transport purposes. Misuse may result in suspension or termination of access.",
  Pricing:
    "Pricing is calculated based on distance, weight, volume, and current demand. Prices may vary and are subject to change without prior notice.",
  Payment:
    "Users agree to pay for services booked through the platform. All applicable charges will be shown at the time of booking and must be paid digitally.",
  "Payment Methods":
    "Payments are processed via integrated payment gateways. Users may be required to add wallet balance or link cards/bank accounts for transactions.",
  Insurance:
    "Optional insurance can be purchased for high-value goods. In the absence of insurance, Droute shall not be responsible for damage, loss, or theft.",
  Cancellation:
    "Cancellations must be made within the allowed window to avoid charges. Repeated last-minute cancellations may lead to account restrictions.",
  Disputes:
    "Any disputes regarding deliveries, payments, or behavior should be reported through the support system. Droute will mediate where applicable.",
  Suspension:
    "Violation of guidelines, repeated misconduct, or fraudulent activity may lead to account suspension or permanent deactivation.",
  "Termination/Modification":
    "Droute reserves the right to modify terms, pricing, or services offered without prior notice. Continued use of the platform implies acceptance of such changes.",
  "Governing Law":
    "These terms are governed by the applicable laws of the jurisdiction in which the service is availed.",
  Tracking:
    "Users agree to share their location for accurate pickups and deliveries. Drivers agree to allow location tracking for user and admin transparency.",
  Privacy:
    "User and driver data is handled in accordance with our Privacy Policy. Personal information will not be shared without consent, except as required by law.",
  Acceptance:
    "By using the Droute platform, both users and drivers agree to these Terms and Conditions and any future updates thereof.",
};

const TermsAndConditionsScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {commonAppBar("Terms & Conditions", navigation)}
        <ScrollView showsVerticalScrollIndicator={false}>
          {termsAndConditionInfo()}
        </ScrollView>
      </View>
    </View>
  );

  function termsAndConditionInfo() {
    return (
      <View
        style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: 50 }}
      >
        <Text style={{ fontSize: 12, marginBottom: 10, textAlign: "justify" }}>
          By visiting our platform or availing any of our services, you indicate
          that you understand, agree, and consent to these Terms and Conditions.
          You hereby give your unconditional consent to Droute for the
          collection, use, storage, processing, sharing, transfer, and
          disclosure of your information as required under applicable law. You
          acknowledge that you have the legal authority to share your
          information with us, and that its use will not cause any loss or
          wrongful gain to you or any other person.
        </Text>
        {Object.entries(termsAndConditionsObject).map(
          ([title, description], index, array) => (
            <View key={index} style={{ marginBottom: Sizes.fixPadding }}>
              <Text style={{ ...Fonts.blackColor16Regular, fontWeight: "700" }}>
                {title}:
              </Text>
              <Text style={{ ...Fonts.blackColor16Regular, textAlign: "justify" }}>
                {description}
                {index === array.length - 1 ? (
                  <Text
                    // onPress={() => Linking.openURL("https://droute.app/privacy")}
                    style={{ color: "blue" }}
                  >
                    {" "}
                    See more
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

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({});
