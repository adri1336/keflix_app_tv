//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import SearchScreen from "app/src/screens/main/SearchScreen";
import PlayScreen from "app/src/screens/main/PlayScreen";

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