import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { Header } from 'react-native-elements';
import '@expo/vector-icons';

import Constants, { topPadding, getCurUserIx } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';
import RestAPI from '../../Utils/RestAPI';

// 계정설정에서 암호 변경하기
export default function AccountSettingViewChangePass({ route, navigation }) {
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    // 암호변경하기
    const ChangePassword = () => {
        if (password == '') {
            Alert.alert('오류', '신규 비밀번호를 입력해주세요!', [{ text: '확인' }])
            return
        } else if (passwordConfirm == '' || password != passwordConfirm) {
            Alert.alert('오류', '신규 비밀번호를 확인해주세요!', [{ text: '확인' }])
            return
        }

        showPageLoader(true)
        RestAPI.changePassword(getCurUserIx(), password).then(res => {
            if (res.msg == "suc") {
                Alert.alert('성공', '변경이 완료되었습니다', [{
                    text: '확인',
                    onPress: () => {
                        setPassword('')
                        setPasswordConfirm('')
                    }
                }])
            } else {
                Alert.alert('변경실패', '관리자에게 문의해주세요!', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            return
        }).finally(() => {
            showPageLoader(false)
        })
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header
                leftComponent={
                    <TouchableOpacity onPress={() => {
                        setPassword('')
                        setPasswordConfirm('')
                        navigation.goBack()
                    }}>
                        <Text>뒤로</Text>
                    </TouchableOpacity>
                }
                centerComponent={
                    <Text style={{ fontSize: 16, fontWeight: 'bold', }}>비밀번호 변경</Text>
                }
                rightComponent={
                    <TouchableOpacity onPress={() => {
                        ChangePassword()
                    }}>
                        <Text>완료</Text>
                    </TouchableOpacity>
                }
                backgroundColor="#FFF"
                containerStyle={{ 
                    height: Constants.HeaderHeight, 
                    alignItems: Platform.OS == 'ios' ? 'center' : 'flex-start'
                }}
            />
            <View style={styles.container}>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={styles.listView}>
                        <View style={styles.titleView}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', }}> </Text>
                        </View>
                        <TouchableOpacity>
                            <View style={{
                                ...styles.itemView, justifyContent: 'flex-start'
                            }}>
                                <Text style={{ fontSize: 15, paddingRight: 10 }}>비밀번호 변경: </Text>
                                <TextInput
                                    style={{ width: Constants.WINDOW_WIDTH - 120 }}
                                    onChangeText={val => setPassword(val)}
                                    value={password}
                                    secureTextEntry={true}
                                />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.line} />

                        <TouchableOpacity>
                            <View style={{
                                ...styles.itemView, borderBottomWidth: 1, borderBottomColor: '#EEE',
                                justifyContent: 'flex-start'
                            }}>
                                <Text style={{ fontSize: 15, paddingRight: 10 }}>비밀번호 확인: </Text>
                                <TextInput
                                    style={{ width: Constants.WINDOW_WIDTH - 120, fontSize: 16 }}
                                    onChangeText={val => setPasswordConfirm(val)}
                                    value={passwordConfirm}
                                    secureTextEntry={true}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <BottomBar navigation={navigation} selTab={'4'} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Constants.WINDOW_HEIGHT - 100 - topPadding(),
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    listView: {
        flexDirection: 'column',
        width: Constants.WINDOW_WIDTH,
    },
    titleView: {
        width: Constants.WINDOW_WIDTH, paddingVertical: 10, paddingHorizontal: 20,
        backgroundColor: '#EEE', borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#DDD'
    },
    itemView: {
        flexDirection: 'row', alignItems: 'center',
        width: Constants.WINDOW_WIDTH, paddingVertical: 15, paddingLeft: 30, paddingRight: 10
    },
    line: { width: Constants.WINDOW_WIDTH - 30, height: 0, borderTopWidth: 1, borderColor: '#EEE', alignSelf: 'flex-end' },

})