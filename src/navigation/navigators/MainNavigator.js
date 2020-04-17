//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import MainScreen from "cuervo/src/screens/main/MainScreen";

//Vars
const MainNavigator = createStackNavigator();

//Code
export default () => {
    return (
        <MainNavigator.Navigator 
            headerMode="none"
        >
            <MainNavigator.Screen name="MainScreen" component={MainScreen}/>
        </MainNavigator.Navigator>
    );
}