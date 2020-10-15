import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';

import { Entypo } from '@expo/vector-icons';
import Constants from '../../Utils/Constant';
import { FontAwesome } from '@expo/vector-icons'; 

// 웹툰 프로필에서 해당 웹툰에 Comment달기 및 보여주기
export default function WebtoonDetailComment({ count, data, status, addViewClick }) {

    if (!data) {
        return null
    }
    if (status) {
        return data.map((item, index) => (
            <View key={index} style={styles.textFieldView}>
                <Text>{item.nickname}</Text>
                <Text style={styles.textField}>{item.content}</Text>
                <Text>{item.in_date}</Text>
            </View>
        ))
    } else {
        return <>
            {
                data.slice(0, 20).map((item, index) => (
                    <View key={index} style={styles.textFieldView}>
                        <View style={{width:"100%",flexDirection:"row",alignItems:"center"}}>
                            <Text style={global.deviceType == '1' ? styles.text : styles.textTablet}>{item.nickname}</Text>
                            <FontAwesome name="star" size={global.deviceType == '1' ? 14 : 20} color="orange" style={{marginLeft: global.deviceType == '1' ? 10 : 5}}/>
                            <TouchableOpacity style={{position:"absolute",right:0}}><Text style={{color:"#999"}}>신고</Text></TouchableOpacity>
                        </View>
                        <Text style={styles.textField}>{item.content}</Text>
                        <Text>{item.in_date}</Text>
                    </View>
                ))
            }
            <TouchableOpacity
                style={{ width: Constants.WINDOW_WIDTH, justifyContent: 'center', alignItems: 'center' }}
                onPress={() => {
                    if (addViewClick) {
                        addViewClick()
                    }
                }}
            >
                {
                    count >= 20 ?
                        <Text style={{
                            fontSize: 16, fontWeight: 'bold', paddingHorizontal: 15,
                            color: 'black'
                        }}><Entypo name="chevron-thin-down" color={'black'} size={18} />  더 보기</Text>
                        : null
                }

            </TouchableOpacity>
        </>

    }

}

const styles = StyleSheet.create({
    textFieldView: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius:5,
        borderWidth:1,
        borderColor:"#ebeaec",
        marginBottom:10
    },
    textField: {
        color: '#777',
        fontWeight: 'bold',
        paddingVertical: 5,
        fontSize: 14,
    },
    text :{
        fontSize: 14
    },
    textTablet:{
        fontSize: 17
    }
})