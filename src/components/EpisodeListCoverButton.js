//Imports
import React from "react";
import { View, Text, Image } from "react-native";

//Components Imports
import TouchableOpacityFix from "./TouchableOpacityFix";
import { hoursMinutesFormat, setStateIfMounted } from "app/src/utils/Functions";
import { COVER_ITEM_VALUES } from "app/src/components/LibraryList";
import * as Tv from "app/src/api/Tv";
import { AppContext } from "app/src/AppContext";
import Definitions from "app/src/utils/Definitions";
import Styles from "app/src/utils/Styles";

export default class SearchCoverButton extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            focused: this.props.hasTVPreferredFocus ? true : false
        };
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

    renderCoverInfo() {
        let timeInfo = null;
        const { tv } = this.props;
        const tagline = "S" + tv.season + ":E" + tv.episode;
        timeInfo = hoursMinutesFormat(tv.runtime * 60);

        return (
            <View style={{ flexDirection: "row" }}>
                { <Text style={[ Styles.mediumText, { marginRight: Definitions.DEFAULT_MARGIN } ]}>{ tagline }</Text> }
                { timeInfo && <Text style={[ Styles.mediumText, { marginRight: Definitions.DEFAULT_MARGIN } ]}>{ timeInfo }</Text> }
            </View>
        );
    }

    render() {
        const { style, tv, tvId } = this.props;
        return (
            <TouchableOpacityFix
                ref={ this.props.touchableFixRef }
                activeOpacity={ 1 }
                hasTVPreferredFocus={ this.props.hasTVPreferredFocus || false }
                deactivable={ true }
                onFocus={
                    () => {
                        if(this.props.onFocus) {
                            this.props.onFocus();
                        }
                        if(!this.state.focused) {
                            setStateIfMounted(this, { focused: true });
                        }
                    }
                }
                onBlur={
                    () => {
                        if(this.props.onBlur) {
                            this.props.onBlur();
                        }
                        if(this.state.focused) {
                            setStateIfMounted(this, { focused: false });
                        }
                    }
                }
                onPress={ this.props.onPress }
                style={[
                    style,
                    {
                        flexDirection: "row",
                        height: COVER_ITEM_VALUES.HEIGHT,
                        borderWidth: 2,
                        borderColor: this.state.focused ? "white" : "transparent",
                        padding: 2
                    }
                ]}
            >
                {
                    tv.mediaInfo.backdrop ? 
                        <Image
                            style={{
                                width: COVER_ITEM_VALUES.WIDTH2,
                                backgroundColor: "rgba(128, 128, 128, 0.2)"
                            }}
                            source={{ uri: Tv.getEpisodeBackdrop(this.context, tvId, tv.season, tv.episode) }}
                            resizeMethod="resize"
                        />
                    :
                        <View
                            style={{
                                width: COVER_ITEM_VALUES.WIDTH2,
                                backgroundColor: "rgba(128, 128, 128, 0.2)"
                            }}
                        />
                }
                <View
                    style={{
                        flex: 1,
                        flexDirection: "column",
                        marginLeft: Definitions.DEFAULT_MARGIN
                    }}
                >
                    <Text style={[ Styles.bigText, { fontWeight: "bold" } ]}>{ tv.name }</Text>
                    { this.renderCoverInfo() }
                    <Text
                        numberOfLines={ 7 }
                        style={[
                            Styles.normalText,
                            {
                                marginTop: Definitions.DEFAULT_MARGIN,
                                color: "rgba(255, 255, 255, 0.6)"
                            }
                        ]}
                    >
                        { tv.overview }   
                    </Text>
                </View>
            </TouchableOpacityFix>
        );
    }
}