//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import WelcomeScreen from "app/src/screens/auth/WelcomeScreen";
import RegisterScreen from "app/src/screens/auth/RegisterScreen";
import LoginScreen from "app/src/screens/auth/LoginScreen";

//Vars
const AuthNavigator = createStackNavigator();

//Code
export default () => {
    return (
        <AuthNavigator.Navigator 
            /*por algun motivo da warning...: (Can't perform a React state update on an unmounted component.) 
            screenOptions={{ animationEnabled: false }}*/
            headerMode="none"
        >
            <AuthNavigator.Screen name="WelcomeScreen" component={WelcomeScreen}/>
            <AuthNavigator.Screen name="RegisterScreen" component={RegisterScreen}/>
            <AuthNavigator.Screen name="LoginScreen" component={LoginScreen}/>
        </AuthNavigator.Navigator>
    );
}