import React from 'react';
import { View, Button, Image, TouchableOpacity, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import DocumentPicker, { pick, types } from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
const UploadDocumentAttach = ({ setDocument, document, width, height, localStyles, text, setError }) => {
    const handleOpenDocumentPicker = async () => {
        try {
            const result = await DocumentPicker.pick({
                mode: 'open'
            });
            const { name,type, uri } = result[0];
            const base64 = await RNFetchBlob.fs.readFile(uri.replace("file://", ""), 'base64');
            setDocument({ name: name, type:type,fileContent:base64, uri:uri });
            setError('');
            // alert(base64)
        } catch (error) {
            console.log(`Error picking document:`, error);
        }
    };
    const cancelDocument = async () => {
        setDocument({});
    }

    return (
        <View style={{
            paddingHorizontal: '6.5%', borderWidth: 1, borderStyle: 'dashed', paddingVertical:'6%', marginVertical: '2%', borderRadius: 10,
            justifyContent: document?.uri ? 'space-between' : 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff',

        }}>
            <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} onPress={handleOpenDocumentPicker}>


                <FontAwesomeIcon
                    icon={faUpload}
                    color="#343D40"
                    style={{ marginRight: '3%' }}
                    size={width * 0.06}
                />
                <View style={{ flexDirection: 'column' }}>
                    {/* <Button
                title="Attach VCC Document"
                color="#343D40"
                style={{ borderRadius: 3, }}
                onPress={handleOpenDocumentPicker}
              /> */}
                    <Text style={{ marginTop: '4%' }}>Attach {text}  </Text>
                </View>
            </TouchableOpacity>
            {document?.uri != null ? (
                <View style={localStyles.documentContainer}>
                    <Image
                        style={[document.type === 'application/pdf' ? { width: 60, height: 60 } : localStyles.imageContainer, { resizeMode: 'contain' }]}
                        source={document.type === 'application/pdf' ? require('../assets/images/PDF_file_icon.svg.png') : { uri: document.uri }}
                    />
                    <TouchableOpacity onPress={cancelDocument} style={localStyles.cancelIconButton}>
                        <FontAwesomeIcon icon={faTimes} color="red" size={15} style={{ padding: '3%', }} />
                    </TouchableOpacity>
                </View>
            ) : null}
        </View>
    );
};

export default UploadDocumentAttach;
