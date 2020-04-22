//Imports
import React from "react";
import { SafeAreaView, View } from "react-native";
import { TabRouter , useNavigationBuilder, createNavigatorFactory } from "@react-navigation/native";

//Components Imports
import TVDrawer from "cuervo/src/components/TVDrawer";

//Code
function isDrawerOpen(state) {
    var _state$history;
    if((_state$history = state.history) === null || _state$history === void 0 ? void 0 : _state$history.find(it => it.type === "drawer")) {
        return true
    }
    return false;
}

function TVDrawerNavigatorRouter(options) {
    const router = TabRouter(options);
    return {
        ...router,
        getStateForAction(state, action, options) {
            switch (action.type) {
                case "GO_BACK":
                case "TOGGLE_DRAWER": {
                    if(isDrawerOpen(state)) {
                        return {
                            ...state,
                            history: []
                        };
                    }
                    else {
                        return {
                            ...state,
                            history: [
                                { type: "drawer" }
                            ]
                        };
                    }
                }
                

                case "OPEN_DRAWER": {
                    if(isDrawerOpen(state)) {
                        return state;
                    }

                    return {
                        ...state,
                        history: [
                            { type: "drawer" }
                        ]
                    };
                }
                case "CLOSE_DRAWER": {
                    if(!isDrawerOpen(state)) {
                        return state;
                    }
                    
                    return {
                        ...state,
                        history: []
                    };
                }
                default: {
                    return router.getStateForAction({
                        ...state,
                        history: []
                    }, action, options);
                }
            }
        },
        actionCreators: {
            ...router.actionCreators,
            openDrawer() {
                return { type: "OPEN_DRAWER" };
            },
            closeDrawer() {
                return { type: "CLOSE_DRAWER" };
            },
            toggleDrawer() {
                return { type: "TOGGLE_DRAWER" };
            }
        }
    };
}

function TVDrawerNavigator({ initialRouteName, children, appContext }) {
    const { state, navigation, descriptors } = useNavigationBuilder(TVDrawerNavigatorRouter, {
        initialRouteName,
        children
    });
    
    const
        { routes, index } = state,
        currentDescriptorKey = routes[index].key,
        descriptor = descriptors[currentDescriptorKey];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                { descriptor.render() }
            </View>
            <TVDrawer
                appContext={ appContext }
                isDrawerOpen={ isDrawerOpen(state) }
                currentDescriptorKey={ currentDescriptorKey }
                descriptors={ descriptors }
                routes={ routes }
                navigation={ navigation }
            />
        </SafeAreaView>
    );
}

const createTVDrawerNavigator = createNavigatorFactory(TVDrawerNavigator);
export { createTVDrawerNavigator };