// ViewAllUserPage.js
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  Colors,
  screenWidth,
  commonStyles,
  Sizes,
  Fonts,
} from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { commonAppBar } from "../../components/commonComponents";
import { SupportTicket, TicketLoaderCard } from "../../components/ticketCard";

const allIssues=[
{
    id: "1",
    title: "App not loading",
    description: "This is decsription...",
    status: "Open",
    created_at: "2024-08-25 10:30 AM",
    user: {
      avatar: null,
      owner_legal_name: "Rohit Sharma",
      mobile_number: "9876543210",
      role: "user",
    },
  },
  {
    id: "2",
    title: "App not loading",
    status: "Open",
    description: "This is decsription...",
    created_at: "2024-08-25 10:30 AM",
    user: {
      avatar: null,
      owner_legal_name: "Rohit Sharma",
      mobile_number: "9876543210",
      role: "user",
    },
  },

]



const AllSupportTickets = ({ navigation }) => {

  const [isLoading, setIsLoading] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <MyStatusBar />
      {commonAppBar("Support Tickets",navigation)}
     
       {isLoading ? (
        <TicketLoaderCard count={5} />
      ):( <FlatList
        data={allIssues}
        renderItem={({ item }) => <SupportTicket issue={item} />}
        keyExtractor={(item) => item?.id?.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="confirmation-number" size={60} color={Colors.extraLightGrayColor} />
            <Text style={styles.emptyText}>No Issues found</Text>
            
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
    paddingHorizontal: Sizes.fixPadding * 0.5,
  },

  listContainer: {
    paddingBottom: 16,
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

export default AllSupportTickets;
