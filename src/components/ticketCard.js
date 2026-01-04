import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Colors,
  commonStyles,
  screenWidth,
} from "../constants/styles";
import { trimText } from "../utils/commonMethods";

export function TicketLoaderCard({ count = 1 }) {
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

  const renderPlaceholder = (width = "80%", height = 12, marginBottom = 8) => (
    <Animated.View
      key={Math.random().toString()}
      style={[
        {
          width,
          height,
          backgroundColor: Colors.extraLightGrayColor,
          borderRadius: 4,
          marginBottom,
        },
        shimmerStyle,
      ]}
    />
  );

  const renderSkeletonCard = () => (
    <View style={styles.userItem} key={Math.random().toString()}>
      {renderPlaceholder("40%", 12)}
      {renderPlaceholder("60%", 12)}
      {renderPlaceholder("70%", 12)}
    </View>
  );

  return <>{Array.from({ length: count }, renderSkeletonCard)}</>;
}

export function SupportTicket({ issue, navigation }) {
  return (
    <TouchableOpacity
    activeOpacity={1}
      // onPress={() => navigation.navigate("SupportIssuesDetail", { issue })}
      style={styles.userItem}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.title}>Status: </Text>
        <Text style={[styles.description, { color: "red" }]}>{issue?.status}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.title}>Created at: </Text>
        <Text style={styles.description}>{issue?.created_at}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.title}>Title: </Text>
        <Text style={styles.description}>{trimText(issue?.title,50) }</Text>
      </View>
       <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.title}>Description: </Text>
        <Text style={styles.description}>{trimText(issue?.description,100) }</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  userItem: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 0.1,
    borderTopWidth: 1.0,
    minHeight: 100,
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.blackColor,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: Colors.grayColor,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.extraLightGrayColor,
    marginLeft: 78,
  },
});
