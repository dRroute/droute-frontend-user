// PaymentGatewayScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Dimensions,
  Image,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { Colors } from "../../constants/styles";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/selector/authSelector";
import { showSnackbar } from "../../redux/slice/snackbarSlice";
import { updateOrderDetails } from "../../redux/thunk/orderThunk";

// Define colors at the top for easy customization
const COLORS = {
  secondary: "#4CAF50",
  danger: "#FF5252",
  background: "#F8F9FA",
  white: "#FFFFFF",
  black: "#333333",
  gray: "#757575",
  lightGray: "#E0E0E0",
  cardBg: "#FFFFFF",
  shadow: "rgba(0, 0, 0, 0.1)",
  success: "#4CAF50",
  failure: "#FF5252",
  warning: "#FF9800",
};

const { width, height } = Dimensions.get("window");

const PaymentGatewayScreen = ({ navigation, route }) => {
  const { data } = route?.params;
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' or 'failure'
  const [isProcessing, setIsProcessing] = useState(false);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  console.log("data at payment screen=>", data);
  // Payment data
  const paymentData = {
    amount: data?.offeredFare,
    orderId: data?.orderId,
    customerEmail: user?.email,
  }
  const paymentRequestDto = {
    orderId: data?.orderId,
    amount: data?.offeredFare,
    paymentMethod: "card",
    transactionId: Date.now(),
    status: "COMPLETED"
  };

  const handlePayment = async (status) => {
    setIsProcessing(true);
    const paymentDataToSend = {
      ...data,
      paymentRequestDto
    }
    console.log("paymentDataToSend at payment screen=>", paymentDataToSend);
    try {

      const response = await dispatch(updateOrderDetails(paymentDataToSend));

      if (updateOrderDetails.fulfilled.match(response)) {
        // Call API here if payment is successful
        await setTimeout(() => {
          setIsProcessing(false);
          setPaymentStatus("success");
          setShowModal(true);
        }, 2000);

        

      }


      else {
        // If status is not "success", treat it as failure
        await setTimeout(() => {
          setIsProcessing(false);
          setPaymentStatus("failure");
          setShowModal(true);
        }, 2000);
      }
    } catch (error) {
      dispatch(
        showSnackbar({
          message: error?.message || "Something went wrong",
          type: "error",
          time: 3000,
        })
      );
      setTimeout(() => {
        setIsProcessing(false);
        setPaymentStatus("failure");
        setShowModal(true);
      }, 2000);
    } finally {
      setIsProcessing(false);
      setShowModal(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPaymentStatus(null);
    navigation.pop(4);
  };

  const PaymentModal = () => (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="fade"
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {paymentStatus === "success" ? (
            <>
              <LottieView
                source={require("../../components/lottieLoader/success.json")}
                autoPlay
                loop={false}
                style={styles.lottieAnimation}
              />
              <Text style={styles.modalTitle}>Payment Successful!</Text>
              <Text style={styles.modalSubtitle}>
                Your payment of {paymentData.amount} has been processed
                successfully.
              </Text>
              <Text style={styles.transactionId}>
                Transaction ID: TXN{Date.now()}
              </Text>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: COLORS.success },
                ]}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>Continue</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <LottieView
                source={require("../../components/lottieLoader/failure.json")}
                autoPlay
                loop={true}
                style={styles.lottieAnimation}
              />
              <Text style={[styles.modalTitle, { color: COLORS.failure }]}>
                Payment Failed!
              </Text>
              <Text style={styles.modalSubtitle}>
                We couldn't process your payment. Please try again or use a
                different payment method.
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    {
                      backgroundColor: COLORS.failure,
                      flex: 1,
                      marginRight: 8,
                    },
                  ]}
                  onPress={closeModal}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    {
                      backgroundColor: Colors.primaryColor,
                      flex: 1,
                      marginLeft: 8,
                    },
                  ]}
                  onPress={() => {
                    closeModal();
                    // Retry payment logic here
                  }}
                >
                  <Text style={styles.modalButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  const ProcessingModal = () => (
    <Modal visible={isProcessing} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.processingModal}>
          <View style={styles.processingSpinner}>
            <MaterialIcons name="sync" size={40} color={Colors.primaryColor} />
          </View>
          <Text style={styles.processingText}>Processing Payment...</Text>
          <Text style={styles.processingSubtext}>
            Please wait while we process your payment
          </Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Gateway</Text>
        <TouchableOpacity style={styles.helpButton}>
          <MaterialIcons name="help-outline" size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      {/* Merchant Info */}
      <View style={styles.merchantCard}>
        <View style={styles.merchantHeader}>
          <View style={styles.merchantLogo}>
            <Image
              source={require("../../../assets/icon.png")}
              style={styles.icon}
            />
          </View>
          <View style={styles.merchantInfo}>
            <Text style={styles.merchantName}>dRoute</Text>
            <Text style={styles.merchantDescription}>
              We provide a Secure Transaction
            </Text>
          </View>
          <View style={styles.secureIcon}>
            <MaterialIcons name="security" size={20} color={COLORS.success} />
          </View>
        </View>
      </View>

      {/* Payment Details */}
      <View style={styles.paymentCard}>
        <Text style={styles.sectionTitle}>Payment Details</Text>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>{paymentData.amount}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order ID:</Text>
          <Text style={styles.detailValue}>{paymentData.orderId}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Customer Email:</Text>
          <Text style={styles.detailValue}>{paymentData.customerEmail}</Text>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.paymentMethodsCard}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>

        <View style={styles.paymentMethodsList}>
          <View style={styles.paymentMethod}>
            <FontAwesome5
              name="credit-card"
              size={20}
              color={Colors.primaryColor}
            />
            <Text style={styles.paymentMethodText}>Credit/Debit Card</Text>
            <MaterialIcons
              name="radio-button-checked"
              size={20}
              color={Colors.primaryColor}
            />
          </View>

          {/* <View style={[styles.paymentMethod, styles.paymentMethodDisabled]}>
            <FontAwesome5 name="university" size={20} color={COLORS.gray} />
            <Text style={[styles.paymentMethodText, { color: COLORS.gray }]}>Net Banking</Text>
            <MaterialIcons name="radio-button-unchecked" size={20} color={COLORS.gray} />
          </View>
          
          <View style={[styles.paymentMethod, styles.paymentMethodDisabled]}>
            <FontAwesome5 name="wallet" size={20} color={COLORS.gray} />
            <Text style={[styles.paymentMethodText, { color: COLORS.gray }]}>Digital Wallet</Text>
            <MaterialIcons name="radio-button-unchecked" size={20} color={COLORS.gray} />
          </View> */}
        </View>
      </View>

      {/* Security Info */}
      <View style={styles.securityInfo}>
        <MaterialIcons name="lock" size={16} color={COLORS.success} />
        <Text style={styles.securityText}>
          Your payment information is encrypted and secure
        </Text>
      </View>

      {/* Test Buttons */}
      <View style={styles.testButtonsContainer}>
        <Text style={styles.testTitle}>Test Payment (Demo)</Text>
        <View style={styles.testButtons}>
          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: COLORS.success }]}
            onPress={() => handlePayment("success")}
            disabled={isProcessing}
          >
            <MaterialIcons name="check-circle" size={20} color={COLORS.white} />
            <Text style={styles.testButtonText}>Pay Success</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.testButton, { backgroundColor: COLORS.failure }]}
            onPress={() => handlePayment("failure")}
            disabled={isProcessing}
          >
            <MaterialIcons name="error" size={20} color={COLORS.white} />
            <Text style={styles.testButtonText}>Pay Failure</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pay Now Button */}
      <View style={styles.payButtonContainer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => handlePayment("success")}
          disabled={isProcessing}
        >
          <Text style={styles.payButtonText}>Pay {paymentData.amount}</Text>
          <MaterialIcons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <PaymentModal />
      <ProcessingModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  icon: {
    height: 50,
    width: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primaryColor,
    resizeMode: "contain",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  helpButton: {
    padding: 8,
  },
  merchantCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  merchantHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  merchantLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${Colors.primaryColor}20`,
    justifyContent: "center",
    alignItems: "center",
  },
  merchantInfo: {
    flex: 1,
    marginLeft: 12,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
  },
  merchantDescription: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  secureIcon: {
    padding: 4,
  },
  paymentCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 16,
    color: COLORS.gray,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primaryColor,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: "500",
  },
  paymentMethodsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentMethodsList: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    backgroundColor: `${Colors.primaryColor}10`,
  },
  paymentMethodDisabled: {
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.background,
  },
  paymentMethodText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.black,
  },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 8,
  },
  securityText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 6,
  },
  testButtonsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.warning,
    borderStyle: "dashed",
  },
  testTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.warning,
    textAlign: "center",
    marginBottom: 12,
  },
  testButtons: {
    flexDirection: "row",
    gap: 12,
  },
  testButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  testButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  payButtonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  payButton: {
    backgroundColor: Colors.primaryColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: width * 0.85,
    maxWidth: 350,
  },
  lottieAnimation: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.success,
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  transactionId: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 100,
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  processingModal: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: width * 0.75,
    maxWidth: 300,
  },
  processingSpinner: {
    marginBottom: 16,
  },
  processingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 8,
  },
  processingSubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
  },
});

export default PaymentGatewayScreen;
