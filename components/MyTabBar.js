
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
        //SafeAreaView,
        Dimensions,
        Animated    } from 'react-native';
import { Overlay } from 'react-native-elements';
import { strings } from '../locals/i18n';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {
    Path
} from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
let {width, height} = Dimensions.get('window');

function initialIndexDetector(length) {
    if (length === 1) {
        return 1;
    } else if (length === 2) {
        return 1;
    } else if (length === 3) {
        return 2;
    } else if (length === 4) {
        return 1;
    } else if (length === 5) {
        return 3;
    }
}

export default class MyTabBar extends Component{

    constructor(props) {
        super(props);
        let initialIndex = 3;
        initialIndex = initialIndexDetector(this.props.icons.length);
        let xValue =0;
        if (this.props.icons.length === 2){
            xValue = -((width/this.props.icons.length)/2);
        } else if (this.props.icons.length === 4) {
            xValue = -((width/this.props.icons.length)+(width/this.props.icons.length/2));
        }
        this.offsetX = new Animated.Value(xValue);
        this.oneOffsetY = new Animated.Value(initialIndex === 1 ? 0:0);
        this.twoOffsetY = new Animated.Value(initialIndex === 2 ? -10:0);
        this.threeOffsetY = new Animated.Value(initialIndex === 3 ? -10:0);
        this.fourOffsetY = new Animated.Value(initialIndex === 4 ? -10:0);
        this.fiveOffsetY = new Animated.Value(initialIndex === 5 ? -10:0);
        moveSelected = moveSelected.bind(this);
        animateIcon = animateIcon.bind(this);
    }

    render(){
        return (
            <SafeAreaView>
            <Animatable.View animation="fadeInUp" 
            duration = {2000} style={styles.container}>
 <LinearGradient 
        start={{x: 0.0, y: 0}} 
        end={{x: 1, y: 0}} 
        //colors = {['#9a1a27', '#8a2137', '#782b4b', '#6f2e52','#583a6c', '#44427e', '#344a8f', '#2d4e97','#1a57aa']}
    colors = {['#013188', '#FFA300' ]}
            
                                        style={styles.linearGradient}>
            <View style={styles.tabBarBack}/>
            <Animated.View style={[{transform: [{translateX: this.offsetX}]}, styles.selectedContainer]}>
                <Svg style={styles.curveContainer} version="1.1" width='128' height="64" x="0px" y="0px"
                     viewBox="0 0 128 64" space="preserve">
                    {/*<Path fill={this.props.backgroundColor} d="M125.3,64.2c-6.6-0.6-13.2-1.6-19.7-2.9c-2.5-0.5-5-1.1-7.4-2.2c-4.5-2-8.2-5.9-10.4-10.6C75.2,25.4,52.1,23.8,40,50.2V50*/}
{/*c-2.2,4.3-5.9,7.8-10.4,9.6c-2.4,1-4.9,1.5-7.4,2c-6.5,1.2-13.1,2.1-19.7,2.6"/>*/}
                    <Path fill='transparent' d="M128,64.2c-6.9-0.3-13.7-0.7-20.5-1.3c-2.6-0.2-5.2-0.5-7.7-1c-4.7-0.9-8.6-2.6-10.8-4.7C75.7,47,51.6,46.3,39.1,58v-0.1
c-2.3,1.9-6.2,3.5-10.8,4.3c-2.5,0.4-5.1,0.7-7.7,0.9C13.7,63.6,6.9,64,0,64.2"/>

                </Svg>
            

            </Animated.View>
            <View style={styles.tabBar}>
            {this.props.state.routes.map((route, index) => {
                const { options } = this.props.descriptors[route.key];
                const label =
                  options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                    ? options.title
                    : route.name;
        
                const offsetY =
                    index == 0
                    ? this.oneOffsetY
                    : index == 1
                    ? this.twoOffsetY
                    : index == 2
                    ? this.threeOffsetY
                    : index == 3
                    ? this.fourOffsetY
                    : this.oneOffsetY;

                const isFocused = this.props.state.index === index;
        
                const onPress = (index) => {
                  this.props.onSelect(index);
                  //console.warn(index);
                  //moveSelected(index)
                  /**const event = this.props.navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                  });
        
                  if (!isFocused && !event.defaultPrevented) {
                    this.props.navigation.navigate(route.name);
                  }**/
                  if (!isFocused) {
                    this.props.navigation.navigate(route.name);
                  }

                  this.props.navigation.navigate(route.name);
                };
        
                const onLongPress = () => {
                    /**this.props.navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                  });**/
                  this.props.navigation.navigate(route.name);
                };
        
                return (
                <View>
                    {this.props.icons[index] &&
                    <TouchableOpacity   activeOpacity={1}
                        accessibilityRole="button"
                        accessibilityStates={isFocused ? ['selected'] : []}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={() => onPress(index+1)}
                        onLongPress={onLongPress}

                    style={{width: width / this.props.icons.length, marginTop:'4%', height: height*0.075, 
                    alignItems: 'center', justifyContent: 'center'}}>
                        <Animated.View style={{transform: [{translateY: offsetY}]}}>
                            {this.props.icons[index]}
                        </Animated.View>
                    </TouchableOpacity>
                    }
                </View>
                );
              })
              
            }
              

            </View>

            </LinearGradient>

            </Animatable.View>
            </SafeAreaView>
          );
    }
}


const styles = StyleSheet.create({
    container: {
        width: width,
        position: 'absolute',
        bottom: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    tabBarBack: {
        width: width,
        height: height*0.07,
        alignSelf: 'center',
        flexDirection: 'row',
        position: 'absolute'

    },
    tabBar: {
        width: width,
        height: height*0.09, //0.07
        alignSelf: 'center',
        flexDirection: 'row'

    },
    curveContainer: {

        alignSelf: 'center',
        position: 'absolute',
        top: -height*0.07,//-22
        right: -height*0.053,//-35
    },
    /**content: {
        flexDirection: "column",
        zIndex: 0,
        width: (Dimensions.get('window').width - 30),
        marginBottom: '4%',
        left: '4%',
        right: '4%',
    },**/
    selectedContainer: {
        width: height*0.07,
        height: height*0.07,
        position: 'absolute',
        alignSelf: 'center',
        bottom: height*0.015,
    },
    roundedButton: {
        width: height*0.07,
        height: height*0.07,
        borderRadius: 50,
        top:0 //4
    },
    /**subContent: {
        flexDirection: 'row',
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 10,
        zIndex: 1,
        position: 'absolute',
        bottom: 5,
    },
    navItem: {
        flex: 1,
        paddingTop: 6,
        paddingBottom: 6,
        alignItems: 'center',
        zIndex: 0,
    },
    navImage: {
        width: height*0.06,
        height: height*0.06,
    },
    circle: {
        bottom: 18,
    }**/
});

export function moveSelected(index) {
    let value = 0;
    value = detectNewOffset(index, this.props.icons.length);
    //console.warn(index);
    animateIcon(-1);
    Animated.parallel([
        Animated.timing(
            this.offsetX,
            {
                toValue: value,
                duration: 500,
				useNativeDriver: true
            }
        ),
    ]).start(() => animateIcon(index));

}

function detectNewOffset(index, length)
{
    if (length === 1) {
        return 0;
    } else {
        let value = 0;
        //console.log(index);
        switch (index) {
            case 1: {
                if (length === 5) {
                    value = -2 * (width / length);
                }
                else if (length === 2) {
                    value = -((width/length)/2);
                }else if (length ===4){
                    value = -((width/length)+(width/length/2));
                }
                else if (length === 3) {
                    value = -(width / length);
                }
                break;
            }
            case 2: {
                if (length === 5) {
                    value = -(width / length);
                } else if (length === 2 ) {
                    value = (width / length)-((width / length)/2);
                } else if (length === 4){
                    value = -((width/length)+(width/length/2))+(width/length);
                }  else if (length === 3) {
                    value = 0;
                }
                break;
            }
            case 3: {
                if (length === 5) {
                    value = 0;
                } else if (length === 4) {
                    value = -((width/length)+(width/length/2))+(2*(width/length));
                } else if (length === 3) {
                    value = (width / length);
                }
                break;
            }
            case 4: {
                if (length === 5) {
                    value = (width / length);
                } else if (length === 4) {
                    value = -((width/length)+(width/length/2))+(3*(width/length));
                }
                break;
            }
            case 5: {
                if (length === 5) {
                    value = 2 * (width / length);
                }
                break;
            }
        }
        return value;
    }
}

export function animateIcon(index) {
    Animated.parallel([
        Animated.timing(
            this.oneOffsetY,
            {
                toValue: index === 1 ? -10 : 0,
                duration: 100,
                useNativeDriver: true
            }
        ),
        Animated.timing(
            this.twoOffsetY,
            {
                toValue: index === 2 ? -10 : 0,
                duration: 100,
                useNativeDriver: true
            }
        ),
        Animated.timing(
            this.threeOffsetY,
            {
                toValue: index === 3 ? -10 : 0,
                duration: 100,
                useNativeDriver: true
            }
        ),
        Animated.timing(
            this.fourOffsetY,
            {
                toValue: index === 4 ? -10 : 0,
                duration: 100,
                useNativeDriver: true
            }
        ),
        Animated.timing(
            this.fiveOffsetY,
            {
                toValue: index === 5 ? -10 : 0,
                duration: 100,
                useNativeDriver: true
            }
        )
    ]).start();
}