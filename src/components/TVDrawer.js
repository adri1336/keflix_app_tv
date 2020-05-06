//Imports
import React from "react";
import { View, Text, Animated, Easing, TVEventHandler, BackHandler, findNodeHandle } from "react-native";
import { Feather } from "@expo/vector-icons";
import i18n from "i18n-js";
import { LinearGradient } from "expo-linear-gradient";

//Components Imports
import NormalButton from "cuervo/src/components/NormalButton";
import LoadingView from "cuervo/src/components/LoadingView";

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

export const SCREEN_MARGIN_LEFT = (DRAWER_VALUES.DRAWER_CLOSED_ITEMS_MARGIN * 2) + DRAWER_VALUES.DRAWER_ICON_SIZE;

//Code
export default class TVDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.screen_buttons = [];
        this.state = {
            isDrawerOpen: this.props.currentOptions.isDrawerOpen || false,
            loading: false,
            drawerOpacity: new Animated.Value(0),
            drawerIconsPosX: new Animated.Value(DRAWER_VALUES.DRAWER_CLOSED_ITEMS_MARGIN),
            drawerPosX: new Animated.Value((-DRAWER_VALUES.DRAWER_OPENED_WIDTH + DRAWER_VALUES.DRAWER_CLOSED_WIDTH)),
            drawerCanOpen: this.props.currentOptions.drawerCanOpen || false
        };
    }

    enableTVEventHandler() {
        if(!this.tvEventHandler) {
            this.tvEventHandler = new TVEventHandler();
            this.tvEventHandler.enable(this, (cmp, evt) => {
                if(evt && evt.eventKeyAction > 0) {
                    if(evt.eventType == "left" && this.state.drawerCanOpen && !this.state.isDrawerOpen) {
                        this.setState({ isDrawerOpen: true });
                    }
                    else if(evt.eventType == "right" && this.state.isDrawerOpen) {
                        this.setState({ isDrawerOpen: false });
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
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            if(this.props.currentOptions.drawer) {
                this.setState({ isDrawerOpen: !this.state.isDrawerOpen });
                return true;
            }
            return false;
        });
        this.enableTVEventHandler();
    }

    componentWillUnmount() {
        this.backHandler.remove();
        this.disableTVEventHandler();
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.isDrawerOpen != prevState.isDrawerOpen) {
            if(this.state.isDrawerOpen) {
                if(this.change_profile_button) {
                    this.change_profile_button.setNativeProps({
                        nextFocusUp: findNodeHandle(this.change_profile_button),
                        nextFocusDown: findNodeHandle(this.screen_buttons[0]),
                        nextFocusLeft: findNodeHandle(this.change_profile_button),
                        nextFocusRight: findNodeHandle(this.change_profile_button)
                    });
                }

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

                if(this.settings_button) {
                    this.settings_button.setNativeProps({
                        nextFocusUp: findNodeHandle(this.screen_buttons[this.screen_buttons.length - 1]),
                        nextFocusDown: findNodeHandle(this.exit_app_button),
                        nextFocusLeft: findNodeHandle(this.settings_button),
                        nextFocusRight: findNodeHandle(this.settings_button)
                    });
                }

                if(this.exit_app_button) {
                    this.exit_app_button.setNativeProps({
                        nextFocusUp: findNodeHandle(this.settings_button),
                        nextFocusDown: findNodeHandle(this.exit_app_button),
                        nextFocusLeft: findNodeHandle(this.exit_app_button),
                        nextFocusRight: findNodeHandle(this.exit_app_button)
                    });
                }

                this.props.currentOptions.isDrawerOpen = true;
                this.props.navigation.emit({ type: "onDrawerOpened" });
            }
            else {
                this.props.currentOptions.isDrawerOpen = false;
                this.props.navigation.emit({ type: "onDrawerClosed" });
            }
            this.animateDrawer();
        }

        if(this.props.currentOptions.drawerCanOpen != prevState.drawerCanOpen) {
            this.setState({ drawerCanOpen: this.props.currentOptions.drawerCanOpen });
        }
    }

    animateDrawer() {
        Animated.timing(this.state.drawerOpacity, {
            toValue: this.state.isDrawerOpen ? 1.0 : 0.0,
            duration: DRAWER_VALUES.DRAWER_ANIMATION_TIME,
            useNativeDriver: true
        }).start();

        Animated.timing(this.state.drawerPosX, {
            toValue: this.state.isDrawerOpen ? 0 : (-DRAWER_VALUES.DRAWER_OPENED_WIDTH + DRAWER_VALUES.DRAWER_CLOSED_WIDTH),
            duration: DRAWER_VALUES.DRAWER_ANIMATION_TIME,
            useNativeDriver: true,
            easing: Easing.linear
        }).start();

        Animated.timing(this.state.drawerIconsPosX, {
            toValue: this.state.isDrawerOpen ? DRAWER_VALUES.DRAWER_ITEMS_MARGIN : DRAWER_VALUES.DRAWER_CLOSED_ITEMS_MARGIN,
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

    printBottomBarIfIsActiveDescriptor(routeName) {
        if(this.props.currentRouteName == routeName) {
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

    printDescriptorIcon(tab) {
        const { route, icon } = tab;
        if(icon) {
            return (
                <View
                    key={ route }
                    style={{
                        width: DRAWER_VALUES.DRAWER_ICON_SIZE,
                        height: 20,
                        marginTop: Definitions.DEFAULT_MARGIN,
                        marginBottom: Definitions.DEFAULT_MARGIN,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <icon.library
                        name={ icon.name }
                        size={ DRAWER_VALUES.DRAWER_ICON_SIZE }
                        color={
                            this.state.isDrawerOpen ?
                                Definitions.TEXT_COLOR :
                                (this.state.drawerCanOpen ? Definitions.TEXT_COLOR : "rgba(255, 255, 255, 0.4);")
                        }
                    />
                    { this.printBottomBarIfIsActiveDescriptor(route) }
                </View>
            );
        }
        else {
            return (
                <View
                    key={ route }
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
                        this.props.tabs.map(tab => {
                            return this.printDescriptorIcon(tab);
                        })
                    }
                </View>
                <View style={{ flex: 1 }}/>
            </Animated.View>
        );
    }

    printDescriptorTextButton(tab, index) {
        const { navigator, route, title } = tab;
        return (
            <View
                key={ route }
                style={{
                    height: 20,
                    margin: Definitions.DEFAULT_MARGIN,
                    marginLeft: DRAWER_VALUES.DRAWER_ITEMS_MARGIN + DRAWER_VALUES.DRAWER_ICON_SIZE + (Definitions.DEFAULT_MARGIN * 2),
                    justifyContent: "center"
                }}
            >
                <NormalButton
                    touchableRef={ component => this.screen_buttons[index] = component }
                    hasTVPreferredFocus={ this.state.isDrawerOpen && route == this.props.currentRouteName ? true : false }
                    textStyle={ Styles.bigText }
                    onPress={
                        () => {
                            this.setState({ isDrawerOpen: false }, function() {
                                if(this.props.currentRouteName != route) {
                                    if(navigator) {
                                        this.props.navigation.navigate(navigator, { screen: route });
                                    }
                                    else {
                                        this.props.navigation.navigate(route);
                                    }
                                }
                            });
                        }
                    }
                >
                    { title }
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
                                onPress={
                                    () => {
                                        this.setState({ loading: true });
                                        this.props.appContext.funcs.profileLogout();
                                    }
                                }
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
                        this.props.tabs.map((tab, index) => {
                            return this.printDescriptorTextButton(tab, index);
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
                        onPress={
                            () => {
                                this.setState({ isDrawerOpen: false }, function() {
                                    this.props.navigation.navigate("SettingsNavigator", {
                                        screen: "GeneralScreen",
                                        params: {
                                            backNavigator: this.props.currentNavigator,
                                            backRouteName: this.props.currentRouteName,
                                            account: this.props.appContext.state.account,
                                            profile: this.props.appContext.state.profile
                                        }
                                    });
                                });
                                
                            }
                        }
                    >
                        { i18n.t("main_tv_navigator.settings_button") }
                    </NormalButton>
                    <NormalButton
                        touchableRef={ component => this.exit_app_button = component }
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
        
        const drawer = this.props.currentOptions.drawer;
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
                    { this.state.isDrawerOpen && this.renderDrawer() }
                </View>
            );
        }
        else {
            return <View/>;
        }
    }
}