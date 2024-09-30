import { View, StyleSheet, TextInput, Text, Pressable, Alert, ScrollView } from "react-native";
import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';

SplashScreen.preventAutoHideAsync();

export default function App() {

  const [getImage, setImage] = useState(null);
  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");

  // Load fonts
  const [loaded, error] = useFonts({
    "Montserrat-Bold": require('./assets/fonts/Montserrat-Bold.ttf'),
    "Montserrat-Light": require('./assets/fonts/Montserrat-Light.ttf'),
    "Montserrat-Regular": require('./assets/fonts/Montserrat-Regular.ttf'),
  });

  const logoPath = require("./assets/images/Green blue chat cloud logo.png");
  const defaultUserIcon = require("./assets/images/Outline user icon.png");

  useEffect(() => {
    // Request permission for ImagePicker
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
      }
    })();

    // Handle SplashScreen hiding after fonts are loaded
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

  return (
    <LinearGradient
      colors={['#00c6ff', '#0072ff']}
      style={styleSheets.view1}
    >
      <ScrollView style={styleSheets.scroll}>

        <Image source={logoPath}
          style={styleSheets.logo} contentFit="contain" />

        <Text style={styleSheets.text1}>Hello! Welcome To Smart Chat</Text>
        <Text style={styleSheets.text2}>Create Account</Text>

        {/* Profile image picker */}
        <Pressable onPress={async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });

          if (!result.cancelled) {
            setImage(result.assets[0]?.uri || result.uri);
          }
        }}>
          <Image
            source={getImage ? { uri: getImage } : defaultUserIcon} // If no image, show default
            style={styleSheets.profilepik}
            contentFit="contain"
          />
        </Pressable>

        <Text style={styleSheets.text3}>Mobile</Text>
        <TextInput style={styleSheets.input1} inputMode="tel"
          placeholder="Enter Your Mobile" maxLength={10} onChangeText={setMobile} />

        <Text style={styleSheets.text3}>First Name</Text>
        <TextInput style={styleSheets.input1} inputMode="text"
          placeholder="Enter Your First Name" onChangeText={setFirstName} />

        <Text style={styleSheets.text3}>Last Name</Text>
        <TextInput style={styleSheets.input1} inputMode="text"
          placeholder="Enter Your Last Name" onChangeText={setLastName} />

        <Text style={styleSheets.text3}>Password</Text>
        <TextInput style={styleSheets.input1} inputMode="text" secureTextEntry={true}
          placeholder="Enter Your Password" maxLength={20} onChangeText={setPassword} />

        <Pressable style={styleSheets.button1}
          onPress={async () => {
            try {
              let response = await fetch(
                "https://4470-43-252-15-79.ngrok-free.app/Smart_Chat/SignUp", // Use your IP address here
                {
                  method: "POST",
                  body: JSON.stringify({
                    mobile: getMobile,
                    firstName: getFirstName,
                    lastName: getLastName,
                    password: getPassword,
                  }),
                  headers: {
                    "Content-Type": "application/json"
                  }
                }
              );

              if (response.ok) {
                let json = await response.json();
                Alert.alert("Smart Chat Server", json.message);
              } else {
                Alert.alert("Error", "Failed to create account. Please try again.");
              }
            } catch (error) {
              Alert.alert("Error", "Network error. Please check your connection.");
            }
          }}
        >
          <View style={styleSheets.buttonContent}>
            <FontAwesome6 name="right-to-bracket" size={18} color={"white"} />
            <Text style={styleSheets.buttonText}>Create Account</Text>
          </View>
        </Pressable>

        <Pressable style={styleSheets.button2} onPress={() => Alert.alert("Smart Chat", "Sign In")}>
          <View style={styleSheets.buttonContent1}>
            <Text style={styleSheets.buttonText1}>Already Registered? Go to Sign In</Text>
          </View>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const styleSheets = StyleSheet.create({
  scroll: {
    flex: 1,
    paddingHorizontal: 6,
  },
  logo: {
    alignSelf: "center",
    height: 120,
    width: "40%",
    marginTop: 70,
    marginBottom: 30,
  },
  view1: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  text1: {
    fontSize: 32,
    fontFamily: "Montserrat-Bold",
  },
  text2: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    marginBottom: 10,
  },
  profilepik: {
    alignSelf: "center",
    height: 100,
    width: 100,
    borderRadius: 50, // Circular image
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 10,
  },
  text3: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
  },
  input1: {
    width: "100%",
    height: 50,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#3b5998",
    fontSize: 16,
    paddingStart: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  button1: {
    backgroundColor: "red",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10, // space between icon and text
  },
  button2: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonContent1: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText1: {
    color: "darkblue",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10, // space between icon and text
  },
});
