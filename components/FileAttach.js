import { StyleSheet, Image, Button,View } from 'react-native'
import React from 'react'
import  { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const FileAttach = ({faUpload,height, width, imagesFiles, pickMultipleImages}) => {

return (
<View style={{height: height*0.15, borderWidth: 1, borderStyle: 'dashed', margin: '4%', borderRadius: 10,
    justifyContent:'center', alignItems:'center', flexDirection:'row'}}>
          <FontAwesomeIcon
              icon={ faUpload }
              color="#343D40" 
              size={width*0.06}
          />
          <View style={{flexDirection:'column'}}>
            <Button
                title="Attach"
                color="#343D40"
                onPress={pickMultipleImages}
            />
          </View>
              {/*Showing the data of selected Single file*/}
              {imagesFiles != null ? (
               imagesFiles.map((item,i) => {
                return( 
                <View>
                  <Image
                      style={{width:90, height:90}}
                      source={{uri: item.path}}
                  />
                </View>
                )
              })
              ) : null}
        </View>
  )
}

export default FileAttach

const styles = StyleSheet.create({})