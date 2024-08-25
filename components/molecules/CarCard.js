import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useTailwind} from 'tailwind-rn';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { strings } from '../../locals/i18n';

const exampleData = {
  id: '11',
  image_small: 'SampleImage',
  vin: '34534534534451',
  lotnumber: '122342345',
  carMakerName: 'Sample',
  year: '3221',
  carModelName: 'Sample',
  follow_car_title_note: 'Follow Car Title Note',
  follow_title: 'Follow Title',
  aTitle: 'ATitle',
  special_notes: 'Special Notes',
  purchasedate: '1',
  delivered_car_key: '1',
  delivered_title: 'Delivered Title',
  receiver_name: 'Receiver Name',
  port_name: 'Port Name',
};

const CarCard = ({data, actions, props}) => {
  const {
    id,
    image_small,
    vin,
    lotnumber,
    carMakerName,
    year,
    carModelName,
    follow_car_title_note,
    follow_title,
    aTitle,
    special_notes,
    purchasedate,
    delivered_car_key,
    delivered_title,
    delivered_date,
    picked_date,
    paymentDate,
    receiver_name,
    port_name,
    container_number,
    eta,
    loaded_date,
    booking_arrival_date,
    shipping_date,
    car_payment_to_cashier,
    finesTotal,
    end_warehouse,
    recovery_iddata,
    receive_date,
    deliver_create_date,
    recovery_name,
    type,
    titleDate,
    price,
    allNotes,
    ETD,
    short_name,
    port_departuren,
    deliver_customer,
    final_payment_status,
    paid_request_id
  } = data?.id ? data : exampleData;

  const hasTitle = (delivered_title ==1 || follow_title ) || false;
  
  const re_name = (recovery_iddata?recovery_name:strings('main.customer'))

  const {goToDetails, goToImages, showNote, addNote, track, showNoteCars, sharePost, deleteFav, showPaidbyCustomer} = actions;

  const tailwind = useTailwind();
  return (
    <View style={{}}>
      
      <TouchableOpacity onPress={()=> type != 'favorit'?props.navigation.navigate('carDetails2', 
                                    {'data': data, 'type': type ,
                                    'allNotes': allNotes}):''} key={id}>
         <View
          style={tailwind(
            `flex-row w-full flex  ${type != 'favorit'?
              'h-[8rem]': 'h-[8rem]'}   flex-row p-2 border border-lightgrey border-0.5`,
          )}>
          <View style={tailwind('flex-col w-[32%]  py-1 pr-2 ')}>
            <FastImage
              resizeMode={FastImage.resizeMode.cover}
              style={tailwind('w-full h-full bg-red-300 rounded-sm')}
              source={{
                uri: image_small,
                priority: FastImage.priority.high,
              }}
            />
          </View>

          <View style={tailwind('flex-col w-[55%]  ')}>
              <Text style={tailwind('   text-black  font-bold text-xs ')}>
                {year} {carMakerName} {carModelName} {
                car_payment_to_cashier == "0"?
                    <View style={{backgroundColor:'#A30000', padding:3, borderWidth:1, borderColor:'#A30000', borderRadius:4,
                    justifyContent:'center', alignItems:'center', flex:0.1}}>
                    </View>:car_payment_to_cashier == "1" ?
                    <View style={{backgroundColor:'#0B9A21', padding:3, borderWidth:1,
                      borderColor:'#0B9A21', borderRadius:4, justifyContent:'center', alignItems:'center', flex:0.1}}>
                    </View>:car_payment_to_cashier == "3"?<View style={{backgroundColor:'#013188', padding:3,
                   justifyContent:'center', alignItems:'center', flex:0.1, borderWidth:1, borderColor:'#013188', borderRadius:4}}>
                  </View>:<View></View>
                }
                {
                final_payment_status == "0"?
                  <View style={{backgroundColor:'#A30000', padding:3, borderWidth:1, borderColor:'#A30000', borderRadius:4,
                  justifyContent:'center', alignItems:'center', flex:0.1}}>
                  </View>:final_payment_status == "1" ?<View style={{backgroundColor:'#0B9A21', padding:3, borderWidth:1, 
                  borderColor:'#0B9A21', borderRadius:4, justifyContent:'center', alignItems:'center', flex:0.1}}>
                  </View>:<View></View>
                }
                {<View style={{flex:0.1, marginLeft:1}}></View>}
                {deliver_customer == "0"?
                  <View style={{backgroundColor:'#343D40', padding:3, borderWidth:1, borderColor:'#343D40', borderRadius:4,
                  justifyContent:'center', alignItems:'center', flex:0.1}}>
                  </View>:deliver_customer == "1" ?<View style={{backgroundColor:'#013188', padding:3, borderWidth:1, 
                  borderColor:'#013188', borderRadius:4, justifyContent:'center', alignItems:'center', flex:0.1}}>
                  </View>:<View></View>
                }
              </Text>
              <View style={tailwind('flex-row  text-start items-start')}>
                <Text style={tailwind('   text-black text-xxs  ')}>Lot # </Text>
                <Text style={tailwind('  text-xdLightBlueDarker text-xxs  ')}>
                  {lotnumber}
                </Text>
              </View>

              {vin && (type=='new' || type == 'favorit' || type == 'towing' || type == 'cancelled' || type == 'all' || type == 'shipping' || type == 'store'|| type == 'loading'|| type == 'warehouse'|| type == 'port')?
                    <View style={tailwind('flex-row  text-start items-start')}>
                    <Text style={tailwind('   text-black text-xxs  ')}>{strings('car.vin')} </Text>
                    <Text style={tailwind('  text-xdLightBlueDarker text-xxs  ')}>
                      {vin}
                    </Text>
                  </View>
                :
                <View />
              }
              {aTitle ?
                   <RowText t1={strings('car.auction')} t2={aTitle} />
                :
                <View />
              }
              {purchasedate && (type=='new' || type == 'all' || type == 'loading' || type == 'port' || type == 'cancelled'
              || type == 'towing'  )?
                   <RowText t1={strings('car.purchase_date')} t2={purchasedate} />
                :
                <View />
              }
              {paymentDate && (type == 'new' || type == 'warehouse' || type == 'towing')?
                   <RowText t1={strings('car.payment_date')} t2={paymentDate} />
                :
                <View />
              }
              {picked_date && (type == 'towing' || type == 'warehouse')?
                   <RowText t1={strings('car.pick_date')} t2={picked_date} />
                :
                <View />
              }
              {delivered_date && (type == 'loading' || type == 'warehouse')?
                   <RowText t1={strings('car.delivered_datewar')} t2={delivered_date} />
                :
                <View />
              }
              {loaded_date && (type == 'loading')?
                   <RowText t1={strings('car.date_loaded')} t2={loaded_date} />
                :
                <View />
              }
              {eta && (type == 'loading' || type == 'shipping')?
                   <RowText t1={strings('car.eta')} t2={eta} />
                :
                <View />
              }
              {container_number && (type == 'loading' || type == 'shipping')?
                   <RowText t1={strings('car.container_id')} t2={container_number} />
                :
                <View />
              }
              {shipping_date && (type == 'loading' || type == 'shipping' || type == 'port')?
                   <RowText t1={strings('car.shipping_date')} t2={shipping_date} />
                :
                <View />
              }
              {booking_arrival_date && (type == 'loading' || type == 'shipping' || type == 'port')?
                   <RowText t1={strings('car.date_arrived_port')} t2={booking_arrival_date} />
                :
                <View />
              }
              {receive_date && (type == 'store')?
                   <RowText t1={strings('car.receive_date')} t2={receive_date} />
                :
                <View />
              }
              {deliver_create_date && (type == 'store')?
                   <RowText t1={strings('car.deliver_create_date')} t2={deliver_create_date} />
                :
                <View />
              }
              {re_name && type=='store' ?
                   <RowText t1={strings('car.deivered_by')} t2={re_name} />
                :
                <View />
              }
              {finesTotal ?
                   <RowText t1={strings('car.finesstore')} t2={ 'AED ' + finesTotal } />
                :
                <View />
              }
              {end_warehouse ?
                <RowText t1={strings('car.store')} t2={end_warehouse} />
                :
                <View />
              }
              {price ? 
                <View style={tailwind('flex-row  text-start items-start')}>
                  <Text style={{color:'green', fontWeight:'bold', paddingTop: '4%'}}>
                    AED {price}
                  </Text>
                </View>
                :
                <View />
              }
              {track ?
                   <TouchableOpacity
                        onPress={track}
                        style={tailwind(
                          'flex-row justify-between text-start items-start',
                        )}>
                        <Text style={tailwind('flex-1  text-lightblue text-xxs  ')}>
                          Track Vehicle..{' '}
                        </Text>
                 </TouchableOpacity>
                :
                <View />
              }
          </View>


          <View
            style={tailwind(
              'flex-col align-end content-end pr-4 pt-2 items-end  w-[16%] content-end align-bottom content-end',
            )}>
              {addNote?<TouchableOpacity onPress={addNote} style={{margin:'2%'}}>
              <Image
                style={{width: 20, height: 20, resizeMode: 'contain'}}
                source={require('../../assets/images/chat-icon.png')}
              />
            </TouchableOpacity>:<View></View>}
            
            {goToImages?<TouchableOpacity onPress={goToImages} style={{margin:'2%'}}>
              <Image
                style={{width: 20, height: 20, resizeMode: 'contain'}}
                source={require('../../assets/images/photo-icon.png')}
              />
            </TouchableOpacity>:<View></View>}
            
            {showNoteCars?<TouchableOpacity onPress={showNoteCars} style={{margin:'2%'}}>
              <Image
                style={{width: 20, height: 20, resizeMode: 'contain'}}
                source={require('../../assets/help_active.png')}
              />
            </TouchableOpacity>:<View></View>}

            {!paid_request_id && car_payment_to_cashier == "0"?<TouchableOpacity onPress={showPaidbyCustomer} style={{margin:'2%'}}>
              <Image
                style={{width: 20, height: 20, resizeMode: 'contain'}}
                source={require('../../assets/debit2.png')}
              />
            </TouchableOpacity>: (paid_request_id)?
            <View>
              <Image
                style={{width: 20, height: 20, resizeMode: 'contain'}}
                source={require('../../assets/cash.png')}
              />
            </View>:<View></View>}

            {sharePost?<TouchableOpacity onPress={sharePost} style={{margin:'2%'}}>
              <Image
                style={{width: 20, height: 20, resizeMode: 'contain'}}
                source={require('../../assets/shareIcon.png')}
              />
            </TouchableOpacity>:<View></View>}
            {deleteFav?<TouchableOpacity onPress={deleteFav} style={{margin:'2%'}}>
              <Image
                style={{width: 20, height: 20, resizeMode: 'contain'}}
                source={require('../../assets/deleteIcon.png')}
              />
            </TouchableOpacity>:<View></View>}

            {type != 'favorit' ? 
            <View style = {tailwind('flex-row mt-4 justify-between ')}>
              {(follow_car_title_note !== null || hasTitle) &&
                <TouchableOpacity
                  onPress={showNote}
                  style={tailwind(
                    `${hasTitle?
                      'bg-green': 'bg-redkey'} rounded-l-lg h-5 w-7 justify-center   items-center align-center  `,
                  )}>
                  {hasTitle ?
                    <Image
                      style={{width: 14, height: 14, resizeMode: 'contain'}}
                      source={require(`../../assets/images/note-icon.png`)}
                    />
                :
                <Image
                  style={{width: 14, height: 14, resizeMode: 'contain'}}
                  source={require(`../../assets/images/no_title.png`)}
                />}

                </TouchableOpacity>
              }
              <View
                style={tailwind(
                  `${delivered_car_key == '1'?
                    'bg-green': 'bg-redkey'} 'ml-1 rounded-r-lg h-5 w-7 justify-center
                    items-center align-center  `,
                )}>
                {delivered_car_key == '1'?
                    <Image
                      style={{width: 14, height: 14, resizeMode: 'contain'}}
                      source={require(`../../assets/images/key-icon.png`)}
                    />
                :
                <Image
                  style={{width: 14, height: 14, resizeMode: 'contain'}}
                  source={require(`../../assets/images/no-key-icon.png`)}
                />}
              </View>
            </View>:<View></View>}
          </View>

        </View>
      </TouchableOpacity>
    </View>
  );
};

const RowText = ({t1, t2}) => {
  const tailwind = useTailwind();
  return (
    <View style={tailwind('flex-row  w-[9rem] justify-between text-start items-start')}>
      <Text style={tailwind('   text-xxxs  ')}>{t1} </Text>
      <Text style={tailwind('  text-xxxs  ')}>
      {t2}{' '}
      </Text>
  </View>

  /**
   * 
<View style={tailwind('flex-row justify-between text-start items-start')}>
<Text style={tailwind('flex-initial w-[9rem] text-xxxs  ')}>{t1} </Text>
<Text style={tailwind('flex-initial  w-[9rem]  text-xxxs  ')}>
{t2}{' '}
</Text>
</View>
   */ 
  );
};

export default CarCard;
