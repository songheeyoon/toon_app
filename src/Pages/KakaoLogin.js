// 카카오 로그인 페이지
import React, { useState } from 'react';
import { TouchableOpacity, Image, Text, Alert, AsyncStorage } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import axios from 'react-native-axios';
import Constants, {getCurUserIx} from '../Utils/Constant';
import RestAPI from '../Utils/RestAPI';

export default function KakaoLogin({ navigation }) {
    // const [code, setCode] = useState()
    // const [token, setToken] = useState()
    // const [userData, setUserData] = useState()


    async function handlePressAsync() {
        let redirectUrl = 'https://auth.expo.io/@toonlab/picktoon_expo'

        console.log(encodeURIComponent(redirectUrl),"값")
        const result = await AuthSession.startAsync({
            authUrl: 'https://kauth.kakao.com/oauth/authorize?client_id=' + Constants.restApiKey + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&response_type=code'
            ,returnUrl: "picktoon://--/expo-auth-session"
        })
        console.log("this is : ", result)
        // setCode(result.params.code)

        // handleGetAccess(redirectUrl, result.params.code)
    }

    async function handleGetAccess(redirectUrl, code) {

        const res = await axios.get(
            'https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=' + Constants.restApiKey + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&code=' + code
        ).catch(err => console.warn("axios error is : ", err));

        // console.log('https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=' + Constants.restApiKey + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&code=' + code)
        // console.log("access_token is : ", res.data.access_token)

        const config = {
            headers: {
                Authorization: 'Bearer ' + res.data.access_token
            }
        }

        // setToken(res.data)

        const res_user = await axios.get('https://kapi.kakao.com/v2/user/me', config)
        // console.log("res_user is : ", res_user.data)
        // setUserData(res_user.data)

        if (res_user && res) {
            // console.log(userData + "-------------------" + token)
            kakaoLogin(
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

    // 카카오 로그인
    const kakaoLogin = (email, name, gender, age_range, id, access_token, refresh_token) => {
        showPageLoader(true)
        RestAPI.socialLogin('kakao', email, name, gender, age_range, id, access_token, refresh_token).then(async (res) => {

            console.log("this is the return value from the server: ", res)

            if (res.msg == 'suc') {
                global.curUser = res
                await AsyncStorage.setItem('cur_user', JSON.stringify(res))
                navigation.navigate('home', {userIx: getCurUserIx()})
            } else {
                Alert.alert('로그인 오류', '이메일로 회원가입을 진행하였는지 확인해 주세요. 이메일로 회원가입을 하지 않았다면 회원가입후 진행해주세요!', [
                    {
                        text: '확인',
                        onPress: () => {
                            navigation.navigate('signupAgree')
                        }
                    }
                ])
                return
            }
        }).catch(err => {
            Alert.alert('오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {
            showPageLoader(false)
        })
    }

    return (
        < TouchableOpacity
            onPress={handlePressAsync}
        >
            <Image source={require('../../assets/icons/new/kakao-black.png')} style={{
                resizeMode: 'contain',
                width: 22
            }} />
        </TouchableOpacity >
    )

}