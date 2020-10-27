import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import '@expo/vector-icons';

import Constants, { getCurUserIx } from '../../../../Utils/Constant';
import TabButtonsPlatform from '../../TabButtonsPlatform';
import RandomList from './RandomList';
import RestAPI from '../../../../Utils/RestAPI';
import { useFocusEffect } from '@react-navigation/native';

// 플랫폼별 웹툰 리스트
export const WebtoonList = ({ navigation, data, onEndReached, platformIndex, onCountAppr, getRefresh }) => {
    return (
        <RandomList
            platformIndex={platformIndex}
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

// 플랫폼별 웹툰 리스트
export default function PlatformSel({ selIndex, navigation, onCountAppr, getRefresh }) {
    const [platformTabIndex, setPlatformTabIndex] = useState(0)
    const [platformListData, setPlatformListData] = useState()
    const [pageIndex, setPageIndex] = useState(2)

    // useFocusEffect(React.useCallback(()=>{
    //     InitialSetSession(platformTabIndex, 2)
    // },[platformTabIndex]))

    useEffect(()=>{
        InitialSetSession(platformTabIndex, 2)
    },[platformTabIndex])

    useEffect(() => {
        if(pageIndex > 2) {
            LoadPlatform(pageIndex)
        }
    }, [pageIndex])

    // 초기 플랫폼별 가져오기
    const InitialSetSession = (val, number) => {
        let str = ''
        if (val == 0) str = 'naver'
        else if (val == 1) str = 'daum'
        else if (val == 2) str = 'lezhin'
        showPageLoader(true)
        RestAPI.apprWebtoon(getCurUserIx(), '', 'change', 'platform', str).then(res => {
            if (res.msg == 'suc') {
                LoadPlatform(number)
            } else {
                Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            // Alert.alert('로딩 오류', 'apprWebtoon in Platform error : ' + err.message, [{ text: '확인' }])
        }).finally(() => {
            showPageLoader(false)
        })
    }

    // 선택된 플랫폼별 웹툰 리스트 가져오기
    const LoadPlatform = (number) => {
        
        RestAPI.apprWebtoon(getCurUserIx(), number, 'plus', 'main', '').then(res => {
            
            if (res.msg == 'suc') {
                let newData = []
                if (number == 2) {
                    newData = res.data
                    setPlatformListData(newData)
                } else if (number > 2) {
                    newData = [...platformListData, ...res.data]
                    setPlatformListData(newData)
                }
            } else {
                Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            // Alert.alert('로딩 오류', 'apprWebtoon in Platform error : ' + err.message, [{ text: '확인' }])
        }).finally(() => {
            
        })
    }

    return (
        <View style={styles.container}>
            <TabButtonsPlatform
                platformIndex={platformTabIndex}
                onTapButton={(index) => {
                    setPlatformTabIndex(index)
                }}
            />
            <WebtoonList
                platformIndex={platformTabIndex}
                selIndex={selIndex}
                navigation={navigation}
                data={platformListData}
                onEndReached={() => {
                    setPageIndex(pageIndex + 1)
                }}
                onCountAppr = {(ix)=>{
                    if(onCountAppr) {
                        onCountAppr(ix)    
                    }
                }}
                getRefresh={()=>{
                    LoadPlatform(2)
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
    }
});
