import React, { useRef, useState, useEffect } from 'react';
import { Text, ScrollView, Modal, View, Dimensions, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Animated } from 'react-native';
import FeedbackCard from './FeedbackCard';
import colors from '../utils/colors';
import { useTailwind } from 'tailwind-rn';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Feedback = React.forwardRef(({ showFeedbackModal, toggleFeedbackModal,customer_id }, ref) => {
  const [selectedMoods, setSelectedMoods] = useState(['', '']);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const tailwind = useTailwind();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(height)).current;
  const handleModalAnimation = () => {
    // alert("Called modal animation handleModalAnimation")
    setIsLoading(true); // Always show loader when modal is opened
    const timer = setTimeout(() => {
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1000, // Adjust duration for smoother animation
        useNativeDriver: true,
      }).start();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // Adjust duration for smoother animation
        useNativeDriver: true,
      }).start();
    }, 1000); // 10 seconds timeout

    return () => clearTimeout(timer);
  };
  const handleToggleFeedbackModal = () => {
    handleFeedbackSubmit();
    Animated.timing(slideUpAnim, {
      toValue: 0, // Target value
      duration: 300, // Duration of the animation in milliseconds
      useNativeDriver: true, // Use native driver for better performance
    }).start(() => {
      // After animation completes, call the function to toggle the modal
      toggleFeedbackModal();
    });
  };
  useEffect(() => {
    handleModalAnimation();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsVisibleModal(true);
    }, 3000); 
    return () => clearTimeout(timer);
  }, []);

  React.useImperativeHandle(ref, () => ({
    open: () => {
      setIsLoading(true);
      setIsVisibleModal(true);
      
    },
    close: () => {
      setIsLoading(false);
      setIsVisibleModal(false);
      this.state.showFeedbackModal
    },
  }));

  const texts = [
    "How was your experience with service?",
    "How satisfied are you with the overall experience while availing the service?",
  ];

  const handleSelectMood = (index, value) => {
    const newSelectedMoods = [...selectedMoods];
    newSelectedMoods[index] = value;
    setSelectedMoods(newSelectedMoods);
  };

  
  const handleFeedbackSubmit = async () => {
    const data = {
      request_id: 20,
      service_experience: selectedMoods[0],
      overall_experience: selectedMoods[1],
    };
    try {
      const response = await fetch('https://api.nejoumaljazeera.co/api/saveAppFeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      console.log('Feedback submitted successfully:', responseData);
      // Handle success response
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      // Handle error
    }
  };
  


  return (
    <View style={{}}>
      {/* loader component */}
      <Modal
        visible={isLoading}
        transparent={true}
        animationType="slide" // Slide animation from the bottom
      >
        <View style={styles.modalContainer}>

          <View style={styles.loadingContainer}>
            {true && (
              <ActivityIndicator size={width*0.07} color={colors.primary} />
            )}
          </View>
        </View>

      </Modal>
      <Modal
        visible={isVisibleModal}
        transparent={true}
        animationType="slide" // Slide animation from the bottom
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.contentContainer, { transform: [{ translateY: slideUpAnim }], opacity: fadeAnim }]}>
            <View style={styles.closeButtonContainer}>
              <Image
                source={require('../assets/images/logo-blue.png')}
                style={{ width: 40, height: 40, marginRight: 5 }}
                resizeMode="contain"
              />
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#013188', fontWeight: 'bold', textTransform: 'uppercase' }}>NEJOUM </Text>
                <Text style={{ color: '#013188' }}> ALJAZEERA{ showFeedbackModal}</Text>
              </View>
            </View>
            <ScrollView style={styles.scrollView}>


              {texts.map((text, index) => (
                <FeedbackCard bgColor={index === 0 ? colors.primaryAlpha(0.05) : undefined} key={index} question={text} onSelectMood={handleSelectMood} index={index} />
              ))}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleToggleFeedbackModal}
              >
                <Text style={styles.submitButtonText} >Submit</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

    </View>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'flex-end', // Align content to the bottom
  },
  contentContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: '7%',
    width: '100%',
    // borderTopColor:'red', 
    // borderTopWidth:5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  closeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    padding: 0

  },
  closeButton: {
    paddingVertical: 10,
    paddingRight: 10,
  },
  scrollView: {
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: colors.primary,
    color: '#fff',
    marginVertical: 7,
    marginHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 50,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loadingContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    zIndex: 1,
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: '7%',
    width: '100%',
  },
});

export default Feedback;