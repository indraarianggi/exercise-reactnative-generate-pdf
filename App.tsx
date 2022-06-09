/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import RNHTMLtoPDF, {
  Options as RNHTMLtoPDFOptions,
} from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

const App = () => {
  const [text, setText] = useState('');

  const isPermitted = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs access to Storage data',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        Alert.alert('Write permission error', error as string);
        return false;
      }
    } else {
      return true;
    }
  };

  const createPDF = async () => {
    try {
      if (await isPermitted()) {
        let options: RNHTMLtoPDFOptions = {
          html: '<h1 style="text-align: center;"><strong>Hello Guys</strong></h1><p style="text-align: center;">Here is an example of pdf Print in React Native</p><p style="text-align: center;"><strong>Team About React</strong></p>',
          fileName: 'test',
          directory: 'Download',
        };

        let file = await RNHTMLtoPDF.convert(options);

        /* Move file from cache to Download folder */
        if (file.filePath) {
          const destPath = `${RNFS.DownloadDirectoryPath}/test.pdf`;
          await RNFS.moveFile(file.filePath as string, destPath);

          setText(`FROM: ${file.filePath} | MOVED TO: ${destPath}`);

          Alert.alert(
            'Successfully Exported and Moved!',
            'Path: ' + destPath,
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Open', onPress: () => openFile(destPath)},
            ],
            {cancelable: true},
          );
        }
      }
    } catch (error) {
      Alert.alert('Failed to generate PDF file');
      console.log(error);
    }
  };

  const openFile = (filepath: string) => {
    FileViewer.open(filepath)
      .then(() => {
        // success
        console.log('Success Open File');
      })
      .catch(error => {
        // error
        console.log({errorOpenFile: error});
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.titleText}>
        Example to Make PDF in React Native from HTML Text
      </Text>
      <View style={styles.container}>
        <TouchableOpacity onPress={createPDF}>
          <View>
            <Image
              source={{
                uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/pdf.png',
              }}
              style={styles.imageStyle}
            />
            <Text style={styles.textStyle}>Create PDF</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.textStyle}>{text}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    fontSize: 18,
    padding: 10,
    color: 'black',
    textAlign: 'left',
  },
  imageStyle: {
    width: 150,
    height: 150,
    margin: 5,
    resizeMode: 'stretch',
  },
});

export default App;
