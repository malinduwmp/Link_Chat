import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function Profile() {
    const [getFirstName, setFirstName] = useState('');
    const [getDateTime,setDateTime]= useState("");
    const [lastName, setLastName] = useState('');
    const [getMobile, setMobile] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [loaded, error] = useFonts({
        "Montserrat-Bold": require('../assets/fonts/Montserrat-Bold.ttf'),
        "Montserrat-Regular": require('../assets/fonts/Montserrat-Regular.ttf'),
    });

  

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userJson = await AsyncStorage.getItem("user");
                if (userJson) {
                    const user = JSON.parse(userJson);
                    setMobile(user.mobile);
                    setFirstName(user.first_name);
                    setLastName(user.last_name);
                    setDateTime(user.registerd_date_time);
                    
                    const imageUri = `${process.env.EXPO_PUBLIC_URL}/Smart_Chat/AvatarImage/${user.mobile}.png`;
                    // Check if the image exists
                    const response = await fetch(imageUri, { method: 'HEAD' });
                    if (response.ok) {
                        setProfileImage(imageUri);
                    } else {
                        setProfileImage('');
                        
                    }
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to load user data');
            }
        };

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

    const handleSaveChanges = async () => {
        try {
            const userData = { first_name: getFirstName, last_name: lastName, mobile: getMobile, profile_image: profileImage  };
         
            await AsyncStorage.setItem("user", JSON.stringify(userData));
            Alert.alert('Success', 'Profile updated successfully!');
            toggleEditName(); // Close editing mode
        } catch (error) {
            Alert.alert('Error', 'Failed to save changes');
        }
    };

    const toggleEditName = () => {
        if (isEditingName) {
            handleSaveChanges(); // Save changes 
        }
        setIsEditingName(!isEditingName);
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            Alert.alert('Account deleted successfully');
                            router.replace('/');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete account. Please try again.');
                        }
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const renderProfileImage = () => {
        
        if (profileImage) {
            return <Image source={{ uri: profileImage }} style={styles.profileImage} />;
            
        } else {
            return (
                <View style={styles.defaultProfile}>
                    <Text style={styles.defaultName}>{getFirstName.charAt(0)}{lastName.charAt(0)}</Text>
                </View>
            );
        }
    };

    if (!loaded && !error) {
        return null;
    }

    return (
        <LinearGradient colors={['#00c6ff', '#0072ff']} style={styles.container}>
            <StatusBar hidden={true} />

            {/* Back Btn */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/home')}>
                <FontAwesome6 name="arrow-left" size={24} color="white" />
                <Text style={styles.backText}>Back to Home</Text>
            </TouchableOpacity>

            {/* Profile Info Sec*/}
            <View style={styles.profileHeader}>
                {renderProfileImage()}
                <View style={styles.nameInputContainer}>
                    {isEditingName ? (
                        <>
                            <TextInput
                                value={getFirstName}
                                onChangeText={setFirstName}
                                style={styles.textInput}
                                placeholder="First Name"
                            />
                            <TextInput
                                value={lastName}
                                onChangeText={setLastName}
                                style={styles.textInput}
                                placeholder="Last Name"
                            />
                        </>
                    ) : (
                        <>
                            <Text style={styles.userName}>{getFirstName} {lastName}</Text>
                        </>
                    )}

                    <TouchableOpacity style={styles.editButton} onPress={toggleEditName}>
                        <FontAwesome6
                            name={isEditingName ? "save" : "pen-to-square"}
                            size={20}
                            color="white"
                            style={styles.editIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Mobile Number - Uneditable */}
            <View style={styles.profileField}>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                    value={getMobile}
                    style={styles.textInput}
                    editable={false}  // Mobile numbe is uneditable
                />
                 <Text style={styles.label}>Joined Date </Text>
                 <TextInput
                    value={getDateTime}
                    style={styles.textInput}
                    editable={false}  // Mobile numbe is uneditable
                />
            </View>

            {/* Action Buttons */}
            <View style={styles.profileActions}>
                <TouchableOpacity style={[styles.button, styles.redButton]} onPress={handleDeleteAccount}>
                    <Text style={styles.buttonText}>Delete Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.redButton]}
                    onPress={async () => {
                        try {
                            await AsyncStorage.clear();
                            router.replace('/');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    }}
                >
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 40,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderColor: 'white',
        borderWidth: 3,
    },
    defaultProfile: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 3,
    },
    defaultName: {
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        color: 'white',
    },
    nameInputContainer: {
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    userName: {
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        color: 'white',
        marginRight: 10,
    },
    editButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    editIcon: {
        marginRight: 0,
    },
    profileField: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Montserrat-Regular',
        marginBottom: 5,
    },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 10,
        borderRadius: 8,
        color: 'white',
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
    },
    profileActions: {
        marginVertical: 20,
        width: '100%',
    },
    button: {
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        alignItems: 'center',
    },
    redButton: {
        backgroundColor: 'rgba(255, 0, 0, 0.6)',
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: 'white',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: 40,
        left: 20,
    },
    backText: {
        color: 'white',
        fontSize: 18,
        marginLeft: 5,
    },
});
