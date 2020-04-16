//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import LoadingViewModal from "cuervo/src/components/LoadingViewModal";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import * as Functions from "cuervo/src/utils/Functions";

//Code
export default class SelectProfileColorScreen extends React.Component {
    constructor(props) {
        super(props);
        this.profile = this.props.route.params;
    }

    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: Definitions.PRIMARY_COLOR
            }}>
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
                            <Text style={ Styles.titleText }>{ i18n.t("profile.select_profile_color.profile_color_text", { name: Functions.capitalizeFirstLetter(this.profile.name) }) }</Text>
                        </View>
                        <View style={{
                            flex: 50,
                            flexDirection: "row"
                        }}>






                        </View>
                        <View style={{ flex: 25 }}/>

                    </View>
                </View>
                <View style={{ flex: 10 }}/>
            </View>
        );
    }
}