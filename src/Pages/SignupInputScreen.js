// 이메일로 회원가입 부분
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Constants from '../Utils/Constant';
import RestAPI from '../Utils/RestAPI';

export default function SignupInputScreen({ navigation }) {
    const [name, onChangeName] = useState('');
    const [id, onChangeId] = useState('');
    const [password, onChangePassword] = useState('');
    const [passwordConfirm, onChangePasswordConfirm] = useState('');
    const SignUp = () => {
        if (name == "") {
            Alert.alert('오류', '닉네임을 입력해주세요!', [{ text: '확인' }])
            return
        } else if (id == "") {
            Alert.alert('오류', '아이디(이메일)을 입력해주세요!', [{ text: '확인' }])
            return
        } else if (password == "") {
            Alert.alert('오류', '비밀번호를 입력해주세요!', [{ text: '확인' }])
            return
        } else if (password != passwordConfirm) {
            Alert.alert('오류', '비밀번호를 확인해주세요!', [{ text: '확인' }])
            return
        } else if (passwordConfirm == "") {
            Alert.alert('오류', '비밀번호가 옳바르지 않습니다!', [{ text: '확인' }])
            onChangePassword('')
            onChangePasswordConfirm('')
            return
        }
        showPageLoader(true)
        RestAPI.register(name, id, password).then(res => {
            if (res.msg == "suc") {
                Alert.alert(
                    '성공', '가입해주셔서 감사합니다!',
                    [{
                        text: '확인',
                        onPress: () => { navigation.navigate('login') }
                    }]
                )
            } else {
                Alert.alert('가입 오류', '이미 '+id+'으로 가입된 계정이 있습니다. 로그인하시겠습니까?', [
                    { 
                        text: '확인',
                        onPress: ()=> { navigation.navigate('login') }
                    }
                ]
                )
                return
            }
        }).catch(err => {
            Alert.alert('오류', err.message, [{ text: '확인' }])
            return
        }).finally(() => {
            showPageLoader(false)
        })

    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS == "ios" ? "padding" : 0}
            enabled>
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
                            <Text style={styles.title}>회원가입</Text>
                            <TextInput
                                style={styles.inputFieldView}
                                onChangeText={val => onChangeName(val)}
                                value={name}
                                placeholder={'닉네임'}
                            />
                            <TextInput
                                style={styles.inputFieldView}
                                onChangeText={val => onChangeId(val)}
                                value={id}
                                placeholder={'이메일'}
                            />
                            <TextInput
                                style={styles.inputFieldView}
                                onChangeText={val => onChangePassword(val)}
                                value={password}
                                secureTextEntry={true}
                                placeholder={'비밀번호'}
                            />
                            <TextInput
                                style={styles.inputFieldView}
                                onChangeText={val => onChangePasswordConfirm(val)}
                                value={passwordConfirm}
                                secureTextEntry={true}
                                placeholder={'비밀번호 확인'}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    SignUp()
                                }}
                                style={styles.bottomBannerView}
                            >
                                <Text style={styles.signupBtn}>회원가입</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
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
    signupBtn: {
        color: 'white',
        fontSize: 16,
    },
    title: {
        fontSize: 20,
        paddingBottom: 10,
        fontWeight: 'bold'
    },
})