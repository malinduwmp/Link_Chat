import { View, StyleSheet, TextInput, Text, Pressable, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function SignUp() {
  const [loaded, error] = useFonts({
    "Montserrat-Bold": require('../assets/fonts/Montserrat-Bold.ttf'),
    "Montserrat-Light": require('../assets/fonts/Montserrat-Light.ttf'),
    "Montserrat-Regular": require('../assets/fonts/Montserrat-Regular.ttf'),
  });

  const logoPath = require("../assets/images/14.png");
  const defaultUserIcon = require("../assets/images/Outline user icon.png");

  const [getImage, setImage] = useState(null);
  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
      }
    })();

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

    
    <LinearGradient colors={['#00c6ff', '#0072ff']} style={styleSheets.view1}>
      <StatusBar hidden={true}/>
      <ScrollView style={styleSheets.scroll}>
        <Image source={logoPath} style={styleSheets.logo} contentFit="contain" />
        <Text style={styleSheets.text1}>Hello! Welcome To Chat Link</Text>
        <Text style={styleSheets.text2}>Create Account</Text>

        {/* Profile image picker */}
        <Pressable onPress={async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });

          if (!result.canceled) {
            setImage(result.assets[0]?.uri || result.uri);
          }
        }}>
          <View style={styleSheets.profileContainer}>
            <Image
              source={getImage ? { uri: getImage } : defaultUserIcon}
              style={styleSheets.profilepik}
              contentFit="contain"
            />
            <FontAwesome name="plus-circle" size={24} color="white" style={styleSheets.plusIcon} />
          </View>
        </Pressable>

        <Text style={styleSheets.text3}>Mobile</Text>
        <TextInput
          style={styleSheets.input1}
          inputMode="tel"
          placeholder="Enter Your Mobile"
          maxLength={10}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />

        <Text style={styleSheets.text3}>First Name</Text>
        <TextInput
          style={styleSheets.input1}
          inputMode="text"
          placeholder="Enter Your First Name"
          onChangeText={setFirstName}
        />

        <Text style={styleSheets.text3}>Last Name</Text>
        <TextInput
          style={styleSheets.input1}
          inputMode="text"
          placeholder="Enter Your Last Name"
          onChangeText={setLastName}
        />

        {/* Password Input */}
        <Text style={styleSheets.text3}>Password</Text>
        <View style={styleSheets.passwordContainer}>
          <TextInput
            style={styleSheets.input1}
            inputMode="text"
            secureTextEntry={!showPassword}
            placeholder="Enter Your Password"
            maxLength={20}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styleSheets.iconContainer}>
            <FontAwesome5
              name={showPassword ? "eye-slash" : "eye"}
              size={20}
              color="#333"
            />
          </TouchableOpacity>
        </View>

        <Pressable
          style={styleSheets.button1}
          onPress={async () => {
            setLoading(true); // Show loading indicator
            let formData = new FormData();
            formData.append("mobile", getMobile);
            formData.append("firstName", getFirstName);
            formData.append("lastName", getLastName);
            formData.append("password", getPassword);

            if (getImage != null) {
              formData.append("avertarImage", {
                name: `avertarImage.png`,
                uri: getImage,
                type: "image/png",
              });
            }

            let response = await fetch(process.env.EXPO_PUBLIC_URL+"/Smart_Chat/SignUp", {
              method: "POST",
              body: formData,
            });

            setLoading(false); // Hide loading indicator

            if (response.ok) {
              let json = await response.json();
              if (json.success) {
                Alert.alert("Success", json.message);
                router.push("/");
              } else {
                Alert.alert("Error", json.message || "Failed to create account");
              }
            }
          }}
        >
          <View style={styleSheets.buttonContent}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <FontAwesome6 name="right-to-bracket" size={18} color={"white"} />
                <Text style={styleSheets.buttonText}>Create Account</Text>
              </>
            )}
          </View>
        </Pressable>

        <Pressable style={styleSheets.button2} onPress={() => { router.replace("/"); }}>
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
    width: "60%",
    marginTop: 10,
    marginBottom: 10,
  },
  view1: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  text1: {
    fontSize: 32,
    fontFamily: "Montserrat-Bold",
    textAlign: 'center',
    color: '#fff',
    marginBottom: 10,
  },
  text2: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
  },
  profileContainer: {
    alignSelf: "center",
    position: 'relative',
  },
  profilepik: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    marginTop: 10,
    marginBottom: 10,
  },
  plusIcon: {
    position: 'absolute',
    bottom: 5,
    right: -5,
  },
  text3: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: '#fff',
  },
  input1: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#fff",
    fontSize: 16,
    paddingStart: 40, // Increased padding for icons
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 20,
    color: "#333",
  },
  button1: {
    backgroundColor: "#ff5f6d",
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
  button2: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    marginLeft: 'auto',
    padding: 10,
  },
  buttonContent1: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText1: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
 