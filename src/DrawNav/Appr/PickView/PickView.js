import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Header } from 'react-native-elements';

import * as Progress from 'react-native-progress';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import '@expo/vector-icons';

import Constants, { topPadding, getCurUserIx } from '../../../Utils/Constant';
import BottomBar from '../../Components/BottomBar';
import TabButtonsFilter from '../TabButtonsFilter';
import PickRandomList from './Lists/PickRandomList';
import RestAPI from '../../../Utils/RestAPI';
import { useFocusEffect } from '@react-navigation/native';
import HeaderRight from '../../Components/HeaderRight';


// 픽한 웹툰 리스트 가져오기
export const WebtoonList = ({ selIndex, navigation }) => {
    return (
        <PickRandomList selIndex={selIndex} navigation={navigation} />
    )
}


// 해당 유저가 픽한 웹툰 리스트
export default function PickView({ route, navigation }) {
    const [selTabIndex, setSelTabIndex] = useState(0)
    
    useFocusEffect(React.useCallback(()=>{
        setSelTabIndex(0)
    },[]))
    
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header
                leftComponent={() => {
                    return <TouchableOpacity onPress={() => {
                        navigation.goBack()
                    }}>
                        <MaterialCommunityIcons name="chevron-left" size={30} color={Constants.mainColor} />
                    </TouchableOpacity>
                }}
                rightComponent={<HeaderRight navigation={navigation} />}
                backgroundColor="#FFF"
                containerStyle={{ 
                    height: Constants.HeaderHeight, 
                    alignItems: Platform.OS == 'ios' ? 'center' : 'flex-start',
                    marginTop: Platform.OS == 'ios' ? 0 : -15,
                }}
            />
            <View style={styles.container}>
                <View style={styles.progressBarField}>
                    <Text style={global.deviceType == '1' ? styles.progressText : styles.progressTextTablet}>최근 본 웹툰</Text>
                </View>

                <View style={styles.webtoonList}>
                    <TabButtonsFilter
                        selIndex={selTabIndex}
                        onTapButton={(index) => {
                            setSelTabIndex(index)
                        }}
                    />
                    <WebtoonList
                        selIndex={selTabIndex}
                        navigation={navigation}
                    />
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
    progressBarField: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: Constants.WINDOW_WIDTH,
        paddingVertical: 10
    },
    progressText: {
        fontSize: 17,
        fontWeight: 'bold',
        paddingBottom: 10
    },
    progressTextTablet: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 10
    },
    webtoonList: {
        flex: 1,
        width: Constants.WINDOW_WIDTH,

    },
});