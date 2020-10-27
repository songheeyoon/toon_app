import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, KeyboardAvoidingView, Alert, Image, Animated, Easing, Keyboard } from 'react-native';
import { Header } from 'react-native-elements';
import { MaterialIcons, MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons';
import '@expo/vector-icons';

import Constants, { topPadding, getCurUserIx, isIPhoneX } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';
import WebtoonDetailPage from './WebtoonDetailPage';
import RestAPI from '../../Utils/RestAPI';
import HeaderRight from '../Components/HeaderRight';
import { useFocusEffect } from '@react-navigation/native';
import FooterModal from './FooterModal';
import * as Network from 'expo-network';

// 웹툰 프로필 페이지
export default function DetailView({ route, navigation }) {


    const [bottomOfMainContainer, setBottomOfMainContainer] = useState(new Animated.Value(0))

    const [isShowBottomBar, setIsShowBottomBar] = useState(false)
    const [favoritedStatus, getfavoritedStatus] = useState('unfavorited')
    const [refuseStatus, getRefuseStatus] = useState('unRefuse')
    const [shownStatus, getShownStatus] = useState()
    const [isOpen, getIsOpen] = useState(false);

    let keyboardShowListener = useRef(null);
    let keyboardHideListener = useRef(null)

    useFocusEffect(React.useCallback(() => {

        CheckWebtoonPick()
        setIsShowBottomBar(true)
        Latest()
        // CheckWebtoonShown()
        // toggleMainView()
    }, [route.params.webtoon.ix]))

    useEffect(() => {
        // CheckWebtoonPick()
        // CheckWebtoonRefuse()
        // CheckWebtoonShown()
        // CheckJame()
        keyboardShowListener.current = Keyboard.addListener('keyboardDidShow', ()=>getIsOpen(true));
        keyboardHideListener.current = Keyboard.addListener('keyboardDidHide', ()=>getIsOpen(false));

        return () => {
            keyboardShowListener.current.remove();
            keyboardHideListener.current.remove();
        }
    }, [route.params.webtoon.ix, navigation])


    // // 웹툰 프로필에서 픽 처리
    // const PickWebtoon = () => {
    //     showPageLoader(true)
    //     RestAPI.ctrlWebtoon('pick', getCurUserIx(), route.params.webtoon.ix).then(res => {
    //         if (res.msg == 'suc') {
    //             setIsShowBottomBar(false)
    //             Alert.alert('알림', '픽 되었습니다. PICK한 웹툰목록에서 확인할수 있습니다.지금 PICK한목록으로 가시겠습니까?',
    //                 [{
    //                     text: '취소',
    //                     onPress: () => {
    //                         navigation.navigate('draw')
    //                     }
    //                 }, {
    //                     text: 'PICK한목록 바로가기',
    //                     onPress: () => { navigation.navigate('pick') }
    //                 }])
    //         } else {
    //             Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
    //             showPageLoader(false)
    //             return
    //         }
    //     }).catch(err => {
    //         Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
    //         showPageLoader(false)
    //         return
    //     }).finally(() => {
    //         CheckWebtoonPick()
    //         showPageLoader(false)
    //     })
    // }

    // 웹툰 프로필에서 관심 없어요 처리
    // const RefuseWebtoon = () => {
    //     showPageLoader(true)
    //     RestAPI.ctrlWebtoon('refuse', getCurUserIx(), route.params.webtoon.ix).then(res => {
    //         if (res.msg == 'suc') {
    //             setIsShowBottomBar(false)
    //         } else {
    //             Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
    //             showPageLoader(false)
    //             return
    //         }
    //     }).catch(err => {
    //         Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
    //         showPageLoader(false)
    //         return
    //     }).finally(() => {
    //         CheckWebtoonRefuse()
    //         showPageLoader(false)
    //     })
    // }

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
            CheckWebtoonPick()
            showPageLoader(false)
        })
    }

    // 해당 웹툰이 이미 본 웹툰인지 즐겨찾기 되어잇는지 확인
    const CheckWebtoonPick = () => {
        RestAPI.checkPickWebtoon(getCurUserIx(), route.params.webtoon.ix).then(res => {
            // console.log("the pick status from server is : ", res)
            if (res.favorited == '1') {
                getfavoritedStatus('favorited')     
            } else {
                getfavoritedStatus('unfavorited')
            }       
            if( res.shown == '1'){
                getShownStatus('shown')
            }else{
                getShownStatus('unShown')
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            return
        }).finally(() => { })
    }

    // 해당 웹툰이 관심없어요 되어 잇는지 확인
    // const CheckWebtoonRefuse = () => {
    //     RestAPI.checkRefuseShownWebtoon(getCurUserIx(), route.params.webtoon.ix, 'refuse').then(res => {
    //         if (res.msg == 'suc') {
    //             getRefuseStatus('unRefuse')
    //         } else {
    //             getRefuseStatus('refuse')
    //         }
    //     }).catch(err => {
    //         Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
    //         return
    //     }).finally(() => { })
    // }

    // 해당 웹툰이 이미 봣어요 확인
    // const CheckWebtoonShown = () => {
    //     RestAPI.checkRefuseShownWebtoon(getCurUserIx(), route.params.webtoon.ix, 'shown').then(res => {
    //         if (res.msg == 'suc') {
    //             getShownStatus('unShown')
    //         } else {
    //             getShownStatus('shown')
    //         }
    //     }).catch(err => {
    //         Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
    //         return
    //     }).finally(() => { })
    // }

    // 해당 웹툰 픽 해제하기
    const DelPick = () => {
        showPageLoader(true)
        RestAPI.pickDel(getCurUserIx(), route.params.webtoon.ix).then(res => {
            if (res.msg == 'suc') {
                getfavoritedStatus('unfavorited')
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

        //   즐찾 추가 
    const AddFavorites = (day, webtoonIx) => {
        showPageLoader(true)
        // pickWebtoon();
        RestAPI.addFavoritesWebtoon(getCurUserIx(), day, webtoonIx).then(res => {

            if (res.msg == 'suc') {
               
                Alert.alert('성공', '즐겨찾기에 추가되었습니다.', [{ text: '확인' }])
                
            } else if (res.msg == 'is') {
                Alert.alert('추가 오류', '이미 즐겨찾기에 추가한 웹툰입니다.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {
            CheckWebtoonPick()
            showPageLoader(false)
        })
    }
    // 즐찾 삭제 
    const DelFavorWebtoon = (webtoonIx) => {
        showPageLoader(true)
        RestAPI.favorDelWebtoon(getCurUserIx(), webtoonIx).then(res => {
            if (res.msg == 'suc') {
                
            } else {
                Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
                showPageLoader(false)
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생하였습니다. 잠시 후 다시 시도해주십시오.', [{ text: '확인' }])
            showPageLoader(false)
            return
        }).finally(() => {
            CheckWebtoonPick()
            showPageLoader(false)
        })
    }
    // 최신 list
    const Latest = () => {
 
        RestAPI.PostLatesList(getCurUserIx() == '' ? global.ipAddress : getCurUserIx(),route.params.webtoon.ix).then(res => {
            if (res.msg == 'suc') {
          
            } else {
                Alert.alert('오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {
            showPageLoader(false)
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header
                leftComponent={
                    <TouchableOpacity onPress={() => {
                        setIsShowBottomBar(false)
                        getfavoritedStatus('unPicked')
                        getRefuseStatus()
                        getShownStatus("unShown")
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
                // behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={{ flex: 1, marginBottom: isIPhoneX ? 20 : 0 }}
                enabled>
                <View style={{
                    flex: 2,
                    height: Constants.WINDOW_HEIGHT - topPadding(),
                    marginBottom: 40
                }}>


                    <WebtoonDetailPage
                        webtoonDetail={route.params.webtoon}
                        navigation={navigation}
                        selTabIndex={route.params.selTabIndex}
                        webtoon_link={route.params.webtoon.webtoon_link}
                        favoritedStatus={favoritedStatus}
                        refuseStatus={refuseStatus}
                        shownStatus={shownStatus}

                        pickWebtoon={() => {
                            PickWebtoon()
                        }}
                        shownWebtoon={() => {
                            ShownWebtoon()
                        }}
                        delPickWebtoon={() => {
                            DelPick()
                        }}
                        delShownWebtoon={() => {
                            DelShown()
                        }}
                        addFavorites = {(day, webtoonIx) => {
                            AddFavorites(day, webtoonIx)
                        }}
                        delFavorites = {(webtoonIx) => {
                            DelFavorWebtoon(webtoonIx)
                        }}
                    />
                </View>
            </KeyboardAvoidingView>
            <BottomBar navigation={navigation} selTab={route.params.selTabIndex} />
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