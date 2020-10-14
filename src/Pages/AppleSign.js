// 애플로 회원가입 및 로그인 페이지
import React, { useState, Component } from 'react';
import { View, Alert, AsyncStorage } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import Constants, {getCurUserIx} from '../Utils/Constant';
import RestAPI from '../Utils/RestAPI';


export default function AppleSign({ type, navigation }) {

    let decoded = require('jwt-decode')

    // 애플로 등록
    const AppleSignUp = (email, name) => {
        showPageLoader(true)
        RestAPI.googleAppleRegister('apple', email, name, '').then(res => {
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

    // 애플로 로그인
    const AppleSignIn = (email, name) => {
        showPageLoader(true)
        RestAPI.googleAppleLogin('apple', email, name, '').then(async (res) => {
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
            Alert.alert('오류', err.message, [{ text: '확인' }])
        }).finally(() => {
            showPageLoader(false)
        })
    }

    return (
        <View style={
            type == 'signUp' ?
                { marginTop: 5 } :
                { marginHorizontal: 10 }
        }>
            {
                type == 'signUp' ?
                    <AppleAuthentication.AppleAuthenticationButton
                        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                        cornerRadius={5}
                        style={{ width: Constants.WINDOW_WIDTH * 0.65, height: 44 }}
                        onPress={async () => {
                            try {
                                const credential = await AppleAuthentication.signInAsync({
                                    requestedScopes: [
                                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                                        AppleAuthentication.AppleAuthenticationScope.EMAIL,
                                    ],
                                });
                                console.log("this is apple data in signUp : ", credential)
                                if (credential.email) {
                                    AppleSignUp(credential.email, credential.fullName.familyName + " " + credential.fullName.givenName)
                                } else {

                                    if (credential.identityToken) {
                                        AppleSignUp(decoded(credential.identityToken).email, '')
                                    } else {
                                        Alert.alert('오류', '문제가 발생하였습니다. 계정정보를 확인하고 다시 등록해주세요!', [{ text: '확인' }])
                                    }
                                }
                                // signed in
                            } catch (e) {
                                if (e.code === 'ERR_CANCELED') {
                                    // handle that the user canceled the sign-in flow
                                } else {
                                    // handle other errors
                                }
                            }
                        }}
                    /> :
                    <AppleAuthentication.AppleAuthenticationButton
                        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                        cornerRadius={22}
                        style={{ width: 44, height: 44 }}
                        onPress={async () => {
                            try {
                                const credential = await AppleAuthentication.signInAsync({
                                    requestedScopes: [
                                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                                        AppleAuthentication.AppleAuthenticationScope.EMAIL,
                                    ],
                                });

                                if (credential.email) {
                                    AppleSignIn(credential.email, credential.fullName.familyName + " " + credential.fullName.givenName)
                                } else {
                                    if (credential.identityToken) {
                                        AppleSignIn(decoded(credential.identityToken).email, '')
                                    } else {
                                        Alert.alert('오류', '문제가 발생하였습니다. 계정정보를 확인하고 다시 등록해주세요!', [{ text: '확인' }])
                                    }
                                }

                                // signed in
                            } catch (e) {
                                if (e.code === 'ERR_CANCELED') {
                                    // handle that the user canceled the sign-in flow
                                } else {
                                    // handle other errors
                                }
                            }
                        }}
                    />
            }
        </View>

    );
}