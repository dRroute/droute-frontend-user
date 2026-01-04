import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import {
  actionOverlay,
  circularLoader,
  commonAppBar,
  inputBox,
  reUsableOverlayWithButton,
} from "../../components/commonComponents";
import MyStatusBar from "../../components/myStatusBar";
import { Colors, commonStyles, Fonts } from "../../constants/styles";
import SwipeableTabs from "../../components/swipeableTabs";
import { ParcelCard, ParcelLoadingCard } from "../../components/parcelCard";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { getDimensionUnitAbbreviation, getWeightUnitAbbreviation } from "../../utils/commonMethods";

const VehicleDetail = ({ navigation, route }) => {
  const { item } = route?.params;
  const driver = item?.driver;
  const journey = item?.journey
  const [isOfferModalVisible, setOfferModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [offerPrice, setOfferPrice] = useState(null);
  const image = null;
  const handleOfferSubmit = () => {};

  const VehicleDetailTab = () => {
    const driverAvatarUrl = driver?.documents?.find(
      (doc) => doc.documentName === `${driver?.driverId}_avatar`
    )?.documentUrl;

    return (
      <>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.userContainer}>
            <View style={styles.userInfo}>
              {driverAvatarUrl ? (
                <Image
                  source={{ uri: driverAvatarUrl }}
                  style={styles.userImage}
                />
              ) : (
                <View style={styles.userImagePlaceholder}>
                  <MaterialIcons
                    name="person"
                    size={26}
                    color={Colors.grayColor}
                  />
                </View>
              )}
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{driver?.fullName}</Text>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                  {driver?.vehicleName}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AllReviewScreen", {
                  driverId: driver?.driverId,
                })
              }
              style={styles.chatIcon}
            >
              <Text style={{ fontSize: 12, fontWeight: "500" }}>
                ⭐{item?.averageDriverRating}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: "500" }}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.locationsContainer}>
            <LocationItem
              title="Source Address"
              address={journey?.journeySource?.address}
            />
            <LocationItem
              title="Destination Address"
              address={journey?.journeyDestination?.address}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Vehicle Capacity:</Text>
            <View style={styles.divider} />
            <View style={{ marginTop: 8 }}>
              <DetailRow
                label="Height"
                value={`${
                  journey?.availableHeight
                } ${getDimensionUnitAbbreviation(
                  journey?.availableSpaceMeasurementType
                )}`}
              />
              <DetailRow
                label="Width"
                value={`${
                  journey?.availableWidth
                } ${getDimensionUnitAbbreviation(
                  journey?.availableSpaceMeasurementType
                )}`}
              />
              <DetailRow
                label="Length"
                value={`${
                  journey?.availableLength
                } ${getDimensionUnitAbbreviation(
                  journey?.availableSpaceMeasurementType
                )}`}
              />
              <DetailRow
                label="Weight"
                value={`${journey?.availableWeight} ${getWeightUnitAbbreviation(
                  journey?.availableWeightMeasurementType
                )}`}
              />
            </View>
          </View>

          <View style={styles.divider} />
        </ScrollView>
      </>
    );
  };

  const LocationItem = ({ title, address }) => {
    return (
      <View style={styles.locationItem}>
        <View style={styles.locationMarker}>
          <MaterialIcons name="location-on" size={20} color="teal" />
        </View>
        <View style={styles.locationInfo}>
          <Text style={{ ...Fonts.blackColor14Bold, marginBottom: 4 }}>
            {title}
          </Text>
          <Text style={Fonts.grayColor12Medium}>{address}</Text>
        </View>
      </View>
    );
  };

  const DetailRow = ({ label, value }) => {
    return (
      <View style={{ ...commonStyles.rowSpaceBetween, paddingVertical: 8 }}>
        <Text style={Fonts.blackColor12SemiBold}>{label}:</Text>
        <Text style={Fonts.blackColor12SemiBold}>{value}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
      {commonAppBar("Vehicle Detail", navigation)}
      {VehicleDetailTab()}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => navigation.navigate("ChatScreen")}
          style={{ ...commonStyles.outlinedButton, flex: 1 }}
        >
          <Text style={commonStyles.outlinedButtonText}>Chat With Driver</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("LocationPickerScreen")}
          style={{ ...commonStyles.button, flex: 1 }}
        >
          <Text style={commonStyles.buttonText}>Request Driver</Text>
        </TouchableOpacity>
      </View>
      {circularLoader(isLoading)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  content: {
    flex: 1,
  },
  userContainer: {
    ...commonStyles.rowSpaceBetween,
    padding: 16,
  },
  userInfo: {
    ...commonStyles.rowAlignCenter,
  },
  userImagePlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: Colors.extraLightGrayColor,
    justifyContent: "center",
    alignItems: "center",
  },
  boxInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    backgroundColor: "#f5f5f5",
    marginBottom: 15,
    height: 45,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    ...Fonts.blackColor16Bold,
    color: Colors.primaryColor,
    marginBottom: 4,
  },
  chatIcon: {
    alignItems: "flex-end",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.extraLightGrayColor,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    ...Fonts.blackColor14Bold,
    marginVertical: 8,
  },
  locationsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  locationItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  locationMarker: {
    width: 24,
    alignItems: "center",
  },

  locationInfo: {
    flex: 1,
    marginLeft: 8,
  },

  bottomButtons: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    gap: 10,
    borderTopColor: Colors.extraLightGrayColor,
  },

  listContainer: {
    padding: 5,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
});

export default VehicleDetail;
