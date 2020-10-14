
// 장르별 선택을 위한 바톤
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import Constants from '../../Utils/Constant';
import { useFocusEffect } from '@react-navigation/native';

export default function TabButtonsGenre({ genreIndex=0, onTapButton }) {
    const [index, setIndex] = useState(genreIndex)
    // useFocusEffect(React.useCallback(()=>{
    //     setIndex(0)
    // },[]))
    return (
        <View style={styles.tabBtnView}>
            {
                Constants.GenreList.map((item, idx) => {
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
        paddingHorizontal: 5
    },
    tabButton: {
        paddingVertical: 4,
        paddingHorizontal: 14,
        borderRadius: 15,
        backgroundColor: 'transparent'
    },
    tabButtonSel: {
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