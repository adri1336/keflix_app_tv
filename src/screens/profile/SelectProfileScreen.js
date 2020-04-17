//Imports
import React from "react";
import { View, Text, FlatList } from "react-native";
import i18n from "i18n-js";

//Components Imports
import LoadingView from "cuervo/src/components/LoadingView";
import ProfileButtonItem from "cuervo/src/components/ProfileButtonItem";
import NormalButton from "cuervo/src/components/NormalButton";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { AppContext } from "cuervo/src/AppContext";
import * as HttpClient from "cuervo/src/utils/HttpClient";

//Code
export default class SelectProfileScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.account = this.context[1];
        HttpClient.get("http://" + Definitions.SERVER_IP + "/account/" + this.account.id + "/profiles").then(([response, data, error]) => {
            if(error == null && response.status == 200) {
                this.profiles = data;
            }
            this.profiles.push({
                id: 0,
                name: i18n.t("profile.select_profile.create_profile_text"),
                color: "gray"
            });
            this.setState({ loading: false });
        });
    }

    componentDidUpdate() {
        if(this.props.route.params?.profile) {
            this.addProfile(this.props.route.params.profile);
            this.props.route.params.profile = undefined;
        }
    }

    addProfile(profile) {
        this.profiles.unshift(profile);
    }

    onProfilePressed(profile) {
        if(profile.id == 0) {
            this.props.navigation.navigate("CreateProfileScreen", {
                account: this.account
            });
        }
        else {

        }
    }

    renderProfileItem(profileItem) {
        var focus = false;
        if(profileItem.index == 0) {
            focus = true;
        }

        return (
            <ProfileButtonItem
                profile={ profileItem.item }
                focused={ focus }
                hasTVPreferredFocus={ focus }
                onPress={ (profile) => this.onProfilePressed(profile) }
            />
        );
    }

    render() {
        return (
            this.state.loading ? (
                <LoadingView/>
            ) : (
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
                            justifyContent: "center",
                            alignItems: "center"
                        }}>

                            <View style={{
                                flex: 30,
                                justifyContent: "flex-end",
                                alignItems: "center",
                                marginBottom: Definitions.DEFAULT_MARGIN
                            }}>
                                <Text style={ Styles.titleText }>{ i18n.t("profile.select_profile.profile_text") }</Text>
                            </View>

                            <View style={{
                                flex: 40,
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <FlatList
                                    horizontal={ true }
                                    data={ this.profiles }
                                    renderItem={ (item) => this.renderProfileItem(item) }
                                    keyExtractor={ item => item.id.toString() }
                                />
                            </View>

                            <View style={{
                                flex: 30,
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <NormalButton
                                    style={{ flex: 1 }}
                                    onPress={
                                        () => {
                                            this.setState({ loading: true });
                                            this.context[0].logOut();
                                        }
                                    }
                                >{ i18n.t("profile.select_profile.logout_button").toUpperCase() }</NormalButton>
                            </View>

                        </View>
                    </View>
                    <View style={{ flex: 10 }}/>
                </View>
            )
        );
    }
}