//Imports
import React from "react";
import { SafeAreaView, View, Text, Animated, Easing, TVEventHandler } from "react-native";
import { TabRouter, useNavigationBuilder, createNavigatorFactory } from "@react-navigation/native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";

//Components Imports
import NormalButton from "cuervo/src/components/NormalButton";
import { enableAllButtons, disableAllButtons } from "cuervo/src/components/TouchableOpacityFix";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions, { DEFAULT_SIZES } from "cuervo/src/utils/Definitions";
import * as Dimensions from "cuervo/src/utils/Dimensions.js";

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
            <View 
                accessible={false}
                pointerEvents="box-none"
                focusable={false}
                disabled
                style={{ flex: 1 }}>
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
const DRAWER_VALUES = {
    DRAWER_OPENED_WIDTH: Dimensions.vw(30.0),
    DRAWER_CLOSED_WIDTH: 50,
    DRAWER_ANIMATION_TIME: 200
};

class TVDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.profile = this.props.appContext.profile;
        this.state = {
            drawerOpacity: new Animated.Value(0),
            drawerIconsPosX: new Animated.Value(0),
            drawerPosX: new Animated.Value((-DRAWER_VALUES.DRAWER_OPENED_WIDTH + DRAWER_VALUES.DRAWER_CLOSED_WIDTH))
        };
    }

    componentDidMount() {
        console.log("TVDrawer componentDidMount");
    }

    componentDidUpdate(prevProps) {
        if(this.props.drawer != prevProps.drawer) {
            console.log("TVDrawer componentDidUpdate: ", this.props.drawer);
            if(this.props.drawer) {
                disableAllButtons();
            }
            else {
                enableAllButtons();
            }
            this.animateDrawer();
        }
    }

    animateDrawer() {
        Animated.timing(this.state.drawerOpacity, {
            toValue: this.props.drawer ? 1.0 : 0.0,
            duration: DRAWER_VALUES.DRAWER_ANIMATION_TIME,
            useNativeDriver: true
        }).start();

        Animated.timing(this.state.drawerPosX, {
            toValue: this.props.drawer ? 0 : (-DRAWER_VALUES.DRAWER_OPENED_WIDTH + DRAWER_VALUES.DRAWER_CLOSED_WIDTH),
            duration: DRAWER_VALUES.DRAWER_ANIMATION_TIME,
            useNativeDriver: true,
            easing: Easing.linear
        }).start();

        Animated.timing(this.state.drawerIconsPosX, {
            toValue: this.props.drawer ? 10 : 0,
            duration: DRAWER_VALUES.DRAWER_ANIMATION_TIME,
            useNativeDriver: true,
            easing: Easing.linear
        }).start();
    }

    renderScreenIcons() {
        const descriptorsArray = Object.entries(this.props.descriptors);
        return (
            <Animated.View
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    transform: [{
                        translateX: this.state.drawerIconsPosX
                    }]
                }}
            >
                <View style={{ flex: 1 }}/>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center"
                    }}
                >
                    {
                        descriptorsArray.map((descriptorEntry, index) => {
                            const descriptor = descriptorEntry[1];
                            return (
                                <View
                                    key={ index }
                                    style={{
                                        height: 20,
                                        margin: Definitions.DEFAULT_MARGIN,
                                        marginLeft: 20,
                                        justifyContent: "center"
                                    }}
                                >
                                    <descriptor.options.iconLibrary
                                        name={ descriptor.options.iconName }
                                        size={ Dimensions.vw(DEFAULT_SIZES.NORMAL_SIZE) }
                                        color={ Definitions.TEXT_COLOR }
                                    />
                                    {
                                        (() => {
                                            if(descriptorEntry[0] == this.props.descriptorKey) {
                                                return (
                                                    <View
                                                        style={{
                                                            position: "absolute",
                                                            bottom: -1,
                                                            width: Dimensions.vw(DEFAULT_SIZES.NORMAL_SIZE),
                                                            height: 2,
                                                            backgroundColor: Definitions.SECONDARY_COLOR,
                                                        }}
                                                    />
                                                );
                                            }
                                        })()
                                    }
                                </View>
                            );
                        })
                    }
                </View>
                <View style={{ flex: 1 }}/>
            </Animated.View>
        );
    }

    renderDrawer() {
        const descriptorsArray = Object.entries(this.props.descriptors);
        return (
            <Animated.View
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: DRAWER_VALUES.DRAWER_OPENED_WIDTH,
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
                    pointerEvents="none"
                    removeClippedSubviews={true}
                    style={{
                        flex: 1,
                        justifyContent: "center"
                    }}
                >
                    {
                        descriptorsArray.map((descriptorEntry, index) => {
                            const descriptor = descriptorEntry[1];
                            return (
                                <View
                                        
                                accessible={false} pointerEvents='none'
                                    key={ index }
                                    style={{
                                        height: 20,
                                        margin: Definitions.DEFAULT_MARGIN,
                                        marginLeft: 55,
                                        justifyContent: "center"
                                    }}
                                >
                                    <NormalButton
                                        alwaysAccessible={ true }
                                        hasTVPreferredFocus={ this.props.drawer && descriptorEntry[0] == this.props.descriptorKey ? true : false }
                                    >
                                        { descriptor.options.title }
                                    </NormalButton>
                                </View>
                            );
                        })
                    }
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
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }}
                    opacity={ this.state.drawerOpacity }
                >
                    <Svg height="100%" width="100%">
                        <Defs>
                            <LinearGradient 
                                gradientUnits="userSpaceOnUse"
                                id="grad"
                                x1="0" y1="0"
                                x2="0.3" y2="0"
                                x3="1" y3="0"
                            >
                                <Stop offset="0" stopColor="black" stopOpacity="1"/>
                                <Stop offset="1" stopColor="black" stopOpacity="1"/>
                                <Stop offset="1" stopColor="black" stopOpacity="0.4"/>
                            </LinearGradient>
                        </Defs>
                        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)"/>
                    </Svg>
                </Animated.View>
               { this.renderScreenIcons() }
               { this.props.drawer && this.renderDrawer() }
            </View>
        );
    }
}