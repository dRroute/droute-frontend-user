import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";

import { Colors, commonStyles } from "../../constants/styles";
import { commonAppBar } from "../../components/commonComponents";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MyStatusBar from "../../components/myStatusBar";
import {
  JourneyCardSkeleton,
  JourneyCard,
} from "../../components/userSideJourneyCard";
import { useSelector } from "react-redux";
import { selectAuthloader } from "../../redux/selector/authSelector";

const SearchJourneyByName = ({ navigation, route }) => {
  const { journeys,refresher,setRefresher } = route?.params;
  const isLoading =useSelector(selectAuthloader);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const filteredJourneys = searchText
    ? journeys?.filter((item) => {
        const text = searchText.toLowerCase();
        return (
          item?.driver?.fullName?.toLowerCase().includes(text) ||
          item?.journey?.journeySource?.address?.toLowerCase().includes(text) ||
          item?.journey?.journeyDestination?.address
            ?.toLowerCase()
            .includes(text)
        );
      })
    : journeys;

  const handleCardClick = (item) => {
    navigation.navigate("VehicleDetail",{item});
  };
  const handleRefresh = async () => {
    setRefresher(!refresher)
  };


  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
      {/* {commonAppBar("Search Journey", navigation)} */}

      <View style={styles.searchBox}>
        <MaterialIcons name="search" color={Colors.grayColor} size={20} />
        <TextInput
          placeholder="Search Driver or City or Address"
          placeholderTextColor={Colors.grayColor}
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      {isLoading ? (
        <View style={{ paddingTop: 60, marginHorizontal: 10 }}>
          <JourneyCardSkeleton count={5} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#9Bd35A", "#101942"]}
              tintColor="#101942"
            />
          }
        >
          {filteredJourneys.length > 0 ? (
            filteredJourneys.map((item) => (
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
                name="map-search-outline"
                size={60}
                color={Colors.grayColor}
              />
              <Text style={styles.emptyText}>No journeys found</Text>
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    // ...commonStyles.shadow,
    borderRadius: 8,
    borderColor: Colors.grayColor,
    borderWidth: 0.5,
    marginHorizontal: 16,
    marginTop: 20,

    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: Colors.lightBlackColor,
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

export default SearchJourneyByName;
