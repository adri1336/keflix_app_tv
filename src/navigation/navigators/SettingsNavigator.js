//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import GeneralScreen from "cuervo/src/screens/settings/GeneralScreen";
import Screen2 from "cuervo/src/screens/settings/Screen2";

//Vars
const SettingsNavigator = createStackNavigator();

//Code
export default () => {
    return (
        <SettingsNavigator.Navigator 
            headerMode="none"
        >
            <SettingsNavigator.Screen name="GeneralScreen" component={GeneralScreen}/>
            <SettingsNavigator.Screen name="Screen2" component={Screen2}/>
        </SettingsNavigator.Navigator>
    );
}