import React, { useState, useEffect } from 'react';
import { Header } from 'react-native-elements';
import { View, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

import HeaderRight from '../Components/HeaderRight';
import BottomBar from '../Components/BottomBar';
import Constants from '../../Utils/Constant';
import { useFocusEffect } from '@react-navigation/native';

// 해당 웹툰의 외부링크 인앱 브라우저로 켜기
export default function DetailWebView({navigation, route}) {
    const [link, setLink] = useState(route.params.link);
    const [show,setShow] = useState('flex');
    
    useEffect(()=>{
        if(route.params.link) {
            setLink(route.params.link)
        }
    }, [route.params.link])
    
    let jsStr = ` 
    var initTop=0;
    window.addEventListener('scroll',function(e){
        var info = navigator.userAgent.toLowerCase();
        var currTop;

        if(info.indexOf('iphone')>=0){
            currTop=document.body.scrollTop;
        }else{
            currTop=document.documentElement.scrollTop;
        }
        if(currTop>initTop){
            window.ReactNativeWebView.postMessage('none');              
        }else if(currTop<=initTop){
            window.ReactNativeWebView.postMessage('flex');  
        }
        initTop = currTop;
    });
    true;
`;


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header
                leftComponent={
                    <TouchableOpacity onPress={() => {
                        navigation.goBack()
                    }}>
                        <MaterialCommunityIcons name="chevron-left" size={30} color={Constants.mainColor} />
                    </TouchableOpacity>
                }
                rightComponent={<HeaderRight navigation={navigation} />}
                backgroundColor="#FFF"
                containerStyle={{ 
                    height: Constants.HeaderHeight, 
                    alignItems: Platform.OS == 'ios' ? 'center' : 'flex-start',
                    marginTop: Platform.OS == 'ios' ? 0 : -15,
                    display:show
                }}
            />
            <WebView 
                style={{flex: 1}}
                source={{ uri: link ? link : ''}}
                decelerationRate={100} // 속도 높이려고 추가
                javaScriptEnabled={true}
                injectedJavaScript={jsStr}
                onMessage={(event)=>{
                    setShow(event.nativeEvent.data);    
                }}
            />
            <BottomBar navigation={navigation} selTab={route.params.selTabIndex} name={show}/>
        </View>
    )
}