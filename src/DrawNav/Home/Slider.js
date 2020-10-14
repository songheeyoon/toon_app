import React from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Constants from '../../Utils/Constant';
import { Image } from 'react-native-elements';

// 현재 이용안함
export default class Slider extends React.Component {
    state = {
        active: 0
    }
    change = ({ nativeEvent }) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        if (slide !== this.state.active) {
            this.setState({ active: slide });
        }
    }

    render() {
        return (
            <View style={styles.containter}>
                <ScrollView
                    pagingEnabled
                    horizontal
                    onScroll={this.change}
                    showsHorizontalScrollIndicator={false}
                    style={styles.containter}
                >
                    {
                        this.props.images.map((image, index) => (
                            <Image
                                key={index}
                                source={{uri: image.url}}
                                style={styles.image}
                                PlaceholderContent={<ActivityIndicator />}
                            />
                        ))
                    }
                </ScrollView>
                <View style={styles.pagenation}>
                    {
                        this.props.images.map((i, k) => (
                            <Text key={k} style={k == this.state.active ? styles.pagingActiveText : styles.pagingText}>⬤</Text>
                        ))
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containter: {
        width: Constants.WINDOW_WIDTH,
        height: Constants.WINDOW_WIDTH * 0.8,
    },
    image: {
        width: Constants.WINDOW_WIDTH,
        height: Constants.WINDOW_WIDTH * 0.8,
        resizeMode: 'cover'
    },
    pagenation: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
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