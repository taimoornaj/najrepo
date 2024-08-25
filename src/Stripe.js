import { View, Text } from 'react-native'
import React from 'react'
//import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentScreen from '../components/molecules/PaymentScreen';
import addServiceRequest from './addServiceRequest';

const Stripe = ({service_amount}) => {
  return (
    <StripeProvider
      publishableKey="pk_test_51P8gMyAfUavBNiHqAYqjVd8fD3fdYxE1nH78cYAVZarVwGS4d5BZd5gQ3N4CGJpC2Osbh8RyWxm6leZJ3eDVdiUN00NC3uCQ3i"
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.{{Nejoum_AlJazeera}}"
    >
     
   <PaymentScreen service_amount={service_amount}  />
    {/* <addServiceRequest/> */}
    {/* <AddDamageRequest */}
    </StripeProvider>
  )
}

export default Stripe