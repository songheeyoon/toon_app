import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';
import Constants, { getCurUserIx } from '../../Utils/Constant';
import RestAPI from '../../Utils/RestAPI';
import { useFocusEffect } from '@react-navigation/native';
// import FastImage from 'react-native-fast-image';

// 홈페이지 부분의 이미지 아이템
const ImageItem = ({ image, title, onPress, textColor }) => {

    return <TouchableOpacity
        style={{ padding: 5 }}
        onPress={() => { if (onPress) { onPress(image, title) } }}>
            {/* <FastImage source={{uri: image}} style={global.deviceType == '1' ? styles.image : styles.imageTablet} resizeMode={FastImage.resizeMode.contain}/> */}
        <Image source={{ uri: image, cache: 'force-cache' }} style={global.deviceType == '1' ? styles.image : styles.imageTablet} PlaceholderContent={<ActivityIndicator />} />
        <View style={{ ...global.deviceType == '1' ? styles.itemName : styles.itemNameTablet}}>
        <Text style={{ ...global.deviceType == '1' ? styles.imageItemTitle : styles.imageItemTitleTablet}}>
            {
                title.length > 9 ?
                    title.slice(0, 9) + '...' :
                    title
            }
        </Text>
        </View>
    </TouchableOpacity>
}

const conv2Arr = (arr) => {
    let res = [];
    for (let i = 0; i < arr.length; i += 2) {
        let one = { top: arr[i], bottom: null }
        if (i + 1 < arr.length) {
            one.bottom = arr[i + 1]
        }
        res.push(one);
    }
    return res;
}

// 웹툰 프로필 배열을 두개의 열로 현시하기
export default function SliderTwoRow(props) {
    let scrollRef = useRef(null)
    // useFocusEffect(React.useCallback(() => {
    //     try {
    //         scrollRef.current?.scrollTo({x: 0, animated: false})
    //     } catch (ex) {
    //         console.log(ex)
    //     }
    // }, [props]))

    useEffect(()=>{
        try {
            scrollRef.current?.scrollTo({x: 0, animated: false})
        } catch (ex) {
            console.log(ex)
        }
    }, [getCurUserIx(), props])

    let curUserIx = ''
    global.curUser ? curUserIx = global.curUser.user_ix : curUserIx = ''


    // 웹툰 상세정보 얻기
    const LoadWebtoonDetail = (webtoonIx) => {
        RestAPI.getWebtoonDetail(curUserIx, webtoonIx).then(res => {
            if (res.success == 1) {
                console.log(res.data[0],"res값");
                props.navigation.navigate('detailView', { webtoon: res.data[0], selTabIndex: '1' });
            } else {
                Alert.alert('적재 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '문제가 발생했습니다. 잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => { })
    }

    return (
        <View style={styles.containter} >
            <ScrollView
                ref={scrollRef}
                scrollToOverflowEnabled={true}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {
                    conv2Arr(props.images).map((item, index) => (
                        <View key={index} style={{ padding: 2 }}>
                            <ImageItem
                                image={item.top.url}
                                textColor={props.textColor}
                                title={item.top.name}
                                onPress={(img, text) => {
                                    LoadWebtoonDetail(item.top.ix)
                                }} />
                            {
                                item.bottom ?
                                    <ImageItem
                                        image={item.bottom.url}
                                        textColor={props.textColor}
                                        title={item.bottom.name}
                                        onPress={(img, text) => {
                                            LoadWebtoonDetail(item.bottom.ix)
                                        }} />
                                    : null
                            }
                        </View>
                    ))
                }
            </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    containter: {
        width: Constants.WINDOW_WIDTH,
        paddingVertical: 5,
    },
    image: {
        width: Constants.WINDOW_WIDTH * 0.4,
        height: Constants.WINDOW_WIDTH * 0.3,
        resizeMode: 'cover',
        borderRadius: 15,
    },
    imageTablet: {
        width: Constants.WINDOW_WIDTH * 0.2,
        height: Constants.WINDOW_WIDTH * 0.15,
        resizeMode: 'cover',
        borderRadius: 15,        
    },
    itemName : {
        width:'100%',
        position:"absolute",
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        backgroundColor:'rgba(0,0,0,0.7)',
        bottom:5,
        left:5,
        
    },
    itemNameTablet :{
        width:'100%',
        position:"absolute",
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        backgroundColor:'rgba(0,0,0,0.7)',
        bottom:5,
        left:5,
    },
    imageItemTitle: {
        fontSize: 15,
        marginVertical: 3,
        marginHorizontal: 5,
        textAlign: 'left',
        paddingHorizontal: 5,
        bottom:0,
        color:'#fff',
        paddingVertical:2,
    },
    imageItemTitleTablet: {

        fontSize: 17,
        marginVertical: 3,
        marginHorizontal: 5,
        textAlign: 'left',
        paddingHorizontal: 5,
        color:'#fff',
        paddingVertical:4,
    }
})