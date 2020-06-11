//Imports
import React from "react";
import { SafeAreaView, View } from "react-native";
import { TabRouter, useNavigationBuilder, createNavigatorFactory } from "@react-navigation/native";

//Components Imports
import TVDrawer from "app/src/components/TVDrawer";

//Code
function TVDrawerNavigator({ initialRouteName, children, appContext, tabs, ...rest }) {
    const { state, navigation, descriptors } = useNavigationBuilder(TabRouter, {
        initialRouteName,
        children
    });
    
    const
        { routes, index } = state,
        descriptor = descriptors[routes[index].key],
        currentOptions = descriptor.options;
    
    let currentNavigator, currentRouteName = null;
    if(descriptor.options.currentRoute) {
        currentNavigator = routes[index].name;
        currentRouteName = descriptor.options.currentRoute;
    }
    else {
        currentNavigator = null;
        currentRouteName = routes[index].name;
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                { descriptor.render() }
            </View>
            <TVDrawer
                appContext={ appContext }
                navigation={ navigation }
                currentNavigator={ currentNavigator }
                currentRouteName={ currentRouteName }
                currentOptions={ currentOptions }
                tabs={ tabs }
            />
        </SafeAreaView>
    );
}

const createTVDrawerNavigator = createNavigatorFactory(TVDrawerNavigator);
export { createTVDrawerNavigator };