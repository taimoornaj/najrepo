import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import SoundPlayer from 'react-native-sound-player';

const { width } = Dimensions.get('window');
const NUM_BARS = 50; 
const VoiceMessage = ({ uri }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const validateUri = async (uri) => {
    try {
      const response = await fetch(uri, { method: 'HEAD' });
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
  useEffect(() => {
    const onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', () => {
      console.log('Finished playing');
      setIsPlaying(false);
      setCurrentTime(0);
    });
  

    return () => {
      SoundPlayer.stop();
      onFinishedPlayingSubscription.remove();
    };
  }, [setIsPlaying, setCurrentTime]);

  useEffect(() => {
    setLoading(true);
    let interval;
    if (isPlaying) {
      interval = setInterval(async () => {
        try {
          const info = await SoundPlayer.getInfo();
          setCurrentTime(info.currentTime);
          // console.log(info.currentTime)
        } catch (error) {
          setError(true);
          setLoading(false);
          console.log('Error getting info:', error);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, setCurrentTime]);
  

  useEffect(() => {
    const loadAudio = async () => {
      if (await validateUri(uri)) {
      setLoading(true);
      try {
        await SoundPlayer.loadUrl(uri);
        const info = await SoundPlayer.getInfo();
        setDuration(info.duration);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log('Error loading audio:', error);
      }}else{
        setError(true);
      }
    };
    loadAudio();
  }, [uri]);
  if (error) {
    return <Text>Audio failed to load</Text>;
  }

  const onStartPlay = async () => {
    setIsPlaying(true);
    try {
      console.log('Starting playback:', uri);
      await SoundPlayer.playUrl(uri);
      setIsPlaying(true);
    } catch (error) {
      console.log('Error starting playback:', error);
    }
  };
  
  const onPausePlay = async () => {
    setIsPlaying(false);
    try {
      console.log('Pausing playback');
      await SoundPlayer.pause();
      setIsPlaying(false);
    } catch (error) {
      console.log('Error pausing playback:', error);
    }
  };

  const onStopPlay = async () => {
    try {
      console.log('Stopping playback');
      await SoundPlayer.stop();
      setIsPlaying(false);
      setCurrentTime(0);
    } catch (error) {
      console.log('Error stopping playback:', error);
    }
  };

   const renderWaveform = () => {
    const progress = duration > 0 ? currentTime / duration : 0;
    return Array.from({ length: NUM_BARS }, (_, index) => {
      const active = index < NUM_BARS * progress;
      return (
        <View
          key={index}
          style={[
            styles.waveformBar,
            { backgroundColor: active ? 'lightgreen' : 'lightgray' },
          ]}
        />
      );
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  return (
    <View>
   {
  !error ? (
    !loading ? (
      <Text>Sending...</Text>
    ) : (
      <>
        <View style={styles.audioContainer}>
          <TouchableOpacity onPress={isPlaying ? onPausePlay : onStartPlay} style={[styles.controlButton, { flex: 0.1 }]}>
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size={24} color={isPlaying ? 'red' : 'gray'} />
          </TouchableOpacity>
          <View style={[styles.waveformContainer, { flex: 0.9 }]}>
            {renderWaveform()}
          </View>
        </View>
        <Text style={{ fontSize: width * 0.029, flex: 0.2 }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
      </>
    )
  ) : (
    <Text>Error: {error.message}</Text>
  )
}
     
    </View>
  );
}

const styles = StyleSheet.create({
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width:'100%',
  },
  waveformBar: {
    width: (width * 0.6) / NUM_BARS - 2, // Adjusted for container's flex and spacing
    height: 20,
    marginHorizontal: 1,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 3,
  },
  controlButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

export default VoiceMessage;
