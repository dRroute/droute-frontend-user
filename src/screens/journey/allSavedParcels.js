import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { commonAppBar } from "../../components/commonComponents";
import { TicketLoaderCard } from "../../components/ticketCard";
import { Colors } from "../../constants/styles";
import { selectAuthloader, selectCouriers, selectUser } from "../../redux/selector/authSelector";
import { showSnackbar } from "../../redux/slice/snackbarSlice";
import { getAllCourierByUserId } from "../../redux/thunk/courierThunk";
import { getDimensionUnitAbbreviation, getWeightUnitAbbreviation } from "../../utils/commonMethods";

const AllSavedParcels = ({ navigation }) => {
  const isLoading = useSelector(selectAuthloader);
  const user = useSelector(selectUser);
  const rawCouriers = useSelector(selectCouriers);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false); // for pull-to-refresh

  const couriers = Array.isArray(rawCouriers)
    ? rawCouriers.filter((item) => item?.status === 'SAVED')
    : [];
  console.log('saved couriers = ', couriers);

  useEffect(() => {
    const fetchSavedCourier = async () => {
      if (rawCouriers.length === 0) {
        const response = await dispatch(getAllCourierByUserId(user?.userId));
        if (!getAllCourierByUserId.fulfilled.match(response)) {
          await dispatch(
            showSnackbar({
              message:
                response?.payload?.message ||
                'Something went wrong. Please try again later.',
              type: 'error',
              time: 3000,
            })
          );
        }
      }
    };
    fetchSavedCourier();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    const response = await dispatch(getAllCourierByUserId(user?.userId));
    if (getAllCourierByUserId.fulfilled.match(response)) {
      await dispatch(
        showSnackbar({
          message: 'Saved couriers refreshed successfully.',
          type: 'success',
          time: 2000,
        })
      );
    } else {
      await dispatch(
        showSnackbar({
          message:
            response?.payload?.message ||
            'Failed to refresh. Please try again later.',
          type: 'error',
          time: 3000,
        })
      );
    }
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('AllSearchedJourneyList', {
          courierId: item?.courierId,
        })
      }
      style={styles.card}
    >
      <View style={styles.row}>
        <Text style={styles.label}>From:</Text>
        <Text style={styles.value}>{item?.courierSourceAddress}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>To:</Text>
        <Text style={styles.value}>{item?.courierDestinationAddress}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Weight:</Text>
        <Text style={styles.value}>
          {item?.courierWeight}{' '}
          {getWeightUnitAbbreviation(item?.courierWeightUnit)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Dimensions:</Text>
        <Text style={styles.value}>
          ({item?.courierLength}×{item?.courierWidth}×{item?.courierHeight}){' '}
          {getDimensionUnitAbbreviation(item?.courierDimensionUnit)}³
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {commonAppBar(`Saved Parcels: ${couriers?.length}`, navigation)}
      {isLoading ? (
        <TicketLoaderCard count={5} />
      ) : (
        <FlatList
          data={couriers}
          keyExtractor={(item) => item?.courierId?.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome
                name="cube"
                size={60}
                color={Colors.extraLightGrayColor}
              />
              <Text style={styles.emptyText}>Saved Parcels Not Found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bodyBackColor,
    padding: 10,
  },
  card: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: Colors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.grayColor,
    width: 90,
  },
  value: {
    fontSize: 12,
    color: Colors.lightBlackColor,
    flex: 1,
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

export default AllSavedParcels;
