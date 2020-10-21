import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import Constants from '../../../Utils/Constant';
import * as Progress from 'react-native-progress';

// 해당 유저가 평가한 웹툰의 개수
export default function ApprTopHeader({ count }) {

    const [apprCount, setApprCount] = useState(count)

    useEffect(() => {
        if (count) {
            setApprCount(count)
        } else {
            setApprCount(0)
        }
    }, [count])

    return (
        <View style={styles.progressBarField}>
            <Text style={styles.progressText}>
                평가한 웹툰 {apprCount ? apprCount : 0}
            </Text>
            <Progress.Bar
                progress={apprCount ? apprCount>=100 ? 0.75+(apprCount%50/200) : apprCount/100 : 0}
                borderColor={Constants.mainColor}
                borderWidth={1.5}
                unfilledColor={Constants.mainColor}
                color='white'
                width={global.deviceType == '1' ? Constants.WINDOW_WIDTH * 0.7 : Constants.WINDOW_WIDTH * 0.6}
                height={2.5}
            />
        </View> 
    )
}

const styles = StyleSheet.create({
    progressBarField: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: Constants.WINDOW_WIDTH,
        paddingVertical: 10
    },
    progressText: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingBottom: 10
    },
})