import { Feather } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/styles";
import { trimText } from "../utils/commonMethods";

export const ParcelCard = ({ parcelItem }) => {
  const handleCall = () => {
    Linking.openURL(`tel:${parcelItem?.journeyDetails?.driver?.contactNo?.replace(/\s/g, "")}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          {parcelItem.image ? (
            <Image
              source={{ uri: parcelItem?.order?.courierImageUrl1 }}
              style={styles.parcelImage}
            />
          ) : (
            <View
              style={[
                styles.parcelImage,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#f0f0f0",
                },
              ]}
            >
              <Feather name="image" size={30} color="#999" />
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.parcelId}>#PCL0{parcelItem?.order?.id}</Text>

          <View style={styles.routeContainer}>
            <View style={styles.timeline}>
              <View style={styles.timelineCircleFilled} />
              <View style={styles.timelineLine} />
              <View style={styles.timelineCircleEmpty} />
            </View>

            <View style={styles.addressesContainer}>
              <Text style={styles.addressText}>
                {trimText(parcelItem?.courier?.courierSourceAddress, 50)}
              </Text>
              <View style={{ height: 15 }} />
              <Text style={styles.addressText}>
                 {trimText(parcelItem?.courier?.courierDestinationAddress, 50)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Feather
            name="phone"
            size={16}
            color={Colors.whiteColor}
            style={styles.phoneIcon}
          />
          <Text style={styles.callButtonText}>{parcelItem?.journeyDetails?.driver?.contactNo}</Text>
        </TouchableOpacity>

        <View>
          <Text style={[styles.statusText, { color: "teal" }]}>{parcelItem?.courier?.status}</Text>
        </View>
      </View>
    </View>
  );
};

export const ParcelLoadingCard = ({ count = 1 }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  const loadingCards = [];

  for (let i = 0; i < count; i++) {
    loadingCards.push(
      <View key={i} style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Animated.View
              style={[styles.parcelImageLoading, styles.skeleton, { opacity }]}
            />
          </View>

          <View style={styles.infoContainer}>
            <Animated.View
              style={[
                styles.skeleton,
                {
                  height: 10,
                  alignSelf: "flex-end",
                  width: 50,
                  marginBottom: 8,
                  opacity,
                },
              ]}
            />

            <View style={styles.routeContainer}>
              <View style={styles.addressesContainer}>
                <Animated.View
                  style={[
                    styles.skeleton,
                    { height: 10, marginBottom: 10, width: "90%", opacity },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.skeleton,
                    { height: 10, width: "80%", opacity },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Animated.View
            style={[
              styles.callButton,
              styles.skeleton,
              { width: 100, height: 24, opacity },
            ]}
          />
          <Animated.View
            style={[styles.skeleton, { width: 60, height: 14, opacity }]}
          />
        </View>
      </View>
    );
  }

  return <>{loadingCards}</>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    marginBottom: 4,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: "row",
    marginBottom: 16,
  },
  imageContainer: {
    width: "40%",
    marginRight: 16,
  },
  parcelImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.grayColor,
  },
  parcelImageLoading: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
  },
  parcelId: {
    fontSize: 10,
    fontWeight: "bold",
    color: Colors.orangeColor,
    textAlign: "right",
  },
  routeContainer: {
    flexDirection: "row",
  },
  timeline: {
    width: 20,
    alignItems: "center",
    marginRight: 8,
  },
  timelineCircleFilled: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primaryColor,
  },
  timelineLine: {
    width: 1,
    height: 25,
    backgroundColor: Colors.primaryColor,
    marginVertical: 4,
    borderStyle: "dotted",
    borderWidth: 1,
  },
  timelineCircleEmpty: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    backgroundColor: Colors.whiteColor,
  },
  addressesContainer: {
    flex: 1,
  },
  addressText: {
    fontSize: 10,
    color: Colors.blackColor,
    lineHeight: 15,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  callButton: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  phoneIcon: {
    marginRight: 6,
  },
  callButtonText: {
    color: Colors.whiteColor,
    fontWeight: "bold",
    fontSize: 12,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  skeleton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
  },
});
