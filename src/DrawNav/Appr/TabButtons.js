// 카테고리별 웹툰설정을 위한 바톤
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import Constants from '../../Utils/Constant';

export default function TabButtons({ selIndex = 0, onTapButton }) {
    const [index, setIndex] = useState(selIndex)
    
    return (
        <View style={styles.tabBtnView}>
            {
                Constants.TitleList.map((item, idx) => {
                    return <TouchableOpacity
                        key={idx}
                        style={index == idx ? global.deviceType == '1' ? styles.tabButtonSel : styles.tabButtonSelTablet : styles.tabButton}
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
        paddingBottom: 10,
    },
    tabButton: {
        paddingVertical: 4,
        paddingHorizontal: 14,
        marginHorizontal: 5,
        borderRadius: 15,
        backgroundColor: 'transparent'
    },
    tabButtonSel: {
        paddingVertical: 4,
        paddingHorizontal: 14,
        marginHorizontal: 5,
        borderRadius: 15,
        backgroundColor: Constants.mainColor
    },
    tabButtonSelTablet: {
        paddingVertical: 4,
        paddingHorizontal: 14,
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: Constants.mainColor
    },
    tabBtnText: { color: 'black', fontSize: 15},
    tabBtnSelText: { color: 'white', fontSize: 15},

    tabBtnTextTablet: { color: 'black', fontSize: 18},
    tabBtnSelTextTablet: { color: 'white', fontSize: 18}
})