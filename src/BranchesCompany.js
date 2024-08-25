import React from 'react';
import {ScrollView, View, Text, Image, Dimensions} from 'react-native';
import {strings} from '../locals/i18n';
import ScreenTitle from '../components/atoms/ScreenTitle';
import {useTailwind} from 'tailwind-rn';

const BranchView = ({title = false, data = {}, order = 1}) => {
  //todo add translations
  const tailwind = useTailwind();
  if (!data.city) {
    return <View style={tailwind('w-1/2')} />;
  }
  return (
    <View
      style={tailwind(`pl-[1.5rem]  w-1/2    ${order == 2 && '  pr-3 '}  `)}>
      {title && (
        <View style={tailwind('flex-row justify-start')}>
          <Text
            style={tailwind(
              ' text-lg    border-b-2 border-b-orange     font-bold  text-xdDarkblue',
            )}>
            {title}
          </Text>
          <Text
            style={tailwind(' text-lg          font-bold  text-xdDarkblue')}>
            {' '}
            Offices
          </Text>
        </View>
      )}
      {data.city ? (
        <Text
          style={tailwind('text-xs text-black py-3 font-bold text-darkblue')}>
          {data.city}
        </Text>
      ) : (
        <View />
      )}
      <Text style={tailwind('text-xxs text-lightblack')}>{data.address}</Text>
      {data.address2 && (
        <Text style={tailwind('text-xxs mt-3 text-lightblack')}>
          {data.address2}
        </Text>
      )}
      {data.address3 && (
        <Text style={tailwind('text-xxs mt-3 text-lightblack')}>
          {data.address3}
        </Text>
      )}
      <Text style={tailwind('text-xxxs pt-2 text-lightblue')}>
        Tel: {data.tel}
      </Text>
      <Text style={tailwind('text-xxxs   text-lightblue  ')}>{data.email}</Text>
      {data.data2 && (
        <View style={tailwind('mt-8')}>
          <Text
            style={tailwind('text-xs text-black py-3 font-bold text-darkblue')}>
            {data.data2.city}
          </Text>
          <Text style={tailwind('text-xxs mt-3 text-lightblack')}>
            {data.data2.address}
          </Text>
          <Text style={tailwind('text-xxxs pt-2 text-lightblue ')}>
            Tel: {data.data2.tel}
          </Text>
          <Text style={tailwind('text-xxxs   text-lightblue  ')}>
            {data.data2.email}
          </Text>
        </View>
      )}
    </View>
  );
};

function BranchViewCol({data = [], titles = []}) {
  const tailwind = useTailwind();
  return (
    <View style={tailwind('flex flex-row items-left my-8')}>
      <BranchView
        title={titles[0] || false}
        data={data[0] || false}
        order={1}
      />
      <BranchView
        title={titles[1] || false}
        data={data[1] || false}
        order={2}
      />
    </View>
  );
}
const BranchesCompany = () => {
  const tailwind = useTailwind();
  return (
    <ScrollView contentContainerStyle={tailwind('flex flex-grow ')}>
      <Text
        style={tailwind(
          'align-center mt-[4rem] text-xdDarkblue text-xl font-bold text-center',
        )}>
        We are in
      </Text>
      <View style={tailwind(' w-full h-[18rem] p-4')}>
        <Image
          source={require('../assets/images/branches-map.png')}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
        />
      </View>
      <View style={tailwind('flex flex-col ')}>
        <BranchViewCol
          titles={['UAE', 'US']}
          data={[
            {
              city: 'Dubai',
              address: 'Nejoum Aljazeera Group Sharjah, Industrial Area 4',
              tel: '+971 65 440 202',
              email: 'info@naj.ae',
            },
            {
              city: 'Texas',
              address: 'Nejoum Express 6012 Murphy ST. Houston, TX 77033-1008',
              tel: '+971 65 440 202',
              email: 'management@nejoumexpress.com',
            },
          ]}
        />

        <BranchViewCol
          data={[
            {
              city: 'Sharjah',
              address: 'Nejoum Aljazeera Group Sharjah, Industrial Area 4',
              address2: 'Nejoum Aljazeera Group Sharjah, Muwaileh',
              address3: 'Nejoum Aljazeera Group Sharjah, Sajaa',
              tel: '+971 65 440 202',
              email: 'info@naj.ae',
            },
            {
              city: 'New Jersey',
              address:
                'Nejoum Express 1 Linden Avenue E, Jersey City, NJ 07305',
              tel: '+971 65 440 202',
              email: 'nj@nejoumexpress.com',
              data2: {
                city: 'Savannah (US)',
                address: '46 ARTLY ROAD, Savannah, GA 31408',
                tel: '+248-495-8526',
                email: 'ga@nejoumexpress.com',
              },
            },
          ]}
        />

        <BranchViewCol
          titles={['Iraq', 'Cambodia']}
          data={[
            {
              city: 'Basra',
              address: 'Nejoum Aljazeera Group Basra Bridge, Basra',
              tel: '+964 7 7171 8897 7',
              email: 'Basra@naj.ae',
            },
            {
              city: 'New Jersey',
              address: '528 ST 1019, Sangkat, tmey, Khan Sen Sok',
              tel: '+855-159 695 38',
              email: 'alsadi@najshipping.com',
            },
          ]}
        />
        <BranchViewCol
          titles={['Oman']}
          data={[
            {
              city: 'Muscat',
              address: 'Amabilah Al Sanaya Road No.10 , C.R.NO: 1339785',
              tel: '+968 94 744 020',
              email: 'oman@naj.ae',
            },
          ]}
        />
      </View>
    </ScrollView>
  );
};
export default BranchesCompany;
