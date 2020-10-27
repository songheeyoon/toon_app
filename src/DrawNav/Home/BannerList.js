import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import Constants from '../../Utils/Constant';
import { Image } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

let timeInterval = null
let timeout = null
let isTimerbannerProcessing = false
let isHandScroll = false
let stepper = 0;

// 홈 페이지 부분의 배너 슬라이더
export default function BannerList({ imgList, navigation }) {
    let [step, setStep] = useState(stepper)
    let [inidcatorIndex, setIndicatorIndex] = useState(0)
    let scrollRef = useRef()
    // console.log(imgList,"list");
    // const tabbanner = imgList.filter((item)=>{
    //     return item.d_type == 'tab'
    // })
    // const mobbanner = imgList.filter((item)=>{
    //     return item.d_type == 'mob'
    // })
    // console.log(tabbanner,"tabbanner");
    useFocusEffect(React.useCallback(() => {
        if (timeInterval) {
            clearInterval(timeInterval)
            timeInterval = null
        }
        if (timeout) {
            clearTimeout(timeout)
            timeout = null
        }
    }, []))

    useEffect(()=>{

    },[imgList])
    useEffect(() => {
        if (timeInterval) {
            clearInterval(timeInterval)
        }
        if (timeout) {
            clearTimeout(timeout)
        }
        timer()
    }, [imgList])

    const timer = () => {
        if (isHandScroll) {
            return;
        }
        if (timeout) {
            clearTimeout(timeout)
            timeout = null;
        }

        timeout = setTimeout(() => {
            isTimerbannerProcessing = true
            onNext();
            timer();

        }, 4500);

    }

    let onNext = () => {
        if (imgList == null) {
            return
        }
        stepper = parseInt(stepper)
        if (stepper < totalPage() - 1) {
            stepper = parseInt(stepper) + 1;
            setStep(stepper)
        } else {
            stepper = 0;
            setStep(0)
        }
    }

    const totalPage = () => {
        return imgList ? imgList.length : 0;
    }

    useEffect(() => {
        scrollToPage(step)

        if (isTimerbannerProcessing) {
            isTimerbannerProcessing = false
        }

    }, [step])

    const scrollToPage = curStep => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ x: (curStep) * Constants.WINDOW_WIDTH, y: 0, animated: true })
        }
    }

    const onScrollBanner = (e) => {

        let offsetX = e.nativeEvent.contentOffset.x;
        let totalW = e.nativeEvent.contentSize.width;
        let pageW = e.nativeEvent.layoutMeasurement.width;
        let curIndex = (offsetX / pageW).toFixed(0);

        if (curIndex != inidcatorIndex) {

            setIndicatorIndex(curIndex)

        }
    }

    return (
        <View style={global.deviceType == '1' ? styles.containter : styles.containtertablet}>

            <ScrollView
                ref={scrollRef}
                style={styles.container}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                scrollEnabled={true}
                onScroll={(e) => {
                    onScrollBanner(e)
                }}
                scrollEventThrottle={16}
                onMomentumScrollEnd={(e) => {
                    isHandScroll = false;
                    stepper = parseInt(inidcatorIndex);
                    timer();
                }}
                onTouchStart={(e) => {
                    isHandScroll = true;
                    if (timeout) {
                        clearTimeout(timeout)
                        timeout = null;
                    }

                }}
            >
            { global.deviceType == '1' ?
                imgList ? imgList.filter(item => item.d_type == 'mob').map((image,index)=>(
                    <TouchableOpacity key={index}
                    onPress={()=>{
                        navigation.navigate(image.page, {
                            selTabIndex: 1,
                            link: image.link, 
                        })
                    }}
                    style={{paddingHorizontal:10,borderRadius:20}}
                >
                    <Image
                        key={index}
                        source={{ uri: image.url }}
                        style={styles.image}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                </TouchableOpacity>

                ))  : null :
                imgList ? imgList.filter(item => item.d_type == 'tab').map((image,index)=>(
                    <TouchableOpacity key={index}
                    onPress={()=>{
                        navigation.navigate(image.page, {
                            selTabIndex: 1,
                            link: image.link,
                            
                        })
                    }}
                    style={{paddingHorizontal:10,borderRadius:20}}
                >
                    <Image
                        key={index}
                        source={{ uri: image.url }}
                        style={styles.imagetablet}
                        PlaceholderContent={<ActivityIndicator />}
                    />
                </TouchableOpacity>

                )) :null                
            }
            </ScrollView>
            <View style={styles.pagenation}>
                <IndicatorView itemList={imgList} curStep={inidcatorIndex} />
            </View>
        </View>
    )
}

export const IndicatorView = ({ itemList, curStep }) => {

    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>

        { global.deviceType == '1' ?
                itemList ? itemList.filter(item => item.d_type == 'mob').map((image,index)=>{
                    let isSel = curStep == index
                    return <View
                        key={'indicator_' + index}
                        style={{
                            backgroundColor: isSel ? 'rgb(255,255,255)' : '#b5b5b5',
                            marginHorizontal: 3,
                            width: 20,
                            height: 5
                        }}>
                    </View>
                })  : null :
                itemList ? itemList.filter(item => item.d_type == 'tab').map((image,index)=>{
                    let isSel = curStep == index
                    return <View
                        key={'indicator_' + index}
                        style={{
                            backgroundColor: isSel ? 'rgb(255,255,255)' : '#b5b5b5',
                            marginHorizontal: 3,
                            width: 20,
                            height: 5
                        }}>
                    </View>

                }) :null                
            }
    </View>
}

const styles = StyleSheet.create({
    containter: {
        width: Constants.WINDOW_WIDTH,
        height: Constants.WINDOW_WIDTH-20,
    },
    containtertablet:{
        width: Constants.WINDOW_WIDTH,
        height: Constants.WINDOW_HEIGHT*0.33,
    },
    image: {
        width: Constants.WINDOW_WIDTH-20,
        height: Constants.WINDOW_WIDTH-20,
        borderRadius:10,
        resizeMode:"cover"
    },
    imagetablet:{
        width: Constants.WINDOW_WIDTH-20,
        height: Constants.WINDOW_HEIGHT*0.33,
        borderRadius:10,
        resizeMode:"cover"
    },
    pagenation: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center'
    },
    pagingText: {
        fontSize: (Constants.WINDOW_WIDTH / 30),
        color: 'white',
        margin: 3
    },
    pagingActiveText: {
        fontSize: (Constants.WINDOW_WIDTH / 30),
        color: 'black',
        margin: 3
    }
})