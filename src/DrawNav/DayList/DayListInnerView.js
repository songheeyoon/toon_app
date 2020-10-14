import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import '@expo/vector-icons';
import { Image } from 'react-native-elements';


import Constants, { getCurUserIx, NumToDay, NumToPlatform } from '../../Utils/Constant';
import TabButtonsPlatform from '../Appr/TabButtonsPlatform';
import RestAPI from '../../Utils/RestAPI';

// 요일별 웹툰추가 페이지에서 추가 바톤을 클릭한후 페이지
export function WebtoonList({ navigation, data, refreshData }) {

    const [listData, setListData] = useState()
    let flatRef = useRef(null);

    useEffect(() => {
        setListData(data)
        try {
            flatRef.current?.scrollToIndex({
                animated: false,
                index: 0,
            })
        } catch (ex) {
            console.log(ex)
        }
    }, [data])

    const LoadWebtoonDetail = (webtoonIx) => {
        RestAPI.getWebtoonDetail(getCurUserIx(), webtoonIx).then(res => {
            if (res.success == 1) {
                navigation.navigate('detailView', { webtoon: res.data[0], selTabIndex: '3' });
            } else {
                Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            // Alert.alert('로딩 오류', 'getWebtoonDetail in DayListInnerView error : ' + err.message, [{ text: '확인' }])
        }).finally(() => {
        })
    }

    const AddFavorites = (day, webtoonIx) => {
        showPageLoader(true)
        RestAPI.addFavoritesWebtoon(getCurUserIx(), day, webtoonIx).then(res => {
            if (res.msg == 'suc') {
                let filterData = listData?.filter(item => item.ix !== webtoonIx)
                setListData(filterData)
                Alert.alert('성공', '즐겨찾기에 추가되었습니다.', [{ text: '확인' }])
            } else if (res.msg == 'is') {
                Alert.alert('추가 오류', '이미 즐겨찾기에 추가한 웹툰입니다.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            // Alert.alert('로딩 오류', 'addFavoritesWebtoon error : ' + err.message, [{ text: '확인' }])
        }).finally(() => {
            showPageLoader(false)
        })
    }

    return (
        <View style={{ flex: 1, paddingBottom: Platform.OS == 'ios' ? 105 : 50}}>
            <FlatList
                ref={flatRef}
                data={listData ? listData : null}
                renderItem={({ item, index, separators }) => {
                    let webtoon = item;
                    return (
                        <View key={index} style={styles.webtoonItemView}>
                            <TouchableOpacity
                                onPress={() => {
                                    LoadWebtoonDetail(webtoon.ix)
                                }}
                            >
                                <Image
                                    source={{ uri: webtoon.image_link }}
                                    style={global.deviceType == '1' ? styles.webtoonItemImage : styles.webtoonItemImageTablet}
                                    PlaceholderContent={<ActivityIndicator />}
                                />
                            </TouchableOpacity>

                            <View style={styles.webtoonItemText}>
                                <TouchableOpacity
                                    onPress={() => {
                                        LoadWebtoonDetail(webtoon.ix)
                                    }}
                                >
                                    <Text style={global.deviceType == '1' ? styles.genreText : styles.genreTextTablet}>{webtoon.genre}</Text>
                                    <Text numberOfLines={1} style={global.deviceType == '1' ? styles.nameText : styles.nameTextTablet}>{webtoon.webtoon_name}</Text>
                                    <Text style={global.deviceType == '1' ? styles.authorText : styles.authorTextTablet}>{webtoon.author}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ ...styles.addDayListBtn, backgroundColor: webtoon.add_class == "favorited" ? '#8c8c8c' : Constants.darkColor }}
                                    onPress={() => {
                                        AddFavorites(webtoon.ing, webtoon.ix)
                                    }}
                                >
                                    <Text style={global.deviceType == '1' ? styles.addText : styles.addTextTablet}>즐겨찾기 추가</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }}
                refreshing={false}
                onRefresh={() => {
                    if (refreshData) {
                        refreshData()
                    }
                }}
                keyExtractor={( item ) => item.ix}
            />
        </View>
    )
}

// 요일별 웹툰 추가를 위한 페이지
export default function DayListInnerView({ selIndex, navigation }) {
    const [platformTabIndex, setPlatformTabIndex] = useState(0)
    const [dayWebtoonList, setDayWebtoonList] = useState()

    const LoadDayList = () => {
        RestAPI.getDayList(getCurUserIx(), NumToDay(selIndex), NumToPlatform(platformTabIndex)).then(res => {
            setDayWebtoonList(res)
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            // Alert.alert('로딩 오류', 'getDayList error : ' + err.message, [{ text: '확인' }])
            return
        })
    }

    useEffect(() => {
        LoadDayList()
    }, [selIndex, platformTabIndex])

    return (
        <View style={styles.container}>
            <View style={styles.tabScroll}>
                <TabButtonsPlatform
                    platformIndex={platformTabIndex}
                    onTapButton={(index) => {
                        setPlatformTabIndex(index)
                    }}
                />
            </View>
            <WebtoonList
                data={dayWebtoonList}
                navigation={navigation}
                refreshData={() => {
                    LoadDayList()
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    containter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    tabScroll: {
        width: Constants.WINDOW_WIDTH,
        paddingBottom: 10,
    },
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
        height: Constants.WINDOW_HEIGHT * 0.15
    },
    webtoonItemText: {
        flexDirection: 'column',
        paddingHorizontal: 15,
        paddingVertical: 5,
        justifyContent: 'space-around',
        width: Constants.WINDOW_WIDTH * 0.6
    },
    genreText: { fontSize: 14, color: '#777' },
    genreTextTablet: { fontSize: 16, color: '#777' },
    nameText: { fontSize: 17, fontWeight: 'bold' },
    nameTextTablet: { fontSize: 20, fontWeight: 'bold' },
    authorText: { fontSize: 14, color: '#555' },
    authorTextTablet: { fontSize: 16, color: '#555' },
    addText: { color: 'white', fontSize: 14 },
    addTextTablet: { color: 'white', fontSize: 16 },
    addDayListBtn: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
})