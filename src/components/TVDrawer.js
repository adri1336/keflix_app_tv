//Imports
import React from "react";
import { View, Text, Animated, Easing, TVEventHandler } from "react-native";

//Components Imports
import NormalButton from "cuervo/src/components/NormalButton";
import { enableAllButtons, disableAllButtons } from "cuervo/src/components/TouchableOpacityFix";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions, { DEFAULT_SIZES } from "cuervo/src/utils/Definitions";
import * as Dimensions from "cuervo/src/utils/Dimensions.js";

//Vars
const DRAWER_VALUES = {
    DRAWER_OPENED_WIDTH: Dimensions.vw(30.0),
    DRAWER_CLOSED_WIDTH: 50,
    DRAWER_ANIMATION_TIME: 200
};

//Code
export default class TVDrawer extends React.Component {
    constructor(props) {
        super(props);
        const activeDescriptor = this.props.descriptors[this.props.currentDescriptorKey];
        this.state = {
            drawerOpacity: new Animated.Value(0),
            drawerIconsPosX: new Animated.Value(0),
            drawerPosX: new Animated.Value((-DRAWER_VALUES.DRAWER_OPENED_WIDTH + DRAWER_VALUES.DRAWER_CLOSED_WIDTH)),
            drawerEnabled: activeDescriptor.options.drawerEnabled
        };
    }

    enableTVEventHandler() {
        if(!this.tvEventHandler) {
            this.tvEventHandler = new TVEventHandler();
            this.tvEventHandler.enable(this, (cmp, evt) => {
                if(evt && evt.eventKeyAction > 0) {
                    if(evt.eventType == "left" && this.state.drawerEnabled && !this.props.isDrawerOpen) {
                        this.props.navigation.openDrawer();
                    }
                    else if(evt.eventType == "right" && this.props.isDrawerOpen) {
                        this.props.navigation.closeDrawer();
                    }
                }
            });
        }
    }

    disableTVEventHandler() {
        if(this.tvEventHandler) {
            this.tvEventHandler.disable();
        }
    }

    componentDidMount() {
        this.enableTVEventHandler();
    }

    componentWillUnmount() {
        this.disableTVEventHandler();
    }

    componentDidUpdate(prevProps) {
        if(this.props.isDrawerOpen != prevProps.isDrawerOpen) {
            if(this.props.isDrawerOpen) {
                disableAllButtons();
            }
            else {
                enableAllButtons();
            }
            this.animateDrawer();
        }
        if(this.props.currentDescriptorKey != prevProps.currentDescriptorKey) {
            const activeDescriptor = this.props.descriptors[this.props.currentDescriptorKey];
            this.setState({ drawerEnabled: activeDescriptor.options.drawerEnabled });
        }
    }

    animateDrawer() {
        Animated.timing(this.state.drawerOpacity, {
            toValue: this.props.isDrawerOpen ? 1.0 : 0.0,
            duration: DRAWER_VALUES.DRAWER_ANIMATION_TIME,
            useNativeDriver: true
        }).start();

        Animated.timing(this.state.drawerPosX, {
            toValue: this.props.isDrawerOpen ? 0 : (-DRAWER_VALUES.DRAWER_OPENED_WIDTH + DRAWER_VALUES.DRAWER_CLOSED_WIDTH),
            duration: DRAWER_VALUES.DRAWER_ANIMATION_TIME,
            useNativeDriver: true,
            easing: Easing.linear
        }).start();

        Animated.timing(this.state.drawerIconsPosX, {
            toValue: this.props.isDrawerOpen ? 10 : 0,
            duration: DRAWER_VALUES.DRAWER_ANIMATION_TIME,
            useNativeDriver: true,
            easing: Easing.linear
        }).start();
    }

    renderDrawerBackground() {
        return (
            <Animated.View 
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    flex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.8);"
                }}
                opacity={ this.state.drawerOpacity }
            />
        );
    }

    printBottomBarIfIsActiveDescriptor(descriptorKey) {
        if(this.props.currentDescriptorKey == descriptorKey) {
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
    }

    printDescriptorIcon(route) {
        const
            descriptorKey = route.key,
            descriptor = this.props.descriptors[descriptorKey];

        if(descriptor.options.icon) {
            return (
                <View
                    key={ descriptorKey }
                    style={{
                        width: Dimensions.vw(DEFAULT_SIZES.NORMAL_SIZE),
                        height: 20,
                        margin: Definitions.DEFAULT_MARGIN,
                        marginLeft: 20,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <descriptor.options.icon.library
                        name={ descriptor.options.icon.name }
                        size={ Dimensions.vw(DEFAULT_SIZES.NORMAL_SIZE) }
                        color={ this.state.drawerEnabled ? Definitions.TEXT_COLOR : "rgba(255, 255, 255, 0.4);" }
                    />
                    { this.printBottomBarIfIsActiveDescriptor(descriptorKey) }
                </View>
            );
        }
        else {
            return (
                <View
                    key={ descriptorKey }
                    style={{
                        height: 20,
                        margin: Definitions.DEFAULT_MARGIN,
                        marginLeft: 20,
                        justifyContent: "center"
                    }}
                />
            );
        }
    }

    renderScreenIcons() {
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
                        this.props.routes.map((route) => {
                            return this.printDescriptorIcon(route);
                        })
                    }
                </View>
                <View style={{ flex: 1 }}/>
            </Animated.View>
        );
    }

    printDescriptorTextButton(route) {
        const
            descriptorKey = route.key,
            descriptor = this.props.descriptors[descriptorKey];

        return (
            <View
                key={ descriptorKey }
                style={{
                    height: 20,
                    margin: Definitions.DEFAULT_MARGIN,
                    marginLeft: 55,
                    justifyContent: "center"
                }}
            >
                <NormalButton
                    alwaysAccessible={ true }
                    hasTVPreferredFocus={ this.props.isDrawerOpen && descriptorKey == this.props.currentDescriptorKey ? true : false }
                    textStyle={ Styles.bigText }
                    onPress={
                        () => {
                            this.props.navigation.navigate(route.name);
                        }
                    }
                >
                    { descriptor.options.title }
                </NormalButton>
            </View>
        );
    }

    renderDrawer() {
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
                        this.props.routes.map((route) => {
                            return this.printDescriptorTextButton(route);
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
        const drawer = this.props.descriptors[this.props.currentDescriptorKey].options.drawer;
        if(drawer) {
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
                    { this.renderDrawerBackground() }
                    { this.renderScreenIcons() }
                    { this.props.isDrawerOpen && this.renderDrawer() }
                </View>
            );
        }
        else {
            return <View/>;
        }
    }
}