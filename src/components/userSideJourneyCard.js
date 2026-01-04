import React, { useRef, useEffect } from "react";
import { View, Text, Image, StyleSheet, Animated } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Colors, commonStyles } from "../constants/styles";
import { getDimensionUnitAbbreviation, getWeightUnitAbbreviation, trimText } from "../utils/commonMethods";

// JourneyCard Component
export const JourneyCard = ({ data }) => {

  console.log('data in journey card = ', data);
  const avatar = data?.driver?.documents?.find(
    (doc) => doc.documentName === `${data?.driver?.driverId}_avatar`
  )?.documentUrl;

  const trimText = (text, maxLength) =>
    text?.length > maxLength ? text.substring(0, maxLength) + "..." : text;

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <View key={(Date.now())} style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Icon name="person-off" size={50} color="#e0e0eb" />
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.topSection}>
          <View style={[commonStyles.rowSpaceBetween, styles.rowAlign]}>
            <Text style={styles.driverName}>
              {trimText(data?.driver?.fullName, 20)}
            </Text>
            <Text style={styles.rating}>⭐ {data?.averageDriverRating || 0}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.middleSection}>
          <View style={styles.locationBlock}>
            <Text style={styles.cityText}>
              {trimText(data?.journey?.journeySource?.city, 20)}
            </Text>
            <Text style={styles.timeText}>
              {formatDateTime(data?.journey?.expectedDepartureDateTime)}
            </Text>
            <Text style={styles.addressText}>
              {trimText(data?.journey?.journeySource?.address, 60)}
            </Text>
          </View>
          <View style={styles.locationBlock}>
            <Text style={styles.cityText}>
              {trimText(data?.journey?.journeyDestination?.city, 20)}
            </Text>
            <Text style={styles.timeText}>
              {formatDateTime(data?.journey?.expectedArrivalDateTime)}
            </Text>
            <Text style={styles.addressText}>
              {trimText(data?.journey?.journeyDestination?.address, 100)}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.capacityBlock}>
            <Text style={styles.capacityText}>
              Weight Capacity :{" "}
              {`${data?.journey?.availableWeight} ${getWeightUnitAbbreviation(data?.journey?.availableWeightMeasurementType)}`}
            </Text>
          </View>
          <View style={styles.capacityBlock}>
            <Text style={styles.capacityText}>
              Volume Capacity :{" "}
              {`${data?.journey?.availableLength} x ${data?.journey?.availableWidth} x ${data?.journey?.availableHeight} ${getDimensionUnitAbbreviation(data?.journey?.availableSpaceMeasurementType)}³`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};


// JourneyCardSkeleton Component
export const JourneyCardSkeleton = ({ count = 1 }) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerStyle = {
    opacity: shimmerValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
  };

  const renderBlock = (width, height, style = {}) => (
    <Animated.View
      key={Math.random().toString()}
      style={[
        {
          backgroundColor: Colors.extraLightGrayColor,
          borderRadius: 4,
          width,
          height,
          marginBottom: 6,
        },
        shimmerStyle,
        style,
      ]}
    />
  );

  const renderSkeleton = () => (
    <View style={styles.container} key={Math.random().toString()}>
      <View style={[styles.avatarContainer,{ borderColor: "#dadada",}]}>
        <Animated.View
          style={[
            styles.avatar,
            shimmerStyle,
            { backgroundColor: Colors.extraLightGrayColor },
          ]}
        />
      </View>

      <View style={styles.card}>
        <View style={[styles.topSection,{backgroundColor: Colors.whiteColor}]}>
          {renderBlock("60%", 10)}
          {renderBlock("30%", 10)}
        </View>

        <View style={[styles.divider,{backgroundColor:"#dadada"}]} />

        <View style={[styles.middleSection,{backgroundColor: Colors.whiteColor}]}>
          <View style={styles.locationBlock}>
            {renderBlock("70%", 10)}
            {renderBlock("60%", 8)}
            {renderBlock("90%", 8)}
          </View>
          <View style={styles.locationBlock}>
            {renderBlock("70%", 10)}
            {renderBlock("60%", 8)}
            {renderBlock("90%", 8)}
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.capacityBlock}>
            {renderBlock("80%", 10)}
          </View>
          <View style={styles.capacityBlock}>
            {renderBlock("80%", 10)}
          </View>
        </View>
      </View>
    </View>
  );

  return <>{Array.from({ length: count }, renderSkeleton)}</>;
};

// Shared Styles
const styles = StyleSheet.create({
  container: {
    // marginHorizontal: 8,
    marginBottom: 60,
    // overflow: 'visible',
  },
  avatarContainer: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: Colors.whiteColor,
    position: "absolute",
    top: -40,
    left: 20,
    zIndex: 2,
    borderWidth: 2,
    borderColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    resizeMode: "cover",
  },
  card: {
    height: 180,
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: Colors.whiteColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  topSection: {
    paddingLeft: 110,
    paddingRight: 20,
    paddingVertical: 6,
    height: 50,
    backgroundColor: Colors.primaryColor,
    justifyContent: "center",
  },
  rowAlign: {
    alignItems: "center",
  },
  driverName: {
    color: Colors.whiteColor,
    fontWeight: "700",
  },
  rating: {
    color: Colors.whiteColor,
  },
  divider: {
    height: 2,
    backgroundColor: Colors.grayColor,
  },
  middleSection: {
    height: 80,
    backgroundColor: Colors.primaryColor,
    flexDirection: "row",
    padding: 6,
  },
  locationBlock: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cityText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: Colors.whiteColor,
  },
  timeText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: Colors.whiteColor,
  },
  addressText: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: "400",
    color: Colors.whiteColor,
  },
  bottomSection: {
    height: 50,
    backgroundColor: Colors.whiteColor,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  capacityBlock: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  capacityText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
  },
});
