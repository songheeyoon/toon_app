import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import { Header } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import '@expo/vector-icons';

import Constants, { topPadding, getDayName, convertDayToNum } from '../../Utils/Constant';
import DayButtonsWeek from './DayButtonsWeek';
import DayListInnerView from './DayListInnerView';
import BottomBar from '../Components/BottomBar';
import HeaderRight from '../Components/HeaderRight';
import { useFocusEffect } from '@react-navigation/native';

export default function DayListView({ route, navigation }) {
    const [selDayIndex, setSelDayIndex] = useState(route.params.selDayIndex)

    useEffect(() => {
        setSelDayIndex(route.params.selDayIndex)
    }, [route.params.selDayIndex])
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
                <DayButtonsWeek
                    selIndex={selDayIndex}
                    onDayButton={(index) => {
                        setSelDayIndex(index)
                    }} />
                <DayListInnerView navigation={navigation} selIndex={selDayIndex}/>
            </View>
            <BottomBar navigation={navigation} selTab={'3'} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Constants.WINDOW_HEIGHT - 100 - topPadding(),
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
})