//Imports
import React from "react";
import { View } from "react-native";

//Other Imports
import Definitions, { DEFAULT_SIZES } from "app/src/utils/Definitions";
import * as Dimensions from "app/src/utils/Dimensions.js";

//Code
export default class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.bgColor = this.props.bgColor || "white";
        this.color = this.props.color || Definitions.SECONDARY_COLOR
        this.state = {
            progress: this.props.progress || 0
        };
        if(this.state.progress > 100) this.state.progress = 100;
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
    
    componentDidUpdate(prevProps) {
        if(prevProps.progress != this.props.progress) {
            this.state.progress = this.props.progress;
            if(this.state.progress > 100) this.state.progress = 100;
        }
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