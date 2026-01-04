// components/rating.js
import { View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Colors } from "../../constants/styles";

const Rating = ({ rating }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((num) => (
        <MaterialIcons
          key={num}
          name="star"
          size={18.0}
          color={rating >= num ? Colors.yellowColor : Colors.grayColor}
        />
      ))}
    </View>
  );
};

export default Rating;
