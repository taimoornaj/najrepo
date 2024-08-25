
import * as React from 'react';
import {
  StatusBar,
  Image,
  FlatList,
  Dimensions,
  Animated,
  Text,
  TouchableOpacity,
  ImageBackground,
  View,
  StyleSheet,
  BackHandler,
  SafeAreaView,
} from 'react-native';

const {width, height} = Dimensions.get('window'); 
import { EvilIcons } from 'react-native-elements';
import {
  FlingGestureHandler,
  Directions,
  State,
} from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import OverflowItems from '../components/OverflowItems.js';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import commonStyle from '../assets/style/styles.js';

// https://www.creative-flyers.com
/**const DATA = [
  {
    title: 'Afro vibes',
    location: 'Mumbai, India',
    date: 'Nov 17th, 2020',
    poster:
      'https://www.creative-flyers.com/wp-content/uploads/2020/07/Afro-vibes-flyer-template.jpg',
  },
  {
    title: 'Jungle Party',
    location: 'Unknown',
    date: 'Sept 3rd, 2020',
    poster:
      'https://www.creative-flyers.com/wp-content/uploads/2019/11/Jungle-Party-Flyer-Template-1.jpg',
  },
  {
    title: '4th Of July',
    location: 'New York, USA',
    date: 'Oct 11th, 2020',
    poster:
      'https://www.creative-flyers.com/wp-content/uploads/2020/06/4th-Of-July-Invitation.jpg',
  },
  {
    title: 'Summer festival',
    location: 'Bucharest, Romania',
    date: 'Aug 17th, 2020',
    poster:
      'https://www.creative-flyers.com/wp-content/uploads/2020/07/Summer-Music-Festival-Poster.jpg',
  },
  {
    title: 'BBQ with friends',
    location: 'Prague, Czech Republic',
    date: 'Sept 11th, 2020',
    poster:
      'https://www.creative-flyers.com/wp-content/uploads/2020/06/BBQ-Flyer-Psd-Template.jpg',
  },
  {
    title: 'Festival music',
    location: 'Berlin, Germany',
    date: 'Apr 21th, 2021',
    poster:
      'https://www.creative-flyers.com/wp-content/uploads/2020/06/Festival-Music-PSD-Template.jpg',
  },
  {
    title: 'Beach House',
    location: 'Liboa, Portugal',
    date: 'Aug 12th, 2020',
    poster:
      'https://www.creative-flyers.com/wp-content/uploads/2020/06/Summer-Beach-House-Flyer.jpg',
  },
];**/

const OVERFLOW_HEIGHT = 70;
const SPACING = 10;
const ITEM_WIDTH = width * 0.76;
const ITEM_HEIGHT = ITEM_WIDTH * 1.7;
const VISIBLE_ITEMS = 3;

/** 
function OverflowItems ({ data, scrollXAnimated }){
  const inputRange = [-1, 0, 1];
  const translateY = scrollXAnimated.interpolate({
    inputRange,
    outputRange: [OVERFLOW_HEIGHT, 0, -OVERFLOW_HEIGHT],
  });
  return (
    <View style={styles.overflowContainer}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        {data.map((item, index) => {
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
};*/


export default function ImagesSlider({ navigation, route }) {
  const DATA = route.params.data;
  navigation.setOptions({
    header: () => (

      <View style = {commonStyle.header}>
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center',
                      marginTop: height*0.05, flex:1}}>
                          <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', flex:0.2
                        ,justifyContent: 'flex-start', alignItems:'flex-start'}}>
                              <TouchableOpacity activeOpacity={1}  onPress={() => this.props.navigation.goBack()}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex:1, flexDirection:'row'}}>
                                        <View>
                                            <FontAwesomeIcon
                                                icon={ faChevronLeft }
                                                color="#fff"
                                                size={width*0.06}
                                            />
                                        </View>
                                        <Text style={commonStyle.headerText}>{strings('main.back')}</Text>
                                    </View>
                              </TouchableOpacity>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.9}}>
                          <Text style={commonStyle.headerText}>{route.params.title}</Text>
                          </View>
                          <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                            <Text style={commonStyle.headerText}></Text>
                          </View>
                        </View>       
                    </View>
    )
   
  });


  const [data, setData] = React.useState(DATA);
  const scrollXIndex = React.useRef(new Animated.Value(0)).current;
  const scrollXAnimated = React.useRef(new Animated.Value(0)).current;
  const [index, setIndex] = React.useState(0);
  const setActiveIndex = React.useCallback((activeIndex) => {
    scrollXIndex.setValue(activeIndex);
    setIndex(activeIndex);
  });

  React.useEffect(() => {
    if (index === data.length - VISIBLE_ITEMS - 1) {
      // get new data
      // fetch more data
      const newData = [...data, ...data];
      setData(newData);
    }
  });

  React.useEffect(() => {
    Animated.spring(scrollXAnimated, {
      toValue: scrollXIndex,
      useNativeDriver: true,
    }).start();
  });
  return (
    <View style={styles.image}>
    <FlingGestureHandler
      key='left'
      direction={Directions.LEFT}
      onHandlerStateChange={(ev) => {
        if (ev.nativeEvent.state === State.END) {
          if (index === data.length - 1) {
            return;
          }
          setActiveIndex(index + 1);
        }
      }}
    >
      <FlingGestureHandler
        key='right'
        direction={Directions.RIGHT}
        onHandlerStateChange={(ev) => {
          if (ev.nativeEvent.state === State.END) {
            if (index === 0) {
              return;
            }
            setActiveIndex(index - 1);
          }
        }}
      >
        
        <SafeAreaView style={styles.container}>
         
          <FlatList
            data={data}
            keyExtractor={(_, index) => String(index)}
            horizontal
            inverted
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
              padding: SPACING * 2,
          
            }}
            scrollEnabled={false}
            removeClippedSubviews={false}
            CellRendererComponent={({
              item,
              index,
              children,
              style,
              ...props
            }) => {
              const newStyle = [style, { zIndex: data.length - index }];
              return (
                <View style={newStyle} index={index} {...props}>
                  {children}
                </View>
              );
            }}
            renderItem={({ item, index }) => {
              const inputRange = [index - 1, index, index + 1];
              const translateX = scrollXAnimated.interpolate({
                inputRange,
                outputRange: [50, 0, -100],
              });
              const scale = scrollXAnimated.interpolate({
                inputRange,
                outputRange: [0.8, 1, 1.3],
              });
              const opacity = scrollXAnimated.interpolate({
                inputRange,
                outputRange: [1 - 1 / VISIBLE_ITEMS, 1, 0],
              });

              return (
                <Animated.View
                  style={{
                    position: 'absolute',
                    left: -ITEM_WIDTH / 2,
                    opacity,
                    transform: [
                      {
                        translateX,
                      },
                      { scale },
                    ],
                  }}
                >
                  <Image
                    source={{ uri: item }}
                    style={{
                      width: ITEM_WIDTH,
                      resizeMode: "cover",
                      height: ITEM_HEIGHT,
                      borderRadius: 14,
                    }}
                  />
                </Animated.View>
              );
            }}
          />
        </SafeAreaView> 
      </FlingGestureHandler>
    </FlingGestureHandler>
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  location: {
    fontSize: 16,
  },
  date: {
    fontSize: 12,
  },
  itemContainer: {
    height: OVERFLOW_HEIGHT,
    padding: SPACING * 2,
  },
  itemContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overflowContainer: {
    height: OVERFLOW_HEIGHT,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  }
});