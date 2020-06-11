//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import MyListScreen from "app/src/screens/main/MyListScreen";
import PlayScreen from "app/src/screens/main/PlayScreen";

//Vars
const MyListNavigator = createStackNavigator();

//Code
export default () => {
    return (
        <MyListNavigator.Navigator 
            headerMode="none"
            initialRouteName="MyListScreen"
        >
            <MyListNavigator.Screen name="MyListScreen" component={MyListScreen}/>
            <MyListNavigator.Screen name="PlayScreen" component={PlayScreen}/>
        </MyListNavigator.Navigator>
    );
}