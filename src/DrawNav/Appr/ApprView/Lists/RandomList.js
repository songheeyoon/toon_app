import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Image, rating } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import '@expo/vector-icons';

import Constants, { getCurUserIx, zeroArray, isIPhoneX } from '../../../../Utils/Constant';
import RestAPI from '../../../../Utils/RestAPI';
import { useFocusEffect } from '@react-navigation/native';

export const StarList = ({ item, index, onLoadWebtoonDetail, onGiveStarCount, onCountAppr, navigation }) => {

    let webtoon = item;
    const [stars, setStars] = useState(item.rate);

    useEffect(()=>{
        setStars(item.rate)
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
                source={{ uri: webtoon.image_link , cache: 'force-cache'}}
                style={global.deviceType == '1' ? styles.webtoonItemImage : styles.webtoonItemImageTablet}
                PlaceholderContent={<ActivityIndicator />}
            />
        </TouchableOpacity>

        <View style={styles.webtoonItemText}>
            <TouchableOpacity
                onPress={() => {
                    if (onLoadWebtoonDetail) {
                        onLoadWebtoonDetail(webtoon.ix)
                    }
                }}
            >
                <Text style={global.deviceType == '1' ? styles.genreText : styles.genreTextTablet}>{webtoon.genre}</Text>
                <Text numberOfLines={1} style={global.deviceType == '1' ? styles.nameText : styles.nameTextTablet}>{webtoon.webtoon_name}</Text>
                <Text style={global.deviceType == '1' ? styles.authorText : styles.authorTextTablet}>{webtoon.author}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: global.deviceType == '1' ? '70%' : '60%' }}>
                <StarRating
                    buttonStyle={{paddingHorizontal: global.deviceType == '1' ? 3 : 10}}
                    containerStyle={{justifyContent: 'flex-start'}}
                    disabled={false}
                    emptyStar={'ios-star'}
                    fullStar={'ios-star'}
                    halfStar={'ios-star-half'}
                    iconSet={'Ionicons'}
                    maxStars={5}
                    rating={global.curUser ? stars : 0}
                    selectedStar={(val) => {

                        if (!global.curUser)
                            Alert.alert(
                                '알림', '로그인이 필요한 기능입니다!',
                                [{
                                    text: '취소',
                                    onPress: () => { }
                                }, {
                                    text: '로그인',
                                    onPress: () => { navigation.navigate('login') }
                                }]
                            )
                        else {
                            setStars(val)
                            onCountAppr(webtoon.ix)
                            onGiveStarCount(val, webtoon.ix)
                        }
                    }}
                    fullStarColor={"orange"}
                    emptyStarColor={'#BBB'}
                    starSize={global.deviceType == '1' ? 25 : 35}
                />
            </TouchableOpacity>
        </View>
    </View>
}


export default function RandomList({ selIndex, genreIndex, platformIndex, data, navigation, onEndReached, onCountAppr, getRefresh }) {
    let flatRef = useRef(null);
    const [curData, setCurData] = useState()

    useEffect(()=>{
        setCurData(data)
    }, [data])

    useEffect(() => {
        try {
            flatRef.current?.scrollToIndex({
                animated: false,
                index: 0,
            })
        } catch (ex) {
            console.log(ex)
        }
    }, [genreIndex, selIndex, platformIndex])



    const LoadWebtoonDetail = (webtoonIx) => {
        RestAPI.getWebtoonDetail(getCurUserIx(), webtoonIx).then(res => {
            if (res.success == 1) {
                navigation.navigate('detailView', { webtoon: res.data[0], selTabIndex: '2' });
            } else {
                Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생하였습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {
        })
    }

    const GiveStar = (val, webtoonIx) => {
        RestAPI.giveStar(getCurUserIx(), webtoonIx, val).then(res => {
            if (res.msg == 'suc') {
            } else {
                return
            }
        }).catch(err => {
            return
        }).finally(() => {
        })
    }



    return (
        <View style={{ flex: 1, paddingBottom: isIPhoneX() ? 50 : 0 }}>
            <FlatList
                ref={flatRef}
                data={curData}
                windowSize={41}
                removeClippedSubviews={true}
                maxToRenderPerBatch={200}
                updateCellsBatchingPeriod={200}
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
                                data[index].rate = val;
                                setCurData(data)
                            }}
                            onCountAppr={(ix) => {
                                if (onCountAppr) {
                                    onCountAppr(ix)
                                }
                            }}
                            navigation={navigation}
                        />
                    )
                }}
                refreshing={false}
                onRefresh={() => {
                    if (getRefresh) {
                        getRefresh()
                    }
                }}
                onEndReachedThreshold={0.5}
                onEndReached={(offset) => {
                    if (onEndReached) {
                        onEndReached();
                    }
                }}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    webtoonItemView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingBottom: 1,
        width: Constants.WINDOW_WIDTH,
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
        paddingVertical: 5,
        paddingLeft: 20,
        justifyContent: 'space-around',
        width: Constants.WINDOW_WIDTH * 0.6
    },
    genreText: { color: '#777', fontSize: 14, paddingBottom: 5 },
    genreTextTablet: { color: '#777', fontSize: 16, paddingBottom: 10 },
    nameText: { fontWeight: 'bold', fontSize: 17, paddingBottom: 5 },
    nameTextTablet: { fontWeight: 'bold', fontSize: 20, paddingBottom: 10 },
    authorText: { color: '#555', fontSize: 14, paddingBottom: 5 },
    authorTextTablet: { color: '#555', fontSize: 16, paddingBottom: 10 },
})

