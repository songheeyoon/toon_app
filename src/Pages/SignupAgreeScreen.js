// 회원가입 동의 스크린
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform, Linking } from 'react-native';
import Constants from '../Utils/Constant';
import { CheckBox } from 'react-native-elements'
import '@expo/vector-icons';
import * as Permissions from 'expo-permissions';

export default function SignupAgreeScreen({ navigation }) {
    const [isSelectedAll, setSelectionAll] = useState(false);
    const [isSelectedPerson, setSelectionPerson] = useState(false);
    const [isSelectedService, setSelectionService] = useState(false);
    const [isSelectedPersonAdd, setSelectionPersonAdd] = useState(false);
    const [isSelectedAdb, setSelectionAdb] = useState(false);

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
                return false
            }
        } else {
            return true
        }
    }



    const checkAgree = async () => {
        if (!isSelectedPerson) {
            Alert.alert('오류', '개인정보취급방법에 동의해주세요!', [{ text: '확인' }])
            return
        } else if (!isSelectedService) {
            Alert.alert('오류', '서비스 이용약관에 동의해주세요!', [{ text: '확인' }])
            return
        } else if (!isSelectedPersonAdd) {
            Alert.alert('오류', '개인정보추가수집에 동의해주세요!', [{ text: '확인' }])
            return
        } else if (isSelectedAdb) {
            let status = await _checkNotificationStatus()
            if (!status) return
        }
        global.selectedAdb = isSelectedAdb
        setSelectionAll(false)
        setSelectionPerson(false)
        setSelectionService(false)
        setSelectionPersonAdd(false)
        setSelectionAdb(false)
        navigation.navigate('signup')
    }

    return (
        <View style={styles.container}>
            <View style={styles.topView}>
                <Text style={styles.title}>회원가입을 위해 약관에 동의해주세요.</Text>
            </View>
            <View style={styles.bottomView}>
                <View style={styles.subTopView}>
                    <View style={styles.allCheckBoxView}>
                        <CheckBox
                            checkedColor={Constants.mainColor}
                            checked={isSelectedAll}
                            iconType='material'
                            checkedIcon='check'
                            uncheckedIcon='check'
                            size={28}
                            onPress={() => {
                                if (isSelectedAll) {
                                    setSelectionAll(false)
                                    setSelectionPerson(false)
                                    setSelectionService(false)
                                    setSelectionPersonAdd(false)
                                    setSelectionAdb(false)
                                } else {
                                    setSelectionAll(true)
                                    setSelectionPerson(true)
                                    setSelectionService(true)
                                    setSelectionPersonAdd(true)
                                    setSelectionAdb(true)
                                }
                            }}
                            containerStyle={{
                                backgroundColor: 'transparent', borderColor: 'transparent', padding: 0, width: 25
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                if (isSelectedAll) {
                                    setSelectionAll(false)
                                    setSelectionPerson(false)
                                    setSelectionService(false)
                                    setSelectionPersonAdd(false)
                                    setSelectionAdb(false)
                                } else {
                                    setSelectionAll(true)
                                    setSelectionPerson(true)
                                    setSelectionService(true)
                                    setSelectionPersonAdd(true)
                                    setSelectionAdb(true)
                                }
                            }}
                        >
                            <Text style={{ color: '#666', fontSize: 18, fontWeight: 'bold' }}>모두 동의합니다.</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={styles.generalCheckBoxView}>
                            <View style={{ flexDirection: 'row', alignItems: 'center',width:"100%" }}>
                                <CheckBox
                                    checkedColor={Constants.mainColor}
                                    iconType='material'
                                    checkedIcon='check'
                                    uncheckedIcon='check'
                                    size={28}
                                    checked={isSelectedPerson}
                                    onPress={() => {
                                        if (isSelectedPerson) {
                                            setSelectionPerson(false)
                                            setSelectionAll(false)
                                        } else {
                                            setSelectionPerson(true)
                                            if (isSelectedService && isSelectedPersonAdd && isSelectedAdb) {
                                                setSelectionAll(true)
                                            }
                                        }
                                    }}
                                    containerStyle={{
                                        backgroundColor: 'transparent', borderColor: 'transparent', padding: 0, width: 25
                                    }}
                                />                         
                                <TouchableOpacity onPress={()=>{
                                    Linking.openURL('https://picktoon.com/policy_info.html');
                                }}>
                                    <Text style={{ textDecorationLine: 'underline', color: '#666', fontSize: 15 }}>개인정보 수집 및 이용 안내 </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => {
                                        if (isSelectedPerson) {
                                            setSelectionPerson(false)
                                            setSelectionAll(false)
                                        } else {
                                            setSelectionPerson(true)
                                            if (isSelectedService && isSelectedPersonAdd && isSelectedAdb) {
                                                setSelectionAll(true)
                                            }
                                        }
                                    }}
                                >
                                    <Text style={{ color: '#666', fontSize: 15 }}>에 동의합니다.(필수)</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.generalCheckBoxView}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox
                                    checkedColor={Constants.mainColor}
                                    iconType='material'
                                    checkedIcon='check'
                                    uncheckedIcon='check'
                                    size={28}
                                    checked={isSelectedService}
                                    onPress={() => {
                                        if (isSelectedService) {
                                            setSelectionService(false)
                                            setSelectionAll(false)
                                        } else {
                                            setSelectionService(true)
                                            if (isSelectedPerson && isSelectedPersonAdd && isSelectedAdb) {
                                                setSelectionAll(true)
                                            }
                                        }
                                    }}
                                    containerStyle={{
                                        backgroundColor: 'transparent', borderColor: 'transparent', padding: 0, width: 25
                                    }}
                                />
                                <TouchableOpacity onPress={()=>{
                                      Linking.openURL('https://picktoon.com/policy_use.html');
                                }}>
                                    <Text style={{ textDecorationLine: 'underline', color: '#666', fontSize: 15 }}>서비스 이용약관</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => {
                                        if (isSelectedService) {
                                            setSelectionService(false)
                                            setSelectionAll(false)
                                        } else {
                                            setSelectionService(true)
                                            if (isSelectedPerson && isSelectedPersonAdd && isSelectedAdb) {
                                                setSelectionAll(true)
                                            }
                                        }
                                    }}
                                >
                                    <Text style={{ color: '#666', fontSize: 15, }}>에 동의합니다.(필수)</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* <View style={styles.generalCheckBoxView}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox
                                    checkedColor={Constants.mainColor}
                                    iconType='material'
                                    checkedIcon='check'
                                    uncheckedIcon='check'
                                    size={28}
                                    checked={isSelectedPersonAdd}
                                    onPress={() => {
                                        if (isSelectedPersonAdd) {
                                            setSelectionPersonAdd(false)
                                            setSelectionAll(false)
                                        } else {
                                            setSelectionPersonAdd(true)
                                            if (isSelectedPerson && isSelectedService && isSelectedAdb) {
                                                setSelectionAll(true)
                                            }
                                        }
                                    }}
                                    containerStyle={{
                                        backgroundColor: 'transparent', borderColor: 'transparent', padding: 0, width: 25
                                    }}
                                />
                                <TouchableOpacity>
                                    <Text style={{ textDecorationLine: 'underline', color: '#666', fontSize: 16 }}>개인정보추가수집</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => {
                                        if (isSelectedPersonAdd) {
                                            setSelectionPersonAdd(false)
                                            setSelectionAll(false)
                                        } else {
                                            setSelectionPersonAdd(true)
                                            if (isSelectedPerson && isSelectedService && isSelectedAdb) {
                                                setSelectionAll(true)
                                            }
                                        }
                                    }}
                                >
                                    <Text style={{ color: '#666', fontSize: 16, }}>에 동의합니다.(필수)</Text>
                                </TouchableOpacity>
                            </View>
                        </View> */}
                        <View style={styles.generalCheckBoxView}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <CheckBox
                                    checkedColor={Constants.mainColor}
                                    iconType='material'
                                    checkedIcon='check'
                                    uncheckedIcon='check'
                                    size={28}
                                    checked={isSelectedAdb}
                                    onPress={() => {
                                        if (isSelectedAdb) {
                                            setSelectionAdb(false)
                                            setSelectionAll(false)
                                        } else {
                                            setSelectionAdb(true)
                                            if (isSelectedService && isSelectedPersonAdd && isSelectedPerson) {
                                                setSelectionAll(true)
                                            }
                                        }
                                    }}
                                    containerStyle={{
                                        backgroundColor: 'transparent', borderColor: 'transparent', padding: 0, width: 25
                                    }}
                                />
                                <TouchableOpacity onPress={()=>{
                                     Linking.openURL('https://picktoon.com/policy_event.html');
                                }}>
                                    <Text style={{ textDecorationLine: 'underline', color: '#666', fontSize: 15 }}>픽툰 신작 및 이벤트 정보수신</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => {
                                        if (isSelectedAdb) {
                                            setSelectionAdb(false)
                                            setSelectionAll(false)
                                        } else {
                                            setSelectionAdb(true)
                                            if (isSelectedService && isSelectedPersonAdd && isSelectedPerson) {
                                                setSelectionAll(true)
                                            }
                                        }
                                    }}
                                >
                                    <Text style={{ color: '#666', fontSize: 15, }}>에 동의합니다.(선택)</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'center', }}>
                        <TouchableOpacity
                            onPress={() => {
                                checkAgree()
                            }}
                            style={styles.bottomBannerView}
                        >
                            <Text style={styles.nextBtn}>다음</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEE',
    },
    topView: {
        height: Constants.WINDOW_HEIGHT * 0.3,
        width: Constants.WINDOW_WIDTH,
        paddingTop: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomView: {
        position: 'absolute',
        bottom: 0,
        height: Constants.WINDOW_HEIGHT * 0.7,
        width: Constants.WINDOW_WIDTH,
        backgroundColor: 'white',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    },
    bottomBannerView: {
        width: Constants.WINDOW_WIDTH * 0.7,
        backgroundColor: Constants.darkColor,
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 5
    },
    nextBtn: {
        color: 'white',
        fontSize: 16,
    },
    title: { color: '#444', fontSize: 20, paddingTop: 50, fontWeight: 'bold' },
    subTopView: { flex: 1, justifyContent: 'space-between', paddingBottom: 50 },
    allCheckBoxView: {
        width: Constants.WINDOW_WIDTH,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderColor: '#DDD',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    generalCheckBoxView: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        paddingTop: 20,
        width: Constants.WINDOW_WIDTH
    },



})