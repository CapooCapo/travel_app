import React, { useState, useEffect } from "react";
import {
  Modal, View, Text, TouchableOpacity,
  ActivityIndicator, FlatList, StyleSheet, Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, FONTS } from "../constants/theme";
import { messagingService } from "../services/messaging.service";
import { ChatDTO } from "../dto/messaging/message.DTO";

interface SelectChatModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectChat: (chatId: number) => void;
}

export default function SelectChatModal({
  visible, onClose, onSelectChat
}: SelectChatModalProps) {
  const [chats, setChats] = useState<ChatDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadChats();
    }
  }, [visible]);

  const loadChats = async () => {
    setIsLoading(true);
    try {
      const data = await messagingService.getChats();
      setChats(data);
    } catch {
      // toast or alert
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Send to Chat</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.muted} />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 30 }} />
          ) : (
            <FlatList
              data={chats}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No recent chats found.</Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.chatItem}
                  onPress={() => onSelectChat(item.id)}
                >
                  <View style={styles.avatar}>
                    <Ionicons name={item.type === 'group' ? 'people' : 'person'} size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.chatInfo}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.chatType}>{item.type}</Text>
                  </View>
                  <Ionicons name="send" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SIZES.padding,
    paddingBottom: 40,
    maxHeight: "70%",
    width: "100%"
  },
  header: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 20
  },
  title: { ...FONTS.h2, color: COLORS.text, fontWeight: "700" },
  closeBtn: { padding: 4 },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12
  },
  chatInfo: { flex: 1 },
  chatName: { ...FONTS.body1, color: COLORS.text, fontWeight: '600' },
  chatType: { ...FONTS.body2, color: COLORS.muted, fontSize: 12 },
  emptyText: { textAlign: 'center', color: COLORS.muted, marginTop: 20 }
});
