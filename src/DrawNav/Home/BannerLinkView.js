import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, KeyboardAvoidingView, Alert, Image, Animated, Easing, Keyboard } from 'react-native';
import { Header } from 'react-native-elements';
import { MaterialIcons, MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons';
import '@expo/vector-icons';
import { WebView } from 'react-native-webview';

import Constants, { topPadding, getCurUserIx } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';
import HeaderRight from '../Components/HeaderRight';
import RestAPI from '../../Utils/RestAPI';

import { CommonActions } from '@react-navigation/native';

// 웹툰 프로필 페이지
export default function BannerLinkView({ route, navigation }) {
    const [show,setShow] = useState('flex');
    const [data,setData] = useState();
    const [faqList, setFaqList] = useState()
    

    let jsStr = ` 
    var initTop=0;
    var delta = 15;
    window.addEventListener('scroll',function(e){
    
        var currTop;
        
        currTop=document.documentElement.scrollTop;
        if(currTop==0){
            currTop=document.body.scrollTop;
        }

        if((currTop>initTop)&&(initTop>0)){
                window.ReactNativeWebView.postMessage('none');
        }else{
            if(currTop + window.innerHeight < document.documentElement.scrollHeight-30) {
               window.ReactNativeWebView.postMessage('flex');  
            }  
            
        }


        initTop = currTop;
    });
    true;
`;
    let curUserIx = ''
    global.curUser ? curUserIx = global.curUser.user_ix : curUserIx = ''

// 웹툰 상세정보 얻기
 const LoadWebtoonDetail = (webtoonIx) => {
    RestAPI.getWebtoonDetail(curUserIx, webtoonIx).then(res => {
        if (res.success == 1) {
            console.log(res.data[0],"res값");
            
            navigation.navigate('detailView', { webtoon : res.data[0], selTabIndex: '1' });

        } else {
            Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }
    }).catch(err => {
        Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
    }).finally(() => { })
}
// 공지사항 정보 얻기 
const getFaqList = (noticeIx) => {
    showPageLoader(true)
    RestAPI.getBoard().then(res => {

       res.map((item,idx)=>{
            if(item.ix == noticeIx){
                navigation.navigate('clientCenterBoardDetail', { data : item },);
            }
       })
    }).catch(err => {
        Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
    }).finally(() => {
        showPageLoader(false)
    })
}
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
                // rightComponent={<HeaderRight navigation={navigation} />}
                backgroundColor="#FFF"
                containerStyle={{
                    height: Constants.HeaderHeight,
                    alignItems: Platform.OS == 'ios' ? 'center' : 'flex-start',
                    marginTop: Platform.OS == 'ios' ? 0 : -15,
                    display:show
                }}
            />
            <WebView 
                style={{flex: 1, marginTop: Platform.OS == 'ios' && show == "none" ? 60 : 0}}
                // source={{ uri: link ? link : ''}}
                source={{ uri:route.params.link }}
                decelerationRate={100} // 속도 높이려고 추가
                javaScriptEnabled={true}
                // injectedJavaScript={jsStr}
                onMessage={(event)=>{
                    const data = JSON.parse(event.nativeEvent.data)

                    if(data.page == 'detailView'){
                        console.log('웹툰')
                        LoadWebtoonDetail(data.param);

                    }else if(data.page == 'clientCenterBoardDetail'){
                        console.log('공지')
                        getFaqList(data.param);

                    }else{
                        console.log('기타')
                        navigation.navigate(data.page,{ event : data.param});

                    }
                }}
            />
            <BottomBar navigation={navigation} selTab={route.params.selTabIndex} name={show}/>  
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Constants.WINDOW_HEIGHT - 140 - topPadding(),
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    bottomToolBarHidden: {
        margin: 0,
        position: 'absolute',
        bottom: 70,
        height: 30,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#AAA'
    },
    bottomToolBarHiddenAndroid: {
        margin: 0,
        position: 'absolute',
        bottom: 50,
        height: 30,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#AAA',
        borderBottomColor: 'white'
    },
    directionIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        width: Constants.WINDOW_WIDTH,
    },
})