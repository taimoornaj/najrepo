import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Alert,
  Dimensions,
  Platform,
  TouchableOpacity,
  Linking
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { readFile } from 'react-native-fs';
import * as Animatable from 'react-native-animatable';
import { strings } from '../locals/i18n';
import { AuthContext } from '../components/context';
import AppHeader from '../components/AppHeader';
import Loader from '../components/Loader.js';
import commonStyle from '../assets/style/styles.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import SearchInput from '../components/molecules/SearchInput.js';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import DocumentPicker from 'react-native-document-picker';
import ImageViewer from '../components/ImageViewer.js';
import VoiceMessage from '../components/voiceMessage';
import ImagePicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRoute } from '@react-navigation/native';
import Timer from '../components/Timer.js';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import MultiImage from '../components/MultiImage.js';
import I18n from 'react-native-i18n';

const { width, height } = Dimensions.get('window');
const radius = height * 0.3 / 2; // 0.35
const center = radius - 15;
const circlesmalsize = height * 0.09;
import * as Localize from 'react-native-localize';

const ComplaintsDetails = ({ navigation, route }) => {
  const [loader, setLoader] = useState(false);
  const [post_page, setPostPage] = useState(0);
  const [load_more, setLoadMore] = useState(false);
  const [startChatTime, setStartChatTime] = useState(null);
  const scrollViewRef = React.useRef(null);
  const [message, setMessage] = useState('');
  const { lot_vin, complaint_type, complaint_message_id, FirstAdd,complaint_created_at,complaint_status  } = route.params;
  const name  = AuthContext.name;
  const name_char = name.charAt(0);

  const queryClient = useQueryClient();

  const fetchComplaintDetails = async (complaint_message_id) => {
    const response = await fetch(`https://api.nejoumaljazeera.co/api/complaintMessageDetailsNoAuth?complaint_message_id=${complaint_message_id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const fetchComplaintChats = async (complaint_message_id) => {
    const response = await fetch(`https://api.nejoumaljazeera.co/api/complaintMessageChatsNoAuth2?complaint_message_id=${complaint_message_id}`);
    if (!response.ok) {

      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data: complaintDetails, isLoading: isLoadingDetails, isError: isErrorDetails, error: errorDetails } = useQuery(
    ['complaintDetails', complaint_message_id],
    () => fetchComplaintDetails(complaint_message_id),
    {
      onSuccess: (data) => {
        const responseData = data.data;
        if (responseData && responseData.length > 0) {
          setStartChatTime(responseData[0].create_date);
        }
      },
    }
  );

  let initialMessage="";
  if(I18n.locale=='ar' ){
    initialMessage = [
     { id: 0, message: 'Hi ' + name + ", "+strings('main.joined_liveChat')},
     { id: 1, message: `${strings('main.glad')} ${name}, ${strings('main.glad_msg')}# ${lot_vin ? lot_vin : lot_vin}. ${strings('main.glad_msg2')} `}
   ];
  }else{
    initialMessage = [
      { id: 0, message: 'Hi ' + name + ", joined Nejoum Aljazeera Live Chat" },
      { id: 1, message: `${strings('main.glad')} ${name}, ${strings('main.glad_msg')}# ${lot_vin ? lot_vin : lot_vin}. ${strings('main.glad_msg2')} `}
    ];
  }

  const { data: complaintChats, isPending: isLoadingChats } = useQuery({
    queryKey: ['complaintChats', complaint_message_id],
    queryFn: () => fetchComplaintChats(complaint_message_id),
    staleTime: 4000,
    refetchInterval: 2000, 
  });

  const { mutate, isError, isPending: isAdding, variables } = useMutation({
    mutationFn: (newChat) => 
    fetch('https://api.nejoumaljazeera.co/api/submitComplaintChatNoAuth2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChat),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryFn:['complaintChats', complaint_message_id]});
    },
  });
  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, []);
  useEffect(() => {

   
    navigation.setOptions({
      header: () => (
        <View style={commonStyle.header}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: height * 0.05,
            flex: 1
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 0.2,
              justifyContent: 'flex-start',
              alignItems: 'flex-start'
            }}>
              <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('complaints',{filter: complaint_status })}>
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  flexDirection: 'row'
                }}>
                  <View>
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      color="#fff"
                      size={width * 0.06}
                    />
                  </View>
                  <Text style={commonStyle.headerText}>{strings('main.back')}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              flex: 0.9
            }}>
              <Text style={commonStyle.headerText}>{route.params.title}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 0.2 }}>
              <Text style={commonStyle.headerText}></Text>
            </View>
          </View>
        </View>
        ),
    });
    if (route.params.FirstAdd && route.params.FirstAdd !== undefined) {
      setStartChatTime(complaint_created_at);
    }
  }, [route.params.FirstAdd]);
  
  const handleSendMessage = () => {
    if (!message) {
      Alert.alert('Error', strings('main.fill_all_data'), [{ text: 'Okay' }]);
      return;
    }

    mutate({
      complaint_message_id: complaint_message_id,
      message: message,
      source: 1,
    });

    setMessage('');
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };
  const readFileAsBase64 = async (filePath) => {
    try {
      const fileContent = await RNFS.readFile(filePath, 'base64');
      // console.log('File content in base64:', fileContent);
      return fileContent;
    } catch (error) {
      console.error('Error reading file:', error);
      throw error; // Re-throw the error for further handling if needed
    }
  };

  const getExtention = mime => {
    switch (mime) {
      case 'application/pdf':
        return '.pdf';
      case 'image/jpeg':
        return '.jpg';
      case 'image/jpg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'image/heif':
          return '.heif';
      case 'image/heic':
          return '.heic';
      default:
        return null;
    }
  };
  
      const handleAttachImage = async () => {
        try {
          const results = await ImagePicker.openPicker({
            maximumImagesCount: 10,
            multiple: true,
            mediaType: 'photo', // You can also pick videos by changing this to 'video'
          });
        const images = [];
       
          for (const result of results) {
            const { filename, type, path } = result;
            const extension = filename.split('.').pop();
            const path2 = path.replace("file://", ""); // Adjust path if necessary based on how 'uri' is formatted
            const base64 = await RNFetchBlob.fs.readFile(path2, 'base64');
            images.push({
              fileContent: base64,
              type: type,
              name: filename,
              extension: extension,
            });
          }
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
    
          mutate({
            complaint_message_id: complaint_message_id,
            attachments:images,
            attachment_status:1,
            source: 1,
            attachment_status:1,
          });
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            console.log('User cancelled the picker');
          } else {
            throw err;
          }
        }
      };
    
      const handleAttachPDF = async () => {
        try {
          // Pick the PDF document
          const result = await DocumentPicker.pickSingle({
            type: [DocumentPicker.types.pdf],
          });
          if (result.length === 0) {
            console.log('No file selected');
            return;
          }
          const { name, type, uri } = result;
          const extension = name.split('.').pop();
          console.log('filePath:', uri + " name:" + name, "extension:" + extension);
          const base64 = await RNFS.readFile(uri, 'base64');
          if (scrollViewRef.current) {
              scrollViewRef.current.scrollToEnd({ animated: true });
          }
          mutate({
            complaint_message_id: complaint_message_id,
            attachments:[ {
              fileContent: base64,
              name: name,
              type: type,
              extension: extension,
            }],
            source: 1,
            attachment_status:1
          });
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            console.log('User cancelled the picker');
          } else {
            console.error(err);
          }
        }
      };    


  const handleAttachFile = async () => {
    try {
      //const result = await DocumentPicker.pick({ mode: 'open' });
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      const { name, type, uri } = result[0];
      const extension = name.split('.').pop();
      //const fileContent = await readFile(uri, 'base64');
        const path = uri.replace("file://", ""); // Adjust path if necessary based on how 'uri' is formatted    
        // Read the file as base64
        const base64 = await RNFetchBlob.fs.readFile(path, 'base64');
      const filePath = uri; // Replace with your file path
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
      mutate({
        complaint_message_id: complaint_message_id,
        attachment: {
          fileContent: base64,
          type: type,
          name: name,
          extension: extension
        },
        source: 1,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        throw err;
      }
    }
  };

  if (isLoadingDetails || isLoadingChats) return <Loader />;
  if (isErrorDetails) return <Text>Error: {errorDetails.message}</Text>;

  return (
    <KeyboardAwareScrollView
    ref={scrollViewRef}
    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={[styles.container, Platform.OS === 'ios' && styles.iosPadding]}
    invertStickyHeaders={true}
    keyboardShouldPersistTaps="always"
  >
    <View style={[styles.container, { flex: 1, paddingHorizontal: '5%', paddingBottom: '1%' }]}>
      <View style={{ flex: 1, paddingTop: 5 }}>
        {startChatTime && <Timer startTime={startChatTime}  FirstAdd={FirstAdd} width={width} />}
     
          {loader ? (
            <Loader loader={loader} />
          ) : (
            <View style={{ flex: 1, paddingBottom: 0, paddingTop: '0%' }}>
              {complaint_type == 40 &&
                initialMessage.map((item,i) => (
                  <View key={i}>
                    <Messagechat  FirstAdd={FirstAdd}
                            navigation={navigation} item={item} width={width} type="nejoum" complaint_type={complaint_type} initial />
                  </View>
                ))}
               {(!FirstAdd && (complaintChats?.data.length !== 1)) && (

complaintDetails?.data.map((item, i) => {

  if (complaintDetails?.data[0]?.message && complaintChats?.data[0]?.message ) {

    return null; 

  }

  

  return (

                        <View key={i}>
                        {item.source == 2 || item.parent_id != 0 ? (
                          <Messagechat
                            FirstAdd={FirstAdd}
                            navigation={navigation}
                            item={item}
                            width={width}
                            created_at={item.parent_id != 0 ? (item.answer_date ? item.answer_date : item.created_at) : item.create_date}
                            type="nejoum"
                            data='fulldata'
                            complaint_type={complaint_type}
                          />
                        ) : (
                          <Messagechat
                          FirstAdd={FirstAdd}
                          navigation={navigation}
                            item={item}
                            width={width}
                            created_at={item.created_at}
                            type="customer"
                            name={name_char}
                            data='fulldata'
                            index={i}
                            complaint_type={complaint_type}
                          />
                        )}
                      </View>
                     );

                    })
        
                  )}
               {complaintChats?.data.map((item, i) => (
                <View key={i}>
                  {item.source == 2 ? (
                      item.attachment_full_path!='no' ?(
                        <Messagechat
                            FirstAdd={FirstAdd}
                            item={item}
                            width={width}
                            created_at={null}
                            type="nejoum"
                            data='fulldata'
                            complaint_type={complaint_type}
                            navigation={navigation}
                            old_attachment={true}
                          />
                          ):(
                        <Messagechat
                        FirstAdd={FirstAdd}
                        item={item}
                        width={width}
                        created_at={null}
                        type="nejoum"
                        data='fulldata'
                        complaint_type={complaint_type}
                        navigation={navigation}
                      />
                      )
                  ) : (
                    item.attachment_full_path!='no' ?(
                  <Messagechat
                  FirstAdd={FirstAdd}
                      item={item}
                      width={width}
                      created_at={null}
                      type="customer"
                      name={name_char}
                      data='fulldata'
                      index={i}
                      complaint_type={complaint_type}
                      navigation={navigation}
                      old_attachment={true}
                    />
                    ):(
                      <Messagechat
                      FirstAdd={FirstAdd}
                      item={item}
                      width={width}
                      created_at={null}
                      type="customer"
                      name={name_char}
                      data='fulldata'
                      index={i}
                      complaint_type={complaint_type}
                      navigation={navigation}
                    />
                    )
                  )}
                  {isAdding && (
                    <Text>is Adding Added</Text>
                  )}
                </View>
              ))}
              {load_more && (
                <View style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Image source={require("../assets/loadingapp.gif")} style={{ justifyContent: 'center', width: 50, height: 50, alignItems: 'center' }} resizeMode="contain" />
                </View>
              )}
            </View>
          )}
              {complaint_type == 40 && complaint_status!=2 && (
    <View style={{width: '100%', alignSelf: 'center',marginVertical:2 }}>
      <SearchInput
        width={width}
        height={height}
        handleAttachImage={handleAttachImage}
        handleAttachPDF={handleAttachPDF}
        handleSendMessage={handleSendMessage}
        message={message}
        handleMessageChange={setMessage}
        complaint_message_id={complaint_message_id}
        scrollViewRef={scrollViewRef}
      />
    </View>
  )} 
          
       
      
      </View>

    </View>
    </KeyboardAwareScrollView>
  );
};

export default ComplaintsDetails;

const Messagechat = ({FirstAdd, item, width, created_at, type, name, data, index, complaint_type, initial, navigation, static_images, static_images_length,old_attachment }) => {
  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const locales = Localize.getLocales();
    const locale = locales && locales.length > 0 ? locales[0].languageTag : 'en-US';

    const today = new Date();
    const timeDifference = today - date;
    const secondsDifference = Math.floor(timeDifference / 1000);

    let options;
    let formattedDate;

    if (secondsDifference < 60 * 60 * 24) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      formattedDate = `${formattedHours}:${formattedMinutes} ${ampm}`;
    } else {
      const year = date.getFullYear();
      const month = date.toLocaleString(locale, { month: 'long' });
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      formattedDate = `${month} ${day}, ${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    return formattedDate;
  };

  const getFormattedDate = () => {
    let date;
    if (item.timestamp) {
      date = new Date(item.timestamp);
    } else if (item.created_at) {
      date = new Date(item.created_at);
    } else if (item.readable_create_date) {
      date = new Date(item.readable_create_date);
    }
    if (!!date && !isNaN(date.getTime())) {
      return formatDateString(date);
    } else {
      const currentDate = new Date();
      const minutesToAdd = index * 5;
      currentDate.setMinutes(currentDate.getMinutes() + minutesToAdd);
      return formatDateString(currentDate);
    }
  };

  const parseText = text => {

    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const parts = text.split(urlRegex);

    return parts.map((part, index) => {

      if (urlRegex.test(part)) {

        return (

          <Text

            key={index}

            style={styles.link}

            onPress={() => Linking.openURL(part)}>

            {''}

            {part}{' '}

          </Text>

        );

      }

      return <Text key={index}>{part}</Text>;

    });

  };

  const getFileType = (url) => {

    // Extract file extension

    const extension = url.split('.').pop().toLowerCase();

    // Determine file type based on extension

    if (extension === 'pdf') {

      return 'PDF';

    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {

      return 'Image';

    } else {

      return 'Unknown';

    }

  };

  const formattedDate = getFormattedDate();
  const firstAttachmentFileType = item.attachments_files && item.attachments_files?.length > 0
  ? item.attachments_files[0].file_type
  : null;
let ValidData=true;
if(item.attachment?.includes('<') || (item.message=="" && item.attachment=='1' && item.attachment_full_path=='https://cdn.nejoumaljazeera.co/upload/complaints/1' && item.attachments_files?.length==0 && item.attachments_files_create_date==null)){
  ValidData=false;
  return null;
}
if ((item.message == "" &&
item.attachments_files_create_date == null &&
complaint_type == 40 && item.attachments_files_create_date == null) 
  || (item.message != null &&
  item.attachments_files_create_date == null &&
  complaint_type == 40 && item.attachments_files_create_date == null) 
  || (item.message == "" && item.attachments_files_create_date == null &&
  item.attachment != null && firstAttachmentFileType == 'pdf' && item.attachment?.includes('.pdf'))|| (item.message == "" &&
  item.attachments_files_create_date != null && item.attachment != null && item.attachments_files?.length == 1 &&firstAttachmentFileType == 'pdf') 
  || (((item.message == "" &&
  item.attachments_files_create_date != null &&
  item.attachment != null &&
  item.attachments_files?.length > 0 &&
  firstAttachmentFileType != 'pdf' )&&(firstAttachmentFileType == 'm4a')||(firstAttachmentFileType == 'mp3') || (firstAttachmentFileType == 'mp4')
  ))
  || ((item.message == "" && item.attachments_files_create_date != null && item.attachment != null && item.attachments_files?.length > 1 && item.attachment?.includes('.')&& firstAttachmentFileType != 'pdf' && firstAttachmentFileType != 'm4a'&&firstAttachmentFileType != 'mp3' &&firstAttachmentFileType != 'mp4')) 
  || (((item.message==""  && item.attachment?.includes('.') &&item.attachment!=null  && firstAttachmentFileType != 'pdf' && firstAttachmentFileType != 'm4a' &&firstAttachmentFileType != 'mp3' && firstAttachmentFileType != 'mp4') &&item.attachments_files?.length==0 )) 
  || ((item.message=="" && item.attachments_files_create_date!=null && item.attachment!=null && item.attachments_files?.length==1 && firstAttachmentFileType != 'pdf' && firstAttachmentFileType != 'm4a' &&firstAttachmentFileType != 'mp3' && firstAttachmentFileType != 'mp4'))
  || ((item.message=="" && item.attachments_files_create_date!=null && item.attachment=='1' && item.attachments_files?.length>=1 && firstAttachmentFileType != 'pdf' && firstAttachmentFileType != 'm4a' &&firstAttachmentFileType != 'mp3' && firstAttachmentFileType != 'mp4'))
  ) {
  ValidData = true;
} else {
  ValidData = false;
}
  return (
  
      ValidData?( <Animatable.View
        delay={800}
        animation={type === 'customer' ? 'fadeInRightBig' : 'fadeInLeftBig'}>
        <View
          style={{
            flex: 1,
            flexDirection: type == 'customer' ? 'row' : 'row-reverse',
            justifyContent: 'flex-end',
            paddingVertical: '3.5%',
          }}>
          <View
            style={
              ((item.message == "" &&
                item.attachments_files_create_date != null &&
                item.attachment != null &&
                item.attachments_files?.length > 0 &&
                firstAttachmentFileType != 'pdf' )&&(firstAttachmentFileType == 'm4a')||(firstAttachmentFileType == 'mp3') || (firstAttachmentFileType == 'mp4')) //audios
                ?{width: '75%'}
                :((item.message != null &&
                  item.attachments_files_create_date == null &&
                  complaint_type == 40)&&((!(item.message==""  && item.attachment!=null  && firstAttachmentFileType != 'pdf' && firstAttachmentFileType != 'm4a' &&firstAttachmentFileType != 'mp3' && firstAttachmentFileType != 'mp4' )  ) ) || (item.message != null &&
                    item.attachments_files_create_date == null &&
                    index == 0 &&
                    complaint_type != 40 && (!((item.message==""  && item.attachment!=null  && firstAttachmentFileType != 'pdf' && firstAttachmentFileType != 'm4a' &&firstAttachmentFileType != 'mp3' && firstAttachmentFileType != 'mp4' )  ) ))) //message
                ? {width: '75%'}
                :((item.message == "" && item.attachments_files_create_date != null && item.attachment != null && item.attachments_files?.length > 1 && firstAttachmentFileType != 'pdf' && firstAttachmentFileType != 'm4a'&&firstAttachmentFileType != 'mp3' &&firstAttachmentFileType != 'mp4'))
                ? {width: '60%'}
                : {width: 'auto'}
            }>
            <View
              style={[
                styles.inputCard,
                {
                  marginRight: type === 'customer' || item.fileName ? '2.5%' : 0,
                  marginLeft: type !== 'customer' || item.fileName ? '2.5%' : 0,
                 
                  paddingHorizontal:
                  
                  ((item.message != null &&
                    item.attachments_files_create_date == null &&
                    complaint_type == 40)||(item.message != null &&
                      item.attachments_files_create_date == null &&
                      index == 0 &&
                      complaint_type != 40 )) != "" 
                      ?'3%' 
                      : (((item.message == "" &&
                item.attachments_files_create_date == null &&
                item.attachment != null)|| (item.message == "" &&
                  item.attachments_files_create_date != null &&
                  item.attachment != null &&
                  item.attachments_files?.length == 1 &&
                  firstAttachmentFileType == 'pdf')))
                  ?'2%'
                  :((item.message=="" && item.attachments_files_create_date!=null && item.attachment!=null && item.attachments_files?.length==1 && firstAttachmentFileType != 'pdf' && firstAttachmentFileType != 'm4a' &&firstAttachmentFileType != 'mp3' && firstAttachmentFileType != 'mp4'))
                  ? '2.5%'
                  :'4%',
                  paddingTop: '3%',
                  paddingBottom: initial ? -3 : '2.5%',
                  backgroundColor: type == 'customer' ? '#DAFDD3' : '#FDFBFC',
                  // marginLeft:((item.message=="" && item.attachments_files_create_date!=null && item.attachment!=null && item.attachments_files?.length==1 && firstAttachmentFileType != 'pdf' && firstAttachmentFileType != 'm4a' &&firstAttachmentFileType != 'mp3' && firstAttachmentFileType != 'mp4'))?'auto'
                  // :null,
                 
                  // marginLeft:((item.message!=null && item.message=="" && item.attachments_files_create_date!=null && item.attachment!=null && item.attachments_files?.length==1 && firstAttachmentFileType != 'pdf' && firstAttachmentFileType != 'm4a' &&firstAttachmentFileType != 'mp3' && firstAttachmentFileType != 'mp4'))?'auto':null,
                  // marginLeft:((item.message!="" && item.attachments_files_create_date==null && item.attachment==null && item.attachments_files?.length==0 && firstAttachmentFileType != 'pdf' && firstAttachmentFileType != 'm4a' &&firstAttachmentFileType != 'mp3' && firstAttachmentFileType != 'mp4'))?'2.5%':null,
                  borderRadius: 5,
                },
              ]}>
              {/* _________________________Text M Start__________________________ */}
              {/* Other than Chat Text Messages */}
              {item.message != null &&
                item.attachments_files_create_date == null &&
                index == 0 &&
                complaint_type != 40 && (
                  <View style={{marginBottom: '2%'}}>
                    <Text
                      style={{
                        flex: 1,
                        color: '#0A4180',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                        fontSize: width * 0.035,
                      }}>
                      Reqested Complaint Details:-
                    </Text>
                    <Text>
                      <Text
                        style={{
                          fontWeight: '600',
                          color: '#0A4180',
                          fontSize: width * 0.034,
                          textTransform: 'capitalize',
                        }}>
                        Subject:
                      </Text>
                      <Text style={{flex: 1, textTransform: 'capitalize'}}>
                        {' '}
                        {item.title}
                      </Text>
                    </Text>
                    <Text>
                      <Text
                        style={{
                          fontWeight: '600',
                          color: '#0A4180',
                          fontSize: width * 0.034,
                          textTransform: 'capitalize',
                        }}>
                        Lot/Vin #:
                      </Text>
                      <Text style={{flex: 1}}> {item.lot_vin}</Text>
                    </Text>
                    <Text>
                      <Text
                        style={{
                          fontWeight: '600',
                          color: '#0A4180',
                          fontSize: width * 0.034,
                          textTransform: 'capitalize',
                        }}>
                        Your Message:{' '}
                      </Text>
                      <Text style={{flex: 1, textTransform: 'capitalize'}}>
                        {item.message}
                      </Text>
                    </Text>
                  </View>
                )}
              {/*Chat Text Message */}
              {item.message != null &&
                item.attachments_files_create_date == null &&
                complaint_type == 40 && (
                  <Text
                    style={{
                      flex: 1,
                      color: type != 'customerdsf' ? '#000' : '#fff',
                      paddingTop: '1%',
                      paddingHorizontal: 2,
                    }}>
                    {/* {item.message} */}
                    {FirstAdd ? item.message : parseText(item.message)}
                  </Text>
                )}
              {/* _________________________Text M End__________________________ */}
  
              {/* _________________________PDFs M Start__________________________ */}
              {/* Old PDFs */}
              {item.message == "" &&
                item.attachments_files_create_date == null &&
                item.attachment != null && item.attachment?.includes('.pdf') && (
                  <>
                    <TouchableOpacity
                      style={{
                        flex: 0.2,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() =>
                        navigation.navigate('pafPreview', {
                          url: item.attachment_full_path,
                        })
                      }>
                      <Image
                        style={[
                          {
                            marginTop: '3.5%',
                            width: width * 0.22,
                            height: width * 0.22,
                            resizeMode: 'contain',
                          },
                        ]}
                        source={require('../assets/images/PDF_file_icon.svg.png')}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        padding: '1.5%',
                        paddingBottom: -5,
                        color: '#A3A9AF',
                        flex: 0.1,
                        fontSize: width * 0.03,
                      }}>
                      {!!item.fileName
                        ? item.fileName
                        : item.attachment?.substring(0, 13) + '.pdf'}
                    </Text>
                  </>
                )}
              {/* New PDFs */}
              {item.message == "" &&
                item.attachments_files_create_date != null &&
                item.attachment != null &&
                item.attachments_files?.length == 1 &&
                firstAttachmentFileType == 'pdf' && (
                  <>
                    <TouchableOpacity
                      style={{
                        flex: 0.2,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() =>
                        navigation.navigate('pafPreview', {
                          url: item.attachments_files[0].file_path,
                        })
                      }>
                      <Image
                        style={[
                          {
                            marginTop: '3.5%',
                            width: width * 0.22,
                            height: width * 0.22,
                            resizeMode: 'contain',
                          },
                        ]}
                        source={require('../assets/images/PDF_file_icon.svg.png')}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        padding: '1.5%',
                        paddingBottom: -5,
                        color: '#A3A9AF',
                        flex: 0.1,
                        fontSize: width * 0.03,
                      }}>
                      {!!item.fileName
                        ? item.fileName
                        : item.attachment?.substring(0, 13) + '.pdf'}
                    </Text>
                  </>
                )}
                {/* <Text>{firstAttachmentFileType}</Text> */}
              {/* _________________________PDFs M End__________________________ */}
  
     
              {/* _________________________Voice M Start__________________________ */}
              {(((item.message == "" &&
                item.attachments_files_create_date != null &&
                item.attachment != null &&
                item.attachments_files?.length > 0 &&
                firstAttachmentFileType != 'pdf' )&&(firstAttachmentFileType == 'm4a')||(firstAttachmentFileType == 'mp3') || (firstAttachmentFileType == 'mp4')
                )) && (
                <VoiceMessage
                  uri={item?.attachments_files[0]?.file_path || null}
                  width={width}
                />
              )}
              {/* _________________________Voice M End_____________________________ */}
              {/* _________________________Images M Start__________________________ */}
              {/* Multi Images */}
              {(item.message == "" && item.attachments_files_create_date != null && item.attachment != null && 
              item.attachments_files?.length >= 2 && firstAttachmentFileType != 'pdf' &&
               firstAttachmentFileType != 'm4a'&&firstAttachmentFileType != 'mp3' &&firstAttachmentFileType != 'mp4'&&
                (!item.attachments_files[0]?.file_name?.includes('mp3')|| 
                !item.attachments_files[0]?.file_name?.includes('mp4'))) &&(
                 <MultiImage
                 images={item?.attachments_files}
                 imageContainer={styles.imageContainer}
                 width={width}
                 images_length={item.attachments_files?.length}
               />
            // <Text>
            // {firstAttachmentFileType}fhfgh
            // </Text>
              )}
              {/* Single Image */}

                  {/* Old Image */}
                  {((item.message==""  && !item.attachment?.includes('.pdf') &&item.attachment!=null  
                  && firstAttachmentFileType != 'pdf' && firstAttachmentFileType != 'm4a' &&firstAttachmentFileType != 'mp3'
                   && firstAttachmentFileType != 'mp4') &&item.attachments_files?.length==0 ) && (
                    <View style={{flex:1, alignSelf:'center', marginTop:3,}}>
                      <ImageViewer
                          imageUrl={item?.attachment_full_path}
                          imageContainer={styles.imageContainer}
                          width={width}
                          multi_single={true}
                        />
                      </View>
                  )}
  
              {/* New Image */}
              {((item.message=="" && item.attachments_files_create_date!=null && 
              item.attachment!=null && item.attachments_files?.length==1 && firstAttachmentFileType != 'pdf' 
              && firstAttachmentFileType != 'm4a' &&firstAttachmentFileType != 'mp3' && firstAttachmentFileType != 'mp4')  ) && ( 
               <View style={{flex:1, alignSelf:'center', marginTop:3,}}>
                  <ImageViewer
                      imageUrl={item?.attachments_files[0]?.file_path}
                      imageContainer={styles.imageContainer}
                      width={width}
                      multi_single={true}
                    />
                    </View>
              )}
        {/* _________________________Images M End____________________________ */}
              {
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    backgroundColor: 'transparent',
                    justifyContent:
                      type == 'customer' ? 'flex-end' : 'flex-start',
                    paddingTop: !!item.fileType ? '3.5%' : 3,
                  }}>
                  <Text
                    style={{
                      color: '#72767A',
                      fontWeight: '600',
                      fontSize: width * 0.027,
                    }}>
                    {initial
                      ? ''
                      : item.create_date
                      ? item.create_date
                      : item.created_at
                      ? item.created_at
                      : formattedDate
                      ? formattedDate
                      : initial
                      ? ''
                      : ''}
                  </Text>
                </View>
              }
            </View>
          </View>
          <Avatar
            size={35}
            rounded
            title={name ? name : 'N'}
            containerStyle={{
              backgroundColor: type == 'customer' ? '#0A4180' : '#FF8F00',
            }}
          />
        </View>
      </Animatable.View>):null
  );
  
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: '1.5%',
  },
  iosPadding: {
    paddingBottom:10,
   
  },
  link: {
    color: '#2980b9',
    textDecorationLine: 'underline',
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 4,
    width: width * 0.4,
    height: width * 0.4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    marginBottom: '3%',
  },
  inputCard: {
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    flex: 1,
    resizeMode: "stretch",
    width: '100%',
    justifyContent: "center",
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
});