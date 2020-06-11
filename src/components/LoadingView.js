//Imports
import React from "react";
import { View, ActivityIndicator } from "react-native";

//Other Imports
import Definitions from "app/src/utils/Definitions";

//Code
export default () => {
    return (
        <View style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Definitions.PRIMARY_COLOR
        }}>
            <ActivityIndicator size="large" color={Definitions.SECONDARY_COLOR}/>
        </View>
    );
}