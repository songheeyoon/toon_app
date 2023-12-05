import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, AsyncStorage, Alert, Platform } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Constants, { getCurUserIx } from '../Utils/Constant';
import HomeView from '../DrawNav/Home/HomeView';
import ApprView from '../DrawNav/Appr/ApprView/ApprView';
import PickView from '../DrawNav/Appr/PickView/PickView';
import RecentView from '../DrawNav/Appr/RecentView/RecentView';
import DetailView from '../DrawNav/Detail/DetailView';
import DetailWebView from '../DrawNav/Detail/DetailWebView';
import DayHomeView from '../DrawNav/DayList/DayHomeView';
import DayListView from '../DrawNav/DayList/DayListView';
import MyHomeView from '../DrawNav/MyPage/MyHomeView';
import AccountSettingView from '../DrawNav/MyPage/AccountSettingView';
import AccountSettingViewChangeName from '../DrawNav/MyPage/AccountSettingViewChangeName';
import ClientCenterView from '../DrawNav/MyPage/ClientCenterView';
import AccountSettingViewChangePass from './MyPage/AccountSettingViewChangePass';
import AccountSettingViewExit from './MyPage/AccountSettingViewExit';
import ClientCenterViewContact from './MyPage/ClientCenterViewContact';
import ClientCenterViewHistory from './MyPage/ClientCenterViewHistory';
import ClientCenterViewFaq from './MyPage/ClientCenterViewFaq';
import ClientCenterViewBoard from './MyPage/ClientCenterViewBoard';
import ClientCenterViewBoardDetail from './MyPage/ClientCenterViewBoardDetail';
import SearchView from './Search/SearchView';
import RestAPI from '../Utils/RestAPI';
import { useFocusEffect } from '@react-navigation/native';
import * as Network from 'expo-network';
import BannerLinkView from '../DrawNav/Home/BannerLinkView';


const Drawer = createDrawerNavigator();

// 픽한 웹툰 목록 햄버거에 현시하기
export const PickWebtoonView = ({ onTapItem, data, type }) => {
    if (data == null) {
        return null
    } else {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {
                    type == 'pick' ?
                        data.pickWebtoonList.map((item, idx) => {
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.scrollImageView}
                                    onPress={() => {
                                        if (onTapItem) {
                                            onTapItem(item, idx);
                                        }
                                    }}>
                                    <Image
                                        source={{ uri: item.webtoon_image }}
                                        style={global.deviceType == '1' ? styles.webtoonImage : styles.webtoonImageTablet} />
                                </TouchableOpacity>
                            )
                        }) :
                        data.apprWebtoonList.map((item, idx) => {
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.scrollImageView}
                                    onPress={() => {
                                        if (onTapItem) {
                                            onTapItem(item, idx);
                                        }
                                    }}>
                                    <Image
                                        source={{ uri: item.webtoon_image }}
                                        style={global.deviceType == '1' ? styles.webtoonImage : styles.webtoonImageTablet} />
                                </TouchableOpacity>
                            )
                        })
                }
            </ScrollView>
        )
    }
}

