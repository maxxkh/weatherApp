import { Tabs } from "expo-router";
import IonIcons from '@expo/vector-icons/Ionicons'

import { View } from 'react-native'


const _layout = () => {
  return (
    <Tabs screenOptions={{
      tabBarShowLabel:false,
      tabBarBackground: () => (
        <View style={{ backgroundColor: '#4DA8DA', flex: 1, }} />
      ),
    }}>
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
                <IonIcons name={focused ? "home-sharp": "home-outline"} size={30} color={'white'}  /> 
        
            ),
          }}/>

          <Tabs.Screen
          name="search"
            options={{
                headerShown: false,
                tabBarIcon: ({  focused }) => (
                     <IonIcons name={focused ? "search-sharp": "search-outline"} size={30} color={'white'} /> 
                  ),
            }}/>

        <Tabs.Screen
          name="settings"
            options={{
                headerShown: false,
                tabBarIcon: ({  focused }) => (
                     <IonIcons name={focused ? "settings-sharp": "settings-outline"} size={30} color={'white'} /> 
                  ),
            }}/>
    </Tabs>
  )}
export default _layout
