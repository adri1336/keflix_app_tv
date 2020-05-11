//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import MoviesScreen from "cuervo/src/screens/main/MoviesScreen";
import PlayScreen from "cuervo/src/screens/main/PlayScreen";

//Vars
const MoviesNavigator = createStackNavigator();

//Code
export default () => {
    return (
        <MoviesNavigator.Navigator 
            headerMode="none"
            initialRouteName="MoviesScreen"
        >
            <MoviesNavigator.Screen name="MoviesScreen" component={MoviesScreen}/>
            <MoviesNavigator.Screen name="PlayScreen" component={PlayScreen}/>
        </MoviesNavigator.Navigator>
    );
}