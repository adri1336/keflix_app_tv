//Imports
import React from "react";
import { SafeAreaView, View } from "react-native";
import { TabRouter, useNavigationBuilder, createNavigatorFactory } from "@react-navigation/native";

//Components Imports
import TVDrawer from "cuervo/src/components/TVDrawer";

//Code
function TVDrawerNavigator({ initialRouteName, children, appContext, tabs, ...rest }) {
    const { state, navigation, descriptors } = useNavigationBuilder(TabRouter, {
        initialRouteName,
        children
    });
    
    const
        { routes, index } = state,
        descriptor = descriptors[routes[index].key],
        currentRouteName = descriptor.options.currentRoute || routes[index].name,
        currentOptions = descriptor.options;
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                { descriptor.render() }
            </View>
            <TVDrawer
                appContext={ appContext }
                navigation={ navigation }
                currentRouteName={ currentRouteName }
                currentOptions={ currentOptions }
                tabs={ tabs }
            />
        </SafeAreaView>
    );
}

const createTVDrawerNavigator = createNavigatorFactory(TVDrawerNavigator);
export { createTVDrawerNavigator };