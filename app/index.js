import { 
    View, 
    StyleSheet, 
    TextInput, 
    Text, 
    Pressable, 
    Alert, 
    ScrollView, 
    KeyboardAvoidingView, 
    Platform, 
    TouchableOpacity 
} from "react-native";
import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function index() {

    // console.log("1");

    const [loaded, error] = useFonts({
        "Montserrat-Bold": require('../assets/fonts/Montserrat-Bold.ttf'),
        "Montserrat-Light": require('../assets/fonts/Montserrat-Light.ttf'),
        "Montserrat-Regular": require('../assets/fonts/Montserrat-Regular.ttf'),
    });

    const logoPath = require("../assets/images/14.png");

    const [getMobile, setMobile] = useState("");
    const [getPassword, setPassword] = useState("");
    const [getName, setName] = useState(".......");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(

        () => {
            async function checkUserInAsyncStorage()  {
                // console.log("2");
                try {
                    let userJson = await AsyncStorage.getItem("user");
                    if (userJson !=null){
                        router.replace("/home");
                    }
                    
                } catch (error) {
                    alert(error);
                }
             
            }
            checkUserInAsyncStorage();
        }

        
    );

    useEffect(() => {
        if (loaded || error) {
            // console.log("3");
            SplashScreen.hideAsync();
        }
        if (error) {
            Alert.alert('Error', 'Failed to load fonts');
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        // console.log("4");
        return null;
    }

    // console.log("5");

    return (
        <LinearGradient colors={['#00c6ff', '#0072ff']} style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>

                <StatusBar hidden={true}/>
              
                <ScrollView style={styles.scroll}>
                    <Image source={logoPath} style={styles.logo} contentFit="contain" />
                    <Text style={styles.welcomeText}>Hello! Welcome To Chat Link</Text>
                    <Text style={styles.signinText}>Sign in to Your Account</Text>

                    <View style={styles.profileContainer}>
                        <View style={styles.profileCircle}>
                            <Text style={styles.initialsText}>{getName}</Text>
                        </View>
                    </View>

                    {/* Mobile Input */}
                    <Text style={styles.label}>Mobile</Text>
                    <TextInput 
                        style={styles.input} 
                        inputMode="tel"
                        placeholder="Enter Your Mobile" 
                        maxLength={10}
                        onChangeText={setMobile}
                        onEndEditing={async () => {
                            if (getMobile.length === 10) {
                                const response = await fetch(`${process.env.EXPO_PUBLIC_URL}/Smart_Chat/GetLetters?mobile=${getMobile}`);
                                if (response.ok) {
                                    const json = await response.json();
                                    setName(json.letters);
                                }
                            }
                        }} 
                    />
                    
                    {/* Password Input */}
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.input}
                            inputMode="text"
                            secureTextEntry={!showPassword}
                            placeholder="Enter Your Password"
                            maxLength={20}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconContainer}>
                            <FontAwesome5
                                name={showPassword ? "eye-slash" : "eye"}
                                size={20}
                                color="#333" // Set the icon color to red
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Sign-in Button */}
                    <Pressable 
                        style={styles.button} 
                        onPress={async () => {
                            const response = await fetch(process.env.EXPO_PUBLIC_URL+"/Smart_Chat/SIgnin",
                                 {
                                method: "POST",
                                body: JSON.stringify({
                                    mobile: getMobile,
                                    password: getPassword,
                                }),
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            });
                            if (response.ok) {
                                const json = await response.json();
                                if (json.success) {
                                    const user = json.user;
                                    try {
                                        console.log(user)
                                        await AsyncStorage.setItem("user", JSON.stringify(user));
                                        router.replace("/home");
                                    } catch (error) {
                                        alert(error);
                                    }
                                }else{
                                    Alert.alert("Error", json.message || "Failed to Sign in");
                                }
                            }
                        }}
                    >
                        <View style={styles.buttonContent}>
                            <FontAwesome6 name="right-to-bracket" size={18} color={"white"} />
                            <Text style={styles.buttonText}>Sign In</Text>
                        </View>
                    </Pressable>

                    {/* Sign-up Button */}
                    <Pressable 
                        style={styles.secondaryButton} 
                        onPress={() => router.replace("/signup")}
                    >
                        <Text style={styles.secondaryButtonText}>New User? Create Account</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 10,
    },
    logo: {
        alignSelf: "center",
        height: 120,
        width: "60%",
        marginVertical: 10,
    },
    welcomeText: {
        fontSize: 32,
        fontFamily: "Montserrat-Bold",
        textAlign: 'center',
        color: '#fff',
        marginBottom: 5,
    },
    signinText: {
        fontSize: 20,
        fontFamily: "Montserrat-Regular",
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    profileContainer: {
        alignSelf: "center",
        marginBottom: 20,
    },
    profileCircle: {
        height: 100,
        width: 100,
        borderRadius: 50,
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 3,
        borderColor: "#0072ff",
    },
    initialsText: {
        fontSize: 36,
        fontFamily: "Montserrat-Bold",
        color: "#0072ff",
    },
    label: {
        fontSize: 16,
        fontFamily: "Montserrat-Bold",
        color: '#fff',
        marginBottom: 5,
    },
    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 12,
        backgroundColor: "#fff",
        marginBottom: 20,
        paddingStart: 10,
        color: "#333",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    iconContainer: {
        marginLeft: 'auto', // This pushes the icon to the right end of the view
        padding: 10, // Optional padding for better touch target
    },
    button: {
        backgroundColor: "#ff5f6d", // Changed the button color to red
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginVertical: 20,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
    secondaryButton: {
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        backgroundColor: "transparent",
    },
    secondaryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
