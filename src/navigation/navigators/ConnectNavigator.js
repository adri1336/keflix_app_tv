//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import ConnectScreen from "app/src/screens/connect/ConnectScreen";

//Vars
const ConnectNavigator = createStackNavigator();

//Code
export default (props) => {
    return (
        <ConnectNavigator.Navigator 
            /*por algun motivo da warning...: (Can't perform a React state update on an unmounted component.) 
            screenOptions={{ animationEnabled: false }}*/
            headerMode="none"
        >
            <ConnectNavigator.Screen name="ConnectScreen" component={ConnectScreen}/>
        </ConnectNavigator.Navigator>
    );
}