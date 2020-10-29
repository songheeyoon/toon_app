import React, { useState } from 'react';
import { Linking, Image, View, AsyncStorage, Platform, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as Network from 'expo-network';

import * as Notifications from 'expo-notifications';

export default function SplashInitialScreen({ route, navigation }) {

    const _getUUID = async () => {
        let UUID = null
        if (Platform.OS == 'android') {
            UUID = Application.androidId
        } else if (Platform.OS == 'ios') {
            UUID = await Application.getIosIdForVendorAsync()
        }
        return UUID
    }

    const _getDeviceType = async () => {
        let ipAddress = await Network.getIpAddressAsync();
        let type = await Device.getDeviceTypeAsync();
        let device = Device.modelName;
        // console.warn("this is Ip address : ", ipAddress)
        global.deviceType = type
        global.deviceName = device
        global.ipAddress = ipAddress
    }

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

    const _getPushTokenAsync = async () => {

        const resPush = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        if (resPush.status !== 'granted') {
            
            const askRes = await Permissions.askAsync(Permissions.NOTIFICATIONS)
            if (askRes.status != 'granted') {

                Alert.alert(
                    '오류',
                    '픽툰알림 허용을 하지 않고서는 알림을 받을수 없습니다. 지금 설정하시겠습니까?',
                    [
                        {
                            text: '취소',
                            onPress: () => {

                            }
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
            console.log('Cur user data at Splash : ', global.curUser)
            navigation.navigate('draw');
        }).catch(err => {
            console.log('Err while get async data', err)
            navigation.navigate('draw');
        })

    }

    useFocusEffect(React.useCallback(() => {
        _getDeviceType()
        _bootstrapAsync()
    }, []))

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
            <Image
                style={{ width: '100%', }}
                resizeMode={"contain"}
                source={require("../../assets/splash.png")}
            />
            {/* <BallIndicator style={{ position: 'absolute', bottom: 20 }} color={Constants.mainColor} size={30} /> */}
        </View>
    )
}