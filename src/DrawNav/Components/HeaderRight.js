import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Constants, {getCurUserIx} from '../../Utils/Constant';

// 현재이용안함
export default function HeaderLeft({ navigation }) {
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'white'
        }}>
            <TouchableOpacity onPress={() => {
                navigation.navigate('search', {userIx: getCurUserIx()})
            }}>
                <Feather name="search" size={25} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                navigation.openDrawer()
            }}
            >
                <Feather name="menu" size={30} style={{ paddingLeft: 10 }} />
            </TouchableOpacity>
        </View>
    )
}