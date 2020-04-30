//Imports
import React from "react";
import { View, Text, Animated, Easing, TVEventHandler, BackHandler, findNodeHandle } from "react-native";
import { Feather } from "@expo/vector-icons";
import i18n from "i18n-js";
import { LinearGradient } from "expo-linear-gradient";

//Components Imports
import NormalButton from "cuervo/src/components/NormalButton";
import LoadingView from "cuervo/src/components/LoadingView";
import { enableAllButtons, disableAllButtons } from "cuervo/src/components/TouchableOpacityFix";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions, { DEFAULT_SIZES } from "cuervo/src/utils/Definitions";
import * as Dimensions from "cuervo/src/utils/Dimensions.js";

//Vars
export const DRAWER_VALUES = {
    DRAWER_OPENED_WIDTH: Dimensions.vw(30.0),
    DRAWER_CLOSED_WIDTH: 50,
    DRAWER_ANIMATION_TIME: 100,
    DRAWER_CLOSED_ITEMS_MARGIN: 30,
    DRAWER_ITEMS_MARGIN: 60,
    DRAWER_ICON_SIZE: Dimensions.vw(DEFAULT_SIZES.NORMAL_SIZE),
    DRAWER_PROFILE_ICON_SIZE: 30
};

//Code
export default class TVDrawer extends React.Component {
    constructor(props) {
        super(props);
        const activeDescriptor = this.props.descriptors[this.props.currentDescriptorKey];
        this.screen_buttons = [];
        this.state = {
            loading: false,
            drawerOpacity: new Animated.Value(0),
            drawerIconsPosX: new Animated.Value(DRAWER_VALUES.DRAWER_CLOSED_ITEMS_MARGIN),
            drawerPosX: new Animated.Value((-DRAWER_VALUES.DRAWER_OPENED_WIDTH + DRAWER_VALUES.DRAWER_CLOSED_WIDTH)),
            drawerCanOpen: activeDescriptor.options.drawerCanOpen,
            currentFocusedScreenButton: null
        };
    }

