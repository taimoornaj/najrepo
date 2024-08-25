import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faX, faEnvelope, faBars } from '@fortawesome/free-solid-svg-icons';
import { strings } from '../locals/i18n';
import { useNavigation } from '@react-navigation/native';

const FloatingActionButton = ({ styleType,lotnumber,width,user_id }) => {
  const navigation = useNavigation();
    const msg="Hi";
    const subject="Request For Complaint";
    const onPress = () => {
        if(lotnumber==false){
            navigation.navigate('contactCompany');
        }
       else{
        sendMsg(lotnumber)
       
       }
    };
    const formatDateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
  
    const sendMsg = (lotNo) => {
        
        var Url = 'https://api.nejoumaljazeera.co/api/submitComplaintNoAuth';
        const formData = new FormData();
        formData.append('customer_id', user_id);
        formData.append('complaint_type', 40);
        formData.append('lot_vin', lotNo);
        formData.append('subject', subject);
        formData.append('message', msg);
  
        fetch(Url, {
          method: 'POST',
          credentials: 'same-origin',
          body: formData,
        })
          .then(response => {
            if (response.ok) {
              return response;
            }
            throw Error(response.success);
          })
          .then(res => res.json())
          .then(response => {
            if (response.success) {
              // setLoader(false);
              
             
              const complaint_created_at=formatDateTime();
              getComplaintMessageId()
              .then(complaintMessageId => {
                navigation.navigate('complaintsDetailsWrapper',{'complaint_message_id': complaintMessageId, 'lot_vin':lotnumber, 'complaint_type':40,'FirstAdd':1,'complaint_created_at':complaint_created_at,'complaint_status':0});
              })
                  .catch(error => {
                    console.error('Error getting complaint message ID:', error);
                  });
    
                return;
             
    
            } else {
            
              setLoader(false);
              setMsg(strings('main.faild'));
              Alert.alert('Error', strings('main.faild'), [{ text: 'Okay' }]);
              return;
            }
          })
          .catch(error => {
            setLoader(false);
            // setMsg(strings('main.network_error'));
            // Alert.alert('Error', strings('main.network_error'), [{ text: 'Okay' }]);
          });
      };
      function getComplaintMessageId() {
        const url = 'https://api.nejoumaljazeera.co/api/complaintMessageId';
       
        const formData = new FormData();
        formData.append('customer_id', user_id);
        formData.append('lot_vin', lotnumber);
        formData.append('message', "Hi");
        formData.append('title', subject);
        return fetch(url, {
          method: 'POST',
          body: formData,
        })
          .then(response => {
           console.log(response)
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log('Success:', data);
            return data.complaint_message_id;
          })
          .catch(error => {
            console.error('Error:', error);
            throw error; // Rethrow the error to be caught by the caller
          });
      }
    
  return (
    <TouchableOpacity style={styleType=='Floating'?styles.container:styles.normalContainer} onPress={onPress}>
      <View style={[styles.button,styleType=='Floating'? styles.floatingButton:styles.normalButton]}>
        <FontAwesomeIcon
                                                    icon={ faEnvelope }
                                                    color="#fff"
                                                    size={styleType=='Floating'?width*0.06:width*0.05}
                                                />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 15,
    right: 10,
    zIndex:1111
  },
  normalContainer: {
  },
  button: {
    backgroundColor: '#013188',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    elevation: 3,
  },
  normalButton:{
    width: 40,
    height: 40,
  },
  floatingButton:{
    width: 50,
    height: 50,
  }
});

export default FloatingActionButton;