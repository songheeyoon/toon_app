import React, { useState } from 'react';
import { StyleSheet, Text, View,  TouchableOpacity, TextInput, Alert, Platform, AsyncStorage } from 'react-native';
import { Header } from 'react-native-elements';
import '@expo/vector-icons';

import Constants, { topPadding, getCurUserIx } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';
import RestAPI from '../../Utils/RestAPI';

export function changeNickName(globalData, name) {
    globalData.name = name;
    return globalData
}

// 계정설정에서 닉네임 변경하기
export default function AccountSettingViewChangeName({ route, navigation }) {
    const [name, setName] = useState('')

    // 닉네임 변경하기
    const ChangeNick = () => {
        if (name == '') {
            Alert.alert('오류', '신규 닉네임을 입력해주세요!', [{ text: '확인' }])
            return
        }
        showPageLoader(true)
        RestAPI.changeNick(getCurUserIx(), name).then(async res => {
            if (res.msg == "suc") {
                Alert.alert('성공', '변경이 완료되었습니다', [{ text: '확인' }])
                await AsyncStorage.setItem('cur_user', JSON.stringify(changeNickName(global.curUser, name)))
            } else if(res.msg == "fail") {
                Alert.alert('변경실패', '관리자에게 문의해주세요!', [{ text: '확인' }])
            } else if(res.msg == "fail1") {
                Alert.alert('알림', '닉네임 중복, 다시 입력해주세요', [{ text: '확인' }])
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
                    <TouchableOpacity onPress={() => { setName(''); navigation.goBack() }}>
                        <Text>뒤로</Text>
                    </TouchableOpacity>
                }
                centerComponent={
                    <Text style={{ fontSize: 16, fontWeight: 'bold', }}>닉네임 변경</Text>
                }
                rightComponent={
                    <TouchableOpacity onPress={() => { 
                        ChangeNick()
                    }}>
                        <Text>완료</Text>
                    </TouchableOpacity>
                }
                backgroundColor="#FFF"
                containerStyle={{ 
                    height: Constants.HeaderHeight, 
                    alignItems: Platform.OS == 'ios' ? 'center' : 'flex-start',
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
                                ...styles.itemView, borderBottomWidth: 1, borderBottomColor: '#EEE',
                                justifyContent: 'flex-start'
                            }}>
                                <Text style={{ fontSize: 15, paddingRight: 10 }}>기존 닉네임: </Text>
                                <Text style={{ fontSize: 15, paddingRight: 10 }}>{route.params.nickname}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={{
                                ...styles.itemView, borderBottomWidth: 1, borderBottomColor: '#EEE',
                                justifyContent: 'flex-start'
                            }}>
                                <Text style={{ fontSize: 15, paddingRight: 10 }}>신규 닉네임: </Text>
                                <TextInput
                                    style={{ fontSize: 16, width: Constants.WINDOW_WIDTH - 120 }}
                                    onChangeText={val => setName(val)}
                                    value={name}
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