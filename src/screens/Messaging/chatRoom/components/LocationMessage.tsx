import React from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../ChatRoom.Style';
import { COLORS } from '../../../../constants/theme';
import { MessageDTO } from '../../../../dto/messaging/message.DTO';

interface LocationMessageProps {
  message: MessageDTO;
  isMe: boolean;
}

const LocationMessage: React.FC<LocationMessageProps> = ({ message, isMe }) => {
  const { latitude, longitude, address } = message;

  const openInMaps = () => {
    if (!latitude || !longitude) return;

    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${latitude},${longitude}`;
    const label = address || 'Shared Location';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.locationCard,
        { backgroundColor: isMe ? COLORS.primary + '22' : COLORS.card }
      ]}
      onPress={openInMaps}
      activeOpacity={0.8}
    >
      <View style={{ height: 120, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="map" size={40} color={isMe ? COLORS.primary : COLORS.muted} />
        <Text style={{ marginTop: 8, color: isMe ? COLORS.primary : COLORS.muted, fontSize: 12 }}>
          Tap to view on Map
        </Text>
      </View>
      <View style={styles.locationInfo}>
        <Text style={[styles.locationName, { color: isMe ? (COLORS.text === '#fff' ? '#fff' : COLORS.text) : COLORS.text }]}>
           Shared Location
        </Text>
        <Text style={[styles.locationAddress, { color: isMe ? (COLORS.text === '#fff' ? 'rgba(255,255,255,0.7)' : COLORS.muted) : COLORS.muted }]} numberOfLines={2}>
          {address || `${latitude?.toFixed(4)}, ${longitude?.toFixed(4)}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default LocationMessage;
