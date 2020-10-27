import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import Constants, { getDayName, convertDayToNum } from '../../Utils/Constant';
import { useFocusEffect } from '@react-navigation/native';

// 주간 요일목록 바톤
export default function DayButtonsWeek({ selIndex, onDayButton }) {

    const [index, setIndex] = useState(selIndex)
    useEffect(() => {
        setIndex(selIndex)
    }, [selIndex])
    return (
        <View style={styles.dayWeekButtonsView}>
            {
                Constants.WeekListDay.map((item, idx) => {
                    return <TouchableOpacity
                        key={idx}
                        style={index == idx ? 
                            global.deviceType == '1' ? styles.tabDayButtonSel : styles.tabDayButtonSelTablet : 
                            global.deviceType == '1' ? styles.tabDayButton : styles.tabDayButtonTablet}
                        onPress={() => { setIndex(idx); if (onDayButton) { onDayButton(idx) } }}
                    >
                        <Text style={index == idx ? 
                            global.deviceType == '1' ? styles.tabDayBtnSelText : styles.tabDayBtnSelTextTablet : 
                            global.deviceType == '1' ? styles.tabDayBtnText : styles.tabDayBtnTextTablet}>{item}</Text>
                    </TouchableOpacity>
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    dayWeekButtonsView: {
        width: Constants.WINDOW_WIDTH,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    tabDayButton: {
        marginHorizontal: 5,
        // width: 30,
        // height: 30,
        paddingVertical: 5,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'transparent'
    },
    tabDayButtonSel: {
        marginHorizontal: 5,
        // width: 30,
        // height: 30,
        paddingVertical: 5,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: Constants.mainColor
    },
    tabDayButtonTablet: {
        marginHorizontal: 20,
        paddingVertical: 5,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'transparent'
    },
    tabDayButtonSelTablet: {
        marginHorizontal: 20,
        paddingVertical: 5,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: Constants.mainColor
    },
    tabDayBtnText: { color: 'black', fontSize: 16 },
    tabDayBtnSelText: { color: 'white', fontSize: 16 },
    tabDayBtnTextTablet: { color: 'black', fontSize: 18 },
    tabDayBtnSelTextTablet: { color: 'white', fontSize: 18 },
})