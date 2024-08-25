import React from 'react';
import { StyleSheet, Dimensions, View, ImageBackground } from 'react-native';
//import PDFView from 'react-native-pdf';
//import PDFView from 'react-native-view-pdf';
import WebView from 'react-native-webview';
import { AuthContext } from '../components/context';
import Pdf from 'react-native-pdf';
import commonStyle from '../assets/style/styles.js';
export default class PafPreview extends React.Component {
    
    render() {
        const source = {uri: this.props.route.params.url,cache:true};
        return (
            <View style={styles.container}>
                <Pdf
                    trustAllCerts={false}
                    source={source}
                    onLoadComplete={(numberOfPages,filePath)=>{
                        //console.log(`number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages)=>{
                        //console.log(`current page: ${page}`);
                    }}
                    onError={(error)=>{
                        //console.log(error);
                    }}
                    onPressLink={(uri)=>{
                        //console.log(`Link presse: ${uri}`)
                    }}
                    style={styles.pdf}/>
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