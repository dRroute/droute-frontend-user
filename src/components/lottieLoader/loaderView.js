import React from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";

export const DottedLoader = () => {
  return (
    <View
      style={{
        // width: 30,
        height: 30,
        flex: 1,
        alignSelf: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LottieView
        source={require("./animatedLoader1.json")}
        autoPlay
        loop
        style={{
          width: 40,
          height: 40,
          position: "absolute",
          top: -5,
          left: 0,
        }}
      />
    </View>
  );
};
export const DottedBlackLoader = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "rgba(182, 206, 232, 0.3)",
        zIndex: 999,
      }}
    >
      <LottieView
        source={require("./animatedLoader2.json")}
        autoPlay
        loop
        style={{
          width: 100,
          height: 100,
        }}
      />
    </View>
  );
};

export const LottieSuccess = () => {
  return (
    // <View
    //   style={{
    //     position: "absolute",
    //     top: 0,
    //     left: 0,
    //     right: 0,
    //     bottom: 0,
    //     justifyContent: "center",
    //     alignItems: "center",
    //     // backgroundColor: "rgba(182, 206, 232, 0.3)",
    //     zIndex: 999,
    //   }}
    // >
      <LottieView
        source={require("./success.json")}
        autoPlay
        loop
        style={{
          width: 100,
          height: 100,
        }}
      />
    // </View>
  );
};

export const LottieFaiure = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "rgba(182, 206, 232, 0.3)",
        zIndex: 999,
      }}
    >
      <LottieView
        source={require("./failure.json")}
        autoPlay
        loop
        style={{
          width: 100,
          height: 100,
        }}
      />
    </View>
  );
};
export const LottieWarning = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "rgba(182, 206, 232, 0.3)",
        zIndex: 999,
      }}
    >
      <LottieView
        source={require("./warning.json")}
        autoPlay
        loop
        style={{
          width: 100,
          height: 100,
        }}
      />
    </View>
  );
};