import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import Animation from 'lottie-react-native';
import colors from '../utils/colors';
import verylike from '../assets/images/feedbackImg/verylike.json';
import like from '../assets/images/feedbackImg/like.json';
import dislike from '../assets/images/feedbackImg/dislike.json';

const FeedbackCard = ({ question, onSelectMood, index }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const animationRefs = useRef([]);
  const [animationPlayed, setAnimationPlayed] = useState(false);

  const images = [
    { img: dislike, value: 1 },
    { img: like, value: 2},
    { img: verylike, value: 3 },
  ];

  const handleSelectMood = (value, animationIndex) => {
    setSelectedMood(value);
    onSelectMood(index, value);
    animationRefs.current.forEach((ref, idx) => {
      if (idx === animationIndex) {
        ref.play();
      } else {
        ref.reset();
      }
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // setSelectedMood(null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedMood]);

  useEffect(() => {
    if (!animationPlayed && animationRefs.current.length > 0) {
      animationRefs.current[2].play(); 
      setAnimationPlayed(true);
    }
  }, [animationPlayed]);
  return (
    <View style={[styles.container, ]}>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.imageContainer}>
        {images.map((image, idx) => (
          <Pressable key={idx} onPress={() => handleSelectMood(image.value, idx)}>
            <Animation
              ref={ref => (animationRefs.current[idx] = ref)}
              style={[styles.image, { opacity: selectedMood === image.value ? 1 : 0.8 }]}
              source={image.img}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.35,
    shadowRadius: 3.84,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1.5,
  },
  question: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width: 70,
    height: 70,
  },
});

export default FeedbackCard;