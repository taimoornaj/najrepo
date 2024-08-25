//import {useStripe} from '@stripe/stripe-react-native';
import React, {useEffect, useState} from 'react';
import {Text,TouchableOpacity,Dimensions} from 'react-native';
import { AuthContext } from '../../components/context';

const PaymentScreen = ({navigation,service_amount, onClick = () => {}, validInput,saveDataintoDB=()=>{},showFeedbackModal,setShowFeedbackModal,toggleFeedbackModal}) => {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);
  const { width, height } = Dimensions.get('window');

  const fetchPaymentSheetParams = async () => {
    if (!service_amount) {
      return;
    }
    try {
      const response = await fetch('https://api.nejoumaljazeera.co/api/payment_sheet_laravel', {
        method: 'POST',
        body: JSON.stringify({amount: service_amount, currency: 'aed'}),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch payment sheet parameters');
      }
      const data = await response.json();
      if (!data || !data.paymentIntent || !data.ephemeralKey || !data.customer) {
        throw new Error('Invalid payment sheet parameters received');
      }
      return data;
    } catch (error) {
      console.error("Error fetching payment sheet parameters:", error);
      throw error;
    }
  };

  const initializePaymentSheet = async () => {
    
    try {
      const {paymentIntent, ephemeralKey, customer, publishableKey} =
        await fetchPaymentSheetParams();

      const {error} = await initPaymentSheet({
        merchantDisplayName: 'Nejoum AlJazeera',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'James Bula',
        },
      });
      if (error) {
        throw new Error('Failed to initialize payment sheet');
      }
      setLoading(true);
    } catch (error) {
      console.error("Error initializing payment sheet:", error);   
    }
  };

  const openPaymentSheet = async () => {
    try {
        const value = onClick();
        if (!value){
            return ;
          }
          // console.log(value, "this is value returning")
          // if(!validInput){
          //     return 
          //   }
          
      const {error} = await presentPaymentSheet();
      if (error) {
        throw new Error(`Payment sheet error: ${error.message}`);
      } else {
        saveDataintoDB();
        // Alert.alert('Success', 'Your order is confirmed!');
       await toggleFeedbackModal()
        // setShowFeedbackModal(true);
       
      }
    } catch (error) {
      console.error("Error opening payment sheet:", error);
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, [service_amount]);

  return (
    <>
          <TouchableOpacity
            onPress={openPaymentSheet}
            style={{ backgroundColor: '#fff', margin: '2%', borderRadius: 5, justifyContent: 'center' }}>
            <Text style={{ color:'#0B9A21', padding: '2%', paddingHorizontal:'3.5%', fontSize: width * 0.04, fontWeight: "500" }}>
            Proceed to Payment{}
            </Text>
          </TouchableOpacity>
     </>
  );
};

export default PaymentScreen;