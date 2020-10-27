import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert, Platform, ImageBackground, Keyboard } from 'react-native';
import Textarea from 'react-native-textarea';
import StarRating from 'react-native-star-rating';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Entypo } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons'; 
import { Foundation } from '@expo/vector-icons';

import Constants, { getCurUserIx } from '../../Utils/Constant';
import RestAPI from '../../Utils/RestAPI';
import WebtoonDetailComment from './WebtoonDetailComment';
import { TouchableItem } from 'react-native-tab-view';



// 해당 웹툰 프로필 내용 현시
export default function WebtoonDetailPage(
    { webtoonDetail, 
      navigation,
    //   기능 option
      selTabIndex,
      webtoon_link,
      favoritedStatus,
      shownStatus,
      pickWebtoon,
      addFavorites,
      delFavorites,
      shownWebtoon,
      delShownWebtoon,
    //   onPressTopBar 
    }
    ) {
    let flatRef = useRef();
    let curUserIx = '';
    let scrollRef = useRef();

    global.curUser ? curUserIx = global.curUser.user_ix : curUserIx = ''
    const [webtoon, setWebtoon] = useState(webtoonDetail)
    const [starCount, setStarCount] = useState(Number(webtoon.rate))
    const [content, setContent] = useState('')
    const [addView, setAddView] = useState(false)
    const [jam,setJam] = useState(webtoon.jam);
    const [review,setReview] = useState(webtoon.reviews.details);
    const [toggle,setToggle] = useState(false);
    let input = useRef();
 
    
    useEffect(() => {
        flatRef.current.scrollToPosition(0)
        setWebtoon(webtoonDetail)
        setAddView(false)
        setContent('')
        setJam(webtoonDetail.jam)
        setReview(webtoonDetail.reviews.details);   
        setStarCount(Number(webtoonDetail.rate)) // console.log(webtoon.reviews.details,"디테일")
    }, [webtoonDetail])

    useEffect(() => {
       
     }, [starCount,favoritedStatus]);

     useEffect(() => {
        reviewreset();
    }, [review]);

     const reviewreset = () => {
        review.map((item,index)=>{
            if(item.user_ix == curUserIx){
                setContent(item.content);
            }
         })      
     }

    useFocusEffect(React.useCallback(()=>{
        flatRef.current.scrollToPosition(0)
    }, []))
    //  console.log(global.curUser);
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
    // console.log(webtoon,"웹툰정보");
    // 댓글 입력하기
    const PostReview = () => {
        showPageLoader(true);
        
        if (content == '') {
            Alert.alert('오류', '댓글을 입력해주세요!', [{ text: '확인' }])
            showPageLoader(false)
        }else if(starCount == null || starCount == 0) {
            Alert.alert('오류', '별점을 입력해주세요!', [{ text: '확인' }])
            showPageLoader(false)
            return
        }else{

        RestAPI.postReview(curUserIx, webtoon.ix, content, starCount ).then(res => {
            
            if (res.msg == 'suc') {
                Keyboard.dismiss()
                LoadWebtoonDetail(webtoon.ix)
                if (shownWebtoon) {
                    shownWebtoon()
                }
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
        })
    }
    }
    // jam nojam 점수 상태 보내기
    const jamBtn = (value) => {
        if(!global.curUser){
        Alert.alert(
            '알림', '로그인이 필요한 기능입니다!',
            [{
                text: '취소',
                onPress: () => { }
            }, {
                text: '로그인',
                onPress: () => { navigation.navigate('login') }
            }]
        )}else{
                setStarCount(5);
                setJam("jam");

            showPageLoader(true);
            RestAPI.sendjam(curUserIx,webtoon.ix,5,value).then(res => {
                
                if (res.msg == 'suc') {
                    LoadWebtoonDetail(webtoon.ix)         
                        if (shownWebtoon) {
                            shownWebtoon()
                        }
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
               
            })
        }
    }
    const nojamBtn = (value) => {
        if(!global.curUser){
        Alert.alert(
            '알림', '로그인이 필요한 기능입니다!',
            [{
                text: '취소',
                onPress: () => { }
            }, {
                text: '로그인',
                onPress: () => { navigation.navigate('login') }
            }]
        ) }else{
            setStarCount(1);
            setJam("nojam");

        showPageLoader(true);
        RestAPI.sendjam(curUserIx,webtoon.ix,1,value).then(res => {
            
            if (res.msg == 'suc') {           
                LoadWebtoonDetail(webtoon.ix)
                if (shownWebtoon) {
                    shownWebtoon()
                }
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
           
        })
    }
}


    // const GiveStar = (index) => {

    //     showPageLoaderForStar(true)
    //     RestAPI.giveStar(curUserIx, webtoon.ix, index).then(res => {
    //         if (res.msg == 'suc') {
    //             LoadWebtoonDetail(webtoon.ix)
    //             if (shownWebtoon) {
    //                 shownWebtoon()
    //             }
    //         } else {
    //             Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
    //             showPageLoaderForStar(false)
    //             return
    //         }
    //     }).catch(err => {
    //         Alert.alert('로딩 오류', '잠시 후 다시 시도하십시오.', [{ text: '확인' }])
    //         showPageLoaderForStar(false)
    //         return
    //     }).finally(() => {
    //         showPageLoaderForStar(false)
    //     })
    // }
    const loginAlert = () => {
        if(!global.curUser)
        Alert.alert(
            '알림', '로그인이 필요한 기능입니다!',
            [{
                text: '취소',
                onPress: () => { }
            }, {
                text: '로그인',
                onPress: () => { navigation.navigate('login') }
            }]
        )
    }

    
    // let verticalColor = ['rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)'];
    let verticalColor =  ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)'];

    // let verticalColorTablet = ['rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)'];
    let verticalColorTablet = ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.8)','rgba(255,255,255,0.8)','rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)'];

    return (
        <KeyboardAwareScrollView 
            keyboardShouldPersistTaps="handled"
            style={styles.detailScroll} ref={flatRef}
            > 
            <View style={[styles.container,{paddingHorizontal:10}]}>
                <Image
                    source={{ uri: webtoon.webtoon_image }}
                    style={global.deviceType == '1' ? styles.webtoonItemImage : styles.webtoonItemImageTablet}
                />
                <LinearGradient
                    colors={global.deviceType == '1' ? verticalColor : verticalColorTablet}
                    style={global.deviceType == '1' ? styles.verticalGradient : styles.verticalGradientTablet}
                />
                <View style={[global.deviceType == '1' ? {bottom:'20%',position:"absolute",flexDirection:"row"} : {bottom:'15%',position:"absolute",flexDirection:"row"} ]}>      
                <Image
                    source={{ uri: webtoon.webtoon_image }}
                    style={global.deviceType == '1' ? styles.webtoonItemImage_2 : styles.webtoonItemImageTablet_2}                
                />
                {/* <ImageBackground
                    source={{ uri: webtoon.webtoon_image }}
                    style={global.deviceType == '1' ? styles.webtoonItemImage_2 : styles.webtoonItemImageTablet_2}                
                /> */}
                <View style={global.deviceType == '1' ? styles.WebtoonDetailView : styles.WebtoonDetailViewTablet}>
                    <Text style={global.deviceType == '1' ? styles.genreText : styles.genreTextTablet}>{webtoon.genre}</Text>
                    <Text style={global.deviceType == '1' ? styles.nameText : styles.nameTextTablet}>{webtoon.name}</Text>
                    <Text style={global.deviceType == '1' ? styles.authorText : styles.authorTextTablet}>{webtoon.author}</Text>
                    <View style={{marginTop:10,flexDirection:"row"}}>
                        <Text style={{fontSize:global.deviceType == '1' ? 14 : 23}}><FontAwesome name="star" size={global.deviceType == '1' ? 14 : 23} color="black" style={{marginRight:5}}/> {webtoon.info.average_rate == '0' ? '없음' : webtoon.info.average_rate}</Text>
                        {/* <Text style={{fontSize:global.deviceType == '1' ? 14 : 23,marginLeft:10}}><Entypo name="heart" size={global.deviceType == '1' ? 14 : 23} color="#f04343" style={{marginRight:5}}/> 88%</Text> */}
                    </View>
                </View>
                </View> 
                <View style={{width:"100%"}}>
                    <View style={styles.line}></View>
                </View>
            </View>
            <View style={[styles.textFieldView,{paddingTop:20}]}>
                <View style={styles.line}>
                    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                    <TouchableOpacity style={jam == "jam" && getCurUserIx() ? (global.deviceType == '1' ? styles.jambtn : styles.jambtnTablet):(global.deviceType == '1' ? styles.nojambtn : styles.nojambtnTablet)} onPress={()=>{
                            jamBtn("jam")
                        }}> 
                            <View style={global.deviceType == '1' ? styles.cir : styles.cirTablet}>
                                <FontAwesome5 name="check" size={global.deviceType == '1' ? 12 : 20}  color={jam == "jam" && getCurUserIx() ? "#a1c98a" : "#535353"} style={{position:"absolute",top:4,left:4}}/>
                            </View>
                            <Text style={global.deviceType == '1' ? styles.jamText : styles.jamTextTablet}> 꿀잼</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={jam == "nojam" && getCurUserIx()? (global.deviceType == '1' ? styles.jambtn : styles.jambtnTablet):(global.deviceType == '1' ? styles.nojambtn : styles.nojambtnTablet)} onPress={()=>{
                            nojamBtn("nojam")
                        }}> 
                            <View style={global.deviceType == '1' ? styles.cir : styles.cirTablet}>
                                <FontAwesome5 name="check" size={global.deviceType == '1' ? 12 : 20}  color={jam == "nojam" && getCurUserIx() ? "#a1c98a" : "#535353"} style={{position:"absolute",top:4,left:4}}/>
                            </View>
                            <Text style={global.deviceType == '1' ? styles.jamText : styles.jamTextTablet}> 노잼</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:"row",justifyContent:"space-around",marginTop:20,paddingBottom:20}}>
                        <TouchableOpacity style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}} onPress={()=>{
                                flatRef.current.scrollToPosition(0,global.deviceType == '1' ? 430 : 630)
                        }}>
                            <FontAwesome name="star" size={global.deviceType == '1' ? 20 : 30} color="orange"/>
                            <Text style={global.deviceType == '1' ? styles.menuText : styles.menuTextTablet}>별점 평가</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection:"column",justifyContent:"center",alignItems:"center",right:13}} onPress={() => {
                            if (!global.curUser)
                            Alert.alert(
                                '알림', '로그인이 필요한 기능입니다!',
                                [{
                                    text: '취소',
                                    onPress: () => { }
                                }, {
                                    text: '로그인',
                                    onPress: () => { navigation.navigate('login') }
                                }]
                            )
                        else {
                            if (shownStatus && shownStatus == 'shown') {
                                Alert.alert('알림', '이미 처리되었습니다. 취소하시겠습니까?',
                                    [{
                                        text: '취소',
                                        onPress: () => { }
                                    },
                                    {
                                        text: '확인',
                                        onPress: () => {
                                            if (delShownWebtoon) {
                                                delShownWebtoon()
                                            }
                                        }
                                    }]
                                )

                            } else {
                                if (shownWebtoon) {
                                    shownWebtoon()
                                }
                            }
                        }
                }}>
                    
                        <Ionicons name="md-eye" size={global.deviceType == '1' ? 20 : 30} color= {getCurUserIx() && shownStatus == 'shown' ? "#DDD" :"#a1c98a"} />
                            <Text style={[global.deviceType == '1' ? styles.menuText : styles.menuTextTablet, {color: shownStatus && getCurUserIx() && shownStatus == 'shown' ? '#DDD' : Constants.darkColor}]}>이미 봤어요</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}} onPress={() => {
                            if (!global.curUser)
                                Alert.alert(
                                    '알림', '로그인이 필요한 기능입니다!',
                                    [{
                                        text: '취소',
                                        onPress: () => { }
                                    }, {
                                        text: '로그인',
                                        onPress: () => { navigation.navigate('login') }
                                    }]
                                )
                            else {
                                if (favoritedStatus && favoritedStatus == 'favorited') {
                                    Alert.alert('알림', '이미 즐겨찾기 한 웹툰입니다. 목록에서 삭제하시겠습니까?',
                                        [{
                                            text: '취소',
                                            onPress: () => { }
                                        },
                                        {
                                            text: '확인',
                                            onPress: () => {
                                                delFavorites(webtoon.ix);
                                            }
                                        }]
                                    )
                                } else {
                                    if (pickWebtoon) {
                                        addFavorites(webtoon.info.ing,webtoon.ix);
                                    }
                                }
                            }
                        }}>
                        
                            <Foundation name="paperclip" size={global.deviceType == '1' ? 20 : 30} color= {getCurUserIx() && favoritedStatus == 'favorited' ? "#DDD":"#535353"} />
                            <Text style={[global.deviceType == '1' ? styles.menuText : styles.menuTextTablet, {color: favoritedStatus && getCurUserIx() && favoritedStatus == 'favorited' ? '#DDD' : Constants.darkColor }]}>즐겨찾기</Text>
                        </TouchableOpacity>
                    </View>    
                </View>
            </View>
            <View style={styles.textFieldView}>
                <View style={[styles.line,{paddingBottom:20}]}>
                    <Text style={global.deviceType == '1' ? styles.textTitle : styles.textTitleTablet}>보러가기</Text>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate('webView', {
                            selTabIndex: selTabIndex,
                            link: webtoon_link
                        })                       
                    }} style={{flexDirection:"row",width:'18%',alignItems:"center"}}>
                      {webtoon.info.platform == "네이버" ? <><Image source={require('../../../assets/icons/naver_logo.png')} style={global.deviceType =='1' ? styles.em : styles.emTablet}/><Text style={[global.deviceType == '1' ? styles.platformText : styles.platformTextTablet,{marginLeft:5}]}> 네이버</Text></>  : null}
                      {webtoon.info.platform == "레진코믹스" ? <><Image source={require('../../../assets/icons/lezhin.png')}  style={global.deviceType =='1' ? styles.em : styles.emTablet}/><Text style={[global.deviceType == '1' ? styles.platformText : styles.platformTextTablet,{marginLeft:5}]}> 레진</Text></>  : null  }
                       {webtoon.info.platform == "다음" ? <><Image source={require('../../../assets/icons/daum.png')} style={global.deviceType =='1' ? styles.em : styles.emTablet}/><Text style={[global.deviceType == '1' ? styles.platformText : styles.platformTextTablet,{marginLeft:5}]}> 다음</Text></>  : null}
                    </TouchableOpacity>
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
            {/* <View style={styles.textFieldView}>
                <Text style={global.deviceType == '1' ? styles.textField : styles.textFieldTablet}>연재요일: {webtoon.info.ing}</Text>
            </View> */}
            <View>
                <Text style={[global.deviceType == '1' ? styles.textTitle : styles.textTitleTablet,styles.textFieldView]}>내가 쓴 한줄평</Text>
 
                <View style={{
                    ...styles.postView
                    // , height: Platform.OS == 'ios' ? 120 : 80
                }}>
                    <View style={[styles.textFieldView,{width:'100%',alignItems:"center"}]}>
                        <Text style={[global.deviceType == '1' ? {fontSize:17,fontWeight: 'bold'} : {fontSize:20,fontWeight: 'bold'}]}>별점을 선택해주세요</Text>
                        <View style={{width:global.deviceType == '1' ? "50%" : "30%"}}>
                         <View style={global.deviceType == '1' ? styles.touchStar : styles.touchStarTablet}>
                        <StarRating
                            disabled={false}
                            emptyStar={'ios-star'}
                            fullStar={'ios-star'}
                            halfStar={'ios-star-half'}
                            iconSet={'Ionicons'}
                            maxStars={5}
                            rating={global.curUser ? starCount : 0}
                            selectedStar={(index) => {
                                if (!global.curUser)
                                    Alert.alert(
                                        '알림', '로그인이 필요한 기능입니다!',
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
                                    // setCommentStar(index);
                                    setStarCount( initialState => index)
                                    // setReviewStar(index);
                                    // GiveStar(index)
                                }
                            }}
                            fullStarColor={"orange"}
                            emptyStarColor={'#BBB'}
                            starSize={global.deviceType == '1' ? 30 : 40}
                        />
                        </View>
                        </View>

                        <Textarea
                            containerStyle={{ ...styles.textAreaContainter, height: Platform.OS == 'ios' ? 80 : 80 }}
                            style={{ ...styles.textArea, height: Platform.OS == 'ios' ? 80 : 80 }}
                            placeholder={global.curUser?'아직 작성한 한줄평이 없어요!':'로그인 후 작성 할 수 있어요!'}
                            maxLength={50}
                            editable={global.curUser? true: false}
                            placeholderTextColor={'#ccc'}
                            underlineColorAndroid={'transparent'}
                            defaultValue={content}
                            ref={input}
                            onChangeText={(val)=>{
                                if (!global.curUser){
                                    setContent('');
                                 }
                                else {
                                    setContent(val);
                                }                                
                            }
                            }
                            onFocus={() => {

                            }}
                            onBlur={() => {

                            }}
                        />
                        <View style={{width:"100%",alignItems:"center"}}>
                            <TouchableOpacity style={styles.postButton}
                                onPress={() => { global.curUser ? PostReview() :loginAlert() }}
                            >
                                <Text style={styles.postText}>작성하기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.textFieldView}>
                 <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                    <Text style={[global.deviceType == '1' ? styles.textTitle : styles.textTitleTablet]}>모든 한줄평 </Text>
                    {/* <TouchableOpacity style={{flexDirection:"row"}} onPress={()=>{setToggle( toggle => !toggle)}}>
                            <Text>{toggle ? "오래된순" : "최신순"}</Text>
                            <AntDesign name="caretdown" size={12} color="black" style={[{marginLeft:5}]}/>
                    </TouchableOpacity>                 */}
                </View> 

                {
                    webtoon.reviews.count == 0 ? 
                    <Text>한 줄 평이 없습니다.</Text> :
                    
                    <WebtoonDetailComment
                        count={webtoon.reviews.count}
                        data={webtoon.reviews.details}
                        order={toggle}
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

    cir:{
        width:20,
        height:20,
        borderRadius:10,
        backgroundColor:"#fff"
    },
    cirTablet:{
        width:30,
        height:30,
        borderRadius:15,
        backgroundColor:"#fff"
    },
    jambtn : {
        borderRadius:5,
        flexDirection:"row",
        width:"48%",
        height:40,
        backgroundColor:"#a1c98a",
        justifyContent:"center",
        alignItems:"center"
    },
    nojambtn : {
        borderRadius:5,
        flexDirection:"row",
        width:"48%",
        height:40,
        backgroundColor:"#535353",
        justifyContent:"center",
        alignItems:"center"
    },
    jambtnTablet : {
        borderRadius:5,
        flexDirection:"row",
        width:"48%",
        height:60,
        backgroundColor:"#a1c98a",
        justifyContent:"center",
        alignItems:"center"
    },
    nojambtnTablet : {
        borderRadius:5,
        flexDirection:"row",
        width:"48%",
        height:60,
        backgroundColor:"#535353",
        justifyContent:"center",
        alignItems:"center"
    },
    em:{
        width:20,
        height:20,
        resizeMode:"contain"
    },
    emTablet:{
        width:30,
        height:30,
        resizeMode:"contain"
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
        position:"relative",
        height: Constants.WINDOW_WIDTH / 3,
        width: Constants.WINDOW_WIDTH * 0.4,
        zIndex: 999,
        borderRadius:10,
    }, 
    webtoonItemImageTablet_2 : {
        position:"relative",
        height: Constants.WINDOW_WIDTH / 3,
        width: Constants.WINDOW_WIDTH * 0.35,
        zIndex: 999,
        borderRadius:10
    },
    webtoonItemImageTablet: {
        height: Constants.WINDOW_HEIGHT * 0.35,
        width: Constants.WINDOW_WIDTH,
        opacity:0.4
    },
    WebtoonDetailView : {
        width: Constants.WINDOW_WIDTH * 0.5,
        // height: Constants.WINDOW_WIDTH * 0.3,
        left: 20,
        zIndex: 999,
        justifyContent:"center"
    },
    WebtoonDetailViewTablet: {
        width: Constants.WINDOW_WIDTH * 0.45,
        left: 50,
        zIndex: 999,
        justifyContent:"center"
    },
    menuText : { fontSize:14,marginTop:5},
    menuTextTablet:{ fontSize:17,marginTop:5},
    jamText: {fontSize:14,color:'#fff'},
    jamTextTablet:{fontSize:20,color:'#fff',marginLeft:5},
    genreText: { color: '#777', fontWeight: 'bold', fontSize: 14 },
    genreTextTablet: { color: '#777', fontWeight: 'bold', fontSize: 18 },
    nameText: { fontSize: 17, fontWeight: 'bold', marginTop: 5 },
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
        alignSelf:"center"
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