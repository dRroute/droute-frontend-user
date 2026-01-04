import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Colors, commonStyles } from "../../constants/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MyStatusBar from "../../components/myStatusBar";
import {
  circularLoader,
  commonAppBar,
  commonLabel,
  fullImageContainer,
  ImageBottomSheet,
  inputBox,
  renderImageBox,
  textArea,
  typeSection,
} from "../../components/commonComponents";
import { showFullImageFunction } from "../../utils/commonMethods";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/selector/authSelector";
import {
  AADHAR_REGEX,
  ACCOUNT_NUMBER_REGEX,
  DL_REGEX,
  IFSC_REGEX,
  NAME_REGEX,
  UPI_REGEX,
  VEHICLE_NUMBER_REGEX,
} from "../../constants/regex";
import { completeProfile } from "../../redux/thunk/authThunk";
import { showSnackbar } from "../../redux/slice/snackbarSlice";

const EditProfile = () => {
  const [imageloading, setImageLoading] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [currentImageSetter, setCurrentImageSetter] = useState(null);
  const [currentImageLabel, setCurrentImageLabel] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  //  these are payload

  // const [address, setAddress] = useState(null);
  // const [coordinate, setCoordinate] = useState(null);//optional
  const [accountHolderName, setAccountHolderName] = useState(null); //
  const [avatarURI, setAvatarURI] = useState(null);
  const [aadhaarImageURI, setAadhaarImageURI] = useState(null);
  const [DLImageURI, setDLImageURI] = useState(null);
  const [DLnumber, setDLNumber] = useState(null);
  const [accountNumber, setAccountNumber] = useState(null);
  const [IfscCode, setIfscCode] = useState(null);
  const [upi, setUpi] = useState(null);
  const [userName, setUserName] = useState(null);
  const [bankName, setBankName] = useState(null);
  const [vehicleType, setVehicleType] = useState(null);
  const [aadhaarNumber, setAadhaarNumber] = useState(null);
  const [Vehiclenumber, setVehicleNumber] = useState(null);
  const [RCimageURI, setRCImageURI] = useState(null);
  const [vehicleImageURI, setVehicleImageURI] = useState(null);

  // console.log("this is user id",user.driverId);
  // {
  //   "userId": 0,
  //   "vehicleNumber": "string",---
  //   "drivingLicenceNo": "string",---
  //   "vehicleName": "string",---
  //   "vehicleType": "string",---
  //   "rcNumber": "string",---
  //   "accountHolderName": "string",---
  //   "driverBankName": "string",
  //   "driverAccountNo": "string",---
  //   "driverIfsc": "string",---
  //   "driverUpiId": "string",---
  //   "aadharNumber": "string"---
  // }

  const validateForm = () => {
    if (
      !aadhaarImageURI ||
      !DLImageURI ||
      !DLnumber ||
      !userName ||
      !bankName ||
      !vehicleType ||
      !aadhaarNumber ||
      !Vehiclenumber ||
      !RCimageURI ||
      !vehicleImageURI
    ) {
      return "Please fill all the required data";
    }

    if (
      !accountHolderName ||
      !accountNumber ||
      !IfscCode ||
      !upi ||
      !bankName
    ) {
      return "You have Missed Any Bank Account Data";
    }

    // Field-specific validations
    if (!NAME_REGEX.test(accountHolderName)) {
      return "Please enter a valid Account Holder Name";
    }

    if (!AADHAR_REGEX.test(aadhaarNumber)) {
      return "Please enter a valid Aadhaar Number";
    }

    if (!VEHICLE_NUMBER_REGEX.test(Vehiclenumber)) {
      return "Please enter a valid Vehicle Number";
    }

    if (!DL_REGEX.test(DLnumber)) {
      return "Please enter a valid Driving License Number";
    }

    // if (!ACCOUNT_NUMBER_REGEX.test(accountNumber)) {
    //   return "Please enter a valid Account Number";
    // }

    // if (!IFSC_REGEX.test(IfscCode)) {
    //   return "Please enter a valid IFSC Code";
    // }

    if (!UPI_REGEX.test(upi)) {
      return "Please enter a valid UPI ID";
    }

    return null;
  };

  const handleSubmit = async () => {
    const data = {
      driverId: user.driverId,
      vehicleNumber: Vehiclenumber,
      drivingLicenceNo: DLnumber,
      vehicleName: userName,
      vehicleType: vehicleType,
      rcNumber: RCimageURI,
      accountHolderName: accountHolderName,
      driverBankName: bankName,
      driverAccountNo: accountNumber,
      driverIfsc: IfscCode,
      driverUpiId: upi,
      aadharNumber: aadhaarNumber,
      avatar: avatarURI,
      aadhaarImage: aadhaarImageURI,
      drivingLicenceImage: DLImageURI,
      vehicleImage: vehicleImageURI,
    };

    const error = validateForm();
    if (error) {
      dispatch(
        showSnackbar({
          message: error,
          type: "error",
          time: 3000,
        })
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await dispatch(completeProfile(data));
      if (completeProfile.fulfilled.match(response)) {
        dispatch(
          showSnackbar({
            message: response?.payload?.message,
            type: "success",
            time: 3000,
          })
        );
        // Optionally navigate or reset form here
      } else {
        dispatch(
          showSnackbar({
            message: response?.payload?.message,
            type: "error",
            time: 3000,
          })
        );
      }
    } catch (err) {
      dispatch(
        showSnackbar({
          message: error,
          type: "error",
          time: 3000,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <MyStatusBar />
      {commonAppBar("Complete Detail", navigation)}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarSection}>
          {commonLabel("Upload Your Photo", true)}
          <Text style={styles.photoDescription}>
            It will Appear As Your Profile Page.
          </Text>
          <View style={styles.imageContainer}>
            {renderImageBox(
              "avatar",
              setAvatarURI,
              avatarURI,
              showFullImageFunction,
              setCurrentImageSetter,
              setCurrentImageLabel,
              setBottomSheetVisible,
              imageloading,
              setSelectedImage,
              setModalVisible
            )}
          </View>
        </View>
        {inputBox?.(
          userName,
          setUserName,
          "Enter Your Full Name",
          "Full Name",
          false
        )}
       
      
        {/* {textArea?.(
          address,
          setAddress,
          "Home/Street/Locality, City, State, Pincode",
          "Address",
          false
        )} */}

     
        <TouchableOpacity
          style={{ ...commonStyles.button, marginBottom: 50 }}
          onPress={handleSubmit}
        >
          <Text style={{ ...commonStyles.buttonText }}>Submit</Text>
        </TouchableOpacity>
        {fullImageContainer(modalVisible, setModalVisible, selectedImage)}
        <ImageBottomSheet
          currentImageSetter={currentImageSetter}
          currentImageLabel={currentImageLabel}
          isBottomSheetVisible={isBottomSheetVisible}
          setBottomSheetVisible={setBottomSheetVisible}
          setImageLoading={setImageLoading}
          user={user}
          dispatch={dispatch}
        />
      </ScrollView>
      {circularLoader(isLoading)}
    </View>
  );

};

export default EditProfile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    padding: 20,
  },

  backButton: {
    marginLeft: 10,
    marginRight: 15,
  },

  photoDescription: {
    fontSize: 10,
    color: "#666",
    // marginBottom: 12,
  },
  imageContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    gap: 20,
    marginTop: 20,
    flexWrap: "wrap",
  },
});
