import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Sizes, Fonts, Colors } from "../constants/styles"; 

export const Tracking = (item) => {
  const isPickedUp =false;
  const isDelivered =false;
  return (
    <>
      {/* Pickup */}
      { isPickedUp&& <View style={styles.rowContainer}>
        <View style={styles.iconColumn}>
          <MaterialIcons name="circle" size={20} color="teal" />
          <View style={styles.dottedLine} />
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>{item?.order?.senderLandmarkAddress || item?.courier?.courierDestinationAddress||"NA"}</Text>
           <Text style={styles.subText}>12/08/25 - 4:30 PM</Text>
          <Text style={[styles.subText, { color: "green" }]}>
            PICKUP
          </Text>
        
        </View>
      </View> }

      {/* Stop 1 */}
      {/* <View style={styles.rowContainer}>
        <View style={styles.iconColumn}>
          <MaterialIcons name="location-on" size={20} color="teal" />
          <View style={styles.dottedLine} />
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.label}>456 Marine Drive, Mumbai 456 Marine Drive, Mumbai 456 Marine Drive, Mumbai</Text>
          <Text style={styles.subText}>12/08/25 - 4:30 PM</Text>
        
        </View>
      </View> */}
      
      {/* Final Destination */}
      {isDelivered && <View style={styles.rowContainer}>
        <View style={styles.iconColumn}>
          <MaterialIcons name="location-on" size={20} color="green" />
        </View>
         <View style={styles.infoBlock}>
          <Text style={styles.label}>{item?.order?.recieverLandmarkAddress|| item?.courier?.courierSourceAddress||"NA"}</Text>
          <Text style={styles.subText}>12/08/25 - 5:30 PM</Text>
          <Text style={[styles.subText, { color: "green" }]}>
            DELIVERED
          </Text>
        </View>
      </View>}
    </>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    flex: 1,
  },
  iconColumn: {
    height: 90,
    width: 30,
    alignItems: "center",
  },
  dottedLine: {
    width: 2,
    flex: 1,
    borderStyle: "dotted",
    borderWidth: 1,
    borderColor: "gray",
  },
  infoBlock: {
    flex: 1,
    marginTop: 2,
  },
  label: {
    fontSize:12,
    color:"teal"
  },
  subText: {
    marginVertical: 2,
    ...Fonts.grayColor12Medium,
  },
  separator: {
    backgroundColor: "#e0ebeb",
    width: "100%",
    height: 0.9,
    marginVertical: 20,
  },
});

;
