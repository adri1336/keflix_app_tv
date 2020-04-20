//Imports
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Components Imports
import { createTVDrawerNavigator } from "cuervo/src/components/TVDrawerNavigator";

//Screen Imports
import MainScreen from "cuervo/src/screens/main/MainScreen";
import Screen2 from "cuervo/src/screens/main/Screen2";

//Other Imports
import { AppContext } from "cuervo/src/AppContext";

//Vars
const MainNavigator = createTVDrawerNavigator();

//Code
export default () => {
    const appContext = React.useContext(AppContext)

    return (
        <MainNavigator.Navigator 
            headerMode="none"
            appContext={ appContext }
        >
            <MainNavigator.Screen name="MainScreen" component={MainScreen}/>
            <MainNavigator.Screen name="Screen2" component={Screen2}/>
        </MainNavigator.Navigator>
    );
}