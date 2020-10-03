//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import TvsScreen from "app/src/screens/main/TvsScreen";
import PlayScreen from "app/src/screens/main/PlayScreen";

//Vars
const MoviesNavigator = createStackNavigator();

//Code
export default () => {
    return (
        <MoviesNavigator.Navigator 
            headerMode="none"
            initialRouteName="TvsScreen"
        >
            <MoviesNavigator.Screen name="TvsScreen" component={TvsScreen}/>
            <MoviesNavigator.Screen name="PlayScreen" component={PlayScreen}/>
        </MoviesNavigator.Navigator>
    );
}