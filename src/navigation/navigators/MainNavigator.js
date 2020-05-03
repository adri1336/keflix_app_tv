//Imports
import React from "react";
import i18n from "i18n-js";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

//Components Imports
import { createTVDrawerNavigator } from "cuervo/src/components/navigators/TVDrawerNavigator";

//Screen Imports
import SearchScreen from "cuervo/src/screens/main/SearchScreen";
import MoviesScreen from "cuervo/src/screens/main/MoviesScreen";
import MyListScreen from "cuervo/src/screens/main/MyListScreen";
import MediaNavigator from "./MediaNavigator";
import SettingsNavigator from "./SettingsNavigator";

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
            initialRouteName="MoviesScreen"
            tabs={[
                { route: "SearchScreen", title: i18n.t("main_navigator.search_screen_title"), icon: { library: FontAwesome, name: "search" } },
                { route: "MoviesScreen", title: i18n.t("main_navigator.movies_screen_title"), icon: { library: MaterialCommunityIcons, name: "movie" } },
                { route: "MyListScreen", title: i18n.t("main_navigator.my_list_screen_title"), icon: { library: FontAwesome, name: "plus" } }
            ]}
            appContext={ appContext }
        >
            <MainNavigator.Screen name="SearchScreen" component={SearchScreen} options={{
                drawer: true, //activa el drawer en esta pantalla
                drawerCanOpen: true, //permite o no abrir el drawer en la pantalla (mediante el mando)
            }}/>
            <MainNavigator.Screen name="MoviesScreen" component={MoviesScreen} options={{
                drawer: true,
                drawerCanOpen: true
            }}/>
            <MainNavigator.Screen name="MyListScreen" component={MyListScreen} options={{
                drawer: true,
                drawerCanOpen: true
            }}/>
            <MainNavigator.Screen name="MediaNavigator" component={MediaNavigator} options={{
                drawer: false,
                drawerCanOpen: false
            }}/>
            <MainNavigator.Screen name="SettingsNavigator" component={SettingsNavigator} options={{
                drawer: false,
                drawerCanOpen: false
            }}/>
        </MainNavigator.Navigator>
    );
}