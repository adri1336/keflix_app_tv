//Imports
import React from "react";
import { View, Text } from "react-native";

//Components Imports
import NormalButton from "cuervo/src/components/NormalButton";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { AppContext } from "cuervo/src/AppContext";

//Code
export default class SearchScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._isMounted = true;
    }
    
    componentWillUnmount() {
        this._isMounted = false;
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
                <Text style={ Styles.titleText }>Search Screen</Text>
                <NormalButton hasTVPreferredFocus={ true }>Button</NormalButton>
            </View>
        );
    }
}