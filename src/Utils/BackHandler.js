import { BackHandler } from 'react-native';

const handleBackButton = callback => {
    BackHandler.addEventListener('hardwareBackPress', () => {
        if(callback) {
            callback()
        }
        return true
    })
}

const removeBackButton = () => {
    BackHandler.removeEventListener('hardwareBackPress', ()=>{})
}

export {handleBackButton, removeBackButton}