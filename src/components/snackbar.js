import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { clearSnackbar } from '../redux/slice/snackbarSlice';

const Snackbar = () => {
  const dispatch = useDispatch();
  const { message, type, time } = useSelector((state) => state.snackbar);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearSnackbar());
      }, time || 3000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch, time]);

  if (!message) return null;

  const bgColor = type === 'error' ? '#FF5722' : '#4caf50';

  return (
    <View style={[styles.snackbarContainer, { top: Platform.OS === 'android' ? 40 : 60 }]}>
      <View style={[styles.snackbarInnerContainer, { backgroundColor: bgColor }]}>
        <Text style={styles.snackbarMessage}>{message}</Text>
        <TouchableOpacity style={styles.icon} onPress={() => dispatch(clearSnackbar())}>
          <Ionicons name="close" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  snackbarContainer: {
    position: 'absolute',
    width: '100%',
    zIndex: 9999,
    paddingHorizontal: '10%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  snackbarInnerContainer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingRight: 30,
    maxWidth: '100%',
  },
  snackbarMessage: {
    color: 'white',
    fontSize: 14,
    flexShrink: 1,
    flex: 1,
  },
  icon: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 4,
  },
});

export default Snackbar;
