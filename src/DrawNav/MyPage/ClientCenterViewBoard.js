import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Header } from 'react-native-elements';
import '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import Constants, { topPadding, getCurUserIx, zeroArray } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';
import RestAPI from '../../Utils/RestAPI';

// 공지사항 페이지
const ContentView = ({ data, navigation }) => {
    let initialValue = data ? zeroArray(data.length) : []
    const [faqValue, setFaqValue] = useState(initialValue)

    //공지사항 눌렀는지 check 
    useFocusEffect(React.useCallback(() => {
        setFaqValue(initialValue)
    }, []))
    return (
        <View style={{ flexDirection: 'column' }}>
            {
                data ?
                    data.map((faqItem, idx) => {
                        console.log(faqItem,"item");
                        return (
                            <View key={idx}>
                                <TouchableOpacity
                                    style={{
                                        ...styles.itemView, justifyContent: 'space-between',
                                        borderBottomWidth: 1, borderColor: '#EEE'
                                    }}
                                    onPress={() => {
                                        setFaqValue(initialValue)
                                            navigation.navigate('clientCenterBoardDetail',{data: faqItem, index : faqItem.ix})
                                    }}>
                                    <Text style={{ fontSize: 15, color: Constants.darkColor }}>{faqItem.question} </Text>
                                    {/* {
                                        faqValue && faqValue[idx] == 1
                                            ? <Entypo name="chevron-thin-up" color={'#999'} size={20} />
                                            : <Entypo name="chevron-thin-down" color={'#999'} size={20} />
                                    } */}
                                </TouchableOpacity>
                                {/* {
                                    faqValue && faqValue[idx] == 1 ?
                                        <View style={{
                                            flexDirection: 'column', paddingLeft: 30, paddingRight: 20, paddingVertical: 20,
                                            borderBottomColor: '#EEE', borderBottomWidth: 1
                                        }}>
                                            <Text style={{ fontSize: 15, color: '#999', paddingBottom: 10 }}>{faqItem.answer}</Text>
                                        </View> :
                                        <View></View>
                                } */}
                            </View>
                        )
                    }) : null
            }
        </View>
    )
}

// 고객센터에서 공지사항 페이지
export default function ClientCenterViewBoard({ route, navigation }) {
    const [faqList, setFaqList] = useState()
    // 공지 목록 가져오기
    const getFaqList = () => {
        showPageLoader(true)
        RestAPI.getBoard().then(res => {
            setFaqList(res)
           
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {
            showPageLoader(false)
        })
    }

    useFocusEffect(React.useCallback(() => {
        getFaqList()
    }, []))
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header
                leftComponent={
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Text>뒤로</Text>
                    </TouchableOpacity>
                }
                centerComponent={
                    <Text style={{ fontSize: 16, fontWeight: 'bold', }}>서비스공지</Text>
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
                        <ContentView data={faqList} navigation={navigation}/>
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
