import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, KeyboardAvoidingView, Alert, Image, Animated, Easing, Keyboard } from 'react-native';
import { Header } from 'react-native-elements';
import { MaterialIcons, MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons';
import '@expo/vector-icons';

import Constants, { topPadding, getCurUserIx } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';
import WebtoonDetailPage from './WebtoonDetailPage';
import RestAPI from '../../Utils/RestAPI';
import HeaderRight from '../Components/HeaderRight';
import { useFocusEffect } from '@react-navigation/native';
import FooterModal from './FooterModal';

// 웹툰 프로필 페이지
export default function DetailView({ route, navigation }) {

    const [bottomOfMainContainer, setBottomOfMainContainer] = useState(new Animated.Value(0))

    const [isShowBottomBar, setIsShowBottomBar] = useState(false)
    const [pickStatus, getPickStatus] = useState('unPicked')
    const [refuseStatus, getRefuseStatus] = useState('unRefuse')
    const [shownStatus, getShownStatus] = useState('unShown')
    const [isOpen, getIsOpen] = useState(false);
    let keyboardShowListener = useRef(null);
    let keyboardHideListener = useRef(null)

    useFocusEffect(React.useCallback(() => {
        CheckWebtoonPick()
        setIsShowBottomBar(true)
        // toggleMainView()
    }, [route.params.webtoon.ix]))

    useEffect(() => {
        // CheckWebtoonPick()
        CheckWebtoonRefuse()
        CheckWebtoonShown()
        keyboardShowListener.current = Keyboard.addListener('keyboardDidShow', ()=>getIsOpen(true));
        keyboardHideListener.current = Keyboard.addListener('keyboardDidHide', ()=>getIsOpen(false));

        return () => {
            keyboardShowListener.current.remove();
            keyboardHideListener.current.remove();
        }
    }, [route.params.webtoon.ix, navigation])

    // 웹툰 프로필에서 픽 처리
    const PickWebtoon = () => {
        showPageLoader(true)
        RestAPI.ctrlWebtoon('pick', getCurUserIx(), route.params.webtoon.ix).then(res => {
            if (res.msg == 'suc') {
                setIsShowBottomBar(false)
                Alert.alert('알림', '픽 되었습니다. PICK한 웹툰목록에서 확인할수 있습니다.지금 PICK한목록으로 가시겠습니까?',
                    [{
                        text: '취소',
                        onPress: () => {
                            navigation.navigate('draw')
                        }
                    }, {
                        text: 'PICK한목록 바로가기',
                        onPress: () => { navigation.navigate('pick') }
                    }])
            } else {
                Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
                showPageLoader(false)
                return
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            showPageLoader(false)
            return
        }).finally(() => {
            CheckWebtoonPick()
            showPageLoader(false)
        })
    }

    // 웹툰 프로필에서 관심 없어요 처리
    const RefuseWebtoon = () => {
        showPageLoader(true)
        RestAPI.ctrlWebtoon('refuse', getCurUserIx(), route.params.webtoon.ix).then(res => {
            if (res.msg == 'suc') {
                setIsShowBottomBar(false)
            } else {
                Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
                showPageLoader(false)
                return
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            showPageLoader(false)
            return
        }).finally(() => {
            CheckWebtoonRefuse()
            showPageLoader(false)
        })
    }

    // 웹툰 프로필에서 이미 봣어요  처리
    const ShownWebtoon = () => {
        showPageLoader(true)
        RestAPI.ctrlWebtoon('shown', getCurUserIx(), route.params.webtoon.ix).then(res => {
            if (res.msg == 'suc') {
                setIsShowBottomBar(false)
            } else {
                Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
                showPageLoader(false)
                return
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            showPageLoader(false)
            return
        }).finally(() => {
            CheckWebtoonShown()
            showPageLoader(false)
        })
    }

    // 해당 웹툰이 이미 픽되어잇는지 확인
    const CheckWebtoonPick = () => {
        RestAPI.checkPickWebtoon(getCurUserIx(), route.params.webtoon.ix).then(res => {
            console.log("the pick status from server is : ", res)
            if (res.msg == 'suc') {
                getPickStatus('unPicked')
            } else {
                getPickStatus('picked')
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            return
        }).finally(() => { })
    }

    // 해당 웹툰이 관심없어요 되어 잇는지 확인
    const CheckWebtoonRefuse = () => {
        RestAPI.checkRefuseShownWebtoon(getCurUserIx(), route.params.webtoon.ix, 'refuse').then(res => {
            if (res.msg == 'suc') {
                getRefuseStatus('unRefuse')
            } else {
                getRefuseStatus('refuse')
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            return
        }).finally(() => { })
    }

    // 해당 웹툰이 이미 봣어요 확인
    const CheckWebtoonShown = () => {
        RestAPI.checkRefuseShownWebtoon(getCurUserIx(), route.params.webtoon.ix, 'shown').then(res => {
            if (res.msg == 'suc') {
                getShownStatus('unShown')
            } else {
                getShownStatus('shown')
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            return
        }).finally(() => { })
    }

    // 해당 웹툰 픽 해제하기
    const DelPick = () => {
        showPageLoader(true)
        RestAPI.pickDel(getCurUserIx(), route.params.webtoon.ix).then(res => {
            if (res.msg == 'suc') {
                getPickStatus('unPicked')
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

    // 해당 웹툰 관심없어요 해제하기
    const DelRefuse = () => {
        showPageLoader(true)
        RestAPI.refuseDel(getCurUserIx(), route.params.webtoon.ix).then(res => {
            if (res.msg == 'suc') {
                getRefuseStatus('unRefuse')
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

    // 해당 웹툰 이미 봣어요 해제하기
    const DelShown = () => {
        showPageLoader(true)
        RestAPI.shownDel(getCurUserIx(), route.params.webtoon.ix).then(res => {
            if (res.msg == 'suc') {
                getShownStatus('unShown')
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

    // 웹툰 프로필 아래 콘트롤 영역 조종하기
    // const toggleMainView = () => {
    //     if (isShowBottomBar) {
    //         hideMainView()
    //     } else {
    //         showMainView()
    //     }
    // }

    // 콘트롤 영역 보여주기
    // const showMainView = () => {

    //     Animated.parallel([
    //         Animated.timing(
    //             bottomOfMainContainer,
    //             {
    //                 toValue: 0,
    //                 easing: Easing.ease,
    //                 duration: 100,
    //             }
    //         ),

    //     ]).start(() => {
    //         setIsShowBottomBar(true)
    //     })

    // }

    // // 콘트롤 영역 숨기기
    // const hideMainView = () => {

    //     Animated.parallel([
    //         Animated.timing(
    //             bottomOfMainContainer,
    //             {
    //                 toValue: global.deviceType == '1' ?
    //                     Platform.OS == 'ios' ? -200 : -180 :
    //                     Platform.OS == 'ios' ? -330 : -280,
    //                 easing: Easing.ease,
    //                 duration: 100,
    //             }
    //         )
    //     ]).start(() => {
    //         setIsShowBottomBar(false)
    //     })

    // }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header
                leftComponent={
                    <TouchableOpacity onPress={() => {
                        setIsShowBottomBar(false)
                        getPickStatus('unPicked')
                        getRefuseStatus()
                        getShownStatus()
                        navigation.goBack()
                    }}>
                        <MaterialCommunityIcons name="chevron-left" size={30} color={Constants.mainColor} />
                    </TouchableOpacity>
                }
                rightComponent={<HeaderRight navigation={navigation} />}
                backgroundColor="#FFF"
                containerStyle={{
                    height: Constants.HeaderHeight,
                    alignItems: Platform.OS == 'ios' ? 'center' : 'flex-start',
                    marginTop: Platform.OS == 'ios' ? 0 : -15,
                }}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={{ flex: 1, marginBottom: Platform.OS == 'ios' ? isOpen ? 0 : 40 : 0 }}
                enabled>
                <View style={{
                    flex: 2,
                    height: Constants.WINDOW_HEIGHT - topPadding(),
                    marginBottom: 40
                        // Platform.OS == 'ios' ?
                        //     global.deviceType == '1' ? 260 : 460 :
                        //     isOpen ? 0 :
                        //         global.deviceType == '1' ? 260 : 380
                }}>


                    <WebtoonDetailPage
                        webtoonDetail={route.params.webtoon}
                        navigation={navigation}
                        // closeButtonArea={() => {
                        //     if(isShowBottomBar) {
                        //         toggleMainView()
                        //     }
                        // }}
                        // outButtonArea={() => {
                        //     if(isShowBottomBar) {
                        //         toggleMainView()
                        //     }
                        // }}
                        selTabIndex={route.params.selTabIndex}
                        webtoon_link={route.params.webtoon.webtoon_link}
                        pickStatus={pickStatus}
                        refuseStatus={refuseStatus}
                        shownStatus={shownStatus}
                        pickWebtoon={() => {
                            PickWebtoon()
                        }}
                        refuseWebtoon={() => {
                            RefuseWebtoon()
                        }}
                        shownWebtoon={() => {
                            ShownWebtoon()
                        }}
                        // onPressTopBar={() => {
                        //     toggleMainView()
                        // }}
                        delPickWebtoon={() => {
                            DelPick()
                        }}
                        delRefuseWebtoon={() => {
                            DelRefuse()
                        }}
                        delShownWebtoon={() => {
                            DelShown()
                        }}
                    />
                </View>
            </KeyboardAvoidingView>
            <BottomBar navigation={navigation} selTab={route.params.selTabIndex} />
            {/* {
                Platform.OS == 'ios' ?
                    <>
                        <View style={Platform.OS == "ios" ? styles.bottomToolBarHidden : styles.bottomToolBarHiddenAndroid}>
                            <TouchableOpacity
                                style={styles.directionIcon}
                                onPress={() => {
                                    toggleMainView()
                                }}
                            >
                                <AntDesign name="up" size={25} color={Constants.mainColor} />
                            </TouchableOpacity>
                        </View>

                        <Animated.View
                            style={{
                                marginBottom: bottomOfMainContainer,
                                width: Constants.WINDOW_WIDTH,
                            }}
                        >
                            <FooterModal
                                navigation={navigation}
                                selTabIndex={route.params.selTabIndex}
                                webtoon_link={route.params.webtoon.webtoon_link}
                                pickStatus={pickStatus}
                                refuseStatus={refuseStatus}
                                shownStatus={shownStatus}
                                pickWebtoon={() => {
                                    PickWebtoon()
                                }}
                                refuseWebtoon={() => {
                                    RefuseWebtoon()
                                }}
                                shownWebtoon={() => {
                                    ShownWebtoon()
                                }}
                                onPressTopBar={() => {
                                    toggleMainView()
                                }}
                                delPickWebtoon={() => {
                                    DelPick()
                                }}
                                delRefuseWebtoon={() => {
                                    DelRefuse()
                                }}
                                delShownWebtoon={() => {
                                    DelShown()
                                }}
                            />
                        </Animated.View>
                        <BottomBar navigation={navigation} selTab={route.params.selTabIndex} />
                    </> :
                    isOpen ?
                        null :
                        <>
                            <View style={Platform.OS == "ios" ? styles.bottomToolBarHidden : styles.bottomToolBarHiddenAndroid}>
                                <TouchableOpacity
                                    style={styles.directionIcon}
                                    onPress={() => {
                                        toggleMainView()
                                    }}
                                >
                                    <AntDesign name="up" size={25} color={Constants.mainColor} />
                                </TouchableOpacity>
                            </View>

                            <Animated.View
                                style={{
                                    marginBottom: bottomOfMainContainer,
                                    width: Constants.WINDOW_WIDTH,
                                }}
                            >
                                <FooterModal
                                    navigation={navigation}
                                    selTabIndex={route.params.selTabIndex}
                                    webtoon_link={route.params.webtoon.webtoon_link}
                                    pickStatus={pickStatus}
                                    refuseStatus={refuseStatus}
                                    shownStatus={shownStatus}
                                    pickWebtoon={() => {
                                        PickWebtoon()
                                    }}
                                    refuseWebtoon={() => {
                                        RefuseWebtoon()
                                    }}
                                    shownWebtoon={() => {
                                        ShownWebtoon()
                                    }}
                                    onPressTopBar={() => {
                                        toggleMainView()
                                    }}
                                    delPickWebtoon={() => {
                                        DelPick()
                                    }}
                                    delRefuseWebtoon={() => {
                                        DelRefuse()
                                    }}
                                    delShownWebtoon={() => {
                                        DelShown()
                                    }}
                                />
                            </Animated.View>
                            <BottomBar navigation={navigation} selTab={route.params.selTabIndex} />
                        </>
            } */}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Constants.WINDOW_HEIGHT - 140 - topPadding(),
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    bottomToolBarHidden: {
        margin: 0,
        position: 'absolute',
        bottom: 70,
        height: 30,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#AAA'
    },
    bottomToolBarHiddenAndroid: {
        margin: 0,
        position: 'absolute',
        bottom: 50,
        height: 30,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#AAA',
        borderBottomColor: 'white'
    },
    directionIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        width: Constants.WINDOW_WIDTH,
    },
})