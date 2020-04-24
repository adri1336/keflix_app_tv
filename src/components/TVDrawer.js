//Imports
import React from "react";
import { View, Text, Animated, Easing, TVEventHandler, BackHandler } from "react-native";
import { Feather } from "@expo/vector-icons";
import i18n from "i18n-js";

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
    DRAWER_CLOSED_ITEMS_MARGIN: 15,
    DRAWER_ITEMS_MARGIN: 40,
    DRAWER_ICON_SIZE: Dimensions.vw(DEFAULT_SIZES.NORMAL_SIZE),
    DRAWER_PROFILE_ICON_SIZE: 30
};

//Code
export default class TVDrawer extends React.Component {
    constructor(props) {
        super(props);
        const activeDescriptor = this.props.descriptors[this.props.currentDescriptorKey];
        this.state = {
            loading: false,
            drawerOpacity: new Animated.Value(0),
            drawerIconsPosX: new Animated.Value(DRAWER_VALUES.DRAWER_CLOSED_ITEMS_MARGIN),
            drawerPosX: new Animated.Value((-DRAWER_VALUES.DRAWER_OPENED_WIDTH + DRAWER_VALUES.DRAWER_CLOSED_WIDTH)),
            drawerCanOpen: activeDescriptor.options.drawerCanOpen
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
                            color={ this.state.drawerCanOpen ? Definitions.TEXT_COLOR : "rgba(255, 255, 255, 0.4);" }
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

    printDescriptorTextButton(route) {
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
                                backgroundColor: this.props.appContext.profile.color
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
                                { this.props.appContext.profile.name.toUpperCase() }
                            </Text>
                            <NormalButton
                                alwaysAccessible={ true }
                                onPress={
                                    () => {
                                        this.setState({ loading: true });
                                        this.props.appContext.appContext.profileLogOut();
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
                        this.props.routes.map((route) => {
                            return this.printDescriptorTextButton(route);
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
                        alwaysAccessible={ true }
                        onPress={
                            () => {
                                this.props.navigation.navigate("SettingsNavigator", {
                                    screen: "GeneralScreen",
                                    params: {
                                        backRouteName: this.props.routes[this.props.currentIndex].name,
                                        account: this.props.appContext.account,
                                        profile: this.props.appContext.profile
                                    }
                                });
                            }
                        }
                    >
                        { i18n.t("main_tv_navigator.settings_button") }
                    </NormalButton>
                    <NormalButton
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