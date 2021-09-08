// 네이버 로그인 페이지
import React, { useState } from 'react';
import { TouchableOpacity, Image, Text, Alert, AsyncStorage } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import axios from 'react-native-axios';
import Constants, {getCurUserIx} from '../Utils/Constant';
import RestAPI from '../Utils/RestAPI';

export default function NaverLogin({ navigation }) {
    // const [code, setCode] = useState()
    // const [token, setToken] = useState()
    // const [userData, setUserData] = useState()

    async function handlePressAsync() {
        let redirectUrl = 'https://auth.expo.io/@toonlab/picktoon_expo';
        const result = await AuthSession.startAsync({
            authUrl: 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + Constants.NaverClientID + '&redirect_uri=' + encodeURIComponent(redirectUrl)
        })

        // setCode(result.params.code)
        handleGetAccess(redirectUrl, result.params.code)
    }

    async function handleGetAccess(redirectUrl, code) {

        const res = await axios.get(
            'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=' + Constants.NaverClientID + '&client_secret=' + Constants.NaverClientSecret + '&code=' + code
        )

        const config = {
            headers: {
                Authorization: 'Bearer ' + res.data.access_token
            }
        }

        // setToken(res.data)
        const res_user = await axios.get('https://openapi.naver.com/v1/nid/me', config)
        // setUserData(res_user.data)

        // console.log("this is naver login data : ", res_user.data)


        if (res_user && res) {
            NaverLogin(
                res_user.data.response.email,
                res_user.data.response.name,
                res_user.data.response.gender,
                res_user.data.response.age,
                res_user.data.response.id,
                res.data.access_token,
                res.data.refresjtoken
            )
        }

    }

    const NaverLogin = (email, name, gender, age_range, id, access_token, refresh_token) => {
        showPageLoader(true)
        RestAPI.socialLogin('naver', email, name, gender, age_range, id, access_token, refresh_token).then(async (res) => {
            if (res.msg == 'suc') {
                global.curUser = res
                await AsyncStorage.setItem('cur_user', JSON.stringify(res))
                navigation.navigate('home', {userIx: getCurUserIx()})
            } else {
                Alert.alert('로그인 오류', '이메일로 회원가입을 진행하였는지 확인해 주세요. 이메일로 회원가입을 하지 않았다면 회원가입후 진행해주세요!', [{
                    text: '확인',
                    onPress: () => {
                        navigation.navigate('signupAgree')
                    }
                }])
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
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>N</Text>
        </TouchableOpacity >
    )

}