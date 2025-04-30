import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function Settings() {
    const [apiUrl, setApiUrl] = useState<string>('');

    useEffect(() => {
        const fetchSettings = async () => {
            const savedApiUrl = await getSettings('apiUrl');
            if (savedApiUrl) {
                setApiUrl(savedApiUrl);
            }
        };

        fetchSettings();
    }, []);

    const storeSettings = async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    const getSettings = async (key: string): Promise<string | null> => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value;
        } catch (error) {
            console.error('Error retrieving settings:', error);
        }
        return null;
    };

    const testApiConnection = async (url: string): Promise<void> => {
        if (!url) {
            showAlert('Please enter a valid URL.');
            return;
        }

        storeSettings('apiUrl', url);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${url}/ping`, true);
        xhr.onload = () => {
            if (xhr.status === 200) {
                showAlert('API connection successful!');
                storeSettings('apiUrl', url);
            } else {
                console.error('API connection failed:', xhr.statusText);
                showAlert('API connection failed. Please check the URL.');
            }
        };
        xhr.onerror = () => {
            console.error('Network error while testing API connection');
            showAlert('Network error occurred.');
        };
        xhr.send();
    };

    const showAlert = (message: string): void => {
        Alert.alert('Alert', message, [{ text: 'OK' }]);
    };

    return (
        <View style={styles.centeredContainer}>
            <TextInput
                placeholder="API URL"
                value={apiUrl}
                onChangeText={(text) => setApiUrl(text)}
                style={styles.input}
            />
            <Button
                title="Save"
                onPress={() => testApiConnection(apiUrl)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        width: '100%',
        borderRadius: 5,
    },
});
