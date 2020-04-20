//Imports
import React from "react";
import { View, Text } from "react-native";

//Components Imports
import NormalButton from "cuervo/src/components/NormalButton";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
export default class MainScreen extends React.Component {
    constructor(props) {
        super(props);
        //console.log("PARAMS: ", this.props.route.params);
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Definitions.PRIMARY_COLOR
                }}
            >
                <Text style={ Styles.titleText }>Screen2</Text>
                <View style={{ height: 20 }}/>
                <NormalButton
                    hasTVPreferredFocus={ true }
                    onPress={
                        () => {
                            this.props.navigation.navigate("MainScreen");
                        }
                    }
                >
                    GO TO MAINSCREEN
                </NormalButton>
            </View>
        );
    }
}