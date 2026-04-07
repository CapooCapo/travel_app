import React from "react";
import {
    View, Text, ScrollView, TouchableOpacity,
    TextInput, Image, ActivityIndicator, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./Profile.Style";
import { useProfile } from "./useProfile";
import { COLORS } from "../../../constants/theme";

const ProfileScreen = ({ navigation }: any) => {
    const insets = useSafeAreaInsets();
    const {
        displayName, displayEmail, displayAvatar,
        beUser, isEditing, setIsEditing,
        isSaving, isLoadingBe,
        fullName, setFullName,
        travelStyle, setTravelStyle,
        gender, setGender,
        selectedInterestIds, setSelectedInterestIds,
        travelStyles, genders, masterInterests,
        handleSave, handleSignOut, loadBeProfile,
        isAdmin, navigateToAdmin,
        navigateToItineraries, navigateToBookmarks,
    } = useProfile(navigation);

    // Hàm hỗ trợ toggle chọn/bỏ chọn Sở thích
    const toggleInterest = (id: number) => {
        if (selectedInterestIds.includes(id)) {
            setSelectedInterestIds(prev => prev.filter(item => item !== id));
        } else {
            setSelectedInterestIds(prev => [...prev, id]);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* ── Header ── */}
                <View style={styles.headerBg}>
                    {!isEditing && (
                        <TouchableOpacity
                            style={styles.editBtn}
                            onPress={() => {
                                setFullName(displayName);
                                setIsEditing(true);
                            }}
                        >
                            <Text style={{ color: COLORS.primary }}>Edit</Text>
                        </TouchableOpacity>
                    )}
                    <View style={styles.avatar}>
                        {displayAvatar ? (
                            <Image source={{ uri: displayAvatar }} style={styles.avatarImage} />
                        ) : (
                            <Ionicons name="person" size={36} color={COLORS.muted} />
                        )}
                    </View>
                    <Text style={styles.displayName}>{displayName}</Text>
                    <Text style={styles.emailText}>{displayEmail}</Text>
                    {isLoadingBe && (
                        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 6 }} />
                    )}
                </View>

                {/* ── Edit name ── */}
                {isEditing && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Display Name</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.textInput}
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="Your name"
                                placeholderTextColor={COLORS.muted}
                            />
                        </View>
                    </View>
                )}

                {/* ── Travel Style ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Travel Style</Text>
                    <View style={styles.styleRow}>
                        {travelStyles.map((s) => (
                            <TouchableOpacity
                                key={s}
                                style={[styles.styleChip, travelStyle === s && styles.styleChipActive]}
                                onPress={() => isEditing && setTravelStyle(s)}
                                disabled={!isEditing}
                            >
                                <Text style={[styles.styleChipText, travelStyle === s && styles.styleChipTextActive]}>
                                    {s}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* ── Gender ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Gender</Text>
                    <View style={styles.styleRow}>
                        {genders.map((g) => (
                            <TouchableOpacity
                                key={g}
                                style={[styles.styleChip, gender === g && styles.styleChipActive]}
                                onPress={() => isEditing && setGender(g)}
                                disabled={!isEditing}
                            >
                                <Text style={[styles.styleChipText, gender === g && styles.styleChipTextActive]}>
                                    {g}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* ── Interests ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Interests</Text>
                    <View style={styles.interestRow}>
                        {!isEditing ? (
                            // Chế độ xem: Hiển thị các sở thích hiện tại
                            beUser?.interests?.map((interest: any, index: number) => {
                                const name = typeof interest === 'string' ? interest : interest.name;
                                return (
                                    <View key={`view-${index}`} style={styles.interestChipActive}>
                                        <Text style={styles.interestChipTextActive}>{name}</Text>
                                    </View>
                                )
                            })
                        ) : (
                            // Chế độ sửa: Hiển thị toàn bộ danh sách để chọn/bỏ chọn
                            masterInterests.map((item) => {
                                const isSelected = selectedInterestIds.includes(item.id);
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styles.interestChip,
                                            isSelected && styles.interestChipActive
                                        ]}
                                        onPress={() => toggleInterest(item.id)}
                                    >
                                        <Text style={[
                                            styles.interestChipText,
                                            isSelected && styles.interestChipTextActive
                                        ]}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </View>
                </View>

                {/* ── Quick actions ── */}
                {!isEditing && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>My Travel</Text>
                        {[
                            { icon: "map-outline", label: "My Itineraries", onPress: navigateToItineraries },
                            { icon: "bookmark-outline", label: "Saved Places", onPress: navigateToBookmarks },
                        ].map(({ icon, label, onPress }) => (
                            <TouchableOpacity key={label} style={styles.menuItem} onPress={onPress}>
                                <Ionicons name={icon as any} size={20} color={COLORS.primary} />
                                <Text style={styles.menuItemText}>{label}</Text>
                                <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
                            </TouchableOpacity>
                        ))}
                        {isAdmin && (
                            <TouchableOpacity style={styles.menuItem} onPress={navigateToAdmin}>
                                <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
                                <Text style={styles.menuItemText}>Dashmin Hub</Text>
                                <Ionicons name="chevron-forward" size={16} color={COLORS.muted} />
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* ── Save / Cancel ── */}
                {isEditing ? (
                    <>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
                            {isSaving
                                ? <ActivityIndicator color="#fff" />
                                : <Text style={styles.saveBtnText}>Save Changes</Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.signOutBtn} onPress={() => {
                            setIsEditing(false);
                            loadBeProfile(); // Trả lại data ban đầu nếu Hủy
                        }}>
                            <Text style={[styles.signOutText, { color: COLORS.muted }]}>Cancel</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

export default ProfileScreen;
