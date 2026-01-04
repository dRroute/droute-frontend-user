import React, { useState, useEffect, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Colors, commonStyles } from "../../constants/styles";
import { Animated, Easing } from "react-native";
import moment from 'moment';

import {
  openCamera,
  openGallery,
  showFullImageFunction,
} from "../../utils/commonMethods";
import { fullImageContainer } from "../../components/commonComponents";
// import moment from 'moment';

const ChatScreen = ({ navigation }) => {
  const [textInput, setTextInput] = useState("");
  const [imageLoadingId, setImageLoadingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);//dummy use state just to call function
  const [currentImageSetter, setCurrentImageSetter] = useState(null);//dummy use state just to call function

  const [messages, setMessages] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const spinAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (isRefreshing) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
    }
  }, [isRefreshing]);

const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const sendMessage = (image = null) => {
    if (!textInput.trim() && !image) return;

    const newMessage = {
      id: `${Date.now()}-${Math.random()}`,
      text: textInput.trim(),
      image: image,
      time: new Date(),
      sender: "user",
    };

    setMessages([newMessage, ...messages]);

    setTextInput("");
    setTimeout(() => {
      const reply = {
        id: (Date.now() + 1).toString(),
        text: "Hlw!",
        image: null,
        time: new Date(),
        sender: "other",
      };
      setMessages((prev) => [reply, ...prev]);
    }, 1500);
  };

  const handleOpenGallery = async () => {
    try {
      const imageUri = await openGallery(
        setCurrentImageSetter,
        imageLoadingId,
        setImageLoadingId,
        setBottomSheetVisible
      );
      if (imageUri) sendMessage(imageUri);
    } catch (error) {
      console.log("Gallery Error", error);
    }
  };

  const handleOpenCamera = async () => {
    try {
      const imageUri = await openCamera(
        setCurrentImageSetter,
        imageLoadingId,
        setImageLoadingId,
        setBottomSheetVisible
      );
      if (imageUri) sendMessage(imageUri);
    } catch (error) {
      console.log("Camera Error", error);
    }
  };

  const deleteMessage = (id) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== id)
    );
    setDeleteItem(null);
  };

  const handleLongPress = (item) => {
    setDeleteItem(item.id);
  };
const handleRefresh = () => {
  setIsRefreshing(true);

  setTimeout(() => {
    setIsRefreshing(false);
  }, 5000); 
};
  const renderMessage = ({ item }) => {
    const isUser = item.sender === "user";
    const isLoading = imageLoadingId === item.id;

    return (
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={() => handleLongPress(item)}
        onPress={() => {
          if (item.image && deleteItem === null) {
            showFullImageFunction(
              item.image,
              setSelectedImage,
              setModalVisible
            );
          } else if (deleteItem != null) {
            setDeleteItem(null);
          }
        }}
        delayLongPress={300}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.otherBubble,
            deleteItem === item.id ? { backgroundColor: "gray" } : null,
          ]}
        >
          {item.image && (
            <View style={{ position: "relative" }}>
              {isLoading && (
                <ActivityIndicator
                  size="large"
                  color={Colors.grayColor}
                  style={styles.loader}
                />
              )}
              <Image
                source={{ uri: item.image }}
                style={styles.imageBubble}
                onLoadStart={() => setImageLoadingId(item.id)}
                onLoadEnd={() => setImageLoadingId(null)}
              />
            </View>
          )}

          {item.text && <Text style={styles.messageText}>{item.text}</Text>}
         <Text style={styles.timeText}>{moment(item.time).fromNow()}</Text>

        </View>
      </TouchableOpacity>
    );
  };

return (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
    keyboardVerticalOffset={Platform.OS === "ios" ? 80 :40} 
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.appBar}>
          <View style={styles.profile}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color={Colors.bodyBackColor} />
            </View>
            <View>
              <Text style={styles.userName}>Dummy User</Text>
              <Text style={styles.userPhone}>+91 567898765</Text>
            </View>
          </View>
          {deleteItem ? (
            <TouchableOpacity onPress={() => deleteMessage(deleteItem)}>
              <Ionicons name="trash" size={24} color={Colors.darkOrangeColor} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleRefresh}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Ionicons name="refresh" size={24} color={Colors.primaryColor} />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 10 }}
          inverted
        />

        <View style={styles.inputBar}>
          <View style={{ ...commonStyles.rowSpaceBetween, gap: 10 }}>
            <TouchableOpacity onPress={handleOpenCamera}>
              <Ionicons name="camera" size={24} color={Colors.primaryColor} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleOpenGallery}>
              <Ionicons name="image" size={24} color={Colors.primaryColor} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.textInput}
            value={textInput}
            placeholder="Type a message"
            onChangeText={setTextInput}
          />
          <TouchableOpacity onPress={() => sendMessage()}>
            <Ionicons name="send" size={24} color={Colors.primaryColor} />
          </TouchableOpacity>
        </View>

        {fullImageContainer(modalVisible, setModalVisible, selectedImage)}
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.extraLightPrimaryColor,
  },
  appBar: {
    flexDirection: "row",
    ...commonStyles.rowSpaceBetween,
    backgroundColor: "#fafafa",
    padding: 15,
    paddingRight: 35,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  loader: {
    position: "absolute",
    top: "45%",
    left: "45%",
    zIndex: 1,
  },

  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.grayColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  userPhone: {
    fontSize: 12,
    color: Colors.grayColor,
  },
  inputBar: {
    ...commonStyles.rowSpaceBetween,
    padding: 10,
    borderTopWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    backgroundColor: "#fafafa",
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    ...commonStyles.boxInput,
  },
  icon: {
    marginHorizontal: 5,
  },
  messageBubble: {
    maxWidth: "70%",
    marginVertical: 5,
    padding: 10,
  },
  userBubble: {
    backgroundColor:Colors.userBubble,
    alignSelf: "flex-end",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 0,
  },
  otherBubble: {
    backgroundColor:Colors.otherBubble,
    alignSelf: "flex-start",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  messageText: {
    fontSize: 14,
  },
  timeText: {
    fontSize: 10,
    color: "#555",
    marginTop: 4,
    textAlign: "right",
  },
  imageBubble: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
});
