import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, ActivityIndicator, Platform } from 'react-native';
import '@expo/vector-icons';
import { Image } from 'react-native-elements';
import StarRating from 'react-native-star-rating';

import Constants, { getCurUserIx, isIPhoneX } from '../../../../Utils/Constant';
import RestAPI from '../../../../Utils/RestAPI';
import { useFocusEffect } from '@react-navigation/native';

// 선택한 웹툰 리스트에 별점 주기
export const StarList = ({ item, index, onLoadWebtoonDetail, onGiveStarCount }) => {
    let webtoon = item;
    const [stars, setStars] = useState(Number(webtoon.rate));

    useEffect(()=>{
        setStars(Number(webtoon.rate))
    },[item])

    return <View style={styles.webtoonItemView}>
        <TouchableOpacity
            onPress={() => {
                if (onLoadWebtoonDetail) {
                    onLoadWebtoonDetail(webtoon.ix)
                }
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
            <TouchableOpacity style={{width: global.deviceType == '1' ? '60%' : '45%'}}>
                <StarRating
                    disabled={false}
                    emptyStar={'ios-star'}
                    fullStar={'ios-star'}
                    halfStar={'ios-star-half'}
                    iconSet={'Ionicons'}
                    maxStars={5}
                    rating={stars}
                    selectedStar={(val) => {
                        setStars(val)
                        onGiveStarCount(val, webtoon.ix)
                    }}
                    fullStarColor={"orange"}
                    emptyStarColor={'#ccc'}
                    starSize={global.deviceType == '1' ? 25 : 35}
                />
            </TouchableOpacity>
        </View>
    </View>
}

// 최근 평가한 웹툰 리스트 가져오기
export default function RecentRandomList({ navigation, selIndex }) {

    const [loadData, setLoadData] = useState()

    useFocusEffect(React.useCallback(() => {
        LoadMyData(0)
    }, []))

    useEffect(() => {
        LoadMyData(selIndex)
    }, [selIndex, navigation])

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

    const LoadMyData = (type) => {
        showPageLoader(true)
        RestAPI.getPickApprWebtoon(getCurUserIx(), type).then(res => {
            setLoadData(res)
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            showPageLoader(false)
            return
        }).finally(() => {
            showPageLoader(false)
        })
    }

    const LoadWebtoonDetail = (webtoonIx) => {
        RestAPI.getWebtoonDetail(getCurUserIx(), webtoonIx).then(res => {
            if (res.success == 1) {
                navigation.navigate('detailView', { webtoon: res.data[0], selTabIndex: '2' });
            } else {
                Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {
        })
    }

    const GiveStar = (index, webtoonIx) => {
        RestAPI.giveStar(getCurUserIx(), webtoonIx, index).then(res => {
            if (res.msg == 'suc') {
            } else {
                return
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            return
        }).finally(() => { })
    }

    return (
        <View style={{ flex: 1, paddingTop: 10, paddingBottom: Platform.OS == 'ios' ? isIPhoneX() ? 50 : 30 : 0 }}>
            {
                loadData && loadData.apprCount != 0 ?
                    <FlatList
                        ref={flatRef}
                        data={loadData.apprWebtoonList}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={500}
                        initialNumToRender={20}
                        windowSize={30}
                        legacyImplementation={true}
                        renderItem={({ item, index, separators }) => {
                            return (
                                <StarList
                                    key={index}
                                    item={item}
                                    index={index}
                                    onLoadWebtoonDetail={(webtoonIx) => { LoadWebtoonDetail(webtoonIx) }}
                                    onGiveStarCount={(val, webtoonIx) => {
                                        GiveStar(val, webtoonIx)
                                    }}
                                />
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
        paddingVertical: 5,
        paddingLeft: 15,
        justifyContent: 'space-around',
        width: Constants.WINDOW_WIDTH * 0.6
    },
    genreText: { color: '#777', fontSize: 14 },
    genreTextTablet: { color: '#777', fontSize: 16 },
    nameText: { fontSize: 17, fontWeight: 'bold' },
    nameTextTablet: { fontSize: 20, fontWeight: 'bold' },
    authorText: { color: '#555', fontSize: 14 },
    authorTextTablet: { color: '#555', fontSize: 16 },

    touchStar: { width: '60%', fontSize: 12 },
    touchStarTablet: { width: '45%', fontSize: 12 },
})

