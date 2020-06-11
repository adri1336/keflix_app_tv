//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import GeneralScreen from "app/src/screens/main/settings/GeneralScreen";
import EnterAccountPasswordScreen from "app/src/screens/main/settings/EnterAccountPasswordScreen";
import EditProfileScreen from "app/src/screens/profile/CreateProfileScreen";
import SelectProfileColorScreen from "app/src/screens/profile/SelectProfileColorScreen";

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
            <SettingsNavigator.Screen name="EditProfileScreen" component={EditProfileScreen}/>
            <SettingsNavigator.Screen name="SelectProfileColorScreen" component={SelectProfileColorScreen}/>
        </SettingsNavigator.Navigator>
    );
}