//Imports
import React from "react";
import { View, FlatList, Dimensions } from "react-native";

//Components Imports
import TouchableOpacityFix from "./TouchableOpacityFix";
import { setStateIfMounted } from "app/src/utils/Functions";

//Code
export default class ColorPicker extends React.Component {
    constructor(props) {
        super(props);
        this.flexWidthPercentage = this.props.flexWidthPercentage ? this.props.flexWidthPercentage : 100;
        this.numColumns = 7;
        this.colors = [
            "#50ef00ff",
            "#01c500ff",
            "#01c9e2ff",
            "#01c6fdff",
            "#01a1ffff",
            "#0092ffff",
            "#0151f0ff",
            "#6261edff",
            "#a85afbff",
            "#e86092ff",
            "#e23ba5ff",
            "#d82416ff",
            "#ff3819ff",
            "#ff5f11ff",
            "#ffab12ff",
            "#b68246ff",
            "#b1aa97ff",
            "#69bbd0ff",
            "#7aa1daff",
            "#93a8bdff",
            "#616e77ff"
        ];
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
    
    formatData(data, numColumns) {
        const numberOfFullRows = Math.floor(data.length / numColumns);
        var numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
        while(numberOfElementsLastRow != numColumns) {
            data.push("#00000000");
            numberOfElementsLastRow ++;
        }
        return data;
    }

    render () {
        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <FlatList
                    data={ this.formatData(this.colors, this.numColumns) }
                    numColumns={ this.numColumns }
                    renderItem={ ({ item, index }) => {
                        return (
                            item == "#00000000" ? (
                                <View
                                    style={{
                                        flex: 1,
                                        margin: 2,
                                        height: (Dimensions.get("window").width * (this.flexWidthPercentage / 100.0)) / this.numColumns,
                                    }}
                                />
                            ) : (
                                <ColorPickerButton
                                    hasTVPreferredFocus={ index == 0 ? true : false }
                                    style={[
                                        {
                                            flex: 1,
                                            margin: 2,
                                            height: (Dimensions.get("window").width * (this.flexWidthPercentage / 100.0)) / this.numColumns,
                                            backgroundColor: item
                                        }
                                    ]}
                                    onPress={
                                        () => {
                                            if(this.props?.onPress) {
                                                this.props.onPress(item);
                                            }
                                        }
                                    }
                                />
                            )
                        );
                    }}
                    keyExtractor={ item => item }
                />
            </View>
        );
    }
}

class ColorPickerButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: false
        };
        if(this.props.hasTVPreferredFocus) {
            this.state.focused = true;
        }
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
    
    render() {
        const { style, ...rest } = this.props;
        return (
            <TouchableOpacityFix
                { ...rest }
                activeOpacity={ 1.0 }
                focused={ this.state.focused }
                style={[
                    style,
                    { borderWidth: 2 },
                    this.state.focused ? { borderColor: "white" } : { borderColor: "#00000000" }
                ]}
                onFocus={
                    () => {
                        setStateIfMounted(this, { focused: true });
                    }
                }
                onBlur={
                    () => {
                        setStateIfMounted(this, { focused: false });
                    }
                }
            />
        );
    }
}