//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import MoviesScreen from "cuervo/src/screens/main/MoviesScreen";
import PlayScreen from "cuervo/src/screens/main/media/PlayScreen";

//Vars
const MediaNavigator = createStackNavigator();

//Code
export default () => {
    return (
        <MediaNavigator.Navigator 
            headerMode="none"
            initialRouteName="MoviesScreen"
        >
            <MediaNavigator.Screen name="MoviesScreen" component={MoviesScreen}/>
            <MediaNavigator.Screen name="PlayScreen" component={PlayScreen}/>
        </MediaNavigator.Navigator>
    );
}