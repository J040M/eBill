import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useClient } from './lib/clientContext';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [uri, setUri] = useState<string>("");
  const cameraRef = useRef<CameraView>(null);
  const client = useClient();

  if (!permission) {
    return <View />;
  } else if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{t('camera.actions.request_permission')}</Text>
        <Button onPress={requestPermission} title={t('camera.actions.request_permission')} />
      </View>
    );
  }

  const renderCamera = () => {
    return (
      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>{t('camera.actions.take_picture')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={router.back}>
            <Text style={styles.text}>{t('camera.actions.close_camera')}</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    )
  }

  const renderPicture = () => {
    return (
      <View>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={{ width: 400, aspectRatio: 1 }}
        />
        <Button onPress={() => setUri("")} title={t('camera.actions.retake_picture')} />
        <Button onPress={() => client.ebill.uploadPicture(uri!)} title={t('camera.actions.upload_picture')} />
      </View>
    );
  };

  const takePicture = async () => {
    if (!cameraRef.current) {
      console.error('Camera ref is not set');
      return;
    };

    const picture = await cameraRef.current.takePictureAsync({
      quality: 1,
      base64: false,
      skipProcessing: true,
      imageType: 'jpg',
    });

    if (picture) setUri(picture.uri);
    else console.error('Error taking picture: No picture returned');
  }

  return (
    <View style={styles.container}>
      {uri ? renderPicture() : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  closedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 18,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
