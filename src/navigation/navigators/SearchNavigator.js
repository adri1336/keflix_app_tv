//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import SearchScreen from "cuervo/src/screens/main/SearchScreen";
import PlayScreen from "cuervo/src/screens/main/PlayScreen";

//Vars
const SearchNavigator = createStackNavigator();

//Code
export default () => {
    return (
        <SearchNavigator.Navigator 
            headerMode="none"
            initialRouteName="SearchScreen"
        >
            <SearchNavigator.Screen name="SearchScreen" component={SearchScreen}/>
            <SearchNavigator.Screen name="PlayScreen" component={PlayScreen}/>
        </SearchNavigator.Navigator>
    );
}