import React, { useState, useEffect } from 'react';
import { View, Image, ScrollView, StyleSheet, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Constants, {getCurUserIx, isIPhoneX} from '../../Utils/Constant';

// 보텀 바
export default function BottomBar(props) {
   
    return (
        <View style={[styles.bottomView,{opacity:props.name == "none" ? 0 : 1}]}>
            <TouchableOpacity
                onPress={() => {
                    props.navigation.navigate('home', {userIx: getCurUserIx()});
                }}
                style={styles.tabWidth}>
                <View style={{...props.selTab == '1' ?  styles.selTabView :  styles.tabView, paddingBottom: Platform.OS == 'ios' ? isIPhoneX() ? 15 : null :null}}>
                    <Image source={require('../../../assets/images/c-menu_link-0.png')} style={{ width: 25, resizeMode: 'contain' }} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    props.navigation.navigate('dayHome');
                }}
                style={styles.tabWidth}>
                <View style={{...props.selTab == '3' ?  styles.selTabView :  styles.tabView, paddingBottom: Platform.OS == 'ios' ? isIPhoneX() ? 15 : null :null}}>
                    <Image source={require('../../../assets/images/c-menu_link-2.png')} style={{ width: 25, resizeMode: 'contain' }} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    props.navigation.navigate('appr', {userIx: getCurUserIx()});
                }}
                style={styles.tabWidth}>
                <View style={{...props.selTab == '2' ?  styles.selTabView :  styles.tabView, paddingBottom: Platform.OS == 'ios' ? isIPhoneX() ? 15 : null :null}}>
                    <Image source={require('../../../assets/images/c-menu_link-1.png')} style={{ width: 25, resizeMode: 'contain' }} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    !global.curUser ?
                        Alert.alert(
                            '알림', '로그인이 필요한 기능입니다!',
                            [{
                                text: '취소',
                                onPress: () => { }
                            }, {
                                text: '로그인',
                                onPress: () => { props.navigation.navigate('login') }
                            }]
                        ) :
                        props.navigation.navigate('myHome');
                }}
                style={styles.tabWidth}>
                <View style={{...props.selTab == '4' ?  styles.selTabView :  styles.tabView, paddingBottom: Platform.OS == 'ios' ? isIPhoneX() ? 15 : null :null}}>
                    <Image source={require('../../../assets/images/c-menu_link-3.png')} style={{ width: 25, resizeMode: 'contain' }} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    bottomView: {
        position: 'absolute',
        bottom: 0,
        height: Constants.BottomHeight,
        width: Constants.WINDOW_WIDTH,
        borderWidth: 1, borderColor: '#DDD',
        flexDirection: 'row',
        backgroundColor: 'white',
        zIndex: 999
    },
    tabWidth: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selTabView: {
        flex: 1,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 3,
        borderColor: Constants.darkColor
    }
})