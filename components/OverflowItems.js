import React, {Component} from 'react';
import {Platform,
        StyleSheet,
        Text,
        View,
        Image,
        ImageBackground,
        StatusBar,
        Modal,
        TouchableOpacity,
        ScrollView,
        Dimensions,
        Animated
    } from 'react-native';
import { Overlay } from 'react-native-elements';
import { strings } from '../locals/i18n';
import { EvilIcons } from 'react-native-elements';


const { width } = Dimensions.get('screen');

const OVERFLOW_HEIGHT = 70;
const SPACING = 10;
const ITEM_WIDTH = width * 0.76;
const ITEM_HEIGHT = ITEM_WIDTH * 1.7;
const VISIBLE_ITEMS = 3;
const inputRange = [-1, 0, 1];

export default class OverflowItems extends Component{
    constructor(props){
        super(props);
        this.state = {
            modalmsg: this.props.modalmsg
        }

        
        
    }


    render(){
        const translateY = this.props.scrollXAnimated.interpolate({
            inputRange,
            outputRange: [OVERFLOW_HEIGHT, 0, -OVERFLOW_HEIGHT],
        });
        return (
            <View style={styles.overflowContainer}>
              <Animated.View style={{ transform: [{ translateY }] }}>
                {this.props.data.map((item, index) => {
                  return (
                    <View key={index} style={styles.itemContainer}>
                      <Text style={[styles.title]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View style={styles.itemContainerRow}>
                        <Text style={[styles.location]}>
                          <EvilIcons
                            name='location'
                            size={16}
                            color='black'
                            style={{ marginRight: 5 }}
                          />
                          {item.location}
                        </Text>
                        <Text style={[styles.date]}>{item.date}</Text>
                      </View>
                    </View>
                  );
                })}
              </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    image_background : {
        width  : '100%',
        height : '100%',
        justifyContent : 'center',
        alignItems : 'center'
    },
    loader_text : {
        fontSize : 20,
        color    : 'yellow',
        textAlign: 'center'  
    },
    loader_text_no_bg : {
        fontSize : 18,
        color    : '#0d5db8',
        fontFamily: "ZEKTON",
        textAlign: 'center',
        paddingBottom: 50
    },
    modals: {
        width: 300,
        height: 200,
        flex: 0.3,
        borderBottomLeftRadius: 20,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonOk: {
        textAlign: 'center',
        width: 80,
        height: 60,
        borderRadius: 25,
        margin: '2%',
        backgroundColor: '#0d5db8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonCancel: {
        textAlign: 'center',
        width: 80,
        height: 60,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#e6514d',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '2%'
    },
    canceltext: {
        color: '#e6514d',
        fontFamily: 'ZEKTON',
        textAlign: 'center'
    },
    approveText: {
        color: '#fff',
        fontFamily: 'ZEKTON',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlaystyle: {
        borderBottomLeftRadius: 100,
        borderTopRightRadius: 100,
        justifyContent: 'center'
    }
});    