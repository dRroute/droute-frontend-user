import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
   RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import { Colors, commonStyles } from "../../constants/styles";
import { commonAppBar } from "../../components/commonComponents";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MyStatusBar from "../../components/myStatusBar";
import {
  JourneyCardSkeleton,
  JourneyCard,
} from "../../components/userSideJourneyCard";
import { useSelector } from "react-redux";
import {
  selectAuthloader,
  selectOrders,
} from "../../redux/selector/authSelector";

const PendingRequests = ({ navigation }) => {
  const isLoading = useSelector(selectAuthloader);
  const couriers = useSelector(selectOrders);
 const [refreshing, setRefreshing] = useState(false);
  
//  console.log("this is couriers ,in pending Screen upperr ",couriers);
  const JOURNEYS = couriers.filter(item => item.order?.payment === null || item.order?.payment !== 'COMPLETED');
 console.log("this is couriers ,in pending Screen ",JOURNEYS);

  const handleCardClick = (item) => {
    navigation.navigate("RequestDetailScreen", { requestDetail: item });
  };
  const handleRefresh = async () => {};

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
      {commonAppBar("Requested Vehicles", navigation)}

      {isLoading ? (
        <JourneyCardSkeleton count={5} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}
         refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#9Bd35A", "#101942"]}
              tintColor="#101942"
            />
          }>
          {JOURNEYS.length > 0 ? (
            JOURNEYS.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.8}
                onPress={() => handleCardClick(item)}
              >
                <JourneyCard data={item.journeyDetails} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon
                name="map-search-outline"
                size={60}
                color={Colors.grayColor}
              />
              <Text style={styles.emptyText}>Journey Not found</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },
  scrollContainer: {
    paddingBottom: 60,
    paddingHorizontal: 16,
    paddingTop: 60,
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
});

export default PendingRequests;
