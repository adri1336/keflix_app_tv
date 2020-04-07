//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import ConnectScreen from "cuervo/src/screens/connect/ConnectScreen";

//Vars
const ConnectNavigator = createStackNavigator();

//Code
export default () => {
    return (
        <ConnectNavigator.Navigator headerMode="none">
            <ConnectNavigator.Screen name="ConnectScreen" component={ConnectScreen}/>
        </ConnectNavigator.Navigator>
    );
}