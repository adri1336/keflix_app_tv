//Imports
import React from "react";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

//Components Imports
import { createTVDrawerNavigator } from "cuervo/src/components/navigators/TVDrawerNavigator";

//Screen Imports
import MainScreen from "cuervo/src/screens/main/MainScreen";
import Screen2 from "cuervo/src/screens/main/Screen2";
import Screen3 from "cuervo/src/screens/main/Screen3";

//Other Imports
import { AppContext } from "cuervo/src/AppContext";

//Vars
const MainNavigator = createTVDrawerNavigator();

//Code
export default () => {
    const appContext = React.useContext(AppContext);

    return (
        <MainNavigator.Navigator 
            headerMode="none"
            initialRouteName="MainScreen"
            appContext={ appContext }
        >
            <MainNavigator.Screen name="Screen2" component={Screen2} options={{
                drawer: true, //activa el drawer en esta pantalla
                drawerEnabled: true, //permite o no abrir el drawer en la pantalla (mediante el mando)
                title: "Búsqueda",
                icon: {
                    library: FontAwesome,
                    name: "search"
                }
            }}/>
            <MainNavigator.Screen name="MainScreen" component={MainScreen} options={{
                drawer: true,
                drawerEnabled: true,
                title: "Películas",
                icon: {
                    library: MaterialCommunityIcons,
                    name: "movie"
                }
            }}/>
            <MainNavigator.Screen name="Screen3" component={Screen3} options={{
                drawer: true,
                drawerEnabled: true,
                title: "Mi lista",
                icon: {
                    library: FontAwesome,
                    name: "plus"
                }
            }}/>
        </MainNavigator.Navigator>
    );
}