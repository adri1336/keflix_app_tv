//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import SelectProfileScreen from "cuervo/src/screens/profile/SelectProfileScreen";
import CreateProfileScreen from "cuervo/src/screens/profile/CreateProfileScreen";
import SelectProfileColorScreen from "cuervo/src/screens/profile/SelectProfileColorScreen";

//Vars
const ProfileNavigator = createStackNavigator();

//Code
export default () => {
    return (
        <ProfileNavigator.Navigator 
            headerMode="none"
        >
            <ProfileNavigator.Screen name="SelectProfileScreen" component={SelectProfileScreen}/>
            <ProfileNavigator.Screen name="CreateProfileScreen" component={CreateProfileScreen}/>
            <ProfileNavigator.Screen name="SelectProfileColorScreen" component={SelectProfileColorScreen}/>
        </ProfileNavigator.Navigator>
    );
}