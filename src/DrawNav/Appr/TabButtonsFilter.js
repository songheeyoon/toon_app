
// 픽크한 웹툰에 대한 필터 조건 바톤
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import Constants from '../../Utils/Constant';
import { useFocusEffect } from '@react-navigation/native';

export default function TabButtonsFilter({ selIndex, onTapButton }) {
    const [index, setIndex] = useState(selIndex)
    useFocusEffect(React.useCallback(()=>{
        setIndex(0)
    },[]))
    return (
        <View style={styles.tabBtnView}>
            {
                Constants.FilterListPick.map((item, idx) => {
                    return <TouchableOpacity
                        key={idx}
                        style={index == idx ? styles.tabButtonSel : styles.tabButton}
                        onPress={() => { setIndex(idx); if (onTapButton) { onTapButton(idx) } }}
                    >
                        <Text style={index == idx ? 
                            global.deviceType == '1' ? styles.tabBtnSelText : styles.tabBtnSelTextTablet : 
                            global.deviceType == '1' ? styles.tabBtnText : styles.tabBtnTextTablet}>{item}</Text>
                    </TouchableOpacity>
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    tabBtnView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    tabButton: {
        paddingVertical: 3,
        paddingHorizontal: 15,
        marginHorizontal: 5,
        borderRadius: 15,
        backgroundColor: 'transparent'
    },
    tabButtonSel: {
        paddingVertical: 3,
        paddingHorizontal: 15,
        marginHorizontal: 5,
        borderRadius: 15,
        backgroundColor: Constants.mainColor
    },
    tabBtnText: { color: 'black', fontSize: 15},
    tabBtnSelText: { color: 'white', fontSize: 15},

    tabBtnTextTablet: { color: 'black', fontSize: 18},
    tabBtnSelTextTablet: { color: 'white', fontSize: 18}
})