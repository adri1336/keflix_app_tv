//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import NormalAlert from "app/src/components/NormalAlert";
import LoadingViewModal from "app/src/components/LoadingViewModal";
import AccountPasswordChecker from "app/src/components/AccountPasswordChecker";

//Styles Imports
import Styles from "app/src/utils/Styles";

//Other Imports
import Definitions, { NAVIGATORS } from "app/src/utils/Definitions";
import { AppContext } from "app/src/AppContext";
import * as Profile from "app/src/api/Profile";

//Code
export default class EnterAccountPasswordScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.account = this.props.route.params.account;
        this.profile = this.props.route.params.profile;
    }

    componentDidMount() {
        this._isMounted = true;
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }

    shouldComponentUpdate() {
        if(!this._isMounted) {
            return false;
        }
        return true;
    }

    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: Definitions.PRIMARY_COLOR
            }}>
                <NormalAlert ref={ component => this.alert = component }/>
                <LoadingViewModal ref={ component => this.loadingViewModal = component }/>
                <View style={{ flex: 10 }}/>
                <View style={{ flex: 80 }}>
                    
                    <View style={{
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "center"
                    }}>
                        
                        <View style={{
                            flex: 25,
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            marginBottom: Definitions.DEFAULT_MARGIN
                        }}>
                            <Text style={ Styles.titleText }>{ i18n.t("settings.enter_account_password.account_password_text") }</Text>
                        </View>
                        
                        <AccountPasswordChecker
                            account={ this.account }
                            onBackRequested={ () => this.props.navigation.goBack() }
                            onInvalidPasswordLength={
                                () => {
                                    this.alert.setAlertVisible(true, i18n.t("settings.enter_account_password.error_alert_title"), i18n.t("settings.enter_account_password.invalid_password_length_alert_message"));
                                }
                            }
                            onPasswordCheckStart={ () => this.loadingViewModal.setVisible(true) }
                            onPasswordChecked={
                                async (successful) => {
                                    if(successful) {
                                        if(this.props.route.params.delete_profile) {
                                            if(await Profile.destroy(this.context, this.profile.id)) {
                                                this.context.funcs.profileLogout();
                                            }
                                            else {
                                                this.loadingViewModal.setVisible(false);
                                                this.props.navigation.navigate("GeneralScreen");
                                            }
                                        }
                                        else if(this.props.route.params.update_profile) {
                                            this.loadingViewModal.setVisible(false);
                                            this.props.navigation.navigate("EditProfileScreen", {
                                                account: this.account,
                                                profile: this.profile
                                            });
                                        }
                                    }
                                    else {
                                        this.loadingViewModal.setVisible(false);
                                        this.alert.setAlertVisible(true, i18n.t("settings.enter_account_password.error_alert_title"), i18n.t("settings.enter_account_password.invalid_password_alert_message"));
                                    }
                                }
                            }
                        />

                        <View style={{ flex: 25 }}/>

                    </View>
                </View>
                <View style={{ flex: 10 }}/>
            </View>
        );
    }
}