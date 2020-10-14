import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';
import { Header } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import '@expo/vector-icons';

import Constants, { topPadding, getCurUserIx } from '../../../Utils/Constant';
import BottomBar from '../../Components/BottomBar';
import TabButtons from '../TabButtons';
import RandomList from './Lists/RandomList';
import GenreSel from './Lists/GenreSel';
import PlatformSel from './Lists/PlatformSel';
import RestAPI from '../../../Utils/RestAPI';
import HeaderRight from '../../Components/HeaderRight';
import ApprTopHeader from './ApprTopHeader';

// 웹툰 리스트(랜덤, 장르별, 플랫폼별)
export const WebtoonList = ({ selIndex = 0, navigation, data, onEndReached, onCountAppr, getRefresh }) => {

    if (selIndex == 0) {
        return (
            <RandomList
                selIndex={selIndex}
                navigation={navigation}
                data={data}
                onEndReached={() => {
                    if (onEndReached) { onEndReached() }
                }}
                onCountAppr={(ix) => {
                    if (onCountAppr) { onCountAppr(ix) }
                }}
                getRefresh={()=>{
                    if(getRefresh) {
                        getRefresh()
                    }
                }}
            />
        )
    } else if (selIndex == 1) {
        return (
            <GenreSel
                selIndex={selIndex}
                navigation={navigation}
                onCountAppr={(ix) => {
                    if (onCountAppr) {
                        onCountAppr(ix)
                    }
                }}
            />
        )
    } else if (selIndex == 2) {
        return (
            <PlatformSel
                selIndex={selIndex}
                navigation={navigation}
                onCountAppr={(ix) => {
                    if (onCountAppr) {
                        onCountAppr(ix)
                    }
                }}
            />
        )
    }
}

// 웹툰평가보기
export default function ApprView({ route, navigation }) {
    const [selTabIndex, setSelTabIndex] = useState(0)
    const [randomList, setRandomList] = useState()
    const [randomListData, setRandomListData] = useState([])
    const [pageIndex, setPageIndex] = useState(1)
    const [countAppr, setCountAppr] = useState()

    useEffect(() => {
        if (selTabIndex == 0) {
            if (pageIndex == 1) {
                LoadAppr(1);
            } else if (pageIndex > 1) {
                LoadAppr(pageIndex);
            }
        }
    }, [pageIndex, selTabIndex])

    // 웹툰 목록 로딩
    const LoadAppr = (number) => {
        showPageLoader(true)
        RestAPI.apprWebtoon(getCurUserIx(), number, 'plus', 'main', '').then(res => {
            if (res.msg == 'suc') {

                if (res.count) global.apprCount = res.count
                else global.apprCount = 0
                setCountAppr(global.apprCount)

                let newData = []
                if (number == 1) {
                    setRandomList(res)
                    newData = res.data
                    setRandomListData(newData)
                } else {
                    newData = [...randomListData, ...res.data]
                    setRandomListData(newData)
                }
                showPageLoader(false)
            } else {
                Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
                showPageLoader(false)
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            showPageLoader(false)
            // Alert.alert('로딩 오류', 'apprWebtoon error : ' + err.message, [{ text: '확인' }])
        }).finally(() => {
            showPageLoader(false)
         })
    }

    // 해당 유저에 대한 웹툰체크
    const CheckWebtoonAppr = async (ix) => {
        showPageLoaderForStar(true)
        RestAPI.checkWebtoonAppr(getCurUserIx(), ix).then(res => {
            if (res.msg == 'suc') {
                setCountAppr(countAppr + 1)
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            // Alert.alert('로딩 오류', 'checkWebtoonAppr error : ' + err.message, [{ text: '확인' }])
            showPageLoaderForStar(false)
        }).finally(() => {
            showPageLoaderForStar(false)
        })
    }


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header
                rightComponent={<HeaderRight navigation={navigation} />}
                backgroundColor="#FFF"
                containerStyle={{ 
                    height: Constants.HeaderHeight, 
                    alignItems: Platform.OS == 'ios' ? 'center' : 'flex-start',
                    marginTop: Platform.OS == 'ios' ? 0 : -15,
                }}
            />
            <View style={styles.container}>
                <ApprTopHeader count={global.curUser ? countAppr : 0} />
                <View style={styles.webtoonList}>
                    <TabButtons
                        selIndex={selTabIndex}
                        onTapButton={(index) => {
                            setRandomListData([])
                            setPageIndex(1)
                            setSelTabIndex(index)
                        }}
                    />
                    <WebtoonList
                        selIndex={selTabIndex}
                        navigation={navigation}
                        data={randomListData}
                        onEndReached={() => {
                            setPageIndex(pageIndex + 1)
                        }}
                        onCountAppr={ async (ix) => {
                            await CheckWebtoonAppr(ix)
                        }}
                        getRefresh={()=>{
                            LoadAppr(1)
                        }}
                    />
                </View>
            </View>
            <BottomBar navigation={navigation} selTab={'2'} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Constants.WINDOW_HEIGHT - 100 - topPadding(),
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    webtoonList: {
        flex: 1,
        width: Constants.WINDOW_WIDTH,

    },
});