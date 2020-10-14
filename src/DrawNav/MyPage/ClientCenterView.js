import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { Header } from 'react-native-elements';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import ToggleSwitch from 'toggle-switch-react-native'
import '@expo/vector-icons';

import Constants, { topPadding } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';

// 고객센터 페이지
export default function ClientCenterView({ route, navigation }) {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header
                leftComponent={
                    <TouchableOpacity onPress={() => {
                        navigation.goBack()
                        navigation.openDrawer()
                    }}>
                        <Text>뒤로</Text>
                    </TouchableOpacity>
                }
                centerComponent={
                    <Text style={{ fontSize: 16, fontWeight: 'bold', }}>고객 센터</Text>
                }
                backgroundColor="#FFF"
                containerStyle={{
                    height: Constants.HeaderHeight,
                    alignItems: Platform.OS == 'ios' ? 'center' : 'flex-start',
                }}
            />
            <View style={styles.container}>
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={styles.listView}>
                        <View style={styles.titleView}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', }}>서비스 문의</Text>
                        </View>


                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('clientCenterContact')
                            }}
                            style={styles.itemView}
                        >
                            <Text style={{ fontSize: 15, }}>1:1 문의하기</Text>

                            <Entypo name="chevron-thin-right" size={20} color={'#AAA'} />
                        </TouchableOpacity>



                        <View style={styles.line} />


                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('clientCenterHistory')
                            }}
                            style={styles.itemView}
                        >
                            <Text style={{ fontSize: 15, }}>문의 내역</Text>

                            <Entypo name="chevron-thin-right" size={20} color={'#AAA'} />
                        </TouchableOpacity>


                        <View style={styles.line} />


                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('clientCenterFaq')
                            }}
                            style={styles.itemView}
                        >
                            <Text style={{ fontSize: 15, }}>자주 묻는 질문</Text>

                            <Entypo name="chevron-thin-right" size={20} color={'#AAA'} />
                        </TouchableOpacity>

                    </View>
                    <View style={styles.listView}>
                        <View style={styles.titleView}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', }}>공지사항</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('clientCenterBoard')
                            }}
                            style={{ ...styles.itemView, borderBottomWidth: 1, borderBottomColor: '#EEE' }}
                        >
                            <Text style={{ fontSize: 15, }}>서비스 공지</Text>
                            <Entypo name="chevron-thin-right" size={20} color={'#AAA'} />
                        </TouchableOpacity>

                    </View>
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
    listView: {
        flexDirection: 'column',
        width: Constants.WINDOW_WIDTH,
    },
    titleView: {
        width: Constants.WINDOW_WIDTH, paddingVertical: 10, paddingHorizontal: 20,
        backgroundColor: '#EEE', borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#DDD'
    },
    itemView: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        width: Constants.WINDOW_WIDTH, paddingVertical: 15, paddingLeft: 30, paddingRight: 10
    },
    line: { width: Constants.WINDOW_WIDTH - 30, height: 0, borderTopWidth: 1, borderColor: '#EEE', alignSelf: 'flex-end' },

})