//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import SelectProfileScreen from "cuervo/src/screens/profile/SelectProfileScreen";

//Vars
const ProfileNavigator = createStackNavigator();

//Code
export default () => {
    return (
        <ProfileNavigator.Navigator 
            headerMode="none"
        >
            <ProfileNavigator.Screen name="SelectProfileScreen" component={SelectProfileScreen}/>
        </ProfileNavigator.Navigator>
    );
}