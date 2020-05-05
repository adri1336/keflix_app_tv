//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import MoviesScreen from "cuervo/src/screens/main/MoviesScreen";
import InfoScreen from "cuervo/src/screens/main/media/InfoScreen";
import VideoScreen from "cuervo/src/screens/main/media/VideoScreen";

//Vars
const MediaNavigator = createStackNavigator();

//Code
export default () => {
    return (
        <MediaNavigator.Navigator 
            headerMode="none"
            screenOptions={{ animationEnabled: false }}
            initialRouteName="MoviesScreen"
        >
            <MediaNavigator.Screen name="MoviesScreen" component={MoviesScreen}/>
            <MediaNavigator.Screen name="InfoScreen" component={InfoScreen}/>
            <MediaNavigator.Screen name="VideoScreen" component={VideoScreen}/>
        </MediaNavigator.Navigator>
    );
}