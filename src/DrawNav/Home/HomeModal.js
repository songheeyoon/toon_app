import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, Alert, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

import Constants, { getCurUserIx } from '../../Utils/Constant';
import RestAPI from '../../Utils/RestAPI';

const BoolenToString = (array, array1) => {
    let str = ''
    for (let i = 0; i < 10; i++) {
        if (array[i] == true) str += array1[i]
    }
    return str
}


// 최초 가입시에 뜨는 선호장르선택 팝업창
export default function HomeModal({ isVisible, navigation }) {
    const [isModalVisible, setIsModalVisible] = useState(isVisible)
    const [tab1, setTab1] = useState(false)
    const [tab2, setTab2] = useState(false)
    const [tab3, setTab3] = useState(false)
    const [tab4, setTab4] = useState(false)
    const [tab5, setTab5] = useState(false)
    const [tab6, setTab6] = useState(false)
    const [tab7, setTab7] = useState(false)
    const [tab8, setTab8] = useState(false)
    const [tab9, setTab9] = useState(false)
    const [tab10, setTab10] = useState(false)

    const FavorGenre = (favorGenre) => {
        if(favorGenre == '') {
            Alert.alert('알림', '선호장르를 선택해주세요!', [{text: '확인'}])
            return
        }
        RestAPI.favorGenreSel(getCurUserIx(), favorGenre).then(res => {
            if (res.msg == 'suc') {

                setIsModalVisible(false)
                setTab1(false)
                setTab2(false)
                setTab3(false)
                setTab4(false)
                setTab5(false)
                setTab6(false)
                setTab7(false)
                setTab8(false)
                setTab9(false)
                setTab10(false)
                navigation.navigate('home', {userIx: getCurUserIx()})
            } else {
                Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {
        })
    }
    return (
        <Modal
            animationInTiming={50}
            animationOutTiming={100}
            isVisible={isModalVisible}
        >
            <View style={styles.container}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, paddingBottom: 15 }}>선호 장르 선택</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 14, textAlign: 'center', paddingBottom: 10 }}>
                    선택한 장르는 추천에 반영되어 홈 화면에 노출됩니다.
                </Text>
                <Text style={{ fontSize: 13 }}>
                    계정에서 선호 장르를 수정할 수 있습니다.
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 20 }}>
                    <TouchableOpacity style={tab1 ? styles.tabButtonSel : styles.tabButton} onPress={() => { tab1 ? setTab1(false) : setTab1(true) }}>
                        <Text style={tab1 ? styles.tabBtnSelText : styles.tabBtnText}>일상</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tab2 ? styles.tabButtonSel : styles.tabButton} onPress={() => { tab2 ? setTab2(false) : setTab2(true) }}>
                        <Text style={tab2 ? styles.tabBtnSelText : styles.tabBtnText}>개그</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tab3 ? styles.tabButtonSel : styles.tabButton} onPress={() => { tab3 ? setTab3(false) : setTab3(true) }}>
                        <Text style={tab3 ? styles.tabBtnSelText : styles.tabBtnText}>드라마</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tab4 ? styles.tabButtonSel : styles.tabButton} onPress={() => { tab4 ? setTab4(false) : setTab4(true) }}>
                        <Text style={tab4 ? styles.tabBtnSelText : styles.tabBtnText}>액션</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 }}>
                    <TouchableOpacity style={tab5 ? styles.tabButtonSel : styles.tabButton} onPress={() => { tab5 ? setTab5(false) : setTab5(true) }}>
                        <Text style={tab5 ? styles.tabBtnSelText : styles.tabBtnText}>판타지</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tab6 ? styles.tabButtonSel : styles.tabButton} onPress={() => { tab6 ? setTab6(false) : setTab6(true) }}>
                        <Text style={tab6 ? styles.tabBtnSelText : styles.tabBtnText}>로맨스</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tab7 ? styles.tabButtonSel : styles.tabButton} onPress={() => { tab7 ? setTab7(false) : setTab7(true) }}>
                        <Text style={tab7 ? styles.tabBtnSelText : styles.tabBtnText}>감성</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tab8 ? styles.tabButtonSel : styles.tabButton} onPress={() => { tab8 ? setTab8(false) : setTab8(true) }}>
                        <Text style={tab8 ? styles.tabBtnSelText : styles.tabBtnText}>스릴러</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity style={tab9 ? styles.tabButtonSel : styles.tabButton} onPress={() => { tab9 ? setTab9(false) : setTab9(true) }}>
                        <Text style={tab9 ? styles.tabBtnSelText : styles.tabBtnText}>시대극</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={tab10 ? styles.tabButtonSel : styles.tabButton} onPress={() => { tab10 ? setTab10(false) : setTab10(true) }}>
                        <Text style={tab10 ? styles.tabBtnSelText : styles.tabBtnText}>스포츠</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.ctrlBtnView}>
                    <TouchableOpacity style={{...styles.ctrlTouchView, backgroundColor: 'white'}}
                        onPress={() => { setIsModalVisible(false) }}
                    >
                        <Text style={{ color: Constants.darkColor, fontSize: 16 }}>건너뛰기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{...styles.ctrlTouchView, backgroundColor: Constants.darkColor}}
                        onPress={() => {
                            FavorGenre(BoolenToString([tab1, tab2, tab3, tab4, tab5, tab6, tab7, tab8, tab9, tab10], Constants.GenreList))
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 16 }}>선택완료</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 0,
        borderColor: Constants.darkColor,
        borderWidth: 2,
        borderRadius: 5
    },
    tabButton: {
        height: 25,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        borderRadius: 13,
        borderColor: Constants.darkColor,
        borderWidth: 1,
        backgroundColor: 'transparent'
    },
    tabButtonSel: {
        height: 25,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        borderRadius: 13,
        backgroundColor: Constants.mainColor
    },
    tabBtnText: { color: 'black', fontSize: 14 },
    tabBtnSelText: { color: 'white', fontSize: 14 },
    ctrlBtnView: { paddingTop: 30, width: '100%', flexDirection: 'row', justifyContent: 'space-around' },
    ctrlTouchView: { width: '49%', padding: 15, borderRadius: 2, justifyContent: 'center', alignItems: 'center' },

})
