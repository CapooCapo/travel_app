import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

interface Props extends TextInputProps {
  // Có thể thêm prop icon ở đây sau này
}

const CustomInput = (props: Props) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor={COLORS.textLight}
        {...props} // Truyền tất cả các props mặc định của TextInput vào
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 55,
    backgroundColor: COLORS.inputBg,
    borderRadius: SIZES.borderRadius,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    marginBottom: 15,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
});

export default CustomInput;
