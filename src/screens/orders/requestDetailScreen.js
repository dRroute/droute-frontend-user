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
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  getDimensionUnitAbbreviation,
  getWeightUnitAbbreviation,
} from "../../utils/commonMethods";
import { sendOrderRequest } from "../../redux/thunk/courierThunk";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAuthloader,
  selectUser,
} from "../../redux/selector/authSelector";
import { showSnackbar } from "../../redux/slice/snackbarSlice";
const RequestDetailScreen = ({ navigation, route }) => {
  const { requestDetail } = route.params;
  const [isOfferModalVisible, setOfferModalVisible] = useState(false);
  const [estimatedFare, setEstimatedFare] = useState(
    requestDetail?.order?.estimatedFare
  );
  const [offerPrice, setOfferPrice] = useState(
    requestDetail?.order?.offeredFare?.toString() || "200"
  );

  const driver = requestDetail?.journeyDetails?.driver;
  const journey = requestDetail?.journeyDetails?.journey;
  const courier = requestDetail?.courier;
  const order = requestDetail?.order;
  const image = driver?.documents?.find(
    (doc) => doc.documentName === `${driver?.driverId}_avatar`
  )?.documentUrl;
  const isLoading = useSelector(selectAuthloader);
  const [isAccepted, setIsAccepted] = useState(
    requestDetail?.order?.status === "ACCEPTED"
  );


  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleOfferSubmit = async () => {
    if (!journey || !courier) {
      dispatch(
        showSnackbar({
          message: "Missing courier or journey details.",
          type: "error",
          time: 3000,
        })
      );
      return;
    }

    const orderData = {
      courierId: courier?.courierId,
      journeyId: journey?.journeyId,
      estimatedFare: estimatedFare,
      offeredFare: parseFloat(offerPrice),
      orderStatus: null,
      userId: user?.userId,
      driverId: driver?.driverId,
      paymentRequestDto: null,
    };

    // console.log("Data to be submitted", orderData);
    setOfferModalVisible(false);
    try {
      const response = await dispatch(sendOrderRequest(orderData));

      if (sendOrderRequest.fulfilled.match(response)) {
        dispatch(
          showSnackbar({
            message:
              response?.payload?.message === "Order created successfully"
                ? "Offer Sent Successfully"
                : "Request sent to the driver",
            type: "success",
            time: 2000,
          })
        );

        setIsAccepted(true);
      } else {
        dispatch(
          showSnackbar({
            message: response?.payload?.message || "Failed to send request",
            type: "error",
            time: 3000,
          })
        );
      }
    } catch (error) {
      console.log("Offer Submit Error:", error);
      dispatch(
        showSnackbar({
          message:
            error?.message ||
            error?.response?.message ||
            "Something went wrong. Please try again later.",
          type: "error",
          time: 3000,
        })
      );
    }
  };



   const dataToNavigate ={
    orderId:order?.id,
    courierId:courier?.courierId,
    journeyId:journey?.journeyId,
    userId:user?.userId,
    driverId:driver.driverId,
    offeredFare:offerPrice,
   }
  const handleCheckout = () => {
  
  navigation.navigate("AddAddress",{dataToNavigate});
  
  };

  const deliveryCharge = order?.estimatedFare || 0;
  const insurance = Math.round(deliveryCharge * 0.01);
  const total = deliveryCharge + insurance;

  const VehicleDetailTab = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.userContainer}>
        <View style={styles.userInfo}>
          {image ? (
            <Image source={{ uri: image }} style={styles.userImage} />
          ) : (
            <View style={styles.userImagePlaceholder}>
              <MaterialIcons name="person" size={26} color={Colors.grayColor} />
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{driver?.fullName || "Unknown"}</Text>
            <Text style={{ ...Fonts.grayColor12Medium }}>
              {driver?.vehicleType}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("ChatScreen")}
          style={styles.chatIcon}
        >
          <Text style={{ fontSize: 12, fontWeight: "500" }}>
            ⭐{requestDetail?.journeyDetails?.averageDriverRating || 0}
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
            value={`${journey?.availableHeight} ${getDimensionUnitAbbreviation(
              journey?.availableSpaceMeasurementType
            )}`}
          />
          <DetailRow
            label="Width"
            value={`${journey?.availableWidth} ${getDimensionUnitAbbreviation(
              journey?.availableSpaceMeasurementType
            )}`}
          />
          <DetailRow
            label="Length"
            value={`${journey?.availableLength} ${getDimensionUnitAbbreviation(
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

      <View style={styles.section}>
        <View style={styles.divider} />
        <View style={{ ...commonStyles.rowSpaceBetween, paddingVertical: 8 }}>
          <Text style={styles.sectionTitle}>
            OFFERED AMOUNT : ₹ {order?.offeredFare}
          </Text>
          <TouchableOpacity onPress={() => setOfferModalVisible(true)}>
            <Ionicons name="create-outline" size={30} color="teal" />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
      </View>

      <View style={styles.divider} />
    </ScrollView>
  );

  const ParcelDetail = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.locationsContainer}>
        <LocationItem
          title="Pickup Address"
          address={courier?.courierSourceAddress}
        />
        <LocationItem
          title="Delivery Address"
          address={courier?.courierDestinationAddress}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Parcel Detail:</Text>
        <View style={styles.divider} />
        <View style={{ marginTop: 8 }}>
          <DetailRow
            label="Height"
            value={`${courier?.courierHeight} ${getDimensionUnitAbbreviation(
              courier?.courierDimensionUnit
            )}`}
          />
          <DetailRow
            label="Width"
            value={`${courier?.courierWidth} ${getDimensionUnitAbbreviation(
              courier?.courierDimensionUnit
            )}`}
          />
          <DetailRow
            label="Length"
            value={`${courier?.courierLength} ${getDimensionUnitAbbreviation(
              courier?.courierDimensionUnit
            )}`}
          />
          <DetailRow
            label="Weight"
            value={`${courier?.courierWeight} ${getWeightUnitAbbreviation(
              courier?.courierWeightUnit
            )}`}
          />
          <DetailRow label="Value" value={`${courier?.courierValue} ₹`} />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Expected Charges :</Text>
        <View style={styles.divider} />
        <View style={{ marginTop: 8 }}>
          <DetailRow label="Delivery Charge" value={`${estimatedFare} ₹`} />
          <DetailRow label="Insurance Charge" value={`${insurance} ₹`} />
          <DetailRow label="Total" value={`${total} ₹`} />
        </View>
      </View>
      <View style={styles.divider} />
    </ScrollView>
  );

  const LocationItem = ({ title, address }) => (
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

  const DetailRow = ({ label, value }) => (
    <View style={{ ...commonStyles.rowSpaceBetween, paddingVertical: 8 }}>
      <Text style={Fonts.blackColor12SemiBold}>{label}:</Text>
      <Text style={Fonts.blackColor12SemiBold}>{value}</Text>
    </View>
  );

  const offerOverlay = () => (
    <View style={{ padding: 10 }}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 14,
          fontWeight: "700",
          marginBottom: 10,
          color: Colors.primaryColor,
        }}
      >
        UPDATE OFFERED AMOUNT
      </Text>
      <TextInput
        style={styles.boxInput}
        placeholder="Amount You are Willing to Pay"
        placeholderTextColor="gray"
        value={offerPrice}
        onChangeText={setOfferPrice}
        keyboardType="numeric"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
      {commonAppBar("Request Detail", navigation)}
      <SwipeableTabs
        titles={["Vehicle Detail", "Parcel Detail"]}
        components={[<VehicleDetailTab />, <ParcelDetail />]}
      />
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
          onPress={isAccepted ? handleCheckout : null}
          disabled={!isAccepted}
          style={{
            ...commonStyles.button,
            flex: 1,
            backgroundColor: isAccepted
              ? Colors.primaryColor
              : Colors.grayColor + "99", 
          }}
        >
          <Text style={commonStyles.buttonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
      {circularLoader(isLoading)}
      {reUsableOverlayWithButton(
        offerOverlay,
        handleOfferSubmit,
        () => setOfferModalVisible(false),
        isOfferModalVisible,
        setOfferModalVisible
      )}
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

export default RequestDetailScreen;
