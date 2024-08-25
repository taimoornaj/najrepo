import React from 'react';
import { StyleSheet, Image, Dimensions, Text, SafeAreaView, View, ImageBackground, TouchableOpacity } from 'react-native';
import Pdf from 'react-native-pdf';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import commonStyle from '../assets/style/styles.js';
import { strings } from '../locals/i18n';

const {width, height} = Dimensions.get('window'); 

export default class PriceFilesViewer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loader      : false,
            fulldata    : [],
            post_page   : 0,
            load_more   : false,
            arrays      :[],
            modalmsg    : false,
            msg         : '',
            name        : '',
            email       : '',
            phone       : '',
            pageload    : '',
            check_emailInputChange: true,
        }
        this.props.navigation.setOptions({
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
                    <Text style={commonStyle.headerText}>{this.props.route.params.name}</Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'center',alignItems: 'center', flex: 0.2}}>
                    <Text style={commonStyle.headerText}></Text>
                  </View>
                </View>       
            </View>)
        });
    }
    render() {
        const source = {
            uri: this.props.route.params.url,
            cache: true,
          };
        return (
            <View style={styles.container}>
            <Pdf
              source={source}
              trustAllCerts={Platform.OS === 'ios'}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`current page: ${page}`);
              }}
              onError={error => {
                console.log(error);
              }}
              onPressLink={uri => {
                console.log(`Link presse: ${uri}`);
              }}
              style={styles.pdf}
            />
          </View>
        );
  }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});