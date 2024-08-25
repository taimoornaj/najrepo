import React, { useState,useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

const ImageViewer = ({ imageUrl, imageContainer, width, multi_single }) => {
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  useEffect(() => {
        
    
    //alert(imageUrl);
}, [imageUrl]);
  const handleImagePress = () => {
    if (imageUrl) {
      setIsImageViewVisible(true);
    } else {
      alert('Image URL is not provided');
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleImagePress}>
       
        {
          !multi_single?( <Image
            style={[imageContainer, { resizeMode: 'cover', width: width * 0.4, height: width * 0.4,borderRadius:8}]}
            source={imageUrl ? { uri: 'https://cdn.nejoumaljazeera.co/upload/complaints/'+imageUrl } : require('../assets/images/fallback-complaints.jpg')}
          />):( <Image
            style={[imageContainer, { resizeMode: 'cover', width: width * 0.4, height: width * 0.4,borderRadius:8}]}
            source={imageUrl ? { uri: imageUrl } : require('../assets/images/fallback-complaints.jpg')}
          />)
        }
       
      </TouchableOpacity>
     { !multi_single?(
      <ImageViewing
        images={imageUrl ? [{ uri: 'https://cdn.nejoumaljazeera.co/upload/complaints/'+imageUrl }] : [{ uri: 'https://files.slack.com/files-tmb/TNV37SYSZ-F077B8T3883-1380500e7c/screenshot_2024-04-20-16-55-26-78_542c361b172786ecb155cfbb71eff79a_720.jpg' }]}
        imageIndex={0}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
      />):(<ImageViewing
        images={imageUrl ? [{ uri: imageUrl }] : [{ uri: 'https://files.slack.com/files-tmb/TNV37SYSZ-F077B8T3883-1380500e7c/screenshot_2024-04-20-16-55-26-78_542c361b172786ecb155cfbb71eff79a_720.jpg' }]}
        imageIndex={0}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
      />)}
    </View>
  );
};

export default ImageViewer;
