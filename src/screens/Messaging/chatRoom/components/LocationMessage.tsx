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
  const { latitude, longitude, address, placeName } = message;
  const displayTitle = placeName || address || 'Shared Location';
  const displaySubtitle = address && placeName ? address : (latitude ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : '');

  const openInMaps = () => {
    if (!latitude || !longitude) return;

    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${latitude},${longitude}`;
    const label = placeName || address || 'Shared Location';
    const url = Platform.select({
      ios: `${scheme}${encodeURIComponent(label)}@${latLng}`,
      android: `${scheme}${latLng}(${encodeURIComponent(label)})`,
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
      <View style={{ height: 100, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
        <Ionicons name="map" size={32} color={isMe ? COLORS.primary : COLORS.muted} />
        <Text style={{ marginTop: 4, color: isMe ? COLORS.primary : COLORS.muted, fontSize: 10 }}>
          Tap to view on Map
        </Text>
      </View>
      <View style={styles.locationInfo}>
        <Text style={[styles.locationName, { color: isMe ? (COLORS.text === '#fff' ? '#fff' : COLORS.text) : COLORS.text }]} numberOfLines={1}>
           {displayTitle}
        </Text>
        {displaySubtitle ? (
          <Text style={[styles.locationAddress, { color: isMe ? (COLORS.text === '#fff' ? 'rgba(255,255,255,0.7)' : COLORS.muted) : COLORS.muted }]} numberOfLines={1}>
            {displaySubtitle}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default LocationMessage;
