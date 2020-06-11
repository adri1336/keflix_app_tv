//Imports
import React from "react";
import { View, Text, BackHandler, Alert } from "react-native";
import { Entypo } from "@expo/vector-icons";
import i18n from "i18n-js";
import { version } from "app/app.json";

//Components Imports
import LoadingView from "app/src/components/LoadingView";
import NormalButton from "app/src/components/NormalButton";

//Styles Imports
import Styles from "app/src/utils/Styles";

//Other Imports
import Definitions from "app/src/utils/Definitions";
import { AppContext } from "app/src/AppContext";
import { setStateIfMounted } from "app/src/utils/Functions";

//Code
export default class GeneralScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.account = this.props.route.params.account;
        this.profile = this.props.route.params.profile;
        this.state = {
            loading: false
        };
    }
    
    componentDidMount() {
        this._isMounted = true;
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            if(this.props.navigation.isFocused()) {
                if(this.props.route.params.backNavigator) {
                    this.props.navigation.navigate(this.props.route.params.backNavigator, { screen: this.props.route.params.backRouteName });
                }
                else {
                    this.props.navigation.navigate(this.props.route.params.backRouteName);
                }
                return true;
            }
            return false;
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.backHandler.remove();
    }

    shouldComponentUpdate() {
        if(!this._isMounted) {
            return false;
        }
        return true;
    }

    render() {
        if(this.state.loading) {
            return <LoadingView/>;
        }

        return (
            <View style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: Definitions.PRIMARY_COLOR
            }}>
                <View style={{ flex: 10 }}/>
                <View style={{ flex: 80 }}>
                    
                    <View style={{
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "center"
                    }}>
                        
                        <View style={{ flex: 20 }}/>
                        <View style={{
                            flex: 60,
                            flexDirection: "row"
                        }}>
                            <View style={{
                                flex: 1,
                                flexDirection: "column"
                            }}>
                                <NormalButton
                                    style={{ marginBottom: 40 }}
                                    hasTVPreferredFocus={ true }
                                    textStyle={ Styles.bigText }
                                    icon={{
                                        library: Entypo,
                                        name: "back"
                                    }}
                                    onPress={
                                        () => {
                                            if(this.props.route.params.backNavigator) {
                                                this.props.navigation.navigate(this.props.route.params.backNavigator, { screen: this.props.route.params.backRouteName });
                                            }
                                            else {
                                                this.props.navigation.navigate(this.props.route.params.backRouteName);
                                            }
                                        }
                                    }
                                >
                                    { i18n.t("settings.general.back_button") }
                                </NormalButton>

                                <NormalButton
                                    onPress={
                                        () => {
                                            this.props.navigation.navigate("EnterAccountPasswordScreen", {
                                                update_profile: true,
                                                account: this.account,
                                                profile: this.profile
                                            });
                                        }
                                    }
                                >
                                    { i18n.t("settings.general.edit_profile_button") }
                                </NormalButton>
                                <NormalButton
                                    style={{ marginBottom: 20 }}
                                    onPress={
                                        () => {
                                            Alert.alert(
                                                i18n.t("settings.general.delete_profile_alert_title"),
                                                i18n.t("settings.general.delete_profile_alert_message"),
                                                [
                                                    {
                                                        text: i18n.t("settings.general.delete_profile_alert_button_cancel"),
                                                        style: "cancel",
                                                    },
                                                    {
                                                        text: i18n.t("settings.general.delete_profile_alert_button_delete"),
                                                        style: "destructive",
                                                        onPress: () => {
                                                            this.props.navigation.navigate("EnterAccountPasswordScreen", {
                                                                delete_profile: true,
                                                                account: this.account,
                                                                profile: this.profile
                                                            });
                                                        }
                                                    }
                                                ],
                                                { cancelable: true }
                                            );
                                        }
                                    }
                                >
                                    { i18n.t("settings.general.delete_profile_button") }
                                </NormalButton>

                                <NormalButton
                                    onPress={
                                        () => {
                                            if(this.context) {
                                                setStateIfMounted(this, { loading: true });
                                                this.context.funcs.profileLogout();
                                            }
                                        }
                                    }
                                >
                                    { i18n.t("settings.general.change_profile_button") }
                                </NormalButton>
                                <NormalButton
                                    style={{ marginBottom: 20 }}
                                    onPress={
                                        () => {
                                            if(this.context) {
                                                setStateIfMounted(this, { loading: true });
                                                this.context.funcs.logout();
                                            }
                                        }
                                    }
                                >
                                    { i18n.t("settings.general.logout_button") }
                                </NormalButton>

                                <NormalButton
                                    onPress={ () => BackHandler.exitApp() }
                                >
                                    { i18n.t("settings.general.exit_app_button") }
                                </NormalButton>
                            </View>

                            <View style={{
                                flex: 1,
                                flexDirection: "column"
                            }}>
                                <View style={{ marginBottom: 30 }}>
                                    <Text style={[ Styles.bigText, { fontWeight: "bold" } ]}>
                                        { i18n.t("settings.general.account_text") }
                                    </Text>
                                    <Text style={ Styles.normalText }>{ i18n.t("settings.general.id_text", { id: this.account.id }) }</Text>
                                    <Text style={ Styles.normalText }>{ i18n.t("settings.general.email_text", { email: this.account.email }) }</Text>
                                    <Text style={ Styles.normalText }>{ i18n.t("settings.general.registration_date_text", { registration_date: this.account.createdAt }) }</Text>
                                </View>

                                <View style={{ marginBottom: 30 }}>
                                    <Text style={[ Styles.bigText, { fontWeight: "bold" } ]}>
                                        { i18n.t("settings.general.profile_text") }
                                    </Text>
                                    <Text style={ Styles.normalText }>{ i18n.t("settings.general.id_text", { id: this.profile.id }) }</Text>
                                    <Text style={ Styles.normalText }>{ i18n.t("settings.general.name_text", { name: this.profile.name }) }</Text>
                                    <Text style={ Styles.normalText }>{ this.profile.password ? i18n.t("settings.general.profile_has_password_yes") : i18n.t("settings.general.profile_has_password_no") }</Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={ Styles.normalText }>{ i18n.t("settings.general.color_text") }</Text>
                                        <Text style={[ Styles.normalText, { color: this.profile.color } ]}> { this.profile.color }</Text>
                                    </View>
                                    <Text style={ Styles.normalText }>{ this.profile.adult_content ? i18n.t("settings.general.profile_adult_content_yes") : i18n.t("settings.general.profile_adult_content_no") }</Text>
                                    <Text style={ Styles.normalText }>{ i18n.t("settings.general.registration_date_text", { registration_date: this.profile.createdAt }) }</Text>
                                </View>

                                <View>
                                    <Text style={[ Styles.bigText, { fontWeight: "bold" } ]}>
                                        { i18n.t("settings.general.app_text") }
                                    </Text>
                                    <Text style={ Styles.normalText }>{ i18n.t("settings.general.version_text", { version: version }) }</Text>
                                    <Text style={ Styles.normalText }>{ i18n.t("settings.general.web_text", { web: Definitions.APPLICATION_WEBPAGE }) }</Text>
                                </View>
                            </View>

                        </View>
                        <View style={{ flex: 20 }}/>

                    </View>
                </View>
                <View style={{ flex: 10 }}/>
            </View>
        );
    }
}