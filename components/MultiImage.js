import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import ImageView from 'react-native-image-viewing';



const MultiImage = ({ images, width, images_length }) => {
    const [visible, setIsVisible] = useState(false);
    const [displayLength, setDisplayLength] = useState(images_length);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setDisplayLength(images_length);
    }, [images_length]);
    const renderImage = (uri) => {
        setSelectedImage([{ uri }]);
        setIsVisible(true);
    };


    const FooterComponent = () => (
        <View style={{ paddingBottom: '5%', alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>{`${currentIndex + 1} / ${images.length}`}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {images_length > 0 && (
                <>
                    {
                        images_length <= 4 && (

                            <View style={styles.imageWrapper}>

                                {images_length === 2 && (
                                    <>
                                        <TouchableOpacity onPress={() => renderImage(images[0].file_path)} style={[styles.image, { width: '47.5%' }]}>
                                            <Image source={{ uri: images[0].file_path }} style={[styles.image, { width: '100%', height: width * 0.3 }]} /></TouchableOpacity>
                                        <TouchableOpacity onPress={() => renderImage(images[1].file_path)} style={[styles.image, { width: '47.5%' }]}>
                                            <Image source={{ uri: images[1].file_path }} style={[styles.image, { width: '100%', height: width * 0.3 }]} /></TouchableOpacity>
                                    </>
                                )}
                                {images_length === 3 && (
                                    <>
                                        <TouchableOpacity onPress={() => renderImage(images[0].file_path)} style={[styles.image, { width: '47.5%' }]}>
                                            <Image source={{ uri: images[0].file_path }} style={[styles.image, { width: '100%', height: width * 0.24 }]} /></TouchableOpacity>
                                        <TouchableOpacity onPress={() => renderImage(images[1].file_path)} style={[styles.image, { width: '47.5%' }]}>
                                            <Image source={{ uri: images[1].file_path }} style={[styles.image, { width: '100%', height: width * 0.24 }]} /></TouchableOpacity>
                                        <TouchableOpacity onPress={() => renderImage(images[2].file_path)} style={[styles.image, { width: '98%' }]}>
                                            <Image source={{ uri: images[2].file_path }} style={[styles.image, { width: '100%', height: width * 0.24 }]} /></TouchableOpacity>
                                    </>
                                )}
                                {images_length == 4 && (
                                    <>
                                        <TouchableOpacity onPress={() => renderImage(images[0].file_path)} style={[styles.image, { width: '47.5%' }]}>
                                            <Image source={{ uri: images[0].file_path }} style={[styles.image, { width: '100%', height: width * 0.255, }]} /></TouchableOpacity>
                                        <TouchableOpacity onPress={() => renderImage(images[1].file_path)} style={[styles.image, { width: '47.5%' }]}>
                                            <Image source={{ uri: images[1].file_path }} style={[styles.image, { width: '100%', height: width * 0.255, }]} /></TouchableOpacity>
                                        <TouchableOpacity onPress={() => renderImage(images[2].file_path)} style={[styles.image, { width: '47.5%' }]}>
                                            <Image source={{ uri: images[2].file_path }} style={[styles.image, { width: '100%', height: width * 0.255, }]} /></TouchableOpacity>
                                        <TouchableOpacity onPress={() => renderImage(images[3].file_path)} style={[styles.image, { width: '47.5%' }]}>
                                            <Image source={{ uri: images[3].file_path }} style={[styles.image, { width: '100%', height: width * 0.255, }]} /></TouchableOpacity>
                                    </>
                                )}

                                {selectedImage && (
                                    <ImageView
                                        images={selectedImage}
                                        imageIndex={0}
                                        visible={visible}
                                        onRequestClose={() => setIsVisible(false)}
                                    />
                                )}
                            </View>

                        )
                    }

                    {images_length > 4 && (<TouchableOpacity onPress={() => setIsVisible(true)}>
                        <View style={styles.imageWrapper}>

                            {images_length > 4 && (
                                <>
                                    <Image source={{ uri: images[0].file_path }} style={[styles.image, { width: '47.5%', height: width *0.255, }]} />
                                    <Image source={{ uri: images[1].file_path }} style={[styles.image, { width: '47.5%', height: width *0.255, }]} />
                                    <Image source={{ uri: images[2].file_path }} style={[styles.image, { width: '47.5%', height: width *0.255, }]} />
                                    <Image source={{ uri: images[3].file_path }} style={[styles.image, { width: '47.5%', height: width *0.255, }]} />
                                </>
                            )}

                            {images_length > 1 && displayLength != 0 && (
                                <View style={styles.overlay}>
                                    <Text style={[styles.countText, { fontSize: width * 0.065, }]}>{`+${displayLength - 4}`}</Text>
                                </View>
                            )}
                            
                            <ImageView
                                // FooterComponent={FooterComponent}
                                images={images.map(img => ({ uri: img.file_path }))}
                                imageIndex={currentIndex}
                                visible={visible}
                                onRequestClose={() => setIsVisible(false)}
                                // onImageIndexChange={(index) => setCurrentIndex(index)}
                            />
                        </View>
                    </TouchableOpacity>)}



                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
        // margin:1,
        padding:0,
        // backgroundColor: '#f2f2f2',
        justifyContent:'space-evenly',
    },
    imageWrapper: {
        position: 'relative',
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        padding:0,
        justifyContent:'space-evenly',
    },
    image: {
        borderRadius: 8,
        margin: 1.2,
        // elevation:2,
        borderColor:'rgba(0,0,0,1)',
        borderWidth:0.3,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 0.2,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 8,
        flex: 1,
        height: '100%',
        width: '98%',
    },
    countText: {
        color: 'white',
        fontWeight: 'bold',
        position: 'absolute',
        bottom: 10,
        right: 15,
    },
});

export default MultiImage;
