//Imports
import React from "react";
import { SafeAreaView, View, Text, Animated, Easing } from "react-native";
import { TabRouter, useNavigationBuilder, createNavigatorFactory } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

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
                return { type: "TOGGLE_DRAWER" };
            }
        }
    };
}

function TVDrawerNavigator({ initialRouteName, children, appContext }) {
    const { state, descriptors } = useNavigationBuilder(TVDrawerNavigatorRouter, {
        initialRouteName,
        children
    });

    const
        { routes, index } = state,
        descriptorKey = routes[index].key,
        descriptor = descriptors[descriptorKey];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                { descriptor.render() }
            </View>
            <TVDrawer
                appContext={ appContext }
                drawer={ isDrawerOpen(state) }
                descriptorKey={ descriptorKey }
                descriptors={ descriptors }
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
            drawerOpacity: new Animated.Value(0),
            drawerPosX: new Animated.Value((-drawerValues.DRAWER_OPENED_WIDTH + drawerValues.DRAWER_CLOSED_WIDTH))
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
        Animated.timing(this.state.drawerOpacity, {
            toValue: this.props.drawer ? 1.0 : 0.0,
            duration: 200,
            useNativeDriver: true
        }).start();

        Animated.timing(this.state.drawerPosX, {
            toValue: this.props.drawer ? 0 : (-drawerValues.DRAWER_OPENED_WIDTH + drawerValues.DRAWER_CLOSED_WIDTH),
            duration: 200,
            useNativeDriver: true,
            easing: Easing.linear
        }).start();
    }

    renderDescriptors() {
        //console.log(this.props.descriptors);
        const descriptorsArray = Object.entries(this.props.descriptors);

        return (
            descriptorsArray.map((descriptorEntry, index) => {
                const descriptor = descriptorEntry[1];
                return (
                    <View
                        key={ index }
                        style={{
                            flexDirection: "row",
                            margin: 8
                        }}
                    >
                        <descriptor.options.iconLibrary name={ descriptor.options.iconName } size={ 16 } color="white"/>
                        <Text style={{ color: "white" }}>{ descriptor.options.title }</Text>
                    </View>
                );
            })
        );
    }

    render() {
        return (
            <View
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }}
            >
                <Animated.View 
                    style={{ flex: 1 }}
                    opacity={ this.state.drawerOpacity }
                >
                    <LinearGradient
                        style={{ flex: 1 }}
                        colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.4)"]}
                        start={[0.25, 0]}
                        end={[0.3, 0]}
                    />
                </Animated.View>

                <Animated.View
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        width: drawerValues.DRAWER_OPENED_WIDTH,
                        transform: [{
                            translateX: this.state.drawerPosX
                        }]
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "flex-start"
                        }}
                    >
                        <Text style={{ color: "white" }}>EDITAR PERFIL, CAMBIAR DE PERFIL</Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center"
                        }}
                    >
                        { this.renderDescriptors() }
                    </View>
                    
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "flex-end"
                        }}
                    >
                        <Text style={{ color: "white" }}>CERRAR SESIÓN, SALIR</Text>
                    </View>
                </Animated.View>
            </View>
        );
    }
}