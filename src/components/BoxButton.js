//Imports
import React from "react";
import { Text, Image } from "react-native";

//Components Imports
import TouchableOpacityFix from "./TouchableOpacityFix";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions, { DEFAULT_SIZES } from "cuervo/src/utils/Definitions";
import * as Dimensions from "cuervo/src/utils/Dimensions.js";
import { setStateIfMounted } from "cuervo/src/utils/Functions";

//Code
export default class BoxButton extends React.Component {
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

    setFocused(toggle) {
        setStateIfMounted(this, { focused: toggle });
    }

    renderImageOrIcon() {
        if(this.props.image) {
            return (
                <Image
                    style={{
                        width: Dimensions.vw(DEFAULT_SIZES.NORMAL_SIZE),
                        height: Dimensions.vw(DEFAULT_SIZES.NORMAL_SIZE)
                    }}
                    source={ this.props.image }
                />
            );
        }
        if(this.props.icon) {
            return (
                <this.props.icon.iconLibrary
                    name={ this.props.icon.iconName }
                    size={ Dimensions.vw(DEFAULT_SIZES.NORMAL_SIZE) }
                    color={ this.state.focused ? "white" : "rgba(255, 255, 255, 0.4);" }
                />
            );
        }
    }
    
    render () {
        const { children, style, ...rest } = this.props;
        return (
            <TouchableOpacityFix
                { ...rest }
                style={[
                    style,
                    { borderRadius: 2 },
                    this.state.focused ? ( { backgroundColor: "rgba(70, 130, 180, 0.9);" } ) : ( { backgroundColor: "rgba(120, 120, 120, 0.4);" } )
                ]}
                activeOpacity={ 1.0 }
                onFocus={
                    () => {
                        if(this.props?.onFocus) {
                            this.props.onFocus();
                        }
                        setStateIfMounted(this, { focused: true });
                    }
                }
                onBlur={
                    () => {
                        if(this.props?.onBlur) {
                            this.props.onBlur();
                        }
                        setStateIfMounted(this, { focused: false });
                    }
                }
            >
                { this.renderImageOrIcon() }
                <Text 
                    style={[
                        this.props.children ? { display: "flex" } : { display: "none" },
                        { padding: Definitions.DEFAULT_MARGIN },
                        this.props.textStyle ? this.props.textStyle : Styles.normalText,
                        this.state.focused ? ( { color: "white" } ) : ( { color: "rgba(255, 255, 255, 0.4);" } )
                    ]}>{ children }</Text>
            </TouchableOpacityFix>
        );
    }
}