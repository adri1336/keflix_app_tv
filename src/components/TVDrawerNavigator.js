//Imports
import React from "react";
import { SafeAreaView, View, Text, Dimensions, Animated, Easing } from "react-native";
import { TabRouter, useNavigationBuilder, createNavigatorFactory } from "@react-navigation/native";

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
                case "GO_BACK": {
                    return state;
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
                return { type: "TOGGLE_DRAWER" }
            }
        }
    };
}

function TVDrawerNavigator({ initialRouteName, children, appContext }) {
    const { state, descriptors } = useNavigationBuilder(TVDrawerNavigatorRouter, {
        initialRouteName,
        children
    });

    const { routes, navigation, index } = state;
    const descriptor = descriptors[routes[index].key];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                { descriptor.render() }
            </View>
            <TVDrawer
                appContext={ appContext }
                drawer={ isDrawerOpen(state) }
            />
        </SafeAreaView>
    );
}

const createTVDrawerNavigator = createNavigatorFactory(TVDrawerNavigator);
export { createTVDrawerNavigator };

//TVDrawer class
const drawerValues = {
    DRAWER_OPENED_WIDTH: 300,
    DRAWER_CLOSED_WIDTH: 50
};

class TVDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.profile = this.props.appContext[2];
        this.state = {
            drawerPosX: new Animated.Value(-drawerValues.DRAWER_OPENED_WIDTH + drawerValues.DRAWER_CLOSED_WIDTH)
        };
    }

    componentDidMount() {
        console.log("TVDrawer componentDidMount");
    }

    componentDidUpdate() {
        console.log("TVDrawer componentDidUpdate: ", this.props.drawer);
        this.animateDrawer();
    }

    animateDrawer() {
        Animated.timing(this.state.drawerPosX, {
            toValue: this.props.drawer ? 0 : -drawerValues.DRAWER_OPENED_WIDTH + drawerValues.DRAWER_CLOSED_WIDTH,
            duration: 150,
            useNativeDriver: true,
            easing: Easing.linear
        }).start();
    }

    render() {
        return (
            <Animated.View
                style={[
                    {
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        width: drawerValues.DRAWER_OPENED_WIDTH,
                        height: Dimensions.get("window").height,
                        transform: [{
                            translateX: this.state.drawerPosX
                        }],
                        backgroundColor: "rgba(0, 0, 0, 0.2);"
                    }
                ]}
            >
                <Text style={{ color: "white" }}>TVDrawerNavigator</Text>
            </Animated.View>
        );
    }
}