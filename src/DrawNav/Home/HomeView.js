import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, Alert, BackHandler, RefreshControl, Image, AsyncStorage, Linking, AppState } from 'react-native';
import { Header } from 'react-native-elements';
import Toast, { DURATION } from 'react-native-easy-toast';
import { UIActivityIndicator, MaterialIndicator } from "react-native-indicators";

import Constants, { topPadding, getCurUserIx, isIOS, isIPhoneX } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';
import BannerList from './BannerList';
import SliderTwoRow from './SliderTwoRow';
import HomeModal from './HomeModal';
import RestAPI from '../../Utils/RestAPI';
import HeaderRight from '../Components/HeaderRight';

// import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as Network from 'expo-network';
import SliderOneRow from './SliderOneRow';

import * as Notifications from 'expo-notifications';
// import {Notifications as Notifications2} from 'expo';

let backButtonPressedInMain = false;

// 홈 페이지
export default function HomeView({ navigation, route }) {
    let backhandler = null
    let toastRef = useRef()
    let scrollRef = useRef(null)
    const [homeData, getHomeData] = useState()
    const [appState, setAppstate] = useState(AppState.currentState);

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

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });

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
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
              });
        }
        let token = (await Notifications.getExpoPushTokenAsync()).data;
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
// 웹툰 상세정보 얻기
const LoadWebtoonDetail = (webtoonIx) => {
    RestAPI.getWebtoonDetail(getCurUserIx(), webtoonIx).then(res => {
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
    useEffect(()=>{
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response,"알림값");
            const url = response.notification.request.content.data.body.title;
            const ix = response.notification.request.content.data.body.body;
            if(url == 'picktoon:///draw/detailView'){
                LoadWebtoonDetail(ix);
            }else if(url == 'picktoon:///draw/clientCenterBoardDetail'){
                getFaqList(ix);
            }else{
                navigation.navigate(url);                
            }
            // console.log(url,"url");
            // Linking.openURL(url);
          });
          return () => subscription.remove();
    },[navigation])

    // useEffect(()=>{
    //     AppState.addEventListener('change',handleChange);
    //     return () => {
    //      AppState.removeEventListener('change',handleChange);
    //     }
    //   })
   
    //   const handleChange = nextAppState => {
    //      setAppstate(appState => nextAppState);
    //      if(nextAppState === null){
    //         console.log("app is in background mode");
    //         Notifications2.addListener((response) => {
         
    //          console.log(response,"background");
    //          const url = response.data.title;
    //          const ix = response.data.body;
    //          if(url == 'picktoon:///draw/detailView'){
    //              LoadWebtoonDetail(ix);
    //          }else if(url == 'picktoon:///draw/clientCenterBoardDetail'){
    //              getFaqList(ix);
    //          }else{
    //              navigation.navigate(url);                
    //          }
    //         });
    //       }
    //      if(nextAppState === 'background'){
    //        console.log("app is in background mode");
    //        Notifications2.addListener((response) => {
        
    //         console.log(response,"background");
    //         const url = response.data.title;
    //         const ix = response.data.body;
    //         if(url == 'picktoon:///draw/detailView'){
    //             LoadWebtoonDetail(ix);
    //         }else if(url == 'picktoon:///draw/clientCenterBoardDetail'){
    //             getFaqList(ix);
    //         }else{
    //             navigation.navigate(url);                
    //         }
    //        });
    //      }
    //      if(nextAppState === 'active'){
    //        console.log("app is in active foreground mode");
    //        Notifications2.addListener((response) => {
        
    //         console.log(response,"background");
    //         const url = response.data.title;
    //         const ix = response.data.body;
    //         if(url == 'picktoon:///draw/detailView'){
    //             LoadWebtoonDetail(ix);
    //         }else if(url == 'picktoon:///draw/clientCenterBoardDetail'){
    //             getFaqList(ix);
    //         }else{
    //             navigation.navigate(url);                
    //         }
    //        });
    //      }
    //      if(nextAppState === 'inactive'){
    //        console.log("app is in inactive mode")
    //        Notifications2.addListener((response) => {
    //         console.log(response,"inactive");
    //         const url = response.data.title;
    //         const ix = response.data.body;
    //         if(url == 'picktoon:///draw/detailView'){
    //             LoadWebtoonDetail(ix);
    //         }else if(url == 'picktoon:///draw/clientCenterBoardDetail'){
    //             getFaqList(ix);
    //         }else{
    //             navigation.navigate(url);                
    //         }
    //        });        
    //      }
   
    //   }

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
            <View style={isIPhoneX() ? styles.containerX : Platform.OS == 'ios' ? styles.containerIOS : styles.container}>
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
                            item.layout_type == "A" || item.layout_type == "B" || item.layout_type == "C_2" ?
                                    <View key={index} style={global.deviceType == '1' ? styles.slideBodyWhite : styles.slideBodyWhiteTablet}>
                                    <Text style={global.deviceType == '1' ? styles.slideBodyWhiteInverseTitle : styles.slideBodyWhiteInverseTitleTablet}>{item.cate_name}</Text>
                                    <SliderOneRow
                                        type={item.layout_type} 
                                        images={item.webtoon_list}
                                        navigation={navigation}
                                        />
                                    </View>
                             :
                                <View key={index} style={global.deviceType == '1' ? styles.slideBodyWhite : styles.slideBodyWhiteTablet}>
                                    <Text style={global.deviceType == '1' ? styles.slideBodyWhiteInverseTitle : styles.slideBodyWhiteInverseTitleTablet}>{item.cate_name}</Text>
                                    <SliderTwoRow
                                        textColor='black' 
                                        images={item.webtoon_list}
                                        navigation={navigation} 
                                        type={item.layout_type}
                                        />
                                </View>
                        )) :
                            <View style={{
                                flex: 1, justifyContent: 'center', alignItems: 'center',
                                width: Constants.WINDOW_WIDTH,
                                height: Platform.OS == 'ios' ? Constants.WINDOW_HEIGHT - topPadding() -120 : Constants.WINDOW_HEIGHT - topPadding() -80,
                                marginTop: global.deviceType == '1' ? -Constants.WINDOW_WIDTH *0.7: -Constants.WINDOW_HEIGHT * 0.35
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
    containerIOS: {
        height: Constants.WINDOW_HEIGHT - 130 - topPadding(),
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    container: {
        height: Constants.WINDOW_HEIGHT - 100 - topPadding(),
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    containerX: {
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
        backgroundColor: 'white'
    }
});