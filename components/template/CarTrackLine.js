import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import I18n from 'react-native-i18n';
import {useTailwind} from 'tailwind-rn';
import React from 'react';
import ScreenTitle from '../atoms/ScreenTitle';

const CarTrackLine = ({data}) => {
  /*
  sample data should be list each with {name,stauts,src}

 {
            name:strings('car.new_cars'),
            status:TRACK_ACTIVITY_STATUS.ACTIVE,
            date:this.state.car_data.purchasedate,
            imgPath:require('../assets/images/car-track/new-car-icon.png')
          }

   */

  const tailwind = useTailwind();
  return (
    <SafeAreaView
      style={tailwind(
        ' mr-[6rem] pl-[1rem] justify-center items-center align-center  mb-2 w-1/2 relative bg-blue-300x ',
      )}>
      <View
        style={tailwind(
          ' my-4 pl-[3rem] bg-blue-200X border-r-2 border-lightblue w-[7.5rem]  ',
        )}>
        {data.map((item, index) => {
          console.log('item', item.date);
          if (index !== data.length - 1) {
            return (
              <StatusImg
                name={item.name}
                date={item.date}
                status={item.status}
                src={item.imgPath}
              />
            );
          } else {
            return (
              <StatusImg
                isLast={true}
                date={item.date}
                name={item.name}
                status={item.status}
                src={item.imgPath}
              />
            );
          }
        })}
      </View>
    </SafeAreaView>
  );
};

const StatusImg = ({
  name,
  date = '',
  src,
  status = TRACK_ACTIVITY_STATUS.INACTIVE,
  isLast = false,
}) => {
  const tailwind = useTailwind();
  const innerStyle = {
    [TRACK_ACTIVITY_STATUS.INACTIVE]: inner.tintInactive,
    [TRACK_ACTIVITY_STATUS.CURRENT]: inner.tintCurrent,
    [TRACK_ACTIVITY_STATUS.ACTIVE]: inner.tintActive,
  };
  console.log(innerStyle[status]);

  return (
    <View
      style={[
        tailwind(
          `bg-white mx-[2rem]  ${!isLast &&
            'mb-3'} rounded-full p-1 h-20 w-20  box-shadow `,
        ),
        inner.imgShadow,
      ]}>
      <Text style={tailwind('absolute top-[2rem] right-[6rem] text-xxs ')}>
        {name}
      </Text>
      <Text style={tailwind('absolute top-[3rem] right-[6rem] text-xxxs ')}>
        {date && date.substring(0, 10)}
      </Text>
     <View style={tailwind('p-4')}>
       <Image source={src} style={[inner.img, innerStyle[status]]} />
     </View>
    </View>
  );
};

const TRACK_ACTIVITY_STATUS = {
  INACTIVE: 'InActive',
  CURRENT: 'Current',
  ACTIVE: 'Active',
};
const inner = StyleSheet.create({
  img: {
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: '100%',
    width: '100%',
    tintColor: '#FEA821',
  },
  tintActive: {
    tintColor: '#013188',
  },
  tintInactive: {
    tintColor: '#656565',
  },
  tintCurrent: {
    tintColor: '#FEA821',
  },
  imgShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
const CarTrackLinePreview = () => {
  const tailwind = useTailwind();
  return (
    <View style={tailwind('bg-blue-400   ')}>
      <View style={tailwind(' bg-blue-200')}>
        <CarTrackLine />
      </View>
    </View>
  );
};
export {CarTrackLine, CarTrackLinePreview, StatusImg, TRACK_ACTIVITY_STATUS};
