import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import MyStatusBar from "../../components/myStatusBar";
import {
  ButtonWithLoader,
  commonAppBar,
  typeSection,
} from "../../components/commonComponents";
import { fetchAddressComponent, trimText } from "../../utils/commonMethods";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Colors, commonStyles, Sizes } from "../../constants/styles";

import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../../redux/slice/snackbarSlice";
import { selectAuthloader, selectUser } from "../../redux/selector/authSelector";
import { postCourier } from "../../redux/thunk/courierThunk";

const LabeledInput = ({ label, placeholder, value, setter, required = false, style }) => (
  <View style={[{ flex: 1 }, style]}>
    <Text style={styles.sectionLabel}>
      {label}
      {required && <Text style={{ color: Colors.darkOrangeColor }}> *</Text>}
    </Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={(text) => setter(text)}
      maxLength={80}
      keyboardType="numeric"
    />
  </View>
);

const SearchVehicleForm = ({ route, navigation }) => {
  const { data } = route?.params;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [selectedField, setSelectedField] = useState(null);

  const [isPickerVisible, setPickerVisible] = useState(false);
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);
  const [length, setLength] = useState(null);
  const [lengthUnit, setLengthUnit] = useState(null);
  const [weightUnit, setWeightUnit] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [parcelValue, setParcelValue] = useState(null)

  const isLoading=useSelector(selectAuthloader);
  const handleSubmit = async () => {

    console.log("data in search vehicle form", data);
    //add validation for weight, height, width, length, weightUnit and lengthUnit
    if (!weight || !height || !width || !length || !weightUnit || !lengthUnit || !parcelValue ||
      !data?.sourceAddress || !data?.destinationAddress
      || !data?.sourceCoordinate || !data?.destinationCoordinate
    ) {
      await dispatch(
        showSnackbar({
          message: "Please fill all the required fields",
          type: "error",
          time: 2000,
        })
      );
      return;
    }


    const CourierData = {
      userId: user?.userId,
      courierSourceAddress: data?.sourceAddress,
      courierSourceCoordinate: `${data?.sourceCoordinate?.latitude},${data?.sourceCoordinate?.longitude}`,
      courierDestinationAddress: data?.destinationAddress,
      courierDestinationCoordinate: `${data?.destinationCoordinate?.latitude},${data?.destinationCoordinate?.longitude}`,
      courierHeight: parseFloat(height),
      courierWidth: parseFloat(width),
      courierLength: parseFloat(length),
      courierDimensionUnit: lengthUnit,
      courierWeight: parseFloat(weight),
      courierWeightUnit: weightUnit,
      courierValue: parcelValue,
    };

    console.log('CourierData in search vehicle form', CourierData);

    try {


      const response = await dispatch(postCourier(CourierData));

      if (postCourier.fulfilled.match(response)) {
        console.log("Courier posted successfully, now searching for Journey");
        await dispatch(
          showSnackbar({
            message: response?.payload?.message,
            type: "success",
            time: 2000,
          })
        );

        //After successful posting, navigate to AllJourneyList
        navigation.navigate("AllSearchedJourneyList", {
          courierId: response?.payload?.data?.courierId,
        });
        return;
      } else {
        console.log("Courier posting failed", response?.payload?.message);
        await dispatch(
          showSnackbar({
            message: response?.payload?.message || "Courier posting failed",
            type: "error",
            time: 2000,
          })
        );
      }

    } catch (error) {

      console.log("Error in posting courier", error);
      await dispatch(
        showSnackbar({
          message: error?.message || "Something went wrong while posting courier. Please try again after sometime.",
          type: "error",
          time: 2000,
        })
      );

    }




    // navigation.navigate("AllJourneyList");
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <MyStatusBar />
      {commonAppBar("Parcel Detail", navigation)}


      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Parcel Detail</Text>

        <View style={styles.routeContainer}>
          <View style={styles.timeline}>
            <Ionicons name="location" size={16} color={Colors.darkOrangeColor} />
            <View style={styles.timelineLine} />
            <Ionicons name="location-outline" size={16} color={Colors.darkOrangeColor} />
          </View>

          <View style={styles.addressesContainer}>
            <Text style={styles.addressText}>
              {trimText(data?.sourceAddress, 45)}
            </Text>
            <View style={{ height: 25 }} />
            <Text style={styles.addressText}>
              {trimText(data?.destinationAddress, 45)}
            </Text>
          </View>
        </View>

        {/* Capacity Section */}
        <View style={styles.section}>
          {typeSection(weightUnit, setWeightUnit, "Select Weight Unit", false, [
            { label: "Ton", value: "Ton" },
            { label: "kg", value: "kg" },
          ])}
        </View>

        <View style={styles.section}>
          {typeSection(lengthUnit, setLengthUnit, "Select Length Unit", false, [
            { label: "meter", value: "m" },
            { label: "foot", value: "f" },
            { label: "Centimeter", value: "cm" },
          ])}
        </View>

        <View style={[styles.section, commonStyles.rowSpaceBetween]}>
          <LabeledInput
            label={`Weight (${weightUnit})`}
            placeholder="Enter Weight Capacity"
            value={weight}
            setter={setWeight}
            required
            style={{ marginRight: 8 }}
          />
          <LabeledInput
            label={`Length (${lengthUnit})`}
            placeholder="Enter Length"
            value={length}
            setter={setLength}
            required
            style={{ marginLeft: 8 }}
          />
        </View>

        <View style={[styles.section, commonStyles.rowSpaceBetween]}>
          <LabeledInput
            label={`Height (${lengthUnit})`}
            placeholder="Enter Height"
            value={height}
            setter={setHeight}
            required
            style={{ marginRight: 8 }}
          />
          <LabeledInput
            label={`Width (${lengthUnit})`}
            placeholder="Enter Width"
            value={width}
            setter={setWidth}
            required
            style={{ marginLeft: 8 }}
          />
          <LabeledInput
            label={`Parcel Value (₹)`}
            placeholder="Enter in INR"
            value={parcelValue}
            setter={setParcelValue}
            required
            style={{ marginRight: 8 }}
          />
        </View>
      </View>

      <View style={{ marginHorizontal: 10, marginVertical: 50 }}>
        {ButtonWithLoader("Search", "Processing..", isLoading, handleSubmit)}
      </View>
    </ScrollView>
  );
};


export default SearchVehicleForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    margin: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primaryColor,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.primaryColor,
    marginBottom: 6,
  },
  //Location detail
  routeContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  timeline: {
    width: 20,
    alignItems: "center",
    marginRight: 8,
  },

  timelineLine: {
    width: 1,
    height: 18,
    backgroundColor: Colors.darkOrangeColor,
    marginVertical: 4,
    borderStyle: "dotted",
    borderWidth: 1,
  },

  addressesContainer: {
    flex: 1,
  },
  addressText: {
    fontSize: 12,
    color: Colors.blackColor,
    lineHeight: 15,
  },
  customTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    width: "48%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
  },
  section: {
    marginBottom: 12,
  },
});
