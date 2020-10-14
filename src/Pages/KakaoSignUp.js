// 카카오 회원가입 페이지
import React, { useState } from 'react';
import { TouchableOpacity, Image, Text, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import axios from 'react-native-axios';
import Constants from '../Utils/Constant';
import RestAPI from '../Utils/RestAPI';

export default function KakaoSignUp({ navigation }) {

    // const [code, setCode] = useState()
    // const [token, setToken] = useState()
    // const [userData, setUserData] = useState()

    async function handlePressAsync() {
        let redirectUrl = AuthSession.getRedirectUrl()

        const result = await AuthSession.startAsync({
            authUrl: 'https://kauth.kakao.com/oauth/authorize?client_id=' + Constants.restApiKey + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&response_type=code' + '&state=' + Constants.NaverState
        })
        // setCode(result.params.code)
        handleGetAccess(redirectUrl, result.params.code)
    }

    async function handleGetAccess(redirectUrl, code) {

        const res = await axios.get('https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=' + Constants.restApiKey + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&code=' + code)
            .catch(err => console.warn("axios error is : ", err));

        const config = {
            headers: {
                Authorization: 'Bearer ' + res.data.access_token
            }
        }

        // setToken(res.data)
        const res_user = await axios.get('https://kapi.kakao.com/v2/user/me', config)
        // setUserData(res_user.data)

        if (res_user && res) {
            kakaoSignUp(
                res_user.data.kakao_account.email,
                res_user.data.kakao_account.profile.nickname,
                '',
                res_user.data.kakao_account.age_range,
                res_user.data.id,
                res.data.access_token,
                res.data.refresh_token
            )
        }
        
    }

    const kakaoSignUp = (email, name, gender, age_range, id, access_token, refresh_token) => {
        showPageLoader(true)
        RestAPI.socialRegister('kakao', email, name, gender, age_range, id, access_token, refresh_token).then(res => {
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
            <Image source={require('../../assets/icons/new/kakao.png')} style={{
                resizeMode: 'contain',
                width: 25,
                height: 35,
            }} />
            <Text style={{
                paddingLeft: 20,
                color: Constants.darkColor,
                fontSize: 16,
                color: 'black'
            }}>카카오톡으로 회원가입</Text>
        </TouchableOpacity>
    )

}