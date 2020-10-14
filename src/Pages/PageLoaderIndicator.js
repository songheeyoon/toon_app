// 페이지 로딩 인디케이터
import React from 'react';
import { View, Dimensions, StyleSheet, Text, Platform } from 'react-native';
import { UIActivityIndicator, MaterialIndicator } from "react-native-indicators";
import PropTypes from 'prop-types';
import Constants from '../Utils/Constant';

const PageLoaderIndicator = ({ isPageLoader = false }) => {
    if (!isPageLoader) {
        return null;
    }
    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999 }}>
            <View style={ Platform.OS == 'ios' ? styles.container_other_ios : styles.container_other } >
                {
                    Platform.OS == 'ios' ?
                        <UIActivityIndicator color={'black'} size={25} count={10}/> :
                        <MaterialIndicator color={'black'} size={20} count={10} trackWidth={3} />
                }
            </View>
        </View>
    );
}

PageLoaderIndicator.propTypes = {
    isPageLoader: PropTypes.bool
};

PageLoaderIndicator.defaultProps = {
    isPageLoader: false,
}

export default PageLoaderIndicator;

const styles = StyleSheet.create({
    container_other: {
        height: 40,
        paddingHorizontal: 10,
        justifyContent: 'center',
        marginTop: Constants.WINDOW_HEIGHT * 0.45,
        borderRadius: 20,
        backgroundColor: 'white',
        elevation: 5
    },
    container_other_ios: {
        height: 41,
        paddingHorizontal: 8,
        justifyContent: 'center',
        marginTop: Constants.WINDOW_HEIGHT * 0.45,
        borderRadius: 21,
        backgroundColor: 'white',
    }
});
