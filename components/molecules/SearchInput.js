import React, { useState, useRef } from 'react';
import { Platform, View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faImages } from '@fortawesome/free-regular-svg-icons';
import { faMicrophone,faMicrophoneLines } from '@fortawesome/free-solid-svg-icons';
import { strings } from '../../locals/i18n';
import I18n from 'react-native-i18n';
import VoiceRecorder from '../VoiceRecorder'; // Assuming VoiceRecorder component is correctly implemented
const SearchInput = ({complaint_message_id,scrollViewRef, width, message, placeholder = "Type Message", handleSendMessage,handleAttachPDF, handleAttachImage, handleMessageChange }) => {
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [recording, setRecording] = useState(false);
  return (
    <View style={styles.inputContainer}>
      {showVoiceRecorder ? (
        <View style={styles.voiceRecorderContainer}>
          <VoiceRecorder icon1={faMicrophone} setShowVoiceRecorder={setShowVoiceRecorder} complaint_message_id={complaint_message_id} scrollViewRef={scrollViewRef} />
        </View>
      ) : (
        <View style={styles.messageContainer}>
          <TextInput
            placeholder={strings('main.type_mesg')}
            placeholderTextColor="#707070"
            value={message}
            onChangeText={handleMessageChange}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={handleAttachImage} style={styles.microphoneButton}>
            <FontAwesomeIcon icon={faImages} color="#013188" size={width * 0.065} />
          </TouchableOpacity >
          <TouchableOpacity onPress={handleAttachPDF} style={styles.attachButton}>
            <Image source={require('../../assets/attachmentIcon.png')} style={[{height:width * 0.060,width:width * 0.060}]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
            <Image source={require('../../assets/sendicon.png')} style={[{height:width * 0.060,width:width * 0.060, transform:I18n.locale === 'ar' ? [{ rotate: '180deg' }]:[{ rotate: '0deg' }]} ]}/>
          </TouchableOpacity>
        </View>
      )}
      {recording && (
        <View style={styles.recordingIndicator}>
          <Text style={styles.timerText}>{recordTime}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: (I18n.locale === 'ar') ? 'row-reverse' : 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    backgroundColor:'#fff',
    paddingVertical:1,
    marginBottom:5
  },
  textInput: {
    textAlign: I18n.locale === 'ar' ? 'right' : 'left',
    direction: I18n.locale === 'ar' ? 'rtl' : 'ltr',
    flex: 1,
    padding:'4%',
    textAlignVertical: 'center',
  },
  sendButton: {
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    // width: width * 0.08,
    height: 24,
    resizeMode: 'contain',
  },
  attachButton: {
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  microphoneButton: {
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  recordingIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 5,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#707070',
  },
  });
export default SearchInput;