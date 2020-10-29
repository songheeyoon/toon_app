import React, { useState, Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Platform, Alert, AsyncStorage } from 'react-native';
import Constants from '../Utils/Constant';
import * as GoogleSignIn from 'expo-google-sign-in';
import { NavigationContext } from '@react-navigation/native'
import RestAPI from '../Utils/RestAPI';
import KakaoSignUp from './KakaoSignUp';
import NaverSignUp from './NaverSignUp';
import AppleSign from './AppleSign';

export default class SignupScreen extends Component {
    state = { user: null }
    static contextType = NavigationContext;

    componentDidMount() {
        this.initAsync();
    }
    initAsync = async () => {
        await GoogleSignIn.initAsync({
            clientId: '444249620673-pea0ut2bbtthaqq32tdef3nqn3uugb6f.apps.googleusercontent.com',
        });
        this._syncUserWithStateAsync();
    };
    _syncUserWithStateAsync = async () => {
        const user = await GoogleSignIn.signInSilentlyAsync();
        this.setState({ user });
    };

    signOutAsync = async () => {
        await GoogleSignIn.signOutAsync();
        this.setState({ user: null });
    };

    signInAsync = async () => {
        const navigation = this.context;
        try {
            await GoogleSignIn.askForPlayServicesAsync();
            const { type, user } = await GoogleSignIn.signInAsync();
            if (type === 'success') {

                RestAPI.googleAppleRegister('google', user.email, user.firstName, user.lastName).then(async (res) => {
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
                    return
                }).finally(() => { })

            } else {
                alert("Oops", '구글로그인에서 문제가 발생하였습니다. 로그인 정보를 확인하고 다시 로그인해주세요!')
            }
        } catch ({ message }) {
            // alert('login: Error:' + message);
            Alert.alert('오류', '오류가 발생하였습니다. 로그인정보를 다시 확인해주세요.', [{ text: '확인' }])
        }
    };

    onPress = () => {
        if (this.state.user) {
            this.signOutAsync();
        } else {
            this.signInAsync();
        }
    };

    render() {
        const navigation = this.context
        return (
            <View style={styles.container}>
                <View style={styles.topView}>
                    <Text style={styles.title}>회원가입 방법을 선택하세요.</Text>
                </View>
                <View style={styles.bottomView}>
                    <View style={{ flex: 1, justifyContent: 'center', paddingTop: 30 }}>
                        <View style={{ flexDirection: 'column', alignItems: 'center', }}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('signupInput')
                                }}
                                style={styles.bottomBannerView}
                            >
                                <Image source={require('../../assets/icons/new/email.png')} style={{
                                    resizeMode: 'contain',
                                    width: 25,
                                    height: 35
                                }} />
                                <Text style={styles.btn}>이메일로 회원가입</Text>
                            </TouchableOpacity>
                            <NaverSignUp navigation={navigation} />
                            <KakaoSignUp navigation={navigation} />
                            {
                                Platform.OS == 'android' ?
                                    <TouchableOpacity
                                        onPress={this.onPress}
                                        style={styles.bottomBannerView}
                                    >
                                        <Image source={require('../../assets/icons/new/google.png')} style={{
                                            resizeMode: 'contain',
                                            width: 25,
                                            height: 35
                                        }} />
                                        <Text style={styles.btn}>Google로 회원가입</Text>
                                    </TouchableOpacity> :
                                    <AppleSign type={'signUp'} navigation={navigation} />

                            }


                            <View style={styles.bottomLinkView}>
                                <Text>픽툰 회원이신가요? </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate('login')
                                    }}>
                                    <Text style={styles.bottomTitle}>로그인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE',
    },
    title: { color: '#444', fontSize: 20, fontWeight: 'bold' },
    topView: {
        height: Constants.WINDOW_HEIGHT * 0.4,
        width: Constants.WINDOW_WIDTH,
        paddingTop: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomView: {
        position: 'absolute',
        bottom: 0,
        height: Constants.WINDOW_HEIGHT * 0.55,
        width: Constants.WINDOW_WIDTH,
        backgroundColor: 'white',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },
    bottomBannerView: {
        flexDirection: 'row',
        width: Constants.WINDOW_WIDTH * 0.65,
        height: 44,
        paddingLeft: Constants.WINDOW_WIDTH * 0.05,
        alignItems: 'center',
        paddingVertical: 5,
        marginVertical: 5,
        borderRadius: 5,
        backgroundColor: '#EEE'
    },
    btn: {
        paddingLeft: 20,
        color: Constants.darkColor,
        fontSize: 16,
    },
    bottomLinkView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 70,
    },
    bottomTitle: {
        textDecorationLine: 'underline',
        fontSize: 16,
        fontWeight: 'bold'
    },
})