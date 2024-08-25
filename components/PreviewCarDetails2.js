import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import Icon2 from 'react-native-vector-icons/FontAwesome';
const {width, height} = Dimensions.get('window'); 

export default (PreviewCarDetails2 = ({
  style,
  item,
  imageKey,
  onPress,
  index,
  active,
  local,
}) => {
  return (
    <TouchableOpacity activeOpacity={1}
      style={[styles.videoContainer]}
      onPress={() => onPress(item)}>
      <View style={[styles.imageContainer, styles.shadow]}>
        <Image
          style={[styles.videoPreview, active ? {margin:0} : { opacity:0.5}]}
          source={{uri: item[imageKey]}}
        />
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  videoContainer: {
    width: width-40,
    paddingVertical: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:20
  },
  videoPreview: {
    width: width-40,
    height: height*0.3,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  desc: {
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 24,
    marginTop: 18,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:20
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});