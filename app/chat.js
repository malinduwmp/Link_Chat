import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { useEffect, useState, useRef } from "react";
import { router, SplashScreen, useLocalSearchParams } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function Chat() {
    const [getChatArray, setChatArray] = useState([]);
    const [loading, setLoading] = useState(true);
    const [getChatText, setChatText] = useState("");
    const flashListRef = useRef(null); // Reference for FlashList

    // Get parameters
    const item = useLocalSearchParams();

    const [loaded, error] = useFonts({
        "Montserrat-Bold": require('../assets/fonts/Montserrat-Bold.ttf'),
        "Montserrat-Light": require('../assets/fonts/Montserrat-Light.ttf'),
        "Montserrat-Regular": require('../assets/fonts/Montserrat-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }

        if (error) {
            Alert.alert('Error', 'Failed to load fonts');
        }
    }, [loaded, error]);

    // Fetch chat array from the server
    useEffect(() => {
        async function fetchChatArray() {
            setLoading(true); // Show loading
            let userJson = await AsyncStorage.getItem("user");
            let user = JSON.parse(userJson);

            let response = await fetch(process.env.EXPO_PUBLIC_URL + "/Smart_Chat/LoadChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id);
            
            if (response.ok) {
                let chatArray = await response.json();
                setChatArray(chatArray);
            }
            setLoading(false); // Hide loading
        }

        fetchChatArray();
    }, []);

    const sendMessage = async () => {
        if (getChatText.length === 0) {
           
        } else {
            let userJson = await AsyncStorage.getItem("user");
            let user = JSON.parse(userJson);
            let response = await fetch(process.env.EXPO_PUBLIC_URL + "/Smart_Chat/SendChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id + "&message=" + getChatText);

            if (response.ok) {
                let json = await response.json();

                if (json.success) {
                    setChatArray((prevChatArray) => [
                        ...prevChatArray,
                        { message: getChatText, side: "right", dateTime: new Date().toLocaleString() }
                    ]);
                    setChatText(""); // Clear the input after sending

                    // Scroll to the bottom after sending a message
                    if (flashListRef.current) {
                        flashListRef.current.scrollToEnd({ animated: true });
                    }
                }
            }
        }
    };

    if (!loaded && !error) {
        return null;
    }

    return (
        <LinearGradient colors={['#00c6ff', '#0072ff']} style={styleSheets.container}>
            <StatusBar hidden={true} />

            {/* Header Section */}
            <View style={styleSheets.header}>
                <Pressable
                    onPress={() => {
                        router.replace({
                            pathname: "/home",
                            params: item
                        });
                    }}
                >
                    <FontAwesome6 name="arrow-left" size={24} color="#fff" style={{ marginRight: 10 }} />
                </Pressable>
                <View style={[styleSheets.profileWrapper, { borderColor: item.other_user_status == 1 ? "#30EE90" : "red" }]}>
                    {item.avatar_image_found == "true"
                        ? <Image
                            source={process.env.EXPO_PUBLIC_URL +`/Smart_Chat/AvatarImage/${item.other_user_mobile}.png`}
                            contentFit={"contain"}
                            style={styleSheets.profileImage}
                            onError={(error) => console.log("Image load error: ", error)}
                        />
                        : <Text style={styleSheets.profileChat}>
                            {item.other_user_avartar_settings}
                        </Text>
                    }
                </View>
                <View style={styleSheets.userDetails}>
                    <Text style={styleSheets.userName}>{item.other_user_name}</Text>
                    <Text style={[item.other_user_status == 1 ? styleSheets.userStatus : styleSheets.userStatus1]}>
                        {item.other_user_status == 1 ? "Online" : "Offline"}
                    </Text>
                </View>
            </View>

            {/* Loading Indicator */}
            {loading ? (
                <ActivityIndicator size="large" color="#fff" />
            ) : (
                <FlashList
                    ref={flashListRef} // Set reference for auto-scrolling
                    data={getChatArray}
                    renderItem={({ item }) => (
                        <View style={item.side == "right" ? styleSheets.messageWrapperOutgoing : styleSheets.messageWrapperIncoming}>
                            <Text style={styleSheets.messageText}>{item.message}</Text>
                            <View style={styleSheets.messageDetails}>
                                <Text style={styleSheets.timestamp}>{item.dateTime}</Text>
                                {item.side == "right" &&
                                    <FontAwesome6 name="check" size={16} color={item.status == 1 ? "green" : "white"} />
                                }
                            </View>
                        </View>
                    )}
                    estimatedItemSize={20000}
                    contentContainerStyle={{ paddingHorizontal: 20 }} // Only padding supported
                />
            )}

            {/* Message Input */}
            <View style={styleSheets.inputWrapper}>
                <TextInput
                    value={getChatText}
                    onChangeText={(Text) => setChatText(Text)}
                    style={styleSheets.messageInput}
                    placeholder="Type your message..."
                    placeholderTextColor="#aaa"
                />
                <Pressable style={styleSheets.sendButton} onPress={sendMessage}>
                    <FontAwesome6 name="paper-plane" size={24} color="#fff" />
                </Pressable>
            </View>
        </LinearGradient>
    );
}

const styleSheets = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: "rgba(50, 56, 59, 0.85)",
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    profileWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "white",
        borderWidth: 3,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },
    profileImage: {
        width: 55,
        height: 55,
        borderRadius: 30,
    },
    profileChat: {
        fontFamily: "Montserrat-Bold",
        fontSize: 22,
        color: "#000",
    },
    userDetails: {
        flex: 1,
        justifyContent: "center",
    },
    userName: {
        fontSize: 20,
        fontFamily: "Montserrat-Bold",
        color: "white",
    },
    userStatus: {
        fontSize: 14,
        fontFamily: "Montserrat-Regular",
        color: "#30EE90",
    },
    userStatus1: {
        fontSize: 14,
        fontFamily: "Montserrat-Regular",
        color: "red",
    },
    messageWrapperOutgoing: {
        backgroundColor: "rgba(50, 56, 59, 0.85)",
        borderRadius: 10,
        padding: 10,
        alignSelf: "flex-end",
        marginBottom: 10,
        maxWidth: "90%",
        marginTop: 20,
    },
    messageWrapperIncoming: {
        backgroundColor: "rgba(75, 66, 69, .75)",
        borderRadius: 10,
        padding: 10,
        alignSelf: "flex-start",
        marginBottom: 10,
        maxWidth: "90%",
    },
    messageText: {
        color: "white",
        fontFamily: "Montserrat-Regular",
        fontSize: 16,
    },
    messageDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
    },
    timestamp: {
        fontSize: 12,
        color: "#ddd",
    },
    inputWrapper: {
        flexDirection: "row",
        padding: 15,
        backgroundColor: "rgba(50, 56, 59, 0.85)",
        alignItems: "center",
        justifyContent: "space-between",
    },
    messageInput: {
        flex: 1,
        height: 50,
        backgroundColor: "white",
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        fontFamily: "Montserrat-Regular",
        color: "#333",
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: "#0072ff",
        borderRadius: 25,
        padding: 10,
    },
});
