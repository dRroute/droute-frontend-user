import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import {
  circularLoader,
  commonAppBar,
  reUsableOverlayWithButton
} from "../../components/commonComponents";
import MyStatusBar from "../../components/myStatusBar";
import SwipeableTabs from "../../components/swipeableTabs";
import { Colors, commonStyles, Fonts } from "../../constants/styles";
import { selectCouriers, selectUser } from "../../redux/selector/authSelector";
import { getDimensionUnitAbbreviation, getWeightUnitAbbreviation } from "../../utils/commonMethods";

import { showSnackbar } from "../../redux/slice/snackbarSlice";
import { sendOrderRequest } from "../../redux/thunk/courierThunk";

const VehicleAndParcelDetail = ({ navigation, route }) => {
  const [isOfferModalVisible, setOfferModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [offerPrice, setOfferPrice] = useState(null);
  const { item, courierId } = route?.params;
  const driver = item?.driver;
  const journey = item?.journey
  const user = useSelector(selectUser);
  const courierDetail = useSelector(selectCouriers).find(courier => courier?.courierId === courierId);
  const dispatch = useDispatch();

  console.log('parcel detail = ', courierDetail);
  const image = null;
  const handleOfferSubmit = async() => { 
    const orderData = {
      courierId: courierDetail?.courierId,
      journeyId: journey?.journeyId,
      estimatedFare: 299,
      offeredFare: offerPrice,
      orderStatus: null,
      userId: user?.userId,
      driverId: driver?.driverId,
      paymentRequestDto: null
    }
 
    console.log('Data to be submitted', orderData);

    setIsLoading(true);
    setOfferModalVisible(false);
    try {
      const response = await dispatch(sendOrderRequest(orderData));

      if (sendOrderRequest.fulfilled.match(response)) {
        dispatch(showSnackbar({
          message: response?.payload?.message ==="Order created successfully"?"Offer Sent Succesfully":"Offer Sent Succesfully" || 'Request sent to the driver',
          type: 'success',
          time: 2000
        }));

        
      } else {
         dispatch(showSnackbar({
          message: response?.payload?.message || 'Failed to sent request',
          type: 'error',
          time: 3000
        }));
        
      }

    } catch (error) {

      console.log(error);
       dispatch(showSnackbar({
          message: error?.message || error?.response?.message || 'Some thing went wrong. Please try after sometime.',
          type: 'error',
          time: 3000
        }));
    } finally{
      setIsLoading(false);
    }
  };

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
                <Image source={{ uri: driverAvatarUrl }} style={styles.userImage} />
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
              onPress={() => navigation.navigate("AllReviewScreen", { driverId: driver?.driverId })}
              style={styles.chatIcon}
            >
              <Text style={{ fontSize: 12, fontWeight: "500" }}>⭐{item?.averageDriverRating}</Text>
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
              <DetailRow label="Height" value={`${journey?.availableHeight} ${getDimensionUnitAbbreviation(journey?.availableSpaceMeasurementType)}`} />
              <DetailRow label="Width" value={`${journey?.availableWidth} ${getDimensionUnitAbbreviation(journey?.availableSpaceMeasurementType)}`}  />
              <DetailRow label="Length" value={`${journey?.availableLength} ${getDimensionUnitAbbreviation(journey?.availableSpaceMeasurementType)}`}  />
              <DetailRow label="Weight" value={`${journey?.availableWeight} ${getWeightUnitAbbreviation(journey?.availableWeightMeasurementType)}`}  />
            </View>
          </View>

          <View style={styles.divider} />
        </ScrollView>
      </>
    );
  };

  const closeOfferModal = () => {
    setOfferModalVisible(false);
  };

  const ParcelDetail = () => {
    return (
      <>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.locationsContainer}>
            <LocationItem
              title="Pickup Address"
              address= {courierDetail?.courierSourceAddress}
            />
            <LocationItem
              title="Delivery Address"
              address= {courierDetail?.courierDestinationAddress}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Parcel Detail:</Text>
            <View style={styles.divider} />
            <View style={{ marginTop: 8 }}>
              <DetailRow label="Height" value= {`${courierDetail?.courierHeight} ${getDimensionUnitAbbreviation(courierDetail?.courierDimensionUnit)}`} />
              <DetailRow label="Width" value= {`${courierDetail?.courierWidth} ${getDimensionUnitAbbreviation(courierDetail?.courierDimensionUnit)}`} />
              <DetailRow label="Length" value= {`${courierDetail?.courierLength} ${getDimensionUnitAbbreviation(courierDetail?.courierDimensionUnit)}`} />
              <DetailRow label="Weight" value= {`${courierDetail?.courierWeight} ${getWeightUnitAbbreviation(courierDetail?.courierWeightUnit)}`} />
              <DetailRow label="Value" value= {`${courierDetail?.courierHeight} ${getWeightUnitAbbreviation(courierDetail?.courierWeightUnit)}`} />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Expected Charges :</Text>
            <View style={styles.divider} />
            <View style={{ marginTop: 8 }}>
              <DetailRow label="Delivery Charge" value="299 $" />
              <DetailRow label="Insurance Charge" value="9 $" />
              <DetailRow label="Total" value="300 $" />
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
  const offerOverlay = () => {
    return (
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
          OFFER AN AMOUNT
        </Text>
        <TextInput
          style={styles.boxInput}
          placeholder="Amount You are Willing to Pay"
          placeholderTextColor="gray"
          value={offerPrice}
          onChangeText={(text) => {
            setOfferPrice(text);
          }}
          keyboardType="numeric"
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
      {commonAppBar("Take an Action", navigation)}
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
          onPress={() => setOfferModalVisible(true)}
          style={{ ...commonStyles.button, flex: 1 }}
        >
          <Text style={commonStyles.buttonText}>Make an Offer</Text>
        </TouchableOpacity>
      </View>
      {circularLoader(isLoading)}
      {reUsableOverlayWithButton(
        offerOverlay,
        handleOfferSubmit,
        closeOfferModal,
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

export default VehicleAndParcelDetail;
