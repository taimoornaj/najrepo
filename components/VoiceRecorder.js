import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Image, FlatList,Platform } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStop, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import VoiceMessage from './voiceMessage';
import RNFetchBlob from 'rn-fetch-blob';
const { width } = Dimensions.get('window');
import {   useQuery,
  useMutation,
  useQueryClient,} from '@tanstack/react-query';
import { AuthContext } from './context';
const VoiceRecorder = ({setShowVoiceRecorder,complaint_message_id, scrollViewRef}) => {
  const [recordSecs, setRecordSecs] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [stoppedRecording, setStoppedRecording] = useState(false);
  const [audioFiles, setAudioFiles] = useState([]);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [sendingStatus, setSendingStatus] = useState(false);
  const [recordedTime, setRecordedTime] = useState('');
  // const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
  const fs = RNFetchBlob.fs;
  const currentRecordingPath = useRef('');
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  useEffect(() => {
    audioRecorderPlayer.setSubscriptionDuration(0.09);
    const recordBackListener = audioRecorderPlayer.addRecordBackListener((e) => {
      const currentPositionInSeconds = e.current_position / 1000;
      setRecordSecs(currentPositionInSeconds);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
    });

    return () => {
      audioRecorderPlayer.removeRecordBackListener(recordBackListener);
    };
  }, [audioRecorderPlayer]);

  const fetchComplaintChats = async (complaint_message_id) => {
    const response = await fetch(`https://api.nejoumaljazeera.co/api/complaintMessageChatsNoAuth?complaint_message_id=${complaint_message_id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };


  const { data: complaintChats, isLoading: isLoadingChats } = useQuery({
    queryKey: ['complaintChats', complaint_message_id],
    queryFn: () => fetchComplaintChats(complaint_message_id),
    staleTime: 4000,
    refetchInterval: 2000,
  });
  const queryClient = useQueryClient();


  const { mutate, isError, isLoading: isAdding, variables } = useMutation({
    mutationFn: (newChat) => 
      fetch('https://api.nejoumaljazeera.co/api/submitComplaintChatNoAuth2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChat),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['complaintChats', complaint_message_id]);
      setSendingStatus(false);
    },
  });

  const onStartRecord = async () => {
    try {
      if (recorded) {
        await onStopRecord();
      }
      setStoppedRecording(false);
      setRecorded(true);
      audioRecorderPlayer.removeRecordBackListener(); 
        
      audioRecorderPlayer.addRecordBackListener((e) => {
          setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      });
      const uniqueId = Date.now();
      let path = '';
      if (Platform.OS === 'ios') {
        path = `file://${RNFS.DocumentDirectoryPath}/recording_${uniqueId}.m4a`;
      } else if (Platform.OS === 'android') {
        path = `${RNFS.CachesDirectoryPath}/recording_${uniqueId}.mp4`;
      }
      if (typeof path !== 'string' || path.trim() === '') {
        throw new Error('Invalid recording path');
      }
      currentRecordingPath.current = path;

      const uri = await audioRecorderPlayer.startRecorder(path); // Pass the path to startRecorder
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setStoppedRecording(true);
      setRecorded(false);
      setRecordedTime(recordTime);
      setRecordTime('00:00:00');
      // console.log('Recording stopped:', result);
  } catch (error) {
      console.error('Failed to stop recording:', error);
  }
  };
 

  const onSend = async () => {
    try {
      setStoppedRecording(true);
      setRecorded(false);
      setRecordedTime(recordTime);

      setSendingStatus(true);
      setRecordTime('00:00:00');

      const filePath = currentRecordingPath.current;
      if (!filePath) throw new Error('No recording path found');

      const audioFilebase64 = await RNFS.readFile(filePath, 'base64');
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
    }
      const newAudioFile = {
        id: Date.now(),
        uri: filePath,
        duration: recordSecs,
        base64: audioFilebase64,
        type: 'audio/m4a',
        name: filePath,
        extension: 'm4a',
      };
      mutate({
        complaint_message_id: complaint_message_id,
        attachments:[ {
          fileContent: audioFilebase64,
          name: filePath,
          type: 'audio/m4a',
          extension: 'm4a',
        }],
        source: 1,
        attachment_status:1
      });
    
      setAudioFiles((prevFiles) => [...prevFiles, newAudioFile]);
    } catch (error) {
      console.error("Error in onSend:", error);
    } finally {
      setSendingStatus(false);
    }
  };
  

  const renderAudioItem = ({ item }) => (
    <VoiceMessage uri={item.uri} recordedDuration={item.duration} />
  );

  return (
    <>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={recorded ? onStopRecord : onStartRecord}
            style={[styles.closeButton, { paddingHorizontal: width * 0.034 }]}
          >
            <FontAwesomeIcon icon={recorded ? faStop : faMicrophone} color="red" size={width * 0.065} />
          </TouchableOpacity>
          {!sendingStatus ? (
            <Text>{!stoppedRecording ? recordTime : recordedTime}</Text>
          ) : (
            <Text>{sendingStatus ? 'Sending...' : null}</Text>
          )}
        </View>
        <View style={{ flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => setShowVoiceRecorder(false)} style={styles.closeButton}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSend} style={[styles.sendButton, { paddingHorizontal: width * 0.034 }]}>
            <Image source={require('../assets/sendicon.png')} style={{ height: width * 0.065, width: width * 0.065 }} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    paddingHorizontal: 5,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VoiceRecorder;
