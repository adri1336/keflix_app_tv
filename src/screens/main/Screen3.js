//Imports
import React from "react";
import { View, Text, BackHandler } from "react-native";

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
    }

    componentDidMount() {
        /*this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.navigate("MainScreen");
            return true;
        });*/
    }

    componentWillUnmount() {
        //this.backHandler.remove();
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
                <Text style={ Styles.titleText }>Screen3</Text>
                <NormalButton>Button</NormalButton>
            </View>
        );
    }
}