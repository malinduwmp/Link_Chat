import { registerRootComponent } from "expo";
import {
    View,
    Text,
    StyleSheet,
    Alert,
    Image,
    TouchableOpacity,
    Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome6 } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

const logoPath = require("../assets/images/14.png");

export default function Home() {
    const [profileMenuVisible, setProfileMenuVisible] = useState(false);
    const [getChatArray, setChatArray] = useState([]);

    const [loaded, error] = useFonts({
        "Montserrat-Bold": require('../assets/fonts/Montserrat-Bold.ttf'),
        "Montserrat-Light": require('../assets/fonts/Montserrat-Light.ttf'),
        "Montserrat-Regular": require('../assets/fonts/Montserrat-Regular.ttf'),
    });

    useEffect(() => {
        async function fetchData() {
            let userJson = await AsyncStorage.getItem("user");
            let user = JSON.parse(userJson);
            
            let response = await fetch(`${process.env.EXPO_PUBLIC_URL}/Smart_Chat/LoadHomeData?id=${user.id}`);

            if (response.ok) {
                let json = await response.json();
                if (json.success) {
                    let chatArray = json.jsonChatArray;
                    setChatArray(chatArray);
                }
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }

        if (error) {
            Alert.alert('Error', 'Failed to load fonts');
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    const toggleProfileMenu = () => {
        setProfileMenuVisible(!profileMenuVisible);
    };

    return (
        <LinearGradient colors={['#00c6ff', '#0072ff']} style={styleSheets.container}>
            <StatusBar hidden={true} />

            {/* Fixed Top Menu */}
            <View style={styleSheets.menu}>
                <Image source={logoPath} style={styleSheets.logo} />
                <Text style={styleSheets.appTitle}>LinkChat</Text>
                <TouchableOpacity style={styleSheets.profileIcon} onPress={toggleProfileMenu}>
                    <FontAwesome6 name="user-circle" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Profile Menu (Conditional Rendering) */}
            {profileMenuVisible && (
                <View style={styleSheets.profileMenu}>
                    <Text style={styleSheets.profileMenuText}
                        onPress={
                            () => {
                                router.push("/profile");
                            }
                        }>Profile</Text>
                    <Text style={styleSheets.profileMenuText}>Settings</Text>
                    <Text style={styleSheets.profileMenuText}
                        onPress={async () => {
                            Alert.alert(
                                'Logout',
                                'Are you sure you want to Logout?',
                                [
                                    {
                                        text: 'Cancel',
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Logout',
                                        onPress: async () => {
                                            try {
                                                await AsyncStorage.clear();
                                                Alert.alert('Successfully Logout');
                                                router.replace('/');
                                            } catch (error) {
                                                Alert.alert('Error', 'Failed to Logout. Please try again.');
                                            }
                                        },
                                        style: 'destructive',
                                    },
                                ]
                            );
                        }
                        }
                    >
                        Logout</Text>
                </View>
            )}

            {/* FlashList to render chat items */}
            <View style={styleSheets.flashListContainer}>
                <FlashList
                    data={getChatArray}
                    renderItem={({ item, index }) => (
                        <Pressable
                            style={[
                                styleSheets.scrollView,
                                index === 0 && { marginTop: 20 },
                            ]}
                            onPress={() => {
                                router.push({
                                    pathname: "/chat",
                                    params: item
                                });
                            }}
                        >
                            <View style={styleSheets.chatContainer}>
                                {/* Dynamic Border Color based on user status */}
                                <View style={[
                                    styleSheets.profilePicture,
                                    { borderColor: item.other_user_status === 1 ? "#30EE90" : "red" } // Green for online, red for offline
                                ]}>
                                    {item.avatar_image_found ? (
                                        <Image
                                            source={{ uri: `${process.env.EXPO_PUBLIC_URL}/Smart_Chat/AvatarImage/${item.other_user_mobile}.png?cache_buster=${new Date().getTime()}` }}
                                            style={styleSheets.Image1}
                                            resizeMode="cover"
                                            onError={(error) => console.log("Image load error: ", error)}
                                        />
                                    ) : (
                                        <Text style={styleSheets.profileChat}>
                                            {item.other_user_avartar_settings}
                                        </Text>
                                    )}
                                </View>

                                {/* Chat text and details */}
                                <View style={styleSheets.chatTextContainer}>
                                    <Text style={styleSheets.userName}>{item.other_user_name}</Text>
                                    <Text style={styleSheets.message}>{item.message}</Text>
                                    <View style={styleSheets.chatDetails}>
                                        <Text style={styleSheets.timestamp}>{item.dateTime}</Text>
                                        <FontAwesome6
                                            name="check"
                                            size={16}
                                            color={item.chat_status_id === 1 ? "#30EE90" : "white"}
                                            style={styleSheets.checkIcon}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    )}
                    estimatedItemSize={100}
                    contentContainerStyle={styleSheets.flashListContent}
                />
            </View>
        </LinearGradient>
    );
}

const styleSheets = StyleSheet.create({
    container: {
        flex: 1,  // Ensure the parent container takes up the full screen
        paddingTop: 60,  // Space for the fixed top menu
        paddingHorizontal: 5,
        paddingVertical: 30,
    },
    menu: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(50, 56, 59, 0.85)",
        padding: 15,
        elevation: 5,
        zIndex: 1000,
    },
    logo: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },
    appTitle: {
        fontSize: 20,
        fontFamily: "Montserrat-Bold",
        color: "#fff",
    },
    profileIcon: {
        padding: 5,
    },
    profileMenu: {
        position: 'absolute',
        top: 60,
        right: 15,
        backgroundColor: "rgba(50, 56, 59, 0.9)",
        padding: 10,
        borderRadius: 10,
        zIndex: 1000,
        marginBottom: 10
    },
    profileMenuText: {
        color: "white",
        fontSize: 16,
        fontFamily: "Montserrat-Regular",
        marginVertical: 5,
    },
    flashListContainer: {
        flex: 1, // Ensure the FlashList container takes up the remaining screen space
    },
    scrollView: {
        marginTop: 5,
        backgroundColor: "rgba(50, 56, 59, 0.85)",
        borderRadius: 8,
        padding: 5,
    },
    flashListContent: {
        paddingBottom: 20, // Padding at the bottom for smoother scrolling experience
    },
    chatContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "rgba(255, 255, 255, 0.10)",
        elevation: 2,
        marginBottom: 5, // Add spacing between chat items
    },
    profilePicture: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "white",
        borderWidth: 3, // Keeps the border width consistent for online/offline
        alignItems: "center",
        justifyContent: "center",
    },
    Image1: {
        width: 55,
        height: 55,
        borderRadius: 30,
        backgroundColor: "white",
    },
    profileChat: {
        fontFamily: "Montserrat-Bold",
        fontSize: 22,
        color: "#000", // Color for avatar initials when image isn't found
    },
    chatTextContainer: {
        flex: 1,
        paddingLeft: 15,
    },
    userName: {
        fontSize: 18,
        fontFamily: "Montserrat-Bold",
        color: '#fff',
        marginBottom: 3,
    },
    message: {
        fontSize: 14,
        fontFamily: "Montserrat-Regular",
        color: '#fff',
        height: 18,
        marginBottom: 3,
    },
    chatDetails: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // Ensures timestamp and check icon are aligned on the same row with space between them
    },
    timestamp: {
        fontSize: 11,
        fontFamily: "Montserrat-Regular",
        color: '#ddd',
    },
    checkIcon: {
        marginLeft: 'auto', // Align check icon at the end of the chatDetails
    },
});
