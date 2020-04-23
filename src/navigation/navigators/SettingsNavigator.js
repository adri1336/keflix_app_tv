//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import GeneralScreen from "cuervo/src/screens/settings/GeneralScreen";
import EnterAccountPasswordScreen from "cuervo/src/screens/settings/EnterAccountPasswordScreen";

//Vars
const SettingsNavigator = createStackNavigator();

//Code
export default () => {
    return (
        <SettingsNavigator.Navigator 
            headerMode="none"
        >
            <SettingsNavigator.Screen name="GeneralScreen" component={GeneralScreen}/>
            <SettingsNavigator.Screen name="EnterAccountPasswordScreen" component={EnterAccountPasswordScreen}/>
        </SettingsNavigator.Navigator>
    );
}