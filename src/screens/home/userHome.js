// DriverDashboard.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Animated,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { RefreshControl } from "react-native";
import {
  Colors,
  commonStyles,
  Fonts,
  screenWidth,
  Sizes,
} from "../../constants/styles";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";

import Icon from "react-native-vector-icons/MaterialIcons";
import { fetchAddressComponent, getUserLocation, trimText } from "../../utils/commonMethods";
import {
  JourneyCard,
  JourneyCardSkeleton,
} from "../../components/userSideJourneyCard";
import { getUserAllOrders } from "../../redux/thunk/orderThunk";
import { showSnackbar } from "../../redux/slice/snackbarSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/selector/authSelector";
import { getAllJourney } from "../../redux/thunk/journeyThunk";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";


const JOURNEYS = [

];

const UserHome = ({ navigation }) => {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [state, setState] = useState(null);
  const [region, setRegion] = useState({});
  const [journeys, setJourneys] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMessage, setErrorMsg] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const handleRefresh = () => {
    console.log("handleRefresh called");
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleCardClick = (item) => {
    navigation.navigate("VehicleDetail",{item});
  };
useEffect(() => {
    const fetchLocationAndAddress = async () => {
      try {
        const { latitude, longitude } = await getUserLocation({
          setRegion,
          setCurrentLocation,
          mapRef,
          setErrorMsg,
        });
        if (latitude && longitude) {
          const addressData = await fetchAddressComponent(latitude, longitude);

          if (addressData?.address) {
            setState(addressData?.state);
            // console.log("state at home page =>",state);
          }
        } else {
          console.log("Latitude or longitude not available.");
        }
      } catch (error) {
         console.log(":", error);
      }
    };
    fetchLocationAndAddress();
  }, []);


  useEffect(() => {
    const fetchOrders = async () => {
       try {
        const response = await dispatch(getUserAllOrders(user?.userId));
        // console.log(" All orders at home",response)
        if (getUserAllOrders.fulfilled && getUserAllOrders.fulfilled.match(response)) {
          dispatch(
            showSnackbar({
              message: response?.payload?.message || "Orders loaded successfully",
              type: "success",
              time: 2000,
            })
          );
        } else {
          console.log("orders not found",response?.payload?.message)
        }
      } catch (error) {
        dispatch(
          showSnackbar({
            message: "An error occurred while loading orders",
            type: "error",
            time: 2000,
          })
        );
      }
    };
    fetchOrders();
  }, []);


  useEffect(() => {
    const fetchjourney = async () => {
      try {
        const response = await dispatch(getAllJourney());
        console.log("All journey at home", response?.payload?.data);
        setJourneys(...journeys, response?.payload?.data);
        if (getAllJourney.fulfilled.match(response)) {
          await dispatch(
            showSnackbar({
              message: response?.payload?.message || "journey loaded successfully",
              type: "success",
              time: 2000,
            })
          );
        } else {
          await dispatch(
            showSnackbar({
              message: response?.payload?.message || "Failed to load journeys",
              type: "error",
              time: 2000,
            })
          );
        }
      } catch (error) {
        await dispatch(
          showSnackbar({
            message: "An error occurred while loading journeys",
            type: "error",
            time: 2000,
          })
        );
      }
    };
    fetchjourney();
  }, []);




  const scrollY = useRef(new Animated.Value(0)).current;
  const animatedTopContainerStyle = {
    borderBottomLeftRadius: scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [100, 30],
      extrapolate: "clamp",
    }),
  };
  const animatedBottomContainerStyle = {
    borderTopRightRadius: scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [100, 30],
      extrapolate: "clamp",
    }),
  };

  const featuresList = [
    {
      title: "Your Orders",
      image: require("../../../assets/images/box.jpg"),
      onPress: () => navigation.navigate("AllOrders"),
    },

    {
      title: "Requested Journey",
      image: require("../../../assets/images/miniTruck.png"),
      onPress: () => navigation.navigate("PendingRequests"),
    },
  ];

  const FeatureRow = () => {
    return (
      // <View style={{paddingRight:20,}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {featuresList.map((feature, index) => (
          <TouchableOpacity
            key={index}
            onPress={feature.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.featureContainer}>
              <Image source={feature.image} style={styles.icon} />
              <Text style={styles.label}>{feature.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      //  </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperBg}>
        <Animated.View style={[styles.upper, animatedTopContainerStyle]}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}></Text>
            <TouchableOpacity>
              {/* <Icon name="notifications" size={24} color={Colors.whiteColor} /> */}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("SearchJourneyByName", { journeys })}
            activeOpacity={0.8}
            style={styles.searchBox}
          >
            <MaterialIcons name="search" color={Colors.grayColor} size={24} />
            <Text
              numberOfLines={1}
              style={{
                ...Fonts.grayColor18Medium,
                flex: 1,
                marginLeft: Sizes.fixPadding,
              }}
            >
              Search Driver or Vehicle
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View style={styles.lowerBg}>
        <Animated.View style={[styles.lower, animatedBottomContainerStyle]}>
          <Animated.ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#9Bd35A", "#101942"]}
                tintColor="#101942"
              />
            }
            style={styles.content}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            {FeatureRow()}
            <View
              style={{
                marginBottom: 60,
                marginTop: 20,
                ...commonStyles.rowSpaceBetween,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "700" }}>
                Nearest Ongoing Vehicles:{" "}
              </Text>
              {/* <TouchableOpacity
                onPress={() => navigation.navigate("AllNearestJourney")}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: Colors.primaryColor,
                  }}
                >
                  See All
                </Text>
              </TouchableOpacity> */}
            </View>
            {isLoading ? (
              <View style={{ paddingTop: 60, marginHorizontal: 10 }}>
                <JourneyCardSkeleton count={5} />
              </View>
            ) : (
              <View>
                {journeys?.length > 0 ? (
                  journeys.map((item) => (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      key={item?.journey?.journeyId}
                      onPress={() => handleCardClick(item)}
                    >
                      <JourneyCard data={item} />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.emptyContainer}>
                    <Icon
                      name="location-on"
                      size={60}
                      color={Colors.grayColor}
                    />
                    <Text style={styles.emptyText}>Journey Not found</Text>
                  </View>
                )}
              </View>
            )}
            {isLoading && (
              <>
                {JourneyCardSkeleton(1)}
                {JourneyCardSkeleton(1)}
                {JourneyCardSkeleton(1)}
              </>
            )}
          </Animated.ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  upperBg: {
    height: 200,
    backgroundColor: Colors.whiteColor,
  },
  upper: {
    height: 200,
    backgroundColor: Colors.primaryColor,
    borderBottomLeftRadius: 100,
  },
  //#101942
  lowerBg: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
  },
  lower: {
    flex: 1,
    borderTopRightRadius: 100,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding - 3.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 25,
    marginTop: 35,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.whiteColor,
  },

  featureContainer: {
    alignItems: "center",
    marginRight: 10,
  },
  icon: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.primaryColor,
    resizeMode: "contain",
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "700",
    textAlign: "center",
    maxWidth: 60,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.grayColor,
    marginTop: 12,
  },
  //journeis card design
});

export default UserHome;
