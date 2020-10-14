import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { Header } from 'react-native-elements';
import { CheckBox } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select';
import Textarea from 'react-native-textarea';
import '@expo/vector-icons';

import Constants, { topPadding, getCurUserIx } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';
import RestAPI from '../../Utils/RestAPI';

// 고객센터 문의 페이지
export default function ClientCenterViewContact({ route, navigation }) {
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [selectedValue, setSelectedValue] = useState(null);
    const placeholder = {
        label: '문의 종류',
        value: null,
    };
    const [isSelected, setSelection] = useState(false);
    const [textarea, setTextarea] = useState('');

    const BoolToNum = (boolean) => {
        let num = '';
        if (boolean) num = 1
        return num
    }

    const ValidateEmail = (email) => {
        let res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return res.test(email);
    }

    // 문의사항 보내기
    const Inquiry = () => {
        if (!selectedValue) {
            Alert.alert('오류', '문의종류를 선택해 주세요!', [{ text: '확인' }])
            return
        } else if (title == '') {
            Alert.alert('오류', '문의제목을 입력해 주세요!', [{ text: '확인' }])
            return
        } else if (textarea == '') {
            Alert.alert('오류', '문의할 내용을 입력해 주세요!', [{ text: '확인' }])
            return
        } else if (email) {
            if (!ValidateEmail(email)) {
                Alert.alert('오류', '이메일 형식이 잘못 되었습니다!', [{ text: '확인' }])
                return
            } else if (isSelected == false) {
                Alert.alert('알림', '이메일로 답변을 받으시려면 체크박스를 체크해주세요!', [{ text: '확인' }])
                return
            }
        } else if (!email && isSelected) {
            Alert.alert('알림', '이메일로 답변을 받으시려면 이메일을 입력해주세요!', [{ text: '확인' }])
            return
        }

        showPageLoader(true)
        RestAPI.postInquiry(getCurUserIx(), selectedValue, title, email, BoolToNum(isSelected), textarea).then((res) => {
            if (res.msg == 'suc') {
                Alert.alert('성공', '문의가 접수되었습니다.', [{
                    text: '확인',
                    onPress: () => {
                        setTitle('')
                        setTextarea('')
                        setSelection(false)
                        setEmail('')
                        setSelectedValue(null)
                    }
                }])
            } else {
                Alert.alert('알림', '관리자에게 문의해주세요!', [{ text: '확인' }])
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
                        navigation.goBack()
                        setTitle('')
                        setTextarea('')
                        setSelection(false)
                        setEmail('')
                        setSelectedValue(null)
                    }}>
                        <Text>뒤로</Text>
                    </TouchableOpacity>
                }
                centerComponent={
                    <Text style={{ fontSize: 16, fontWeight: 'bold', }}>1:1 문의하기</Text>
                }
                rightComponent={
                    <TouchableOpacity onPress={() => {
                        Inquiry()
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

                        <View style={{ ...styles.itemView, justifyContent: 'flex-start' }}>
                            <Text style={{ fontSize: 15, paddingRight: 10, lineHeight: 40 }}>문의 종류: </Text>
                            <RNPickerSelect
                                onValueChange={(value, index) => setSelectedValue(value)}
                                style={{ ...pickerSelectStyles }}
                                placeholder={placeholder}
                                value={selectedValue}
                                items={Constants.ContactList}
                                Icon={() => {
                                    return (
                                        <View
                                            style={pickerSelectStyles.icon}
                                        />
                                    );
                                }}
                            />
                        </View>

                        <View style={styles.line} />

                        <View style={{ ...styles.itemView, justifyContent: 'flex-start' }}>
                            <Text style={{ fontSize: 15, paddingRight: 10, lineHeight: 40 }}>문의 제목: </Text>
                            <TextInput
                                style={{ width: Constants.WINDOW_WIDTH - 120 }}
                                onChangeText={val => setTitle(val)}
                                value={title}
                            />
                        </View>

                        <View style={styles.line} />

                        <View style={{ ...styles.itemView, justifyContent: 'flex-start' }}>
                            <Text style={{ fontSize: 15, paddingRight: 5, lineHeight: 30 }}>이메일: </Text>
                            <TextInput
                                style={{ width: Constants.WINDOW_WIDTH - 240 }}
                                onChangeText={val => setEmail(val)}
                                value={email}
                                autoCompleteType={'email'}
                            />
                            <CheckBox
                                checkedColor={Constants.darkColor}
                                checked={isSelected}
                                onPress={() => {
                                    isSelected ? setSelection(false) : setSelection(true)
                                }}
                                title='메일로 답변받기'
                                containerStyle={{ backgroundColor: 'transparent', borderColor: 'transparent', padding: 0, width: 140 }}
                            />
                        </View>

                        <View style={styles.line} />

                        <View style={{
                            ...styles.itemView, borderBottomWidth: 1, borderBottomColor: '#EEE',
                            justifyContent: 'flex-start'
                        }}>
                            <Textarea
                                containerStyle={styles.textAreaContainter}
                                style={styles.textArea}
                                placeholder={'문의할 내용을 적어주세요'}
                                placeholderTextColor={'#c7c7c7'}
                                underlineColorAndroid={'transparent'}
                                defaultValue={textarea}
                                onChangeText={val => setTextarea(val)}
                            />
                        </View>

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
        width: Constants.WINDOW_WIDTH, paddingVertical: 8, paddingLeft: 30, paddingRight: 10
    },
    line: { width: Constants.WINDOW_WIDTH - 30, height: 0, borderTopWidth: 1, borderColor: '#EEE', alignSelf: 'flex-end' },
    textAreaContainter: {
        width: Constants.WINDOW_WIDTH,
        height: 120,
        backgroundColor: 'transparent',
    },
    textArea: {
        textAlignVertical: 'top',  // hack android
        height: 120,
        width: Constants.WINDOW_WIDTH,
        fontSize: 17,
        color: '#333',
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        textAlign: 'left',
        width: 150,
        height: 40,
        fontSize: 16,
        color: 'black',
    },
    inputAndroid: {
        textAlign: 'left',
        width: 150,
        height: 40,
        fontSize: 16,
        color: 'black',
        paddingRight: 10, // to ensure the text is never behind the icon
    },
    icon: {
        position: 'absolute',
        backgroundColor: 'transparent',
        borderTopWidth: 7,
        borderTopColor: '#00000099',
        borderRightWidth: 5,
        borderRightColor: 'transparent',
        borderLeftWidth: 5,
        borderLeftColor: 'transparent',
        width: 0,
        height: 0,
        top: 15,
        right: 50,
    },
});