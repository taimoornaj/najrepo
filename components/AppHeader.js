import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const AppHeader = ({ navigation, strings,commonStyle,height,width, text }) => (
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
        <TouchableOpacity activeOpacity={1} onPress={() => navigation.goBack()}>
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
        <Text style={commonStyle.headerText}>{text}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 0.2 }}>
        <Text style={commonStyle.headerText}></Text>
      </View>
    </View>
  </View>
);

export default AppHeader;