// 웹툰 상세정보 얻어오기
export const LoadWebtoonDetail = (webtoonIx, navigation) => {
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

// 픽한 웹툰 리스트 가져오기
const PickWebtoonList = ({ navigation, data }) => {
    return (
        <>
            <PickWebtoonView data={data} type={'pick'} onTapItem={(item, idx) => {
                LoadWebtoonDetail(item.ix, navigation)
            }} />
            {
                data && data.pickCount >= 5 ?
                    <TouchableOpacity
                        style={styles.allView}
                        onPress={() => {
                            navigation.navigate('pick')
                        }}
                    >
                        <Text style={styles.allViewText}>모두 보기</Text>
                    </TouchableOpacity> : null
            }
        </>
    )
}

// 평가한 웹툰 리스트 가져오기
const ApprWebttonList = ({ navigation, data }) => {
    return (
        <>
            <PickWebtoonView data={data} type={'appr'} onTapItem={
                (item, idx) => {
                    LoadWebtoonDetail(item.ix, navigation)
                }} />
            {
                data && data.apprCount >= 5 ?
                    <TouchableOpacity
                        style={styles.allView}
                        onPress={() => {
                            navigation.navigate('recent')
                        }}
                    >
                        <Text style={styles.allViewText}>모두 보기</Text>
                    </TouchableOpacity> : null
            }
        </>
    )
}

// 햄버거
export const CustomDrawerContent = (props) => {

    const [pickApprWebtoonData, getPickApprWebtoonData] = useState()
    const [ip,setIp] = useState();
    let isEnabledOne = '';
    let isEnabledTwo = '';
    let isEnabledThree = '';


    // 해당 유저의 픽 및 평가한 웹툰 목록 가져오기
    const ApprPickWebtoon = () => {
        RestAPI.getPickApprWebtoon(getCurUserIx() == '' ? global.ipAddress : getCurUserIx(), '0').then(res => {
            getPickApprWebtoonData(res)
        }).catch(err => {
            Alert.alert('로딩 오류', '인터넷 연결 확인 후 다시 시도해주세요.', [{ text: '확인' }])
            // Alert.alert('로딩 오류', 'getPickApprWebtoon in Drawer Navigation error : ' + err.message, [{ text: '확인' }])
            showPageLoader(false)
            return
        }).finally(() => {
            showPageLoader(false)
        })
    }

    // 로그아웃
    const logout = () => {
        RestAPI.logout(getCurUserIx()).then(res => {
        }).catch(err => {
            Alert.alert('로딩 오류', err.message, [{ text: '확인' }])
        }).finally(() => { })
    }

    useEffect(() => {
        ApprPickWebtoon()
    }, [props])

    useFocusEffect(React.useCallback(() => {
        getPickApprWebtoonData()
        ApprPickWebtoon()
    }, []))
    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.closeView}>
                <MaterialCommunityIcons name="close" size={28} onPress={() => props.navigation.closeDrawer()} />
            </View>
            <View style={styles.pickView}>
                <Text style={{ fontSize: 16 }}>최근 본 웹툰</Text>
                {
                    pickApprWebtoonData && pickApprWebtoonData.pickCount == 0 ?
                        <View style={{ padding: 30 }}>
                            <Text style={{ color: '#888' }}>최근 본 웹툰이 없습니다.</Text>
                        </View> :
                        <PickWebtoonList navigation={props.navigation} data={pickApprWebtoonData} />
                }

            </View>
            <View style={styles.apprView}>
                <Text style={{ fontSize: 16 }}>평가한 웹툰</Text>
                {
                    pickApprWebtoonData && pickApprWebtoonData.apprCount == 0 ?
                        <View style={{ padding: 30 }}>
                            <Text style={{ color: '#888' }}>평가한 웹툰이 없습니다.</Text>
                        </View> :
                        <ApprWebttonList navigation={props.navigation} data={pickApprWebtoonData} />
                }
            </View>
            <View style={styles.settingView}>
                <Text style={{ fontSize: 16 }}>설정</Text>
            </View>

            <DrawerItem
                label={"고객센터"}
                style={{ backgroundColor: 'white', justifyContent: 'center', height: 40, paddingHorizontal: 10 }}
                labelStyle={{ color: "#888" }}
                onPress={() => {
                    // props.navigation.closeDrawer()
                    props.navigation.navigate('clientCenter')
                }}
            />
            {
                global.curUser ?
                    <DrawerItem
                        label={"계정설정"}
                        style={{ backgroundColor: 'white', justifyContent: 'center', height: 40, paddingHorizontal: 10 }}
                        labelStyle={{ color: "#888" }}
                        onPress={() => {
                            RestAPI.getPush(getCurUserIx()).then(res => {
                                console.log("this is the result from server", res)
                                isEnabledOne = res[0].push_night == '1' ? true : false
                                isEnabledTwo = res[0].push_event == '1' ? true : false
                                isEnabledThree = res[0].push_marketing == '1' ? true : false
                            }).catch(err => {
                                Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
                            }).finally(() => {
                                props.navigation.navigate('accountSetting', { one: isEnabledOne, two: isEnabledTwo, three: isEnabledThree })
                            })
                        }}
                    /> :
                    <DrawerItem
                        label={"회원가입"}
                        style={{ backgroundColor: 'white', justifyContent: 'center', height: 40, paddingHorizontal: 10 }}
                        labelStyle={{ color: "#888" }}
                        onPress={() => {
                            props.navigation.closeDrawer()
                            props.navigationParent.navigate("signupAgree")
                        }}
                    />
            }
            {
                global.curUser ?
                    <DrawerItem
                        label={"로그아웃"}
                        style={{ backgroundColor: 'white', justifyContent: 'center', height: 40, paddingHorizontal: 10 }}
                        labelStyle={{ color: "#888" }}
                        onPress={async () => {
                            logout()
                            props.navigation.closeDrawer()
                            global.curUser = null
                            global.apprCount = null
                            await AsyncStorage.removeItem('cur_user')
                            Alert.alert('알림', '로그아웃 되었습니다.', [
                                { text: '취소' },
                                {
                                    text: '확인',
                                    onPress: () => {
                                        props.navigation.navigate('home', { userIx: getCurUserIx() })
                                    }
                                }
                            ])
                        }}
                    /> :
                    <DrawerItem
                        label={"로그인"}
                        style={{ backgroundColor: 'white', justifyContent: 'center', height: 40, paddingHorizontal: 10 }}
                        labelStyle={{ color: "#888" }}
                        onPress={() => {
                            props.navigation.closeDrawer()
                            props.navigation.navigate("login")
                        }}
                    />
            }
        </DrawerContentScrollView>
    );
}

export default function DrawNavigation({ navigation }) {
    // 사이드바가 깜박이는거 방지.
    const [initRender, setInitRender] = useState(true)

    useEffect(() => {
        setInitRender(false)
    }, [initRender])
    return (
        <Drawer.Navigator
            drawerPosition='right'
            drawerStyle={{
                width: initRender ? 0 : Constants.WINDOW_WIDTH * 0.75,
                zIndex: 999999
            }}
            drawerContent={
                props => <CustomDrawerContent {...props}
                    navigationParent={navigation}
                />
            }
            initialRouteName={'home'}
            screenOptions={{
                gestureEnabled: Platform.OS == 'ios' ? true : false
            }}
        >

            {/* 메인 홈 페이지 */}
            <Drawer.Screen name="home" component={HomeView}
                initialParams={{
                    userIx: getCurUserIx()
                }}
            />

            {/* 웹툰평가 */}
            <Drawer.Screen name="appr" component={ApprView} />
            <Drawer.Screen name="pick" component={PickView} />
            <Drawer.Screen name="recent" component={RecentView} />

            {/* 날자별 즐겨찾기 추가 */}
            <Drawer.Screen name="dayHome" component={DayHomeView} />
            <Drawer.Screen name="dayList" component={DayListView} />

            {/* 사용자관련 페이지(계정설정, 암호변경, 닉네임변경, 계정탁퇴, 나의 페이지) */}
            <Drawer.Screen name="myHome" component={MyHomeView} />
            <Drawer.Screen name="accountSetting" component={AccountSettingView} />
            <Drawer.Screen name="accountSettingName" component={AccountSettingViewChangeName} />
            <Drawer.Screen name="accountSettingPass" component={AccountSettingViewChangePass} />
            <Drawer.Screen name="accountSettingExit" component={AccountSettingViewExit} />

            {/* 고객센터관련 */}
            <Drawer.Screen name="clientCenter" component={ClientCenterView} />
            <Drawer.Screen name="clientCenterContact" component={ClientCenterViewContact} />
            <Drawer.Screen name="clientCenterHistory" component={ClientCenterViewHistory} />
            <Drawer.Screen name="clientCenterFaq" component={ClientCenterViewFaq} />
            <Drawer.Screen name="clientCenterBoard" component={ClientCenterViewBoard} />
            <Drawer.Screen name="clientCenterBoardDetail" component={ClientCenterViewBoardDetail} />

            {/* 기타 페이지 */}
            <Drawer.Screen name="detailView" component={DetailView} />
            <Drawer.Screen name="webView" component={DetailWebView} />
            <Drawer.Screen name="search" component={SearchView} />
            <Drawer.Screen name="banner" component={BannerLinkView} />

        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({
    closeView: {
        flex: 1,
        paddingTop: Platform.OS == 'ios' ? 10 : 15,
        paddingRight: 15,
        alignItems: 'flex-end',
    },
    pickView: {
        flexDirection: 'column',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        alignItems: 'flex-start',
    },
    apprView: {
        flex: 1,
        paddingBottom: 10,
        paddingLeft: 10,
        alignItems: 'flex-start',
    },
    settingView: {
        flex: 1,
        paddingTop: 20,
        paddingLeft: 10,
        alignItems: 'flex-start',
    },
    scrollImageView: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    webtoonImage: {
        borderRadius: 5,
        width: Constants.WINDOW_WIDTH * 0.3,
        height: Constants.WINDOW_WIDTH * 0.24
    },
    webtoonImageTablet: {
        borderRadius: 10,
        width: Constants.WINDOW_WIDTH * 0.2,
        height: Constants.WINDOW_WIDTH * 0.15
    },
    allView: {
        flex: 1,
        alignItems: 'center',
        width: Constants.WINDOW_WIDTH * 0.75
    },
    allViewText: {
        color: "#888",
        fontSize: 13
    },
});
