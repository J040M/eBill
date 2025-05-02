import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';

export default function Settings() {
    const { t } = useTranslation()
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
            showAlert(t('alerts.api.missing_url'));
            return;
        }

        storeSettings('apiUrl', url);

        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${url}/ping`, true);
        xhr.onload = () => {
            if (xhr.status === 200) {
                showAlert(t('alerts.api.success'));
                storeSettings('apiUrl', url);
            } else {
                console.error('API connection failed:', xhr.statusText);
                showAlert(t('alerts.api.fail'));
            }
        };
        xhr.onerror = () => {
            console.error('Network error while testing API connection');
            showAlert(t('alerts.network.fail'));
        };
        xhr.send();
    };

    const showAlert = (message: string): void => {
        Alert.alert('Alert', message, [{ text: 'OK' }]);
    };

    return (
        <View style={styles.centeredContainer}>
            <TextInput
                placeholder={t('settings.inputs.placeholder.api_url')}
                value={apiUrl}
                onChangeText={(text) => setApiUrl(text)}
                style={styles.input}
            />
            <Button
                title={t('settings.actions.save_api_url')}
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
