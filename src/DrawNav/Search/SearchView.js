import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Platform, Keyboard } from 'react-native';
import { Header } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import '@expo/vector-icons';
import { SearchBar } from 'react-native-elements';

import Constants, { topPadding, getCurUserIx } from '../../Utils/Constant';
import BottomBar from '../Components/BottomBar';
import RestAPI from '../../Utils/RestAPI';
import { useFocusEffect } from '@react-navigation/native';
import SearchList from './SearchList';


export const WebtoonList = ({ keyWord, navigation }) => {
    return (
        <SearchList navigation={navigation} keyWord={keyWord} />
    )
}

export default function SearchView({ route, navigation }) {
    const [keyWord, setKeyWord] = useState('')
    const [isOpen, getIsOpen] = useState(false);
    let searchRef = useRef(null)
    let keyboardShowListener = useRef(null);
    let keyboardHideListener = useRef(null);

    useFocusEffect(React.useCallback(() => {
        if (searchRef) {
            searchRef.focus()
        }
        return ()=>{}
    }, []))

    useEffect(()=>{
        if (searchRef) {
            searchRef.focus()
        }
        return ()=>{}
    },[route])

    useEffect(() => {
        setKeyWord('')
        keyboardShowListener.current = Keyboard.addListener('keyboardDidShow', () => getIsOpen(true));
        keyboardHideListener.current = Keyboard.addListener('keyboardDidHide', () => getIsOpen(false));
        
        return () => {
            keyboardShowListener.current.remove();
            keyboardHideListener.current.remove();
        }
    }, [route.params?.userIx])

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
                centerComponent={
                    <TextInput style={{
                        backgroundColor: '#EEE',
                        width: Constants.WINDOW_WIDTH * 0.7,
                        marginLeft: Constants.WINDOW_WIDTH * 0.1,
                        paddingHorizontal: 20,
                        paddingVertical: Platform.OS == 'ios' ? 10 : 5,
                        borderRadius: 10,
                        fontSize: 16
                    }}
                        onChangeText={val => setKeyWord(val)}
                        value={keyWord}
                        placeholder={'제목/작가로 검색해주세요!'}
                        ref={ref => searchRef = ref}
                    />
                }
                backgroundColor="#FFF"
                containerStyle={{
                    height: Constants.HeaderHeight,
                    alignItems: Platform.OS == 'ios' ? 'center' : 'flex-start',
                    marginTop: Platform.OS == 'ios' ? 0 : -15,
                }}
            />
            <View style={styles.container}>
                {
                    keyWord != '' ?
                        <View style={styles.progressBarField}>
                            <Text style={styles.progressText}>‘{keyWord != '' ? keyWord : ' '}’</Text>
                            <Text style={{ fontSize: 16, color: '#AAA' }}>에 대한 검색결과입니다.</Text>
                        </View> : null
                }
                <View style={styles.webtoonList}>
                    {
                        keyWord != '' ?
                            <WebtoonList
                                keyWord={keyWord}
                                navigation={navigation}
                            /> : <Text style={{ fontSize: 17, paddingTop: 10 }}>검색어를 입력해주세요!</Text>
                    }

                </View>
            </View>
            {
                isOpen ? null :
                <BottomBar navigation={navigation} selTab={'1'} />
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Constants.WINDOW_HEIGHT - 100 - topPadding(),
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBarField: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: Constants.WINDOW_WIDTH,
        paddingTop: 10,
    },
    progressText: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    webtoonList: {
        flex: 1,
        width: Constants.WINDOW_WIDTH,
        alignItems: 'center',
    },
});