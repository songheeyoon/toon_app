// 네이버 회원가입 페이지
import React, { useState } from 'react';
import { TouchableOpacity, Image, Text, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import axios from 'react-native-axios';
import Constants from '../Utils/Constant';
import RestAPI from '../Utils/RestAPI';

export default function NaverSignUp({ navigation }) {

    // const [code, setCode] = useState()
    // const [token, setToken] = useState()
    // const [userData, setUserData] = useState()

    async function handlePressAsync() {
        let redirectUrl = AuthSession.getRedirectUrl()

        const result = await AuthSession.startAsync({
            authUrl: 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + Constants.NaverClientID + '&redirect_uri=' + encodeURIComponent(redirectUrl)
        })
        // setCode(result.params.code)
        handleGetAccess(redirectUrl, result.params.code)
    }

    async function handleGetAccess(redirectUrl, code) {

        const res = await axios.get(
            'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=' + Constants.NaverClientID + '&client_secret=' + Constants.NaverClientSecret + '&code=' + code
        );


        const config = {
            headers: {
                Authorization: 'Bearer ' + res.data.access_token
            }
        }
        // setToken(res.data)
        const res_user = await axios.get('https://openapi.naver.com/v1/nid/me', config)
        // setUserData(res_user.data)


        if (res_user && res) {
            NaverSign(
                res_user.data.response.email,
                res_user.data.response.name,
                res_user.data.response.gender,
                res_user.data.response.age,
                res_user.data.response.id,
                res.data.access_token,
                res.data.refresh_token
            )
        }
    }

    const NaverSign = (email, name, gender, age_range, id, access_token, refresh_token) => {
        showPageLoader(true)
        RestAPI.socialRegister('naver', email, name, gender, age_range, id, access_token, refresh_token).then(res => {
            Alert.alert('알림', res.msg, [
                {
                    text: '확인',
                    onPress: () => {
                        navigation.navigate('login')
                    }
                }
            ])
        }).catch(err => {
            Alert.alert('오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {
            showPageLoader(false)
        })
    }




    return (
        <TouchableOpacity
            onPress={handlePressAsync}
            style={{
                flexDirection: 'row',
                width: Constants.WINDOW_WIDTH * 0.65,
                height: 44,
                paddingLeft: Constants.WINDOW_WIDTH * 0.05,
                alignItems: 'center',
                paddingVertical: 5,
                marginVertical: 5,
                borderRadius: 5,
                backgroundColor: '#EEE'
            }}
        >
            <Image source={require('../../assets/icons/new/naver.png')} style={{
                resizeMode: 'contain',
                width: 35,
                height: 35,
                marginLeft: -5,                
            }} />
            <Text style={{
                paddingLeft: 15,
                color: Constants.darkColor,
                fontSize: 16,
                color: 'black'
            }}>네이버로 회원가입</Text>
        </TouchableOpacity>
    )

    //     return (
    //         < TouchableOpacity
    //             onPress={handlePressAsync}
    //         >
    //             <Image source={require('../../assets/icons/kakao_signup.png')} style={{
    //                 resizeMode: 'contain',
    //                 width: 30
    //             }} />
    //         </TouchableOpacity >
    //     )

}