import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import '@expo/vector-icons';

import Constants, { getCurUserIx } from '../../../../Utils/Constant';
import TabButtonsGenre from '../../TabButtonsGenre';
import RandomList from './RandomList';
import RestAPI from '../../../../Utils/RestAPI';
import { useFocusEffect } from '@react-navigation/native';

// 장르별 선택햇을때 웹툰 리스트
export const WebtoonList = ({ navigation, data, onEndReached, genreIndex, onCountAppr, getRefresh }) => {
    return (
        <RandomList
            genreIndex={genreIndex}
            navigation={navigation}
            data={data}
            onEndReached={() => {
                if (onEndReached) { onEndReached() }
            }}
            onCountAppr = {(ix)=>{
                if(onCountAppr) {
                    onCountAppr(ix)
                }
            }}
            getRefresh={()=>{
                if(getRefresh) {
                    getRefresh()
                }
            }}
        />
    )
}

// 웹툰평가 - 장르별 선택하기
export default function GenreSel({ selIndex, navigation, onCountAppr, getRefresh }) {
    const [genreTabIndex, setGenreTabIndex] = useState(0)
    const [genreListData, setGenreListData] = useState()
    const [pageIndex, setPageIndex] = useState(2)

    useEffect(() => {
        InitialSetSession(genreTabIndex, 2)
    }, [genreTabIndex])

    // useFocusEffect(React.useCallback(()=>{
    //     InitialSetSession(genreTabIndex, 2)
    // },[genreTabIndex]))

    useEffect(() => {
        if(pageIndex > 2) {
            LoadGenre(pageIndex)
        }
    }, [pageIndex])

    // 초기 장르별 웹툰 목록가져오기
    const InitialSetSession = (val, number) => {
        showPageLoader(true)
        RestAPI.apprWebtoon(getCurUserIx(), '', 'change', 'genre', val + 1).then(res => {
            if (res.msg == 'suc') {
                LoadGenre(number)
            } else {
                Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            // Alert.alert('로딩 오류', 'apprWebtoon in GenreSel error : ' + err.message, [{ text: '확인' }])
        }).finally(() => {
            showPageLoader(false)
        })
    }

    // 선택된 장르별 웹툰목록가져오기
    const LoadGenre = (number) => {
        RestAPI.apprWebtoon(getCurUserIx(), number, 'plus', 'main', '').then(res => {
            if (res.msg == 'suc') {
                let newData = []
                if (number == 2) {
                    newData = res.data
                    setGenreListData(newData)
                } else if (number > 2) {
                    newData = [...genreListData, ...res.data]
                    setGenreListData(newData)
                }
            } else {
                Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {})
    }

    return (
        <View style={styles.container}>
            <View style={styles.tabScroll}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    <TabButtonsGenre
                        genreIndex={genreTabIndex}
                        onTapButton={(index) => {
                            setGenreTabIndex(index)
                        }}
                    />
                </ScrollView>
            </View>
            <WebtoonList
                selIndex={selIndex}
                genreIndex={genreTabIndex}
                navigation={navigation}
                data={genreListData}
                onEndReached={() => {
                    setPageIndex(pageIndex + 1)
                }}
                onCountAppr = {(ix)=>{
                    if(onCountAppr) {
                        onCountAppr(ix)
                    }
                }}
                getRefresh={()=>{
                    LoadGenre(2)
                }}
            />
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    webtoonList: {
        flex: 1,
        width: Constants.WINDOW_WIDTH,
    },
    tabScroll: {
        width: Constants.WINDOW_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 5,
    }
});
