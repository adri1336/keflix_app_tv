//Imports
import React from "react";
import { SafeAreaView, View } from "react-native";
import { StackRouter, useNavigationBuilder, createNavigatorFactory } from "@react-navigation/native";
import { StackView } from "@react-navigation/stack";

//Components Imports
import TVDrawer from "cuervo/src/components/TVDrawer";

//Code
function TVDrawerNavigator({ initialRouteName, children, appContext, tabs, ...rest }) {
    const { state, navigation, descriptors } = useNavigationBuilder(StackRouter, {
        initialRouteName,
        children
    });
    
    const
        { routes, index } = state,
        currentRouteName = routes[index].name,
        currentOptions = descriptors[routes[index].key].options;
        
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StackView
                style={{ flex: 1 }}
                state={ state }
                navigation={ navigation }
                descriptors={ descriptors }
                { ...rest }
            />
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