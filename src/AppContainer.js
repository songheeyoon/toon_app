import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer, useLinking } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DrawNavigation from './DrawNav/DrawNavigation';
import LoginScreen from './Pages/LoginScreen';
import SignupScreen from './Pages/SignupScreen';
import SignupInputScreen from './Pages/SignupInputScreen';
import SignupAgreeScreen from './Pages/SignupAgreeScreen';
import * as Linking from 'expo-linking';
// import { Notifications } from 'expo';

const Stack = createStackNavigator()

export default function AppContainer() {
  const ref = useRef();
  const prefix = Linking.makeUrl('/');
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();

    const {getInitialState} = useLinking(ref,{
        prefixes: [prefix],
        config:{
          screen:{
            draw:{
              path:'draw',
              screen:{
                home : {
                    path:'home'
                },
                appr : 'appr',
                pick : 'pick',
                recent : 'recent',
                dayHome : 'dayhome',
                dayList : 'daylist',
                myHome : 'myHome',
                accountSetting : 'accountsetting',
                accountSettingName : 'accountsettingname',
                accountSettingPass : 'accountsettingpass',
                accountSettingExit : 'accountsettingexit',
                clientCenter : 'clientcenter',
                clientCenterContact : 'clientcentercontact',
                clientCenterHistory : 'clientcenterhistory',
                clientCenterFaq : 'clientcenterfaq',
                clientCenterBoard : 'clientcenterboard',
                detailView : 'detailview',
                webView : {
                  path:'webview',
                  params:''
                },
                search : 'search'
              }
            },
            login:'login',
            signup:'signup',
            signupAgree:'signupagree',
            signupInput:'signupinput'
            }
          }      
     });
        useEffect(() => {
          getInitialState()
            .catch(() => {})
            .then(state => {
              if (state !== undefined) {
                setInitialState(state);
              }
      
              setIsReady(true);
            });
        }, [getInitialState]);
      
        // useEffect(()=>{

        //   const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
        //     // It didn't work for me
      
        //     console.log(toggle+"알림눌렀을때1");
        //     if(Platform.OS ==='ios'){
        //     const link = response.notification.request.content.data.body.screen;
        //     setScreen(link);
        //     Linking.openURL(link);
        //     }else{
        //       const link = response.notification.request.content.data.screen;
        //       setScreen(link);
        //       Linking.openURL(link);
        //     }
        //     console.log(toggle+"알림눌렀을때2");
        //   });
        //   return() => subscription.remove();
        // },[])

        if (!isReady) {
          return null;
        }
      
  return (
    <NavigationContainer initialState={initialState} ref={ref}>
      <Stack.Navigator initialRouteName="draw" headerMode="none">
        {/* 로그인 스크린 */}
        <Stack.Screen name='login' component={LoginScreen} />

        {/* 회원가입 관련 스크린 */}
        <Stack.Screen name='signup' component={SignupScreen} />
        <Stack.Screen name='signupAgree' component={SignupAgreeScreen} />
        <Stack.Screen name='signupInput' component={SignupInputScreen} />
        
        {/* 메인 드로우 내비게이션 스크린 */}
        <Stack.Screen name='draw' component={DrawNavigation} options={{gestureEnabled: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

