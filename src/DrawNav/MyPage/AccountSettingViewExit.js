import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, AsyncStorage, TextInput, Alert, Platform } from 'react-native';
import { Header } from 'react-native-elements';
import '@expo/vector-icons';
import axios from 'react-native-axios';

import Constants, { topPadding, getCurUserIx } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';
import RestAPI from '../../Utils/RestAPI';

// 계정설정에서 계정 닫기
export default function AccountSettingViewExit({ route, navigation }) {
    const [reason, setReason] = useState('')

    // 이미 카카오 계정이 로그인 되어 잇다면 탈퇴하기
    async function unlinkKakao() {
        const config = {
            headers: {
                Authorization: 'Bearer ' + global.curUser.access_token
            }
        }
        const res_user = await axios.get('https://kapi.kakao.com/v1/user/unlink', config)
        console.log("kakao unlink : ", res_user)
    }


    // 이미 네이버 계정이 로그인 되어 잇다면 탈퇴하기
    async function unlinkNaver() {
        const res_user = await axios.get(
            'https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id='+ Constants.NaverClientID +'&client_secret='+ Constants.NaverClientSecret +'&access_token='+ global.curUser.access_token +'&service_provider=NAVER'
        )
        console.log("naver unlink : ", res_user)
    }

    // 계정닫기 문의
    const Close = () => {
        Alert.alert('알림', '정말 탈퇴하시겠습니까?', [
            { text: '취소' },
            {
                text: '확인',
                onPress: () => {
                    if(global.curUser.type == 'kakao'){
                        unlinkKakao()
                    } else if(global.curUser.type == 'naver') {
                        unlinkNaver()
                    }
                    CloseAccount()
                }
            }
        ])
    }

    // 계정닫기 확인
    const CloseAccount = () => {
        showPageLoader(true)
        RestAPI.closeAccount(getCurUserIx(), reason).then(res => {
            if (res.msg == 'suc') {
                Alert.alert('탈퇴 성공', '탈퇴되었습니다. 그동안 이용해주셔서 감사합니다!', [{
                    text: '확인',
                    onPress: async () => {
                        setReason('')
                        global.curUser = null
                        global.apprCount = null
                        await AsyncStorage.removeItem('cur_user')
                        navigation.navigate('home', {userIx: getCurUserIx()})
                    }
                }])
            } else {
                Alert.alert('탈퇴 오류', '관리자에게 문의해주세요.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            showPageLoader(false)
            return
        }).finally(() => {
            showPageLoader(false)
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header
                leftComponent={
                    <TouchableOpacity onPress={() => { setReason(''); navigation.goBack() }}>
                        <Text>뒤로</Text>
                    </TouchableOpacity>
                }
                centerComponent={
                    <Text style={{ fontSize: 16, fontWeight: 'bold', }}>회원 탈퇴</Text>
                }
                rightComponent={
                    <TouchableOpacity onPress={() => { Close() }}>
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
                                <Text style={{ fontSize: 15, paddingRight: 10 }}>탈퇴사유: </Text>
                                <TextInput
                                    style={{ width: Constants.WINDOW_WIDTH - 120, fontSize: 16 }}
                                    onChangeText={val => setReason(val)}
                                    value={reason}
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