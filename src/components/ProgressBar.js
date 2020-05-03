//Imports
import React from "react";
import { View } from "react-native";

//Other Imports
import Definitions, { DEFAULT_SIZES } from "cuervo/src/utils/Definitions";
import * as Dimensions from "cuervo/src/utils/Dimensions.js";

//Code
export default class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.bgColor = this.props.bgColor || "white";
        this.color = this.props.color || Definitions.SECONDARY_COLOR
        this.state = {
            progress: this.props.progress || 10
        };
    }

    setProgress(progress) {
        if(progress < 0) progress = 0;
        else if(progress > 100) progress = 100;
        this.setState({ progress: progress });
    }

    render () {
        return (
            <View
                style={[
                    this.props.style,
                    { backgroundColor: this.bgColor }
                ]}
            >
                <View
                    style={{
                        position: "absolute",
                        width: this.state.progress + "%",
                        height: "100%",
                        backgroundColor: this.color
                    }}
                />
            </View>
        );
    }
}