import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

const PageLoaderIndicatorForStar = ({ isPageLoader = false }) => {
    if (!isPageLoader) {
        return null;
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999 }} />
    );
}

PageLoaderIndicatorForStar.propTypes = {
    isPageLoader: PropTypes.bool
};

PageLoaderIndicatorForStar.defaultProps = {
    isPageLoader: false,
}

export default PageLoaderIndicatorForStar;
