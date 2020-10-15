import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, Alert, BackHandler, RefreshControl, Image, AsyncStorage, Linking } from 'react-native';
import { Header } from 'react-native-elements';
import Toast, { DURATION } from 'react-native-easy-toast';
import { UIActivityIndicator, MaterialIndicator } from "react-native-indicators";

import Constants, { topPadding, getCurUserIx, isIOS } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';
import BannerList from './BannerList';
import SliderTwoRow from './SliderTwoRow';
import HomeModal from './HomeModal';
import RestAPI from '../../Utils/RestAPI';
import HeaderRight from '../Components/HeaderRight';

import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as Network from 'expo-network';
import SliderOneRow from './SliderOneRow';

let backButtonPressedInMain = false;

// 홈 페이지
export default function HomeView({ navigation, route }) {
    let backhandler = null
    let toastRef = useRef()
    let scrollRef = useRef(null)
    const [homeData, getHomeData] = useState()

    // 기기의 uuid얻기
    const _getUUID = async () => {
        let UUID = null
        if (Platform.OS == 'android') {
            UUID = Application.androidId
        } else if (Platform.OS == 'ios') {
            UUID = await Application.getIosIdForVendorAsync()
        }
        return UUID
    }

    // 기기의 타입 판정하기
    const _getDeviceType = async () => {
        let ipAddress = await Network.getIpAddressAsync();
        let type = await Device.getDeviceTypeAsync();
        let device = Device.modelName;
        console.log("this is Ip address : ", ipAddress)
        console.log("this is device type : ", type)
        // console.log(global.deviceType+"글로벌")
        // for(var key in global){
        //     console.log("key:"+key + ",value:"+global[key]);
        // }
        global.deviceType = type
        global.deviceName = device
        global.ipAddress = ipAddress
    }


    // 기기의 권한 얻기
    const _checkPermission = async () => {
        let UUID = await _getUUID()
        global.UUID = UUID
        if (Device.isDevice) {
            let token = await _getPushTokenAsync()
            console.log(token)
            global.expoPushToken = token
        } else {
            global.expoPushToken = 'simulator'
        }
        return true
    }

    // 푸시알림을 위한 기기의 권한얻기 및 설정
    const _getPushTokenAsync = async () => {

        const resPush = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        console.log("notification status", resPush.status)
        if (resPush.status !== 'granted') {
            const askRes = await Permissions.askAsync(Permissions.NOTIFICATIONS)
            if (askRes.status != 'granted') {

                Alert.alert(
                    '오류',
                    '픽툰알림 허용을 하지 않고서는 알림을 받을수 없습니다. 지금 설정하시겠습니까?',
                    [
                        {
                            text: '취소',
                            onPress: () => { }
                        }
                        , {
                            text: '앱설정 바로가기',
                            onPress: () => {
                                if (Platform.OS === 'ios') {
                                    Linking.openURL('app-settings://notification');
                                } else {
                                    Linking.openSettings();
                                }
                            }
                        }
                    ]
                )
                return
            }
        }
        if(Platform.OS == 'android') {
            Notifications.createChannelAndroidAsync('push_message', {
                name: 'push_message',
                priority: 'high',
                sound: true,
                vibrate: true
            })
        }
        let token = await Notifications.getExpoPushTokenAsync();
        return token;
    }

    
    const _bootstrapAsync = async () => {
        let res = await _checkPermission()
        if (res == false) {
            return
        }
        AsyncStorage.getItem('cur_user', (err, data) => {
            console.log(err, data)
        }).then(data => {
            global.curUser = JSON.parse(data)
            console.log('Cur user data at Splash : ', global.curUser);
            // console.log("'"+global.curUser.name+"'"+"님을 위한 웹툰");
            navigation.navigate('draw');
        }).catch(err => {
            console.log('Err while get async data', err)
            navigation.navigate('draw');
        })

    }

    useEffect(()=>{
        _getDeviceType()
        _bootstrapAsync()
    },[])
    
    useEffect(() => {
        try {
            scrollRef.current?.scrollTo({
                animated: false,
                x: 0,
                y: 0
            })
        } catch (ex) {
            console.log(ex)
        }
        LoadHome()
    }, [getCurUserIx(), global.curUser?.name])

    // 홈페이지 부분에 현시할 웹툰목록 가져오기
    const LoadHome = () => {
        RestAPI.preProcess(getCurUserIx()).then(res => {
            if (res.msg == 'suc') {
                RestAPI.getHomeWebtoons(getCurUserIx()).then(res => {
                    if (res.success == 1) {
                        getHomeData(res)
                
                    } else {
                        Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
                        showPageLoader(false)
                    }
                }).catch(err => {
                    Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
                    showPageLoader(false)
                })
            }
        }).catch(err => {
            console.log(err)
            showPageLoader(false)
        }).finally(() => {
            showPageLoader(false)
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header
                rightComponent={<HeaderRight navigation={navigation} />}
                backgroundColor="#FFF"
                containerStyle={{
                    height: Constants.HeaderHeight,
                    alignItems: Platform.OS == 'ios' ? 'center' : 'flex-start',
                    marginTop: Platform.OS == 'ios' ? 0 : -15,
                }}
            />
            <View style={Platform.OS == 'ios' ? styles.containerIOS : styles.container}>
                <ScrollView
                    ref={scrollRef}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={LoadHome}
                        />
                    }
                >
                    <BannerList imgList={homeData ? homeData.banner : null} navigation={navigation} />
                    {
                        homeData ? homeData.data.map((item, index) => (
                            index == 0 || index == 1 || index == item.cate_name.length -1 || item.cate_name == "이번주 신작" ?
                            // item.cate_name == "이번주 신작" || item.cate_name == "가슴뛰는 스포츠 레전드" ||item.cate_name == "입꼬리 주의 개그 레전드"?
                                    <View key={index} style={global.deviceType == '1' ? styles.slideBodyWhite : styles.slideBodyWhiteTablet}>
                                    <Text style={global.deviceType == '1' ? styles.slideBodyWhiteInverseTitle : styles.slideBodyWhiteInverseTitleTablet}>{item.cate_name}</Text>
                                    <SliderOneRow
                                        textColor={item.cate_name} 
                                        images={item.webtoon_list}
                                        navigation={navigation}
                                        index={index}
                                        last={item.cate_name.length-1}
                                        />
                                    </View>
                             :
                                <View key={index} style={global.deviceType == '1' ? styles.slideBodyWhite : styles.slideBodyWhiteTablet}>
                                    <Text style={global.deviceType == '1' ? styles.slideBodyWhiteInverseTitle : styles.slideBodyWhiteInverseTitleTablet}>{item.cate_name}</Text>
                                    <SliderTwoRow
                                        textColor='black' 
                                        images={item.webtoon_list}
                                        navigation={navigation} />
                                </View>
                        )) :
                            <View style={{
                                flex: 1, justifyContent: 'center', alignItems: 'center',
                                width: Constants.WINDOW_WIDTH,
                                height: Platform.OS == 'ios' ? Constants.WINDOW_HEIGHT - 160 - topPadding() : Constants.WINDOW_HEIGHT - 110 - topPadding(),
                                marginTop: -Constants.WINDOW_WIDTH * 0.8,
                            }}>
                                <View style={Platform.OS == 'ios' ? styles.container_other_ios : styles.container_other} >
                                    {
                                        Platform.OS == 'ios' ?
                                            <UIActivityIndicator color={'black'} size={25} count={10} /> :
                                            <MaterialIndicator color={'black'} size={20} count={10} trackWidth={3} />
                                    }
                                </View>
                            </View>
                    }
                </ScrollView>
            </View>
            <BottomBar navigation={navigation} selTab={'1'} />
            {
                getCurUserIx() != '' && homeData && (homeData.favor_count != '1' || homeData.favor_count != 1) ?
                    <HomeModal isVisible={true} navigation={navigation} /> :
                    null
            }
            <Toast ref={toastRef} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Constants.WINDOW_HEIGHT - 100 - topPadding(),
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    containerIOS: {
        height: Constants.WINDOW_HEIGHT - 160 - topPadding(),
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    slideBody: {
        width: Constants.WINDOW_WIDTH,
        justifyContent: 'flex-start'
    },
    slideBodyWhite: { paddingTop: 20 },
    slideBodyBlack: { paddingTop: 20, backgroundColor: '#333' },
    slideBodyWhiteTablet: { paddingTop: 20, width: Constants.WINDOW_WIDTH },
    slideBodyBlackTablet: { paddingTop: 20, backgroundColor: '#333', width: Constants.WINDOW_WIDTH },

    slideBodyWhiteInverseTitle: { paddingLeft: 10, fontSize: 17, fontWeight: 'bold' },
    slideBodyBlackInverseTitle: { paddingLeft: 10, fontSize: 17, fontWeight: 'bold', color: 'white' },
    slideBodyWhiteInverseTitleTablet: { paddingLeft: 20, fontSize: 21, fontWeight: 'bold' },
    slideBodyBlackInverseTitleTablet: { paddingLeft: 20, fontSize: 21, fontWeight: 'bold', color: 'white' },
    container_other: {
        height: 40,
        paddingHorizontal: 10,
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: 'white',
        elevation: 5
    },
    container_other_ios: {
        height: 41,
        paddingHorizontal: 8,
        justifyContent: 'center',
        borderRadius: 21,
        backgroundColor: 'white',
    }
});