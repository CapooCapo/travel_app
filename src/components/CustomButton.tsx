import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

interface Props {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  bgColor?: string; // Cho phép đổi màu nền nếu cần
}

const CustomButton = ({ title, onPress, isLoading = false, bgColor = COLORS.primary }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: bgColor, opacity: isLoading ? 0.7 : 1 }]}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 55,
    borderRadius: SIZES.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomButton;
