import { FlatList, Text, View, Image } from "react-native";
import React from "react";
import { Colors, commonStyles, Fonts, Sizes } from "../../constants/styles";
import MyStatusBar from "../../components/myStatusBar";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Rating from "./rating";
import { commonAppBar } from "../../components/commonComponents";


const dummyText =
  "Lorem ipsum dolor sit amet consectetur. Vitae luctusmassa viverra eget pulvinar. Vestibulum ac cras estplatea natoque nec. Sed sed gravida platea viverra vel ac.Eu placerat sit lacus tellus. Faucibus et id a eros volutpatinterdum in tincidunt viverra.";

const reviewsList = [
  {
    id: "1",
    reviewerImage: "https://randomuser.me/api/portraits/men/1.jpg",
    reviewerName: "Andrew Anderson",
    rating: 5.0,
    review: dummyText,
  },
  {
    id: "2",
    reviewerImage: "https://randomuser.me/api/portraits/men/2.jpg",
    reviewerName: "Peter Jones",
    rating: 4.0,
    review: dummyText,
  },
  {
    id: "3",
    reviewerImage: "https://randomuser.me/api/portraits/women/3.jpg",
    reviewerName: "Emily Wood",
    rating: 3.0,
    review: dummyText,
  },
];

const AllReviewScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        {commonAppBar("Reviews", navigation)}
        {reviewsInfo()}
      </View>
    </View>
  );

  function reviewsInfo() {
    const renderItem = ({ item }) => (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: item.reviewerImage }}
            style={{
              width: 40.0,
              height: 40.0,
              borderRadius:20,
            }}
          />

          <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor14SemiBold }}>
              {item.reviewerName}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Rating rating={item.rating} />

            </View>
          </View>
        </View>
        <Text
          style={{ ...Fonts.grayColor12Medium, marginTop: Sizes.fixPadding }}
        >
          {item.review}
        </Text>
      </View>
    );
    return (
      <FlatList
        data={reviewsList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    );
  }


};

export default AllReviewScreen;
