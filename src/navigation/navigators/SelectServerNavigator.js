//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import SelectServerScreen from "app/src/screens/select_server/SelectServerScreen";

//Vars
const SelectScreenNavigator = createStackNavigator();

//Code
export default (props) => {
    return (
        <SelectScreenNavigator.Navigator 
            headerMode="none"
        >
            <SelectScreenNavigator.Screen name="SelectServer" component={SelectServerScreen}/>
        </SelectScreenNavigator.Navigator>
    );
}