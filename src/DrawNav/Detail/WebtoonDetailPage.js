import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import Textarea from 'react-native-textarea';
import StarRating from 'react-native-star-rating';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Entypo } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 


import Constants from '../../Utils/Constant';
import RestAPI from '../../Utils/RestAPI';
import WebtoonDetailComment from './WebtoonDetailComment';


// 해당 웹툰 프로필 내용 현시
export default function WebtoonDetailPage(
    { webtoonDetail, 
      navigation,
      closeButtonArea,
      outButtonArea,
    //   기능 option
      selTabIndex,
      webtoon_link,
      pickStatus,
      refuseStatus,
      shownStatus,
      pickWebtoon,
      delPickWebtoon,
      refuseWebtoon,
      delRefuseWebtoon,
      shownWebtoon,
      delShownWebtoon,
    //   onPressTopBar 
    }
    ) {
    let flatRef = useRef();
    let curUserIx = ''
    global.curUser ? curUserIx = global.curUser.user_ix : curUserIx = ''
    const [webtoon, setWebtoon] = useState(webtoonDetail)
    const [starCount, setStarCount] = useState(Number(webtoon.rate))
    const [content, setContent] = useState('')
    const [addView, setAddView] = useState(false)

    useEffect(() => {
        flatRef.current.scrollToPosition(0)
        setWebtoon(webtoonDetail)
        setAddView(false)
        setContent('')
        setStarCount(Number(webtoonDetail.rate))
    }, [webtoonDetail])

    useFocusEffect(React.useCallback(()=>{
        flatRef.current.scrollToPosition(0)
    }, []))


    // 선택된 프로필의 상세정보 가져오기
    const LoadWebtoonDetail = (webtoonIx) => {
        RestAPI.getWebtoonDetail(curUserIx, webtoonIx).then(res => {
            if (res.success == 1) {
                setWebtoon(res.data[0])
            } else {
                Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
        }).finally(() => {
        })
    }

    // 댓글 입력하기
    const PostReview = () => {
        if (content == '') {
            Alert.alert('오류', '댓글을 입력해주세요!', [{ text: '확인' }])
            return
        }
        showPageLoader(true)
        RestAPI.postReview(curUserIx, webtoon.ix, content).then(res => {
            if (res.msg == 'suc') {
                LoadWebtoonDetail(webtoon.ix)
            } else {
                Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
                showPageLoader(false)
                return
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            showPageLoader(false)
            return
        }).finally(() => {
            showPageLoader(false)
            setContent('')
        })
    }

    // 별점 주기
    const GiveStar = (index) => {
        showPageLoaderForStar(true)
        RestAPI.giveStar(curUserIx, webtoon.ix, index).then(res => {
            if (res.msg == 'suc') {
                LoadWebtoonDetail(webtoon.ix)
            } else {
                Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
                showPageLoaderForStar(false)
                return
            }
        }).catch(err => {
            Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
            showPageLoaderForStar(false)
            return
        }).finally(() => {
            showPageLoaderForStar(false)
        })
    }

    // let verticalColor = ['rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)'];
    let verticalColor =  ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)'];

    // let verticalColorTablet = ['rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)'];
    let verticalColorTablet = ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)'];

    return (
        <KeyboardAwareScrollView 
            keyboardShouldPersistTaps="handled"
            style={styles.detailScroll} ref={flatRef}>
            <View style={[styles.container,{paddingHorizontal:10}]}>
                <Image
                    source={{ uri: webtoon.webtoon_image }}
                    style={global.deviceType == '1' ? styles.webtoonItemImage : styles.webtoonItemImageTablet}
                />
                <LinearGradient
                    colors={global.deviceType == '1' ? verticalColor : verticalColorTablet}
                    style={global.deviceType == '1' ? styles.verticalGradient : styles.verticalGradientTablet}
                />

                <Image
                    source={{ uri: webtoon.webtoon_image }}
                    style={global.deviceType == '1' ? styles.webtoonItemImage_2 : styles.webtoonItemImageTablet_2}                
                />
                <View style={global.deviceType == '1' ? styles.WebtoonDetailView : styles.WebtoonDetailViewTablet}>
                    <Text style={global.deviceType == '1' ? styles.genreText : styles.genreTextTablet}>{webtoon.genre}</Text>
                    <Text style={global.deviceType == '1' ? styles.nameText : styles.nameTextTablet}>{webtoon.name}</Text>
                    <Text style={global.deviceType == '1' ? styles.authorText : styles.authorTextTablet}>{webtoon.author}</Text>
                    <View style={{marginTop:10,flexDirection:"row"}}>
                        <Text style={{fontSize:18}}><FontAwesome name="star" size={16} color="black" style={{marginRight:5}}/> {webtoon.info.average_rate == '0' ? '없음' : webtoon.info.average_rate}</Text>
                        <Text style={{fontSize:18,marginLeft:10}}><Entypo name="heart" size={16} color="#f04343" style={{marginRight:5}}/> 88%</Text>
                    </View>
                </View>
                <View style={{width:"100%"}}>
                    <View style={styles.line}></View>
                </View>
            </View>
            <View style={[styles.textFieldView,{paddingTop:20}]}>
                <View style={styles.line}>
                    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                        <TouchableOpacity style={{borderRadius:5,flexDirection:"row", width:"48%",height:40,backgroundColor:"#a1c98a",justifyContent:"center",alignItems:"center"}}> 
                            <View style={{width:20,height:20,borderRadius:10,backgroundColor:"#fff"}}>
                                <FontAwesome5 name="check" size={12}  color="#a1c98a" style={{position:"absolute",top:4,left:4}}/>
                            </View>
                            <Text style={{color:"#fff"}}> 꿀잼</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{borderRadius:5,flexDirection:"row", width:"48%",height:40,backgroundColor:"#535353",justifyContent:"center",alignItems:"center"}}>
                            <View style={{width:20,height:20,borderRadius:10,backgroundColor:"#fff"}}>
                                <FontAwesome5 name="check" size={12}  color="#535353" style={{position:"absolute",top:4,left:4}}/>
                            </View>
                            <Text style={{color:"#fff"}}> 노잼</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:"row",justifyContent:"space-around",marginTop:20,paddingBottom:20}}>
                        <TouchableOpacity style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                            <FontAwesome name="star" size={20} color="orange"/>
                            <Text style={{marginTop:5}}>별점 평가</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection:"column",justifyContent:"center",alignItems:"center",right:13}}>
                        <Image source={require('../../../assets/icons/see.png')} style={{width:20,height:20,resizeMode:"contain"}}></Image>
                            <Text style={{marginTop:5}}>이미 봤어요</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                        <Image source={require('../../../assets/icons/clip.png')} style={{width:20,height:20,resizeMode:"contain"}}></Image>
                            <Text style={{marginTop:5}}>Pick</Text>
                        </TouchableOpacity>
                    </View>    
                </View>
            </View>
            <View style={styles.textFieldView}>
                <View style={[styles.line,{paddingBottom:20}]}>
                    <Text style={global.deviceType == '1' ? styles.textTitle : styles.textTitleTablet}>보러가기</Text>
                    { webtoon.info.platform == "네이버" ? 
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate('webView', {
                            selTabIndex: selTabIndex,
                            link: webtoon_link
                        })                       
                    }} style={{flexDirection:"row",width:"15%"}}><Image source={require('../../../assets/icons/naver_logo.png')} style={{width:20,height:20}}/><Text style={global.deviceType == '1' ? styles.platformText : styles.platformTextTablet}> 네이버</Text></TouchableOpacity>: null}
                    { webtoon.info.platform == "레진코믹스" ? <TouchableOpacity onPress={()=>{
                        navigation.navigate('webView', {
                            selTabIndex: selTabIndex,
                            link: webtoon_link
                        })
                    }} style={{flexDirection:"row",width:"15%"}}><Image source={require('../../../assets/icons/lezhin.png')}  style={{width:20,height:20}}/><Text style={global.deviceType == '1' ? styles.platformText : styles.platformTextTablet}> 레진</Text></TouchableOpacity>: null}
                    { webtoon.info.platform == "다음" ? <TouchableOpacity onPress={()=>{
                        navigation.navigate('webView', {
                            selTabIndex: selTabIndex,
                            link: webtoon_link
                        })
                    }}
                    style={{flexDirection:"row",width:"15%"}}><Image source={require('../../../assets/icons/daum.png')}  style={{width:20,height:20}}/><Text style={global.deviceType == '1' ? styles.platformText : styles.platformTextTablet}> 레진</Text></TouchableOpacity>: null}
                </View>
            </View>
            <View style={styles.textFieldView}>
                <View style={[styles.line,{paddingBottom:20}]}>
                    <Text style={global.deviceType == '1' ? styles.textTitle : styles.textTitleTablet}>작품 정보</Text>
                    <Text style={global.deviceType == '1' ? styles.textField : styles.textFieldTablet}>
                        {webtoon.story}
                    </Text>
                </View>
            </View>
            <View style={styles.textFieldView}>
                <Text style={global.deviceType == '1' ? styles.textTitle : styles.textTitleTablet}>정보</Text>
                <Text style={global.deviceType == '1' ? styles.textField : styles.textFieldTablet}>평균평점: {webtoon.info.average_rate == '0' ? '없음' : webtoon.info.average_rate}</Text>
                <Text style={global.deviceType == '1' ? styles.textField : styles.textFieldTablet}>연재요일: {webtoon.info.ing}</Text>
                <Text style={global.deviceType == '1' ? styles.textField : styles.textFieldTablet}>연재플랫폼: {webtoon.info.platform}</Text>
            </View>
            <View>
                <Text style={[global.deviceType == '1' ? styles.textTitle : styles.textTitleTablet,styles.textFieldView]}>내가 쓴 한줄평</Text>
                <View style={{
                    ...styles.postView
                    // , height: Platform.OS == 'ios' ? 120 : 80
                }}>
                    <View style={[styles.textFieldView,{width:'100%',alignItems:"center"}]}>
                        <Text style={[global.deviceType == '1' ? {fontSize:17,fontWeight: 'bold'} : {fontSize:20,fontWeight: 'bold'}]}>별점을 선택해주세요</Text>
                        <View style={{width:"50%"}}>
                         <View style={global.deviceType == '1' ? styles.touchStar : styles.touchStarTablet}>
                        <StarRating
                            disabled={false}
                            emptyStar={'ios-star'}
                            fullStar={'ios-star'}
                            halfStar={'ios-star-half'}
                            iconSet={'Ionicons'}
                            maxStars={5}
                            rating={starCount}
                            selectedStar={(index) => {
                                if (!global.curUser)
                                    Alert.alert(
                                        '알림', '로그인이 필요한  !',
                                        [{
                                            text: '취소',
                                            onPress: () => { }
                                        }, {
                                            text: '로그인',
                                            onPress: () => {
                                                navigation.navigate('login')
                                            }
                                        }]
                                    )
                                else {
                                    setStarCount(index)
                                    GiveStar(index)
                                }
                            }}
                            fullStarColor={Constants.darkColor}
                            emptyStarColor={'#BBB'}
                            starSize={global.deviceType == '1' ? 30 : 40}
                        />
                        </View>
                        </View>
                        <Textarea
                            containerStyle={{ ...styles.textAreaContainter, height: Platform.OS == 'ios' ? 80 : 80 }}
                            style={{ ...styles.textArea, height: Platform.OS == 'ios' ? 80 : 80 }}
                            placeholder={'아직 작성한 한줄평이 없어요!'}
                            maxLength={50}
                            placeholderTextColor={'#ccc'}
                            underlineColorAndroid={'transparent'}
                            defaultValue={content}
                            onChangeText={val => setContent(val)}
                            onFocus={() => {
                                if (closeButtonArea) {
                                    closeButtonArea()
                                }
                            }}
                            onBlur={() => {
                                if (outButtonArea) {
                                    outButtonArea()
                                }
                            }}
                        />
                        <View style={{width:"100%",alignItems:"center"}}>
                            <TouchableOpacity style={styles.postButton}
                                onPress={() => { PostReview() }}
                            >
                                <Text style={styles.postText}>작성하기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.textFieldView}>
                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                    <Text style={[global.deviceType == '1' ? styles.textTitle : styles.textTitleTablet]}>모든 한줄평 </Text>                
                </View> 
                {
                    webtoon.reviews.count == 0 ? 
                    <Text>한 줄 평이 없습니다.</Text> :
                    
                    <WebtoonDetailComment
                        count={webtoon.reviews.count}
                        data={webtoon.reviews.details}
                        status={addView ? addView : false}
                        addViewClick={() => {
                            setAddView(true)
                        }}
                    />
                }
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    detailScroll: {
        flex: 1,
        backgroundColor: 'white',
    },
    line : {
        borderBottomColor:"#ebeaec",
        borderBottomWidth:1,
       
    },
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    imageView: {
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    webtoonItemImage: {
        height: Constants.WINDOW_WIDTH / 2,
        width: Constants.WINDOW_WIDTH,
        opacity:0.4
    },
    webtoonItemImage_2 : {
        position:"absolute",
        height: Constants.WINDOW_WIDTH / 3,
        width: Constants.WINDOW_WIDTH * 0.35,
        top:40,
        left:20,
        zIndex: 999,
        borderRadius:10
    }, 
    webtoonItemImageTablet_2 : {
        position:"absolute",
        height: Constants.WINDOW_WIDTH / 3,
        width: Constants.WINDOW_WIDTH * 0.35,
        bottom:40,
        left:20,
        zIndex: 999,
        borderRadius:10
    },
    webtoonItemImageTablet: {
        height: Constants.WINDOW_WIDTH / 1.5,
        width: Constants.WINDOW_WIDTH,
        opacity:0.4
    },
    WebtoonDetailView : {
        width: Constants.WINDOW_WIDTH * 0.5,
        position: 'absolute',
        right: 10,
        top:50,
        zIndex: 999
    },
    WebtoonDetailViewTablet: {
        width: Constants.WINDOW_WIDTH * 0.45,
        position: 'absolute',
        right: 15,
        bottom:40,
        // top: Constants.WINDOW_WIDTH * 0.5 / 1.8,
        zIndex: 999
    },
    genreText: { color: '#777', fontWeight: 'bold', fontSize: 14 },
    genreTextTablet: { color: '#777', fontWeight: 'bold', fontSize: 18 },
    nameText: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
    nameTextTablet: { fontSize: 22, fontWeight: 'bold', marginTop: 5, paddingVertical: 20 },
    authorText: { color: '#555', fontWeight: 'bold', marginTop: 5, fontSize: 14 },
    authorTextTablet: { color: '#555', fontWeight: 'bold', marginTop: 5, fontSize: 18, paddingBottom: 20 },
    touchStar: { width: '100%', marginVertical: 10},
    touchStarTablet: { width: '100%', marginVertical: 15 },

    webtoonBtnTextWhite: { fontWeight: 'bold', fontSize: 13, color: 'white' },

    textFieldView: {
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    textTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        paddingVertical: 10
    },
    platformText : {
        fontSize: 17,
        alignSelf:"center"
    },
    platformTextTablet:{
        fontSize: 20,
    },
    textTitleTablet: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingVertical: 10
    },
    textField: {
        color: '#777',
        fontWeight: 'bold',
        paddingVertical: 5,
        fontSize: 14,
    },
    textFieldTablet: {
        color: '#777',
        fontWeight: 'bold',
        paddingVertical: 5,
        fontSize: 17,
    },
    postView: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor:"#f7f7f7",
        paddingVertical:20
    },
    textAreaContainter: {
        // width: Constants.WINDOW_WIDTH * 0.8,
        width:"100%",
        backgroundColor: 'transparent',
    },
    textArea: {
        textAlignVertical: 'top',  // hack android
        // width: Constants.WINDOW_WIDTH * 0.7,
        width:"100%",
        fontSize: 17,
        color: '#333',
        borderColor: '#888',
        borderWidth:1,
        borderRadius:5,
        backgroundColor:"#fff",
        paddingHorizontal:3
    },
    postBtnView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    postButton: {
        alignItems: 'center',
        width:'50%',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: Constants.mainColor,
        borderRadius:5,
        marginTop:20
    },
    postText: {
        fontWeight: 'bold',
        fontSize: 17,
        color: 'white'
    },
    horizentalGradient: {
        position: 'absolute',
        left: 0,
        width: Constants.WINDOW_WIDTH,
        height: Constants.WINDOW_WIDTH,
        transform: [{ rotate: '-90deg' }]
    },
    horizentalGradientTablet: {
        position: 'absolute',
        top: -(Constants.WINDOW_WIDTH - Constants.WINDOW_WIDTH / 1.5) / 2,
        width: Constants.WINDOW_WIDTH / 1.5,
        height: Constants.WINDOW_WIDTH,
        transform: [{ rotate: '-90deg' }],
    },
    verticalGradient: {
        position: 'absolute',
        left: 0,
        width: Constants.WINDOW_WIDTH,
        height: Constants.WINDOW_WIDTH
    },
    verticalGradientTablet: {
        position: 'absolute',
        left: 0,
        width: Constants.WINDOW_WIDTH,
        height: Constants.WINDOW_WIDTH / 1.5,
    },
})