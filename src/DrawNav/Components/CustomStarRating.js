import React, { useState } from 'react';
import StarRating from 'react-native-star-rating';
import Constants from '../../Utils/Constant';

// 현재 이용안함
export default function CustomStarRating(props) {
    const [starCount, setStarCount] = useState(props.starCount)
    return (
        <StarRating
            disabled={false}
            emptyStar={'ios-star-outline'}
            fullStar={'ios-star'}
            halfStar={'ios-star-half'}
            iconSet={'Ionicons'}
            maxStars={5}
            rating={starCount}
            selectedStar={(index) => setStarCount(index)}
            fullStarColor={Constants.darkColor}
            emptyStarColor={'#999'}
            starSize={25}
        />
    )
}
