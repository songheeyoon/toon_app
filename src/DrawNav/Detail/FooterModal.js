import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, KeyboardAvoidingView, Alert, Image } from 'react-native';
import Modal from 'react-native-modal';
import { MaterialIcons, MaterialCommunityIcons, AntDesign, Entypo } from '@expo/vector-icons';

import Constants, { topPadding, getCurUserIx } from '../../Utils/Constant';


// 웹툰 프로필에서 아래 부분 콘트롤 영역
export default function FooterModal(
    {
        navigation,
        selTabIndex,
        webtoon_link,
        pickStatus,
        refuseStatus,
        shownStatus,
        pickWebtoon,
        delPickWebtoon,
        refuseWebtoon,
        delRefuseWebtoon,
        shownWebtoon,
        delShownWebtoon,
        onPressTopBar
    }
) {
    console.log("current webtoon pcik status: ", pickStatus)

    return (
        <View
            style={Platform.OS == "ios" ?
                {
                    ...styles.bottomToolBarShow,
                    height: global.deviceType == '1' ? 200 : 370
                } :
                {
                    ...styles.bottomToolBarShowAndorid,
                    height: global.deviceType == '1' ? 180 : 280
                }}
        >
            <TouchableOpacity
                style={styles.directionIcon}
                onPress={onPressTopBar}
            >
                <AntDesign name="down" size={25} color={Constants.mainColor} />
            </TouchableOpacity>
            <View style={styles.toolView}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('webView', {
                        selTabIndex: selTabIndex,
                        link: webtoon_link
                    })

                }}>
                    <View style={styles.itemView}>
                        <AntDesign name="arrowleft" size={25} color={Constants.mainColor} />
                        <Text style={styles.itemTitle}>보러가기</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
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
                        if (pickStatus && pickStatus == 'picked') {
                            Alert.alert('알림', '이미 PICK한 웹툰입니다. PICK목록에서 삭제하시겠습니까?',
                                [{
                                    text: '취소',
                                    onPress: () => { }
                                },
                                {
                                    text: '확인',
                                    onPress: () => {
                                        if (delPickWebtoon) {
                                            delPickWebtoon()
                                        }
                                    }
                                }]
                            )
                        } else {
                            if (pickWebtoon) {
                                pickWebtoon()
                            }
                        }
                    }
                }}
                >
                    <View style={styles.itemView}>
                        <Image source={require('../../../assets/images/pick.png')} style={{ width: 25, height: 27, resizeMode: 'contain' }} />
                        <Text style={{ ...styles.itemTitle, color: pickStatus && getCurUserIx() && pickStatus == 'picked' ? '#DDD' : Constants.darkColor }}>PICK</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
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
                        if (refuseStatus && refuseStatus == 'refuse') {
                            Alert.alert('알림', '이미 처리되었습니다. 취소하시겠습니까?',
                                [{
                                    text: '취소',
                                    onPress: () => { }
                                },
                                {
                                    text: '확인',
                                    onPress: () => {
                                        if (delRefuseWebtoon) {
                                            delRefuseWebtoon()
                                        }
                                    }
                                }]
                            )

                        } else {
                            if (refuseWebtoon) {
                                refuseWebtoon()
                            }
                        }
                    }
                }}
                >
                    <View style={styles.itemView}>
                        <MaterialIcons name="do-not-disturb-alt" size={25} color={Constants.mainColor} />
                        <Text style={{ ...styles.itemTitle, color: refuseStatus && getCurUserIx() && refuseStatus == 'refuse' ? '#DDD' : Constants.darkColor }}>관심 없어요</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
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
                        if (shownStatus && shownStatus == 'shown') {
                            Alert.alert('알림', '이미 처리되었습니다. 취소하시겠습니까?',
                                [{
                                    text: '취소',
                                    onPress: () => { }
                                },
                                {
                                    text: '확인',
                                    onPress: () => {
                                        if (delShownWebtoon) {
                                            delShownWebtoon()
                                        }
                                    }
                                }]
                            )

                        } else {
                            if (shownWebtoon) {
                                shownWebtoon()
                            }
                        }
                    }
                }}
                >
                    <View style={styles.itemView}>
                        <AntDesign name="eyeo" size={25} color={Constants.mainColor} />
                        <Text style={{ ...styles.itemTitle, color: shownStatus && getCurUserIx() && shownStatus == 'shown' ? '#DDD' : Constants.darkColor }}>이미 봤어요.</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bottomToolBarShow: {
        margin: 0,
        position: 'absolute',
        bottom: 70,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#AAA',
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 10,
        // },
        // shadowOpacity: 0.5,
        // shadowRadius: 25.00,
    },
    bottomToolBarShowAndorid: {
        margin: 0,
        position: 'absolute',
        bottom: 50,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#AAA',
        borderBottomColor: 'white',
        zIndex: 1
    },
    directionIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        width: Constants.WINDOW_WIDTH,
    },
    toolView: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    itemView: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Platform.OS == 'ios' ? 10 : 5
    },
    itemTitle: { fontSize: 16, paddingLeft: 20 }
})