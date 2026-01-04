import {SafeAreaView, StatusBar} from 'react-native';
import React from 'react';
import { Colors } from '../constants/styles';

const MyStatusBar = () => {
  return (
    <StatusBar
      translucent={false}
      backgroundColor={Colors.primaryColor}
      barStyle="light-content"
    />
  );
};


export default MyStatusBar;