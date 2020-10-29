import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, 
         KeyboardAvoidingView, Platform, Alert, AsyncStorage, Keyboard } from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';
import { NavigationContext } from '@react-navigation/native'

import Constants, { getCurUserIx } from '../Utils/Constant';
import RestAPI from '../Utils/RestAPI';
import KakaoLogin from './KakaoLogin';
import NaverLogin from './NaverLogin';
import AppleSign from './AppleSign';

export default class LoginScreen extends Component {
    static contextType = NavigationContext;

    state = {
        id: '',
        password: '',
        user: null,
    }

    componentDidMount() {
        this.initAsync();
    }
    // 구글 로그인
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

    // 구글 로그아웃
    signOutAsync = async () => {
        await GoogleSignIn.signOutAsync();
        this.setState({ user: null });
    };

    // 로그인 진행
    signInAsync = async () => {
        const navigation = this.context
        try {
            await GoogleSignIn.askForPlayServicesAsync();
            const {type, user} = await GoogleSignIn.signInAsync();
            if (type === 'success') {

                RestAPI.googleAppleLogin('google', user.email, user.firstName, user.lastName).then(async (res) => {
                    if (res.msg == 'suc') {
                        global.curUser = res
                        await AsyncStorage.setItem('cur_user', JSON.stringify(res))
                        navigation.navigate('draw')
                    } else {
                        Alert.alert('로그인 오류', '이메일로 회원가입을 진행하였는지 확인해 주세요. 이메일로 회원가입을 하지 않았다면 회원가입후 진행해주세요!', [{ text: '확인' }])
                        return
                    }
                }).catch(err => {
                    Alert.alert('오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
                    return
                }).finally(() => {})

            } else {
                alert("Oops", '구글로그인에서 문제가 발생하였습니다. 로그인 정보를 확인하고 다시 시도해주세요!')
            }
        } catch ({ message }) {
            // alert('login: Error:' + message);
            Alert.alert('오류', '오류가 발생하였습니다. 로그인정보를 다시 확인해주세요.', [{ text: '확인'}])
        }
    };

    onPress = () => {
        if (this.state.user) {
            this.signOutAsync();
        } else {
            this.signInAsync();
        }
    };


    // 이메일로 로그인
    Login = () => {
        const navigation = this.context
        if (this.state.id == "") {
            Alert.alert('오류', '이메일(아이디)을 입력해주세요!', [{ text: '확인' }])
            return
        } else if (this.state.password == "") {
            Alert.alert('오류', '비밀번호를 입력해주세요!', [{ text: '확인' }])
            return
        }
        showPageLoader(true)
        RestAPI.login(this.state.id, this.state.password).then(async (res) => {
            if (res.msg == 'suc') {
                global.curUser = res
                await AsyncStorage.setItem('cur_user', JSON.stringify(res))
                navigation.navigate('home', {userIx: getCurUserIx()})
            } else {
                Alert.alert('로그인 오류', '이메일(아이디)과 비밀번호가 정확하지 않습니다!', [{ text: '확인' }])
                return
            }
        }).catch(err => {
            Alert.alert('오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            return
        }).finally(() => {
            showPageLoader(false)
        })
    }
    render() {
        const navigation = this.context
        return (
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS == "ios" ? "padding" : 0}
                enabled >
                <View style={styles.container}>
                    <View style={styles.topView}>
                        <Image
                            source={require('../../assets/splash.png')}
                            style={{ width: Constants.WINDOW_WIDTH, height: Constants.WINDOW_WIDTH }}
                        />
                    </View>
                    <View style={styles.bottomView}>

                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'column', alignItems: 'center', }}>
                                <Text style={styles.title}>로그인</Text>
                                <TextInput
                                    style={styles.inputFieldView}
                                    onChangeText={id => this.setState({ id })}
                                    value={this.state.id}
                                    placeholder={'이메일'}
                                />
                                <TextInput
                                    style={styles.inputFieldView}
                                    onChangeText={password => this.setState({ password })}
                                    value={this.state.password}
                                    secureTextEntry={true}
                                    placeholder={'비밀번호'}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        Keyboard.dismiss()
                                        this.Login()
                                    }}
                                    style={styles.bottomBannerView}
                                >
                                    <Text style={styles.loginBtn}>login</Text>
                                </TouchableOpacity>
                                <View style={styles.socialBtns}>
                                    <View style={{ ...styles.socialBtn, backgroundColor: '#ffdf00' }}>
                                        <KakaoLogin navigation={navigation} />
                                    </View>
                                    <View style={{ ...styles.socialBtn, backgroundColor: '#01c73c' }}>
                                        <NaverLogin navigation={navigation} />
                                    </View>
                                    {
                                        Platform.OS == 'android' ?
                                            <View style={{ ...styles.socialBtn, backgroundColor: '#ee4822' }}>
                                                <TouchableOpacity
                                                    onPress={this.onPress}
                                                >
                                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>G</Text>
                                                </TouchableOpacity>
                                            </View> :
                                            <AppleSign type={'login'} navigation={navigation} />
                                    }

                                </View>
                                <View style={styles.bottomLinkView}>
                                    <Text>픽툰이 처음이신가요? </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({id: ''})
                                            this.setState({password: ''})
                                            navigation.navigate('signupAgree')
                                        }}>
                                        <Text style={styles.bottomTitle}>회원가입</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE',
    },
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
        height: Constants.WINDOW_HEIGHT * 0.6,
        width: Constants.WINDOW_WIDTH,
        backgroundColor: 'white',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },
    inputFieldView: {
        padding: 10,
        borderColor: '#DDD',
        borderWidth: 1,
        width: Constants.WINDOW_WIDTH * 0.7,
        marginTop: 15,
        borderRadius: 5,
        fontSize: 16,
    },
    bottomBannerView: {
        backgroundColor: Constants.darkColor,
        width: Constants.WINDOW_WIDTH * 0.7,
        alignItems: 'center',
        paddingVertical: 15,
        marginTop: 15,
        marginBottom: 30,
        borderRadius: 5
    },
    loginBtn: {
        color: 'white',
        fontSize: 17,
    },
    title: {
        fontSize: 20,
        paddingBottom: 10,
        fontWeight: 'bold'
    },
    socialBtns: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    socialBtn: {
        height: 44, width: 44, padding: 5,
        borderRadius: 22,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottomLinkView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50
    },
    bottomTitle: {
        textDecorationLine: 'underline',
        fontSize: 16,
        fontWeight: 'bold'
    },
})