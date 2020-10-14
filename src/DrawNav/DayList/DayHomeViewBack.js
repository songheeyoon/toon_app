import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { Header } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import { AntDesign } from '@expo/vector-icons';
import '@expo/vector-icons';
import { Image } from 'react-native-elements';


import Constants, { topPadding, getCurUserIx, NumToDay, getDayName, convertDayToNum } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';
import DayButtons from './DayButtons';
import RestAPI from '../../Utils/RestAPI';
import { useFocusEffect } from '@react-navigation/native';
import HeaderRight from '../Components/HeaderRight';

// 백업 파일
export const WebtoonListSwipe = ({ item, navigation }) => {

    return (
        <View style={styles.webtoonListSwipeView}>
            <View key={item.index} style={styles.webtoonItemView} >
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('webView', {
                            selTabIndex: 3,
                            link: item.item.link
                        })
                    }}
                    style={{ flexDirection: 'row', alignItems: 'stretch' }}
                >
                    <Image
                        source={{ uri: item.item.image_link }}
                        style={global.deviceType == '1' ? styles.webtoonItemImage : styles.webtoonItemImageTablet}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                    <View style={global.deviceType == '1' ? styles.webtoonItemText : styles.webtoonItemTextTablet}>
                        <Text style={global.deviceType == '1' ? styles.genreText : styles.genreTextTablet}>{item.item.genre}</Text>
                        <Text style={global.deviceType == '1' ? styles.nameText : styles.nameTextTablet}>{item.item.webtoon_name}</Text>
                        <Text style={global.deviceType == '1' ? styles.authorText : styles.authorTextTablet}>{item.item.author}</Text>
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.webtoonItemIcon} > */}
                    <AntDesign name="left" size={30} color={Constants.mainColor} />
                {/* </TouchableOpacity> */}

            </View>
        </View>
    )
}

export default function DayHomeView({ route, navigation }) {
    const [selDayIndex, setSelDayIndex] = useState(convertDayToNum(getDayName()))
    const [selectDayWebtoon, setSelectDayWebtoon] = useState()

    useEffect(() => {
        WebtoonFromDay(selDayIndex)
    }, [selDayIndex])

    useFocusEffect(React.useCallback(() => {
        setSelDayIndex(convertDayToNum(getDayName()))
        WebtoonFromDay(selDayIndex)
    }, []))


    const WebtoonFromDay = (selDay) => {
        showPageLoader(true)
        RestAPI.getWebtoonFromDay(getCurUserIx(), NumToDay(selDay)).then(res => {
            setSelectDayWebtoon(res)
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            showPageLoader(false)
            return
        }).finally(() => {
            showPageLoader(false)
        })
    }

    const DelFavorWebtoon = (webtoonIx) => {
        showPageLoader(true)
        RestAPI.favorDelWebtoon(getCurUserIx(), webtoonIx).then(res => {
            if (res.msg == 'suc') {
                WebtoonFromDay()
            } else {
                Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
                showPageLoader(false)
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생하였습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            showPageLoader(false)
            return
        }).finally(() => {
            showPageLoader(false)
        })
    }

    const LoadWebtoonDetail = (webtoonIx) => {
        RestAPI.getWebtoonDetail(getCurUserIx(), webtoonIx).then(res => {
            if (res.success == 1) {
                navigation.navigate('detailView', { webtoon: res.data[0], selTabIndex: '3' });
            } else {
                Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {
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
                <DayButtons
                    selIndex={selDayIndex}
                    onDayButton={(index) => {
                        setSelDayIndex(index)
                    }} />

                <View style={styles.homeRightView}>
                    <View style={styles.homeRightInnerView}>
                        <TouchableOpacity
                            style={{ paddingBottom: 5, paddingTop: 15, paddingRight: 50 }}
                            onPress={() => {
                                if (getCurUserIx() == '') {
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
                                } else {
                                    navigation.navigate('dayList', {selDayIndex: selDayIndex })
                                }
                            }}
                        >
                            <AntDesign name="pluscircle" size={25} color={Constants.darkColor} />
                        </TouchableOpacity>
                        <Text style={{ paddingBottom: 10, paddingRight: 50 }}>요일별 웹툰을 추가해주세요.</Text>
                        {
                            getCurUserIx() != '' && selectDayWebtoon ?
                                <SwipeListView
                                    disableRightSwipe
                                    keyExtractor={(item, index) => index.toString()}
                                    contentContainerStyle={{ paddingBottom: 90 }}
                                    data={selectDayWebtoon}
                                    renderItem={(data, rowMap) => (
                                        <WebtoonListSwipe item={data} navigation={navigation}/>
                                    )}
                                    renderHiddenItem={(data, rowMap) => (
                                        <View style={{ flex: 1, paddingBottom: 1 }}>
                                            <View style={global.deviceType == '1' ? styles.hiddenItemView : styles.hiddenItemViewTablet}>
                                                <TouchableOpacity style={styles.hiddenItemDelBtn}
                                                    onPress={() => {
                                                        Alert.alert('알림', '정말 삭제하시겠습니까?', [
                                                            { text: '취소' },
                                                            {
                                                                text: '확인',
                                                                onPress: () => {
                                                                    DelFavorWebtoon(data.item.ix)
                                                                }
                                                            }
                                                        ])
                                                    }}
                                                >
                                                    <Text style={{ color: 'white' }}>삭제</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.hiddenItemDetailBtn}
                                                    onPress={() => {
                                                        LoadWebtoonDetail(data.item.ix)
                                                    }}
                                                >
                                                    <Text style={{ color: Constants.darkColor }}>상세{"\n"}보기</Text>
                                                </TouchableOpacity>

                                            </View>
                                        </View>
                                    )}
                                    leftOpenValue={0}
                                    rightOpenValue={-75}
                                    refreshing={true}
                                /> : null

                        }


                    </View>
                </View>
            </View>
            <BottomBar navigation={navigation} selTab={'3'} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Constants.WINDOW_HEIGHT - 100 - topPadding(),
        flexDirection: 'row',
    },
    homeRightView: {
        flexDirection: 'column',
        width: Constants.WINDOW_WIDTH - 50,
        // borderColor: 'blue', borderWidth: 1
    },
    homeRightInnerView: {
        width: '100%',
        alignItems: 'center',
        // borderColor: 'blue', borderWidth: 1 
    },
    hiddenItemView: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginBottom: 10,
        height: (Constants.WINDOW_WIDTH - 50) * 0.3
    },
    hiddenItemViewTablet: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginBottom: 10,
        height: (Constants.WINDOW_WIDTH - 50) * 0.2
    },
    hiddenItemDetailBtn: {
        // borderWidth: 1, borderColor: 'red', 
        height: '50%',
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dbdbdb'
    },
    hiddenItemDelBtn: {
        // borderWidth: 1, borderColor: 'red', 
        height: '50%',
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Constants.mainColor
    },
    webtoonListSwipeView: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: Constants.WINDOW_WIDTH - 50,
        backgroundColor: 'white',
        paddingBottom: 1
    },
    webtoonItemIcon: {
        flexDirection: 'row',
        width: (Constants.WINDOW_WIDTH - 50) * 0.15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    webtoonItemView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
    },
    webtoonItemImage: {
        width: (Constants.WINDOW_WIDTH - 50) * 0.4,
        height: (Constants.WINDOW_WIDTH - 50) * 0.3
    },
    webtoonItemImageTablet: {
        width: (Constants.WINDOW_WIDTH - 50) * 0.3,
        height: (Constants.WINDOW_WIDTH - 50) * 0.2
    },
    webtoonItemText: {
        flexDirection: 'column',
        paddingLeft: 15,
        paddingVertical: 5,
        justifyContent: 'space-around',
        width: (Constants.WINDOW_WIDTH - 50) * 0.45,
    },
    webtoonItemTextTablet: {
        flexDirection: 'column',
        paddingLeft: 15,
        paddingVertical: 5,
        justifyContent: 'space-around',
        width: (Constants.WINDOW_WIDTH - 50) * 0.55,
    },
    genreText: { fontSize: 14 , color: '#777' },
    genreTextTablet: { fontSize: 16 , color: '#777' },
    nameText: { fontSize: 17 , fontWeight: 'bold' },
    nameTextTablet: { fontSize: 20 , fontWeight: 'bold' },
    authorText: { fontSize: 14 , color: '#555' },
    authorTextTablet: { fontSize: 16 , color: '#555' },
    showBtn: {
        height: '100%',
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Constants.mainColor,
        marginRight: 5
    },
    showBtnView: {
        flexDirection: 'row',
        height: 25,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
})