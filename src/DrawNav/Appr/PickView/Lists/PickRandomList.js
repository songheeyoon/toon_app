import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import '@expo/vector-icons';
import { Image } from 'react-native-elements';

import Constants, { getCurUserIx } from '../../../../Utils/Constant';
import RestAPI from '../../../../Utils/RestAPI';
import { useFocusEffect } from '@react-navigation/native';


// 픽한 웹툰 리스트 랜덤 목록 가져오기
export default function PickRandomList({ navigation, selIndex }) {

    const [loadData, setLoadData] = useState()

    useFocusEffect(React.useCallback(() => {
        LoadMyData(0)
    }, []))

    useEffect(() => {
        LoadMyData(selIndex)
    }, [selIndex])

    let flatRef = useRef(null);
    useEffect(() => {
        try {
            flatRef.current?.scrollToIndex({
                animated: false,
                index: 0,
            })
        } catch (ex) {
            console.log(ex)
        }
    }, [selIndex])

    // 픽한 웹툰 목록 가져오기
    const LoadMyData = (type) => {
        showPageLoader(true)
        RestAPI.getPickApprWebtoon(getCurUserIx() == '' ? global.ipAddress : getCurUserIx(), type).then(res => {
            setLoadData(res)
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생하였습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            // Alert.alert('로딩 오류', 'getPickApprWebtoon in PickRandomList error : ' + err.message, [{ text: '확인' }])
            showPageLoader(false)
            return
        }).finally(() => {
            showPageLoader(false)
        })
    }

    // 선택한 웹툰 프로필 가져오기
    const LoadWebtoonDetail = (webtoonIx) => {
        RestAPI.getWebtoonDetail(getCurUserIx(), webtoonIx).then(res => {
            if (res.success == 1) {
                navigation.navigate('detailView', { webtoon: res.data[0], selTabIndex: '2' });
            } else {
                Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            // Alert.alert('로딩 오류', 'getWebtoonDetail in PickRandomList in GenreSel error : ' + err.message, [{ text: '확인' }])
        }).finally(() => {
        })
    }

    // 픽한웹툰 삭제하기
    const DelPick = (webix) => {
        showPageLoader(true)
        RestAPI.pickDel(getCurUserIx(), webix).then(res => {
            if (res.msg == 'suc') {
                LoadMyData(selIndex)
            } else {
                Alert.alert('오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            // Alert.alert('로딩 오류', 'pickDel error : ' + err.message, [{ text: '확인' }])
            showPageLoader(false)
            return
        }).finally(() => {
            showPageLoader(false)
        })
    }

    return (
        <View style={{ flex: 1, paddingTop: 10, paddingBottom: Platform.OS == 'ios' ? 50 : 0 }}>
            {
                loadData && loadData.pickCount != 0 ?
                    <FlatList
                        ref={flatRef}
                        data={loadData.pickWebtoonList}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={500}
                        initialNumToRender={20}
                        windowSize={30}
                        legacyImplementation={true}
                        renderItem={({ item, index, separators }) => {
                            let webtoon = item;
                            return (
                                <View key={webtoon.ix} style={styles.webtoonItemView}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            // Alert.alert(
                                            //     '알림', '픽한 목록에서 삭제하시겠습니까?',
                                            //     [{
                                            //         text: '취소',
                                            //         onPress: () => {
                                            //             LoadWebtoonDetail(webtoon.ix)
                                            //         }
                                            //     }, {
                                            //         text: '확인',
                                            //         onPress: () => {
                                            //             DelPick(webtoon.ix)
                                            //         }
                                            //     }]
                                            // )
                                            LoadWebtoonDetail(webtoon.ix)
                                        }}
                                    >
                                        <Image
                                            source={{ uri: webtoon.webtoon_image }}
                                            style={global.deviceType == '1' ? styles.webtoonItemImage : styles.webtoonItemImageTablet}
                                            PlaceholderContent={<ActivityIndicator />}
                                        />
                                    </TouchableOpacity>

                                    <View style={styles.webtoonItemText}>
                                        <Text style={global.deviceType == '1' ? styles.genreText : styles.genreTextTablet}>{webtoon.genre}</Text>
                                        <Text numberOfLines={1} style={global.deviceType == '1' ? styles.nameText : styles.nameTextTablet}>{webtoon.title}</Text>
                                        <Text style={global.deviceType == '1' ? styles.authorText : styles.authorTextTablet}>{webtoon.author}</Text>
                                        {/* <TouchableOpacity 
                                            style={styles.delPickBtn}
                                            onPress={() => {
                                                Alert.alert(
                                                    '알림', '정말로 삭제하시겠습니까?',
                                                    [{
                                                        text: '취소',
                                                        onPress: () => { }
                                                    }, {
                                                        text: '확인',
                                                        onPress: () => {
                                                            DelPick(webtoon.ix)
                                                        }
                                                    }]
                                                )
                                            }}
                                        >
                                            <Text style={{ color: 'white', fontSize: global.deviceType == '1' ? 14 : 16 }}>삭제</Text>
                                        </TouchableOpacity>  */}
                                    </View>
                                </View>
                            )
                        }}
                        refreshing={false}
                        onRefresh={() => { }}
                        keyExtractor={(item, index) => index.toString()}
                    /> : null
            }

        </View>
    )
}

const styles = StyleSheet.create({
    webtoonItemView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingBottom: 1
    },
    webtoonItemImage: {
        width: Constants.WINDOW_WIDTH * 0.4,
        height: Constants.WINDOW_WIDTH * 0.32
    },
    webtoonItemImageTablet: {
        width: Constants.WINDOW_WIDTH * 0.3,
        height: Constants.WINDOW_WIDTH * 0.2
    },
    webtoonItemText: {
        flexDirection: 'column',
        padding: 10,
        justifyContent: 'space-around',
        width: Constants.WINDOW_WIDTH * 0.6
    },
    genreText: { color: '#777', fontSize: 14 },
    genreTextTablet: { color: '#777', fontSize: 16 },
    nameText: { fontSize: 17, fontWeight: 'bold' },
    nameTextTablet: { fontSize: 20, fontWeight: 'bold' },
    authorText: { color: '#555', fontSize: 14 },
    authorTextTablet: { color: '#555', fontSize: 16 },
    delPickBtn: {
        width: '45%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Constants.mainColor,
        paddingVertical: 5,
    },
})

