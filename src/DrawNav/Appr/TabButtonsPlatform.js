
// 플랫폼별을 선택하기 위한 바톤
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import Constants from '../../Utils/Constant';
import { useFocusEffect } from '@react-navigation/native';

export default function TabButtonsPlatform({ platformIndex = 0, onTapButton }) {
    const [index, setIndex] = useState(platformIndex)
    // useFocusEffect(React.useCallback(() =>{
    //     setIndex(0)
    // },[]))
    return (
        <View style={styles.tabBtnView}>
            {
                Constants.PlatformList.map((item, idx) => {
                    return (
                        <TouchableOpacity
                            key={idx}
                            style={index == idx ? styles.tabButtonSel : styles.tabButton}
                            onPress={() => { setIndex(idx); if (onTapButton) { onTapButton(idx) } }}
                        >
                            <Text style={index == idx ? 
                                global.deviceType == '1' ? styles.tabBtnSelText : styles.tabBtnSelTextTablet :
                                global.deviceType == '1' ? styles.tabBtnText : styles.tabBtnTextTablet}>{item}</Text>
                        </TouchableOpacity>
                    )
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
        paddingBottom: 5
    },
    tabButton: {
        marginHorizontal: 5,
        paddingVertical: 4,
        paddingHorizontal: 14,
        borderRadius: 15,
        backgroundColor: 'transparent'
    },
    tabButtonSel: {
        marginHorizontal: 5,
        paddingVertical: 4,
        paddingHorizontal: 14,
        borderRadius: 15,
        backgroundColor: Constants.mainColor
    },
    tabBtnText: { color: 'black', fontSize: 14},
    tabBtnSelText: { color: 'white', fontSize: 14},
    tabBtnTextTablet: { color: 'black', fontSize: 17},
    tabBtnSelTextTablet: { color: 'white', fontSize: 17},
})