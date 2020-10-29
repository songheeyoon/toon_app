import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';
import Constants, { getCurUserIx } from '../../Utils/Constant';
import RestAPI from '../../Utils/RestAPI';
import { useFocusEffect } from '@react-navigation/native';
import * as Analytics from 'expo-firebase-analytics';
// import FastImage from 'react-native-fast-image';
const img = [
        { "url":require('../../../assets/images/1.png')}, {"url":require('../../../assets/images/2.png')},{"url":require('../../../assets/images/3.png')},
        { "url":require('../../../assets/images/4.png')}, {"url":require('../../../assets/images/5.png')},{"url":require('../../../assets/images/6.png')},
        { "url":require('../../../assets/images/7.png')}, {"url":require('../../../assets/images/8.png')},{"url":require('../../../assets/images/9.png')},
        { "url":require('../../../assets/images/10.png')} 
   ]
// 홈페이지 부분의 이미지 아이템
const ImageItem = ({ image, title, onPress, type, num }) => {

    return <TouchableOpacity
        style={{ paddingLeft: 5, paddingRight:5, alignItems:"center"}}
        onPress={() => { if (onPress) { onPress(image, title) } }}>
            {
        
                type == "A" ?
                <>
                <View style={global.deviceType == '1' ? styles.cir : styles.cirTablet} >
                <Image source={{ uri: image, cache: 'force-cache' }} style={global.deviceType == '1' ? styles.image_cir : styles.image_cirTablet} PlaceholderContent={<ActivityIndicator />} />
                </View>
                <View style={{ ...global.deviceType == '1' ? styles.itemName_cir : styles.itemName_cir}}>
                <Text style={{ ...global.deviceType == '1' ? styles.imageItemTitle_cir : styles.imageItemTitleTablet_cir}}>
                    {
                        title.length > 9 ?
                            title.slice(0, 9) + '...' :
                            title
                    }
                </Text>
                </View>
                </> : 
                // 순위
                type == "B" ?
                <View style={{...global.deviceType == '1' ? styles.num_wrap : styles.Tablet_num_wrap}}>
                    <Image source={img[num].url} style={{...global.deviceType == '1' ? styles.num_score : styles.Tablet_num_score}}/>
                    <View style={{marginLeft:2}}>
                        <Image source={{ uri: image, cache: 'force-cache' }} style={global.deviceType == '1' ? styles.image_num : styles.image_numTablet} PlaceholderContent={<ActivityIndicator />} />
                        <View style={{ ...global.deviceType == '1' ? styles.numName : styles.numNameTablet}}>
                        <Text style={{ ...global.deviceType == '1' ? styles.imageItemTitle_num : styles.imageItemTitleTablet}}>
                            {
                                title.length > 8 ?
                                    title.slice(0, 8) + '...' :
                                    title
                            }
                        </Text>
                    </View>
                    </View>
                </View>  :

                <View style={[global.deviceType == '1' ? styles.image : styles.imageTablet,{overflow:"hidden"}]}>
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
                </View>           
            }
    </TouchableOpacity>
}

const newArr = (list) => {
    return list.slice(0,3);
}

// 웹툰 프로필 배열을 두개의 열로 현시하기
export default function SliderOneRow(props) {

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
    //  인기 순위 3개로 자르기 
            props.type == "B" ? 

            props.images.map((item, index) => (
                <View style={{ padding: 2 }} key={index}>
                <ImageItem
                    image={item.url}
                    title={item.name}
                    type={props.type}
                    num={index}
                    onPress={(img, text) => {
                        LoadWebtoonDetail(item.ix)
                    }} />

            </View>
            ))
            :
                    props.images.map((item, index) => (
                        <View style={{ padding: 2 }} key={index}>
                        <ImageItem
                            image={item.url}
                            title={item.name}
                            type={props.type}
                            onPress={(img, text) => {
                                LoadWebtoonDetail(item.ix)
                            }} />
    
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
    num_wrap:{
        flexDirection:"row", 
        width: Constants.WINDOW_WIDTH * 0.4, 
        height: Constants.WINDOW_WIDTH * 0.3
    },
    num_score:{
        width: Constants.WINDOW_WIDTH * 0.1,
        height: Constants.WINDOW_WIDTH * 0.3, 
        borderRadius: 5       
    },
    Tablet_num_wrap:{
        flexDirection:"row", 
        width: Constants.WINDOW_WIDTH * 0.2, 
        height: Constants.WINDOW_WIDTH * 0.15,
  
    },
    Tablet_num_score:{
        width: Constants.WINDOW_WIDTH * 0.05,
        height: Constants.WINDOW_WIDTH * 0.15, 
        borderRadius: 5       
    },
    image: {
        width: Constants.WINDOW_WIDTH * 0.4,
        height: Constants.WINDOW_WIDTH * 0.3,
        resizeMode: 'cover',
        borderRadius: 5,
    },
    imageTablet: {
        width: Constants.WINDOW_WIDTH * 0.2,
        height: Constants.WINDOW_WIDTH * 0.15,
        resizeMode: 'cover',
        borderRadius: 5,        
    },
    cir:{
        width: Constants.WINDOW_WIDTH * 0.27,
        height: Constants.WINDOW_WIDTH * 0.27,
        resizeMode: 'cover',
        borderRadius: 100, 
        borderWidth:1,
        borderColor:'#000',
        overflow:"hidden",
    },
    cirTablet:{
        width: Constants.WINDOW_WIDTH * 0.2,
        height: Constants.WINDOW_WIDTH * 0.2,
        resizeMode: 'cover',
        borderRadius: 100, 
        borderWidth:1,
        borderColor:'#000',   
        overflow:"hidden"
    },
    image_cir:{
        width: Constants.WINDOW_WIDTH * 0.27,
        height: Constants.WINDOW_WIDTH * 0.27,
        resizeMode: 'cover',
    },
    image_cirTablet:{
        width: Constants.WINDOW_WIDTH * 0.2,
        height: Constants.WINDOW_WIDTH * 0.2,
        resizeMode: 'cover',    
    },
    image_num:{
        width: Constants.WINDOW_WIDTH * 0.3,
        height: Constants.WINDOW_WIDTH * 0.3,
        resizeMode: 'cover',
        borderRadius: 5,          
    },
    image_numTablet:{
        width: Constants.WINDOW_WIDTH * 0.15, 
        height: Constants.WINDOW_WIDTH * 0.15,  
        borderRadius: 5,    
    },
    itemName : {
        width:'100%',
        position:"absolute",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor:'rgba(0,0,0,0.7)',
        bottom:0,
        left:0,    
        height:22
    },
    numName :{
        width:'100%',
        position:"absolute",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor:'rgba(0,0,0,0.7)',
        bottom:0,
        left:0,          
        height:22
    },
    numNameTablet :{
        width:'100%',
        position:"absolute",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor:'rgba(0,0,0,0.7)',
        bottom:0,
        left:0,          
        height:28
    },
    itemNameTablet :{
        width:'100%',
        position:"absolute",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        backgroundColor:'rgba(0,0,0,0.7)',
        bottom:0,
        left:0, 
        height:28   
    },
    itemName_cir:{
        alignItems:"center"
    },
    imageItemTitle: {
        fontSize: 15,
        // marginVertical: 3,
        marginHorizontal: 5,
        textAlign: 'left',
        paddingHorizontal: 5,
        bottom:0,
        color:'#fff',
        lineHeight:22
    },
    imageItemTitle_cir: {
        fontSize: 12,
        marginVertical: 3,
        marginHorizontal: 5,
        textAlign: 'left',
        paddingHorizontal: 5,
        bottom:0,
        color:'#000',
        paddingVertical:2,        
    },
    imageItemTitleTablet_cir: {
        fontSize: 17,
        marginVertical: 3,
        marginHorizontal: 5,
        textAlign: 'left',
        paddingHorizontal: 5,
        bottom:0,
        color:'#000',
        paddingVertical:2,        
    },
    imageItemTitle_num :{
        fontSize: 12,
        marginHorizontal: 5,
        textAlign: 'left',
        paddingHorizontal: 5,
        bottom:0,
        color:'#fff',
        lineHeight:22      
    },
    imageItemTitleTablet: {

        fontSize: 14,
        // marginVertical: 3,
        // marginHorizontal: 5,
        textAlign: 'left',
        paddingHorizontal: 5,
        color:'#fff',
        lineHeight:28
    }
})