import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import Constants, { topPadding, getCurUserIx, zeroArray } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';
import RestAPI from '../../Utils/RestAPI';

// 문의 내역 페이지
const ContentView = ({ data }) => {
    let initialArray = data ? zeroArray(data.length) : []
    const [viewAnswer, setViewAnswer] = useState(initialArray)

    useFocusEffect(React.useCallback(()=>{
        setViewAnswer(initialArray)
    }, []))
    
    return (
        <View style={{ flexDirection: 'column' }}>
            {
                data ?
                    data.map((inquiryItem, idx) => {
                        return (
                            <View key={idx}>
                                <TouchableOpacity
                                    style={{
                                        ...styles.itemView, justifyContent: 'space-between',
                                        borderBottomWidth: 1, borderColor: '#EEE'
                                    }}
                                    onPress={() => {
                                        viewAnswer && viewAnswer[idx] == 1 ? initialArray[idx] = 0 : initialArray[idx] = 1
                                        setViewAnswer(initialArray)
                                    }}>
                                    <Text style={{ fontSize: 15, color: Constants.darkColor }}>{inquiryItem.title} </Text>
                                    {
                                        inquiryItem && inquiryItem.answer_status == '' ? 
                                        <Text style={{ fontSize: 13, color: '#999' }}>답변대기</Text> : 
                                        <Text style={{ fontSize: 13, color: '#999' }}>답변완료</Text>
                                    }

                                </TouchableOpacity>
                                {
                                    viewAnswer && viewAnswer[idx] == 1 ?
                                        <View style={{
                                            flexDirection: 'column', paddingLeft: 30, paddingRight: 10, paddingVertical: 20
                                        }}>
                                            <Text style={{ fontSize: 13, color: '#999', paddingBottom: 10 }}>{inquiryItem.question}</Text>
                                            <View style={styles.line} />
                                            <Text style={{ fontSize: 13, color: Constants.darkColor, paddingTop: 10 }}>{inquiryItem.answer}</Text>
                                        </View> : null
                                }
                            </View>
                        )
                    }) : null
            }

        </View >
    )
}

export default function ClientCenterViewHistory({ route, navigation }) {
    const [inquriyList, setInquiryList] = useState()

    // 현재 유저의 문의 상태 얻어오기
    const getInquriyList = () => {
        showPageLoader(true)
        RestAPI.getInquiry(getCurUserIx()).then(res => {
            setInquiryList(res)
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {
            showPageLoader(false)
        })
    }

    useFocusEffect(React.useCallback(
        () => {
            getInquriyList()
        },
        []
    ))

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header
                leftComponent={
                    <TouchableOpacity onPress={() => { navigation.goBack();}}>
                        <Text>뒤로</Text>
                    </TouchableOpacity>
                }
                centerComponent={
                    <Text style={{ fontSize: 16, fontWeight: 'bold', }}>문의 내역</Text>
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
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}> </Text>
                        </View>
                        <ContentView data={inquriyList} />
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
    line: { width: Constants.WINDOW_WIDTH - 30, height: 0, borderTopWidth: 1, borderColor: '#EEE', },
})
