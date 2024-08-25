import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';

const VideoPlayer = ({ source }) => {
  return (
    <View style={styles.container}>
      <Video
        source={{uri:source}}
        style={styles.video}
        resizeMode="contain"
        controls
        paused={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: 300,
  },
});

export default VideoPlayer;
