//Imports
import React from "react";
import { View, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import Keyboard from "cuervo/src/components/Keyboard";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
export default () => {
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
                    
                    <View style={{
                        flex: 25,
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        marginBottom: Definitions.DEFAULT_MARGIN
                    }}>
                        <Text style={ Styles.titleText }>Registrarse</Text>
                    </View>
                    <View style={{
                        flex: 50,
                        flexDirection: "row"
                    }}>
                        <View style={{
                            flex: 45,
                            flexDirection: "column"
                        }}>
                            <Keyboard/>
                        </View>
                        <View style={{
                            flex: 55,
                            flexDirection: "column",
                            marginLeft: Definitions.DEFAULT_MARGIN
                        }}>
                            <Text style={ Styles.normalText }>COL2, Fields</Text>
                        </View>
                    </View>
                    <View style={{ flex: 25 }}/>

                </View>
            </View>
            <View style={{ flex: 10 }}/>
        </View>
    );
}