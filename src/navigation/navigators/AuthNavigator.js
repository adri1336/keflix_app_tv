//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import WelcomeScreen from "cuervo/src/screens/auth/WelcomeScreen";
import RegisterScreen from "cuervo/src/screens/auth/RegisterScreen";

//Vars
const AuthNavigator = createStackNavigator();

//Code
export default () => {
    return (
        <AuthNavigator.Navigator 
            screenOptions={{ animationEnabled: false }}
            headerMode="none"
        >
            <AuthNavigator.Screen name="WelcomeScreen" component={WelcomeScreen}/>
            <AuthNavigator.Screen name="RegisterScreen" component={RegisterScreen}/>
        </AuthNavigator.Navigator>
    );
}