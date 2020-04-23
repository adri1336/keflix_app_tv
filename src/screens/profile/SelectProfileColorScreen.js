//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import NormalAlert from "cuervo/src/components/NormalAlert";
import LoadingViewModal from "cuervo/src/components/LoadingViewModal";
import ColorPicker from "cuervo/src/components/ColorPicker";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import * as Functions from "cuervo/src/utils/Functions";
import * as HttpClient from "cuervo/src/utils/HttpClient";

//Code
export default class SelectProfileColorScreen extends React.Component {
    constructor(props) {
        super(props);
        this.account = this.props.route.params.account;
        this.profile = this.props.route.params.profile;
        this.updating = false;
        if(this.profile.id) {
            this.updating = true;
        }
    }

    onColorSelected(color) {
        this.profile.color = color;
        this.loadingViewModal.setVisible(true);
        if(!this.updating) {
            HttpClient.post("http://" + Definitions.SERVER_IP + "/account/" + this.account.id + "/profile", this.profile).then(([response, data, error]) => {
                if(error == null && response.status == 200 && data?.id > 0) {
                    this.props.navigation.navigate("SelectProfileScreen", {
                        profile: data
                    });
                }
                else {
                    this.loadingViewModal.setVisible(false);
                    this.alert.setAlertVisible(true, i18n.t("profile.select_profile_color.error_alert_title"), i18n.t("profile.select_profile_color.create_profile_error_alert_message"));
                }
            });
        }
        else {
            HttpClient.put("http://" + Definitions.SERVER_IP + "/profile/" + this.profile.id, this.profile).then(([response, data, error]) => {
                if(error == null && response.status == 200 && data?.id > 0) {
                    this.props.navigation.navigate("GeneralScreen", {
                        profile: data
                    });
                }
                else {
                    this.loadingViewModal.setVisible(false);
                    this.alert.setAlertVisible(true, i18n.t("profile.select_profile_color.error_alert_title"), i18n.t("profile.select_profile_color.edit_profile_error_alert_message"));
                }
            });
        }
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
                            flex: 20,
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            marginBottom: Definitions.DEFAULT_MARGIN
                        }}>
                            <Text style={ Styles.titleText }>{ i18n.t("profile.select_profile_color.profile_color_text", { name: Functions.capitalizeFirstLetter(this.profile.name) }) }</Text>
                        </View>
                        <View style={{
                            flex: 60
                        }}>
                            <ColorPicker
                                flexWidthPercentage={ 80 }
                                onPress={ (color) => this.onColorSelected(color) }
                            />
                        </View>
                        <View style={{ flex: 20 }}/>

                    </View>
                </View>
                <View style={{ flex: 10 }}/>
            </View>
        );
    }
}