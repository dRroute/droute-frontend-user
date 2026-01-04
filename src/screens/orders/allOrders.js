
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Touchable,
  TouchableOpacity,
} from "react-native";
import {
  FontAwesome,
} from "@expo/vector-icons";
import { Colors } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import { commonAppBar } from "../../components/commonComponents";
import { ParcelCard, ParcelLoadingCard } from "../../components/parcelCard";
import { useSelector } from "react-redux";
import { selectAcceptedOrders, selectOrders } from "../../redux/selector/authSelector";

const PACKAGES = [
{
  id: "PCL2025",
  image: "https://thumbs.dreamstime.com/b/delivery-man-blue-uniform-handing-parcel-box-to-recipient-courier-service-concept-84275323.jpg?w=768", 
  phone: "9876543210",
  pickup: {
    address: "101 Alpha Street nksn njsnn njnsj bbdj jdjne jndjn nnd jnjsj",
  },
  delivery: {
    address: "202 Beta Avenue nsnj njsnjn njsnj jbsjb jbsjb bjs njsnjns njsnj",
  },
  status:"Cancelled"
},
{
  id: "PCL202s5",
  image: "https://thumbs.dreamstime.com/b/delivery-man-blue-uniform-handing-parcel-box-to-recipient-courier-service-concept-84275323.jpg?w=768", 
  phone: "9876543210",
  pickup: {
    address: "101 Alpha Street nksn njsnn njnsj bbdj jdjne jndjn nnd jnjsj",
  },
  delivery: {
    address: "202 Beta Avenue nsnj njsnjn njsnj jbsjb jbsjb bjs njsnjns njsnj",
  },
  status:"Delivered"
},
{
  id: "PCL20255",
  image: null, 
  phone: "9876543210",
  pickup: {
    address: "101 Alpha Street nksn njsnn njnsj bbdj jdjne jndjn nnd jnjsj",
  },
  delivery: {
    address: "202 Beta Avenue nsnj njsnjn njsnj jbsjb jbsjb bjs njsnjns njsnj",
  },
  status:"Ongoing"
}
];

const AllOrders = ({ navigation }) => {

  const [isLoading,setIsLoading]=useState(false);
  const allOrders = useSelector(selectOrders);

  console.log('all orders = ' , allOrders);
  const orders = allOrders.filter(
  (data) => data?.order?.orderStatus === "ACCEPTED" && data?.order?.payment?.status === 'COMPLETED'
);
  console.log('accepted orders = ' , orders);

  const renderPackageCard = ({ item }) =>
(
  <TouchableOpacity activeOpacity={0.8} onPress={()=>navigation.navigate("OrderDetailScreen", {item})} > 
  <ParcelCard  parcelItem={item} />
  </TouchableOpacity>
);

   return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
      {commonAppBar("All Orders", navigation)}
      {isLoading?(<ParcelLoadingCard count={3} />):(
      <FlatList
        data={orders}
        renderItem={renderPackageCard}
        keyExtractor={(item) => item?.order?.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome
              name="cube"
              size={60}
              color={Colors.extraLightGrayColor}
            />
            <Text style={styles.emptyText}>No Orders found</Text>
          </View>
        }
      />)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
  },

  listContainer: {
    padding: 5,
     flexGrow:1,
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

export default AllOrders;
