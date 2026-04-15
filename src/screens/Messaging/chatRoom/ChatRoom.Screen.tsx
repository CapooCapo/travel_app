import React from "react";
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar, Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./ChatRoom.Style";
import { useChatRoom } from "./useChatRoom";
import { COLORS } from "../../../constants/theme";
import { MessageDTO } from "../../../dto/messaging/message.DTO";
import LocationMessage from "./components/LocationMessage";

// Hard-coded placeholder for current user id — replace with Clerk user id in real app
const MY_USER_ID = 1;

const ChatRoomScreen = ({ navigation, route }: any) => {
  const { chatRoomId, chatName, chatType } = route.params;
  const insets = useSafeAreaInsets();
  const {
    messages, isLoading, inputText, setInputText,
    isSending, pinnedMessage, listRef, userId,
    handleSend, handleSendLocation, handlePinMessage, goBack,
  } = useChatRoom(navigation, chatRoomId);

  const renderMessageContent = (item: MessageDTO, isMe: boolean) => {
    if (item.type === "IMAGE") {
      const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.72:8080";
      const fullUrl = item.content.startsWith("http")
        ? item.content
        : `${baseUrl}${item.content}`;
      
      return (
        <Image
          source={{ uri: fullUrl }}
          style={styles.messageImage}
          resizeMode="cover"
        />
      );
    }

    if (item.type === "LOCATION") {
      return <LocationMessage message={item} isMe={isMe} />;
    }

    return (
      <Text style={isMe ? styles.bubbleOutText : styles.bubbleInText}>
        {item.content}
      </Text>
    );
  };

  const renderMessage = ({ item }: { item: MessageDTO }) => {
    if (item.type === "SYSTEM") {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.content}</Text>
        </View>
      );
    }

    const isMe = item.senderId === userId;

    if (isMe) {
      return (
        <View style={styles.bubbleOut}>
          {renderMessageContent(item, true)}
          <Text style={styles.bubbleOutTime}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.bubbleInRow}>
        {item.senderAvatar ? (
          <Image source={{ uri: item.senderAvatar }} style={styles.avatarMini} />
        ) : (
          <View style={styles.avatarPlaceholderMini}>
            <Ionicons name="person" size={14} color={COLORS.muted} />
          </View>
        )}
        
        <TouchableOpacity
          style={styles.bubbleInWrapper}
          onLongPress={() => handlePinMessage(item.id)}
          delayLongPress={600}
          activeOpacity={0.9}
        >
          {chatType === "GROUP" && (
            <Text style={styles.bubbleSenderName}>{item.senderName || "User"}</Text>
          )}
          <View style={styles.bubbleIn}>
            {renderMessageContent(item, false)}
            <Text style={styles.bubbleInTime}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.chatName} numberOfLines={1}>{chatName}</Text>
          <Text style={styles.chatType}>
            {chatType === "group" ? "Group chat" : "Private message"}
          </Text>
        </View>
        <Ionicons name="ellipsis-vertical" size={20} color={COLORS.muted} />
      </View>

      {/* Pinned message banner */}
      {pinnedMessage && (
        <View style={styles.pinnedBanner}>
          <Ionicons name="pin" size={14} color={COLORS.primary} />
          <Text style={styles.pinnedText} numberOfLines={1}>
            📌 {pinnedMessage.content}
          </Text>
        </View>
      )}

      {/* Messages */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => `msg-${item.id}`}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: false })
          }
        />
      )}

      {/* Input bar */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom || 10 }]}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message…"
            placeholderTextColor={COLORS.muted}
            multiline
            returnKeyType="default"
          />
        </View>
        
        <TouchableOpacity
          style={[styles.sendBtn, { marginRight: 4, backgroundColor: 'transparent' }]}
          onPress={handleSendLocation}
          disabled={isSending}
        >
          <Ionicons name="location" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sendBtn,
            inputText.trim() ? styles.sendBtnActive : styles.sendBtnInactive,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons
              name="send"
              size={18}
              color={inputText.trim() ? "#fff" : COLORS.muted}
            />
          )}
        </TouchableOpacity>
      </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatRoomScreen;
