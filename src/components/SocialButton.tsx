import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, ImageSourcePropType, View } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

interface Props {
  title: string;
  icon: ImageSourcePropType;
  onPress: () => void;
  bgColor?: string;
  textColor?: string;
}

const SocialButton = ({ title, icon, onPress, bgColor = '#fff', textColor = COLORS.text }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: bgColor, borderColor: bgColor === '#fff' ? COLORS.borderColor : bgColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Để chia đều 2 cột
    flexDirection: 'row',
    height: 50,
    borderRadius: SIZES.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5, // Khoảng cách giữa 2 nút
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default SocialButton;
