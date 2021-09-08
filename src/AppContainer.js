import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer, useLinking } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Analytics from 'expo-firebase-analytics';

import DrawNavigation from './DrawNav/DrawNavigation';
import LoginScreen from './Pages/LoginScreen';
import SignupScreen from './Pages/SignupScreen';
import SignupInputScreen from './Pages/SignupInputScreen';
import SignupAgreeScreen from './Pages/SignupAgreeScreen';

// import { Notifications } from 'expo';

const Stack = createStackNavigator()

export default function AppContainer() {
  const ref = useRef();
  const routeNameRef = useRef();

  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();

    const {getInitialState} = useLinking(ref,{
        prefixes: 'picktoon://',
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
                clientCenterBoardDetail:{
                  path:"clientCenterBoardDetail",
                  params:''
                },
                detailView : {
                  path:"detailview",
                  params:''
                },
                webView : "webview",
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
      

        if (!isReady) {
          return null;
        }
      
  return (
    <NavigationContainer initialState={initialState} ref={ref}
    onReady={() => routeNameRef.current = ref.current.getCurrentRoute().name}
    onStateChange={() => {
      const previousRouteName = routeNameRef.current;
      const currentRouteName = ref.current.getCurrentRoute().name

      if (previousRouteName !== currentRouteName) {
        // The line below uses the expo-firebase-analytics tracker
        // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
        // Change this line to use another Mobile analytics SDK
        Analytics.setCurrentScreen(currentRouteName);
      }

      // Save the current route name for later comparision
      routeNameRef.current = currentRouteName;
    }}

    >
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