    enableTVEventHandler() {
        if(!this.tvEventHandler) {
            this.tvEventHandler = new TVEventHandler();
            this.tvEventHandler.enable(this, (cmp, evt) => {
                if(evt && evt.eventKeyAction > 0) {
                    if(evt.eventType == "left" && this.state.drawerCanOpen && !this.props.isDrawerOpen) {
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
                
                this.change_profile_button.setNativeProps({
                    nextFocusUp: findNodeHandle(this.change_profile_button),
                    nextFocusDown: findNodeHandle(this.screen_buttons[0]),
                    nextFocusLeft: findNodeHandle(this.change_profile_button),
                    nextFocusRight: findNodeHandle(this.change_profile_button)
                });

                this.screen_buttons.map((screen_button, index) => {
                    var nextFocusUp = null;
                    var nextFocusDown = null;

                    //nextFocusUp 
                    if(index == 0) {
                        nextFocusUp = findNodeHandle(this.change_profile_button);
                    }
                    else {
                        nextFocusUp = findNodeHandle(this.screen_buttons[index - 1]);
                    }

                    //nextFocusDown
                    if(index == this.screen_buttons.length - 1) {
                        nextFocusDown = findNodeHandle(this.settings_button);
                    }
                    else {
                        nextFocusDown = findNodeHandle(this.screen_buttons[index + 1]);
                    }

                    screen_button.setNativeProps({
                        nextFocusUp: nextFocusUp,
                        nextFocusDown: nextFocusDown,
                        nextFocusLeft: findNodeHandle(screen_button),
                        nextFocusRight: findNodeHandle(screen_button)
                    });
                });

                this.settings_button.setNativeProps({
                    nextFocusUp: findNodeHandle(this.screen_buttons[this.screen_buttons.length - 1]),
                    nextFocusDown: findNodeHandle(this.exit_app_button),
                    nextFocusLeft: findNodeHandle(this.settings_button),
                    nextFocusRight: findNodeHandle(this.settings_button)
                });

                this.exit_app_button.setNativeProps({
                    nextFocusUp: findNodeHandle(this.settings_button),
                    nextFocusDown: findNodeHandle(this.exit_app_button),
                    nextFocusLeft: findNodeHandle(this.exit_app_button),
                    nextFocusRight: findNodeHandle(this.exit_app_button)
                });

                disableAllButtons();
            }
            else {
                enableAllButtons();
            }
            this.animateDrawer();
        }
        if(this.props.currentDescriptorKey != prevProps.currentDescriptorKey) {
            const activeDescriptor = this.props.descriptors[this.props.currentDescriptorKey];
            this.setState({ drawerCanOpen: activeDescriptor.options.drawerCanOpen });
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
            toValue: this.props.isDrawerOpen ? DRAWER_VALUES.DRAWER_ITEMS_MARGIN : DRAWER_VALUES.DRAWER_CLOSED_ITEMS_MARGIN,
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
                    backgroundColor: "rgba(0, 0, 0, 0.6);"
                }}
                opacity={ this.state.drawerOpacity }
            >
                <LinearGradient
                    style={{
                        width: Dimensions.vw(50.0),
                        height: "100%"
                    }}
                    colors={ ["black", "transparent"] }
                    start={ [0.3, 0] }
                    end={ [1, 0] }
                />
            </Animated.View>
        );
    }

    printBottomBarIfIsActiveDescriptor(descriptorKey) {
        if(this.props.currentDescriptorKey == descriptorKey) {
            return (
                <View
                    style={{
                        position: "absolute",
                        bottom: -1,
                        width: DRAWER_VALUES.DRAWER_ICON_SIZE,
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

        if(descriptor.options.showScreenInDrawer) {
            if(descriptor.options.icon) {
                return (
                    <View
                        key={ descriptorKey }
                        style={{
                            width: DRAWER_VALUES.DRAWER_ICON_SIZE,
                            height: 20,
                            marginTop: Definitions.DEFAULT_MARGIN,
                            marginBottom: Definitions.DEFAULT_MARGIN,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <descriptor.options.icon.library
                            name={ descriptor.options.icon.name }
                            size={ DRAWER_VALUES.DRAWER_ICON_SIZE }
                            color={
                                this.props.isDrawerOpen ?
                                    (this.state.currentFocusedScreenButton == route.name ? Definitions.TEXT_COLOR : "rgba(255, 255, 255, 0.4);") :
                                    (this.state.drawerCanOpen ? Definitions.TEXT_COLOR : "rgba(255, 255, 255, 0.4);")
                            }
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

    printDescriptorTextButton(route, index) {
        const
            descriptorKey = route.key,
            descriptor = this.props.descriptors[descriptorKey];
        
        if(descriptor.options.showScreenInDrawer) {
            return (
                
                <View
                    key={ descriptorKey }
                    style={{
                        height: 20,
                        margin: Definitions.DEFAULT_MARGIN,
                        marginLeft: DRAWER_VALUES.DRAWER_ITEMS_MARGIN + DRAWER_VALUES.DRAWER_ICON_SIZE + (Definitions.DEFAULT_MARGIN * 2),
                        justifyContent: "center"
                    }}
                >
                    <NormalButton
                        touchableRef={ component => this.screen_buttons[index] = component }
                        alwaysAccessible={ true }
                        hasTVPreferredFocus={ this.props.isDrawerOpen && descriptorKey == this.props.currentDescriptorKey ? true : false }
                        textStyle={ Styles.bigText }
                        onFocus={ () => this.setState({ currentFocusedScreenButton: route.name }) }
                        onPress={ () => this.props.navigation.navigate(route.name) }
                    >
                        { descriptor.options.title }
                    </NormalButton>
                </View>
            );
        }
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
                        justifyContent: "flex-start",
                        margin: Definitions.DEFAULT_MARGIN,
                        marginLeft: DRAWER_VALUES.DRAWER_ITEMS_MARGIN,
                        marginTop: 30
                    }}
                >
                    <View
                        style={{
                            height: DRAWER_VALUES.DRAWER_PROFILE_ICON_SIZE,
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <View
                            style={{
                                borderRadius: 1,
                                borderWidth: 1,
                                width: DRAWER_VALUES.DRAWER_PROFILE_ICON_SIZE,
                                height: DRAWER_VALUES.DRAWER_PROFILE_ICON_SIZE,
                                borderColor: "white",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: this.props.appContext.state.profile.color
                            }}
                        >
                            <Feather name="user" size={ 20 } color="white"/>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "column",
                                marginLeft: Definitions.DEFAULT_MARGIN
                            }}
                        >
                            <Text style={[ Styles.normalText, { fontWeight: "bold" } ]}>
                                { this.props.appContext.state.profile.name.toUpperCase() }
                            </Text>
                            <NormalButton
                                touchableRef={ component => this.change_profile_button = component }
                                alwaysAccessible={ true }
                                onPress={
                                    () => {
                                        this.setState({ loading: true });
                                        this.props.appContext.funcs.profileLogout();
                                    }
                                }
                                onFocus={ () => this.setState({ currentFocusedScreenButton: null }) }
                            >
                                { i18n.t("main_tv_navigator.change_profile_button") }
                            </NormalButton>
                        </View>
                    </View>
                </View>

                <View
                    style={{
                        flex: 1,
                        justifyContent: "center"
                    }}
                >
                    {
                        this.props.routes.map((route, index) => {
                            return this.printDescriptorTextButton(route, index);
                        })
                    }
                </View>
                
                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        margin: Definitions.DEFAULT_MARGIN,
                        marginLeft: DRAWER_VALUES.DRAWER_ITEMS_MARGIN,
                        marginBottom: 30
                    }}
                >
                    <NormalButton
                        touchableRef={ component => this.settings_button = component }
                        alwaysAccessible={ true }
                        onPress={
                            () => {
                                this.props.navigation.navigate("SettingsNavigator", {
                                    screen: "GeneralScreen",
                                    params: {
                                        backRouteName: this.props.routes[this.props.currentIndex].name,
                                        account: this.props.appContext.state.account,
                                        profile: this.props.appContext.state.profile
                                    }
                                });
                            }
                        }
                        onFocus={ () => this.setState({ currentFocusedScreenButton: null }) }
                    >
                        { i18n.t("main_tv_navigator.settings_button") }
                    </NormalButton>
                    <NormalButton
                        touchableRef={ component => this.exit_app_button = component }
                        alwaysAccessible={ true }
                        onPress={
                            () => {
                                BackHandler.exitApp();
                            }
                        }
                    >
                        { i18n.t("main_tv_navigator.exit_app_button") }
                    </NormalButton>
                </View>
            </Animated.View>
        );
    }

    render() {
        if(this.state.loading) {
            return <LoadingView/>;
        }
        
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