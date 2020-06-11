//Imports
import React from "react";
import i18n from "i18n-js";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

//Components Imports
import { createTVDrawerNavigator } from "app/src/components/navigators/TVDrawerNavigator";

//Screen Imports
import SearchNavigator from "./SearchNavigator";
import MoviesNavigator from "./MoviesNavigator";
import MyListNavigator from "./MyListNavigator";
import SettingsNavigator from "./SettingsNavigator";

//Other Imports
import { AppContext } from "app/src/AppContext";

//Vars
const MainNavigator = createTVDrawerNavigator();

//Code
export default () => {
    const appContext = React.useContext(AppContext);

    return (
        <MainNavigator.Navigator 
            headerMode="none"
            initialRouteName="MoviesNavigator"
            tabs={[
                { navigator: "SearchNavigator", route: "SearchScreen", title: i18n.t("main_navigator.search_screen_title"), icon: { library: FontAwesome, name: "search" } },
                { navigator: "MoviesNavigator", route: "MoviesScreen", title: i18n.t("main_navigator.movies_screen_title"), icon: { library: MaterialCommunityIcons, name: "movie" } },
                { navigator: "MyListNavigator", route: "MyListScreen", title: i18n.t("main_navigator.my_list_screen_title"), icon: { library: FontAwesome, name: "plus" } }
            ]}
            appContext={ appContext }
        >
            <MainNavigator.Screen name="SearchNavigator" component={SearchNavigator} options={{
                drawer: true, //activa el drawer en esta pantalla
                drawerCanOpen: true, //permite o no abrir el drawer en la pantalla (mediante el mando)
                currentRoute: "SearchScreen"
            }}/>
            <MainNavigator.Screen name="MoviesNavigator" component={MoviesNavigator} options={{
                drawer: true,
                drawerCanOpen: true,
                currentRoute: "MoviesScreen"
            }}/>
            <MainNavigator.Screen name="MyListNavigator" component={MyListNavigator} options={{
                drawer: true,
                drawerCanOpen: true,
                currentRoute: "MyListScreen"
            }}/>
            <MainNavigator.Screen name="SettingsNavigator" component={SettingsNavigator} options={{
                drawer: false,
                drawerCanOpen: false
            }}/>
        </MainNavigator.Navigator>
    );
}