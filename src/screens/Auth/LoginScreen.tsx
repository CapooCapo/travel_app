import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView,
    Alert,
} from 'react-native';

// Import Components và Constants
import { COLORS, SIZES } from '../../constants/theme';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialButton from '../../components/SocialButton';
// import { authService } from '../../services/auth.service';

// Assets (Đảm bảo bạn đã có ảnh trong thư mục này)
//import logoImg from '../../assets/images/logo.png';
import googleIcon from '../../../assets/images/googleIcon.jpg';
import microsoftIcon from '../../../assets/images/mcIcon.png';

// ... Code bên dưới giữ nguyên

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // --- XỬ LÝ LOGIC ---
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
            return;
        }
        setIsLoading(true);
        try {
            // Gọi Service đã viết sẵn (cần đảm bảo API chạy)
            // const res = await authService.login(email, password);
            // Lưu token và điều hướng vào Home...
            Alert.alert("Thông báo", "Đang gọi API login (Giả lập thành công)");
            // navigation.replace('HomeStack');

        } catch (error) {
            Alert.alert('Đăng nhập thất bại', 'Kiểm tra lại thông tin.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (type: 'Google' | 'Microsoft') => {
        Alert.alert('Thông báo', `Tính năng đăng nhập ${type} đang phát triển.`);
        // Cần tích hợp Firebase Auth hoặc SDK riêng cho phần này
    };

    // --- GIAO DIỆN ---
    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* 1. LOGO */}
                    <View style={styles.logoContainer}>
                        {/* <Image source={logoImg} style={styles.logo} resizeMode="contain" /> */}
                        <Text style={styles.welcomeText}>Chào mừng trở lại!</Text>
                        <Text style={styles.subText}>Đăng nhập để tiếp tục</Text>
                    </View>

                    {/* 2. INPUT FORM */}
                    <View style={styles.formContainer}>
                        <CustomInput
                            placeholder="Email"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                        <CustomInput
                            placeholder="Mật khẩu"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        {/* Remember Me & Forgot Password */}
                        <View style={styles.optionsRow}>
                            <TouchableOpacity
                                style={styles.rememberMeContainer}
                                onPress={() => setRememberMe(!rememberMe)}
                                activeOpacity={1}
                            >
                                {/* Checkbox giả (Sau này thay bằng icon) */}
                                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                    {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                                </View>
                                <Text style={styles.optionText}>Ghi nhớ tôi</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                <Text style={styles.forgotPassText}>Quên mật khẩu?</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Nút Đăng nhập thường */}
                        <CustomButton
                            title="ĐĂNG NHẬP"
                            onPress={handleLogin}
                            isLoading={isLoading}
                        />
                    </View>

                    {/* 3. DIVIDER (Hoặc đăng nhập bằng) */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Hoặc đăng nhập với</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* 4. SOCIAL BUTTONS */}
                    <View style={styles.socialRow}>
                        <SocialButton
                            title="Google"
                            icon={googleIcon}
                            onPress={() => handleSocialLogin('Google')}
                            bgColor="#fff" // Hoặc COLORS.google nếu muốn nền màu
                            textColor={COLORS.text}
                        />
                        <View style={{ width: 15 }} /> {/* Khoảng cách giữa 2 nút */}
                        <SocialButton
                            title="Microsoft"
                            icon={microsoftIcon}
                            onPress={() => handleSocialLogin('Microsoft')}
                            bgColor={COLORS.microsoft} // Nền màu đặc trưng
                            textColor="#fff"
                        />
                    </View>

                    {/* 5. ĐĂNG KÝ */}
                    <View style={styles.registerContainer}>
                        <Text style={styles.optionText}>Chưa có tài khoản? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.registerText}>Đăng ký ngay</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// Styles
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: SIZES.padding,
        paddingTop: 40,
        minHeight: '100%', // Đảm bảo nội dung căn giữa khi màn hình cao
        justifyContent: 'center'
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 15,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 5,
    },
    subText: {
        fontSize: 16,
        color: COLORS.textLight,
    },
    formContainer: {
        marginBottom: 20,
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg
    },
    checkboxChecked: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    checkmark: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    optionText: {
        color: COLORS.textLight,
        fontSize: 14,
    },
    forgotPassText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.borderColor,
    },
    dividerText: {
        marginHorizontal: 10,
        color: COLORS.textLight,
        fontSize: 14,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    registerText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default LoginScreen;
