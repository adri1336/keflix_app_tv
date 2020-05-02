//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import InfoScreen from "cuervo/src/screens/media/InfoScreen";

//Vars
const MediaNavigator = createStackNavigator();

//Code
export default () => {
    return (
        <MediaNavigator.Navigator 
            headerMode="none"
        >
            <MediaNavigator.Screen name="InfoScreen" component={InfoScreen}/>
        </MediaNavigator.Navigator>
    );
}