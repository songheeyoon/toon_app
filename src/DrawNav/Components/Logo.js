import React from 'react';
import { View, Image } from 'react-native';

// 현재 이용안함
export default function Logo() {
  return (
    <View>
      <Image 
        style={{ width: 100, height: 20 }}
        source={ require('../../../assets/logo.png') }
      />
    </View>
  );
}
