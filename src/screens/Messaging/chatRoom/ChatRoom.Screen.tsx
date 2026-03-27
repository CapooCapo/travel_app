import React from "react";
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./ChatRoom.Style";
import { ChatRoomFunction } from "./ChatRoom.Function";
import { COLORS } from "../../../constants/theme";
import { MessageDTO } from "../../../dto/messaging/message.DTO";

// Hard-coded placeholder for current user id — replace with Clerk user id in real app
const MY_USER_ID = 1;

const ChatRoomScreen = ({ navigation, route }: any) => {
  const { chatId, chatName, chatType } = route.params;
  const insets = useSafeAreaInsets();
  const {
    messages, isLoading, inputText, setInputText,
    isSending, pinnedMessage, listRef,
    handleSend, handlePinMessage, goBack,
  } = ChatRoomFunction(navigation, chatId);

  const renderMessage = ({ item }: { item: MessageDTO }) => {
    const isMe = item.senderId === MY_USER_ID;

    if (isMe) {
      return (
        <View style={styles.bubbleOut}>
          <Text style={styles.bubbleOutText}>{item.content}</Text>
          <Text style={styles.bubbleOutTime}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.bubbleInWrapper}
        onLongPress={() => handlePinMessage(item.id)}
        delayLongPress={600}
        activeOpacity={0.9}
      >
        {chatType === "group" && (
          <Text style={styles.bubbleSenderName}>{item.senderName}</Text>
        )}
        <View style={styles.bubbleIn}>
          <Text style={styles.bubbleInText}>{item.content}</Text>
          <Text style={styles.bubbleInTime}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.bottom}
    >
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
    </KeyboardAvoidingView>
  );
};

export default ChatRoomScreen;
