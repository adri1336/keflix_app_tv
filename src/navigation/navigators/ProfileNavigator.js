//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import SelectProfileScreen from "app/src/screens/profile/SelectProfileScreen";
import CreateProfileScreen from "app/src/screens/profile/CreateProfileScreen";
import SelectProfileColorScreen from "app/src/screens/profile/SelectProfileColorScreen";
import EnterProfilePasswordScreen from "app/src/screens/profile/EnterProfilePasswordScreen";
import EnterAccountPasswordScreen from "app/src/screens/profile/EnterAccountPasswordScreen";

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
            <ProfileNavigator.Screen name="EnterProfilePasswordScreen" component={EnterProfilePasswordScreen}/>
            <ProfileNavigator.Screen name="EnterAccountPasswordScreen" component={EnterAccountPasswordScreen}/>
        </ProfileNavigator.Navigator>
    );
}