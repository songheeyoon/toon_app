import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';

import Constants, { getDayName, convertDayToNum } from '../../Utils/Constant';
import { useFocusEffect } from '@react-navigation/native';

// 주간 요일 목록바톤
export default function DayButtons({ selIndex, onDayButton }) {

    const [index, setIndex] = useState(convertDayToNum(getDayName()))
    // useFocusEffect(React.useCallback(()=>{
    //     setIndex(convertDayToNum(getDayName()))
    // },[]))

    return (
        <View style={{...styles.dayButtonsView, marginBottom : Platform.OS == 'ios' ? 50 : 10}}>
            <View style={{width: 50, height: Constants.WINDOW_HEIGHT * 0.45, justifyContent: Platform.OS == 'ios' ? 'space-around' : 'space-between', alignItems: 'center'}}>
                {
                    Constants.WeekList.map((item, idx) => {
                        return <TouchableOpacity
                            key={idx}
                            style={index == idx ? styles.tabButtonSel : styles.tabButton}
                            onPress={() => { setIndex(idx); if (onDayButton) { onDayButton(idx) } }}
                        >
                            <Text style={index == idx ? styles.tabBtnSelText : styles.tabBtnText}>{item}</Text>
                        </TouchableOpacity>
                    })
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    dayButtonsView: {
        flexDirection: 'column',
        width: 50,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    tabButton: {
        paddingVertical: 8,
        paddingHorizontal: 7,
        borderRadius: 14,
        backgroundColor: 'transparent'
    },
    tabButtonSel: {
        paddingVertical: 8,
        paddingHorizontal: 7,
        borderRadius: 14,
        backgroundColor: Constants.mainColor
    },
    tabBtnText: { color: 'black', fontSize: 16 },
    tabBtnSelText: { color: 'white', fontSize: 16 },
})