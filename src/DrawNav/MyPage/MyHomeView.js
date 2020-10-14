import React, { useState } from 'react';
import { StyleSheet, Text, View, Platform, FlatList, ScrollView, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import * as Progress from 'react-native-progress';
import '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import Logo from '../Components/Logo';
import Constants, { topPadding, getCurUserIx } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';
import RestAPI from '../../Utils/RestAPI';
import HeaderRight from '../Components/HeaderRight';


// 나의 페이지
export default function MyPage({ route, navigation }) {
    const [myDetail, setMyDetail] = useState()

    // 나의 페이지 상세정보 가져오기
    const getMyPageDetail = () => {
        showPageLoader(true)
        RestAPI.getMyPage(getCurUserIx()).then(res => {
            setMyDetail(res)
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            // Alert.alert('로딩 오류', 'getMyPage error : ' + err.message, [{ text: '확인' }])
            showPageLoader(false)
        }).finally(() => {
            showPageLoader(false)
        })
    }

    useFocusEffect(React.useCallback(
        () => {
            getMyPageDetail()
        },
        []
    ))

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
                <View style={styles.mainInnerView}>
                    <Text style={global.deviceType ? styles.userName : styles.userNameTablet}>{myDetail ? myDetail.user_name : null}님</Text>
                </View>

                <View style={styles.progressView}>
                    <Text style={global.deviceType == '1' ? styles.apprTitle : styles.apprTitleTablet}>
                        평가한 웹툰 {myDetail ? myDetail.evaluated_count : null}
                    </Text>
                    <Progress.Bar
                        progress={myDetail ? myDetail.evaluated_count / 100 : null}
                        borderColor={Constants.mainColor}
                        borderWidth={1.5}
                        unfilledColor={Constants.mainColor}
                        color='white'
                        width={global.deviceType == '1' ? Constants.WINDOW_WIDTH * 0.7 : Constants.WINDOW_WIDTH * 0.6}
                        height={2.5}
                    />
                </View>

                <View style={{...styles.preferView, height: myDetail && myDetail.author_count == 0 ? Constants.WINDOW_HEIGHT * 0.2 : Constants.WINDOW_HEIGHT * 0.4}}>
                    <Text style={global.deviceType == '1' ? styles.preferTitle : styles.preferTitleTablet}>선호 작가</Text>
                    {
                        myDetail && myDetail.author_count == 0 ?
                            <View style={styles.preferTitle}>
                                <Text>아직 높은 점수를 받은 작가가 없습니다.</Text>
                            </View> :
                            <FlatList
                                data={myDetail ? myDetail.best_author_list : null}
                                style={{ width: Constants.WINDOW_WIDTH }}
                                renderItem={({ item, index, separators }) => {
                                    let webtoon = item;
                                    if (webtoon) {
                                        return (
                                            <View style={styles.preferInnerView}>
                                                <Text style={global.deviceType == '1' ? styles.preferAuthorName : styles.preferAuthorNameTablet}>{webtoon.bestAuthorList}</Text>
                                                <View style={styles.preferAuthorDetailView}>
                                                    <View style={styles.preferWebtoonNameField}>
                                                        <Text style={{ color: '#AAA', fontSize: global.deviceType == '1' ? 12 : 16 }}>
                                                            {webtoon.title_text}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.preferWebtoonCountField}>
                                                        <Text style={{ color: '#AAA', fontSize: global.deviceType == '1' ? 12 : 16 }}>{webtoon.work_count}작품</Text>
                                                    </View>
                                                    <View style={styles.preferWebtoonPlatformField}>
                                                        <Text style={{ color: '#AAA', fontSize: global.deviceType == '1' ? 12 : 16 }}>
                                                            {webtoon.platform}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }
                                }}
                                refreshing={false}
                                onRefresh={() => { }}
                                keyExtractor={(item, index) => index.toString()}
                            />
                    }

                </View>
                <View style={styles.preferGenreView}>
                    <Text style={global.deviceType == '1' ? styles.preferTitle : styles.preferTitleTablet}>선호 장르</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {
                            myDetail ?
                                myDetail.genre_count == 0 ?
                                    <Text>아직 선호하는 장르가 없습니다.</Text> :
                                    myDetail.best_genre_list.map((genre, index) => {
                                        return (
                                            <View key={index} style={styles.preferGenreInnerView}>
                                                <Text style={global.deviceType == '1' ? styles.genreTitleList : styles.genreTitleListTablet}>{genre.genre_list}</Text>
                                                <Text style={global.deviceType == '1' ? styles.genreAppr : styles.genreApprTablet}>{genre.score_list}</Text>
                                            </View>
                                        )
                                    }) : null
                        }
                    </ScrollView>
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
    mainView: {
        flexDirection: 'column',
        height: '100%', width: Constants.WINDOW_WIDTH,
    },
    mainInnerView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 20,
    },
    userName: { fontSize: 16, marginRight: 5 },
    userNameTablet: { fontSize: 20, marginRight: 5 },
    progressView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: Constants.WINDOW_WIDTH,
    },
    apprTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        paddingBottom: 5,
    },
    apprTitleTablet: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 5,
    },
    apprNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 5
    },
    preferView: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingTop: 10,
        marginTop: 30,
        paddingHorizontal: 10,
        width: Constants.WINDOW_WIDTH
    },
    preferTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 10,
    },
    preferTitleTablet: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingVertical: 30,
    },
    preferInnerView: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingVertical: 5,
        paddingLeft: 15
    },
    preferAuthorName: { fontSize: 14, fontWeight: 'bold' },
    preferAuthorNameTablet: { fontSize: 17, fontWeight: 'bold' },
    preferAuthorDetailView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 5,
        paddingRight: 20
    },
    preferWebtoonNameField: {
        paddingRight: 5,
        width: '65%'
    },
    preferWebtoonCountField: { width: '15%' },
    preferWebtoonPlatformField: { width: '20%', alignItems: 'flex-end' },

    preferGenreView: {
        flexDirection: 'column',
        width: Constants.WINDOW_WIDTH,
        padding: 10
    },
    preferGenreInnerView: {
        width: Constants.WINDOW_WIDTH * 0.21,
        flexDirection: 'column',
        alignItems: 'center'
    },
    genreTitleList: {
        color: Constants.mainColor,
        fontWeight: 'bold',
        fontSize: 14,
    },
    genreTitleListTablet: {
        color: Constants.mainColor,
        fontWeight: 'bold',
        fontSize: 18,
    },
    genreAppr: { paddingVertical: 5, fontSize: 14, color: '#AAA' },
    genreApprTablet: { paddingVertical: 5, fontSize: 18, color: '#AAA' }

})