import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Platform, Linking } from 'react-native';
import { Header } from 'react-native-elements';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import ToggleSwitch from 'toggle-switch-react-native';
import '@expo/vector-icons';
import * as Permissions from 'expo-permissions';

import Constants, { topPadding, getCurUserIx } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';
import { useFocusEffect } from '@react-navigation/native';
import RestAPI from '../../Utils/RestAPI';

// 계정설정 페이지
export default function AccountSettingView({ route, navigation }) {
    console.log(route.params)
    const [nickname, getNickname] = useState()

    // const [isEnabled, setIsEnabled] = useState();
    const [isEnabledOne, setIsEnabledOne] = useState(route.params?.one);
    const [isEnabledTwo, setIsEnabledTwo] = useState(route.params?.two);
    const [isEnabledThree, setIsEnabledThree] = useState(route.params?.three);


    useEffect(() => {
        SetPush()
    }, [isEnabledOne, isEnabledTwo, isEnabledThree])

    useEffect(() => {
        if (global.curUser) {
            getNickname(global.curUser.name)
        }
    }, [global.curUser])

    useFocusEffect(React.useCallback(()=>{
        _bootstrapAsync()
        GetPush()
        getNickname(global.curUser.name)
    },[]))

    const _bootstrapAsync = async () => {
        await _checkNotificationStatus()
    }

    // 기기의 푸시알림 권한 얻기 및 설정
    const _checkNotificationStatus = async () => {
        const resPush = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        if (resPush.status !== 'granted' && resPush.status !== 'undetermined') {
            const askRes = await Permissions.askAsync(Permissions.NOTIFICATIONS)
            if (askRes.status != 'granted') {
                Alert.alert(
                    '오류',
                    '픽툰알림 허용을 하지 않고서는 픽툰 혜택 및 광고성알림을 받을수 없습니다. 지금 설정하시겠습니까?',
                    [
                        {
                            text: '취소',
                            onPress: () => {

                            }
                        }
                        , {
                            text: '앱설정 바로가기',
                            onPress: () => {
                                if (Platform.OS === 'ios') {
                                    Linking.openURL('app-settings://notification');
                                } else {
                                    Linking.openSettings();
                                }
                            }
                        }
                    ]
                )
            }
        }
    }

    // 현재 유저의 푸시 받기 상태 얻기
    const GetPush = () => {
        RestAPI.getPush(getCurUserIx()).then(res => {
            console.log("this data from server are : ", res)
            // setIsEnabled(res[0].push_all == '1' ? true : false)
            setIsEnabledOne(res[0].push_night == '1' ? true : false)
            setIsEnabledTwo(res[0].push_event == '1' ? true : false)
            setIsEnabledThree(res[0].push_marketing == '1' ? true : false)
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {
        })
    }


    // 해당 유저가 푸시알림 받기 설정하기
    const SetPush = () => {
        RestAPI.setPush(getCurUserIx(), isEnabledOne, isEnabledTwo, isEnabledThree).then(res => {
            if (res.msg == 'suc') { }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        })
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header
                leftComponent={
                    <TouchableOpacity onPress={() => {
                        navigation.goBack()
                        navigation.openDrawer()
                    }}>
                        <Text>뒤로</Text>
                    </TouchableOpacity>
                }
                centerComponent={
                    <Text style={{ fontSize: 16, fontWeight: 'bold', }}>계정 설정</Text>
                }
                backgroundColor="#FFF"
                containerStyle={{ 
                    height: Constants.HeaderHeight, 
                    alignItems: Platform.OS == 'ios' ? 'center' : 'flex-start',
                }}
            />
            <View style={styles.container}>
                <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={styles.listView}>
                        <View style={styles.titleView}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', }}>계정 정보</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('accountSettingName', { nickname : nickname ? nickname : ''})
                            }}
                            style={styles.itemView}
                        >
                            <View style={{
                                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                                width: '90%'
                            }}>
                                <Text style={{ fontSize: 15, }}>닉네임 변경</Text>
                                <Text style={{ fontSize: 15, color: '#AAA' }}>
                                    {
                                        nickname ?
                                            nickname :
                                            null
                                    }
                                </Text>
                            </View>
                            <Entypo name="chevron-thin-right" size={20} color={'#AAA'} />
                        </TouchableOpacity>


                        <View style={styles.line} />

                        {
                            global.curUser && global.curUser.type == 'email' ?
                                <>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate('accountSettingPass')
                                        }}
                                        style={styles.itemView}
                                    >
                                        <Text style={{ fontSize: 15, }}>비밀번호 변경</Text>

                                        <Entypo name="chevron-thin-right" size={20} color={'#AAA'} />
                                    </TouchableOpacity>


                                    <View style={styles.line} />
                                </> :
                                null
                        }


                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('accountSettingExit')
                            }}
                            style={styles.itemView}
                        >
                            <Text style={{ fontSize: 15, }}>회원 탈퇴</Text>

                            <Entypo name="chevron-thin-right" size={20} color={'#AAA'} />
                        </TouchableOpacity>

                    </View>
                    <View style={styles.listView}>
                        <View style={styles.titleView}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', }}>알림 설정</Text>
                        </View>

                        <View style={styles.itemView}>
                            <Text style={{ fontSize: 17, }}>푸시 설정</Text>
                        </View>

                        <View style={styles.line} />

                        <View style={styles.itemView}>
                            <Text style={{ fontSize: 15, paddingLeft: 20 }}>야간 알림 허용</Text>
                            <ToggleSwitch
                                isOn={isEnabledOne }
                                onColor={Constants.darkColor}
                                offColor="#DDD"
                                onToggle={() => {
                                    if (isEnabledOne) {
                                        setIsEnabledOne(false)
                                    } else {
                                        setIsEnabledOne(true)
                                    }
                                }}
                                
                            />
                        </View>

                        <View style={styles.line} />

                        <View style={styles.itemView}>
                            <Text style={{ fontSize: 15, paddingLeft: 20 }}>추천/이벤트 알림</Text>
                            <ToggleSwitch
                                isOn={isEnabledTwo}
                                onColor={Constants.darkColor}
                                offColor="#DDD"
                                onToggle={(val) => {
                                    if (isEnabledTwo) {
                                        setIsEnabledTwo(false)
                                    } else {
                                        setIsEnabledTwo(true)
                                    }
                                }}
                            />
                        </View>

                        <View style={styles.line} />

                        <View style={styles.itemView}>
                            <Text style={{ fontSize: 15, paddingLeft: 20 }}>마케팅 알림</Text>
                            <ToggleSwitch
                                isOn={isEnabledThree}
                                onColor={Constants.darkColor}
                                offColor="#DDD"
                                onToggle={(val) => {
                                    if (isEnabledThree) {
                                        setIsEnabledThree(false)
                                    } else {
                                        setIsEnabledThree(true)
                                    }
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.listView}>
                        <View style={styles.titleView}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', }}>기타</Text>
                        </View>

                        <View style={styles.itemView}>
                            <Text style={{ fontSize: 15, }}>버전 정보</Text>
                            <Text style={{ fontSize: 15, }}>1.02</Text>
                        </View>

                        <View style={styles.line} />

                    </View>
                </ScrollView>
            </View>
            <BottomBar navigation={navigation} selTab={'4'} />
        </View >
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
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        width: Constants.WINDOW_WIDTH, paddingVertical: 15, paddingLeft: 30, paddingRight: 10
    },
    line: { width: Constants.WINDOW_WIDTH - 30, height: 0, borderTopWidth: 1, borderColor: '#EEE', alignSelf: 'flex-end' },

})