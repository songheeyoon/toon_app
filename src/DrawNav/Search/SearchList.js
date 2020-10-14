import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import '@expo/vector-icons';
import { Image } from 'react-native-elements';

import Constants, { getCurUserIx } from '../../Utils/Constant';
import RestAPI from '../../Utils/RestAPI';
import { useFocusEffect } from '@react-navigation/native';

export default function SearchList({ keyWord, navigation }) {
    const [searchResult, setSearchResult] = useState()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        let isCancelled = false
        showPageLoader(true)
        RestAPI.searchWebtoon(keyWord).then(res => {
            if (!isCancelled) {
                setSearchResult(res)
            }
        }).catch(err => {
            if (!isCancelled) {
                Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
                showPageLoader(false)
            }
        }).finally(() => {
            if (!isCancelled) {
                showPageLoader(false)
            }
        })
        return () => {
            isCancelled = true
            showPageLoader(false)
        }
    }, [keyWord])

    const LoadWebtoonDetail = (webtoonIx, navigation) => {
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

    return (
        <View style={{ flex: 1, paddingTop: 10, width: Constants.WINDOW_WIDTH }}>
            {
                searchResult && searchResult == '' ?
                    <View style={{justifyContent: 'center', flexDirection: 'row'}}><Text style={{ fontSize: 17 }}>검색결과가 비어있습니다!</Text></View> :
                    <FlatList
                        data={searchResult}
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
                                            LoadWebtoonDetail(webtoon.ix, navigation)
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
                                                LoadWebtoonDetail(webtoon.ix, navigation)
                                            }}
                                        >
                                            <Text style={global.deviceType == '1' ? styles.genreText : styles.genreTextTablet}>{webtoon.genre}</Text>
                                            <Text numberOfLines={1} style={global.deviceType == '1' ? styles.nameText : styles.nameTextTablet}>{webtoon.name}</Text>
                                            <Text style={global.deviceType == '1' ? styles.authorText : styles.authorTextTablet}>{webtoon.author}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={global.deviceType == '1' ? styles.delPickBtn : styles.delPickBtnTablet}
                                            onPress={() => {
                                                navigation.navigate('webView', {
                                                    selTabIndex: 1,
                                                    link: webtoon.link
                                                })
                                            }}
                                        >
                                            <Text style={{ color: 'white', fontSize: 13 }}>바로 보기</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }}
                        refreshing={false}
                        onRefresh={() => { }}
                        keyExtractor={(item, index) => index.toString()}
                    />
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

    delPickBtn: {
        marginTop: 10,
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Constants.mainColor,
        paddingVertical: 3,
    },
    delPickBtnTablet: {
        marginTop: 10,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Constants.mainColor,
        paddingVertical: 5,
    },
})

