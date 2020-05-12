//Imports
import React from "react";
import { View, Text, Image } from "react-native";

//Components Imports
import TouchableOpacityFix from "./TouchableOpacityFix";
import { hoursMinutesFormat, setStateIfMounted } from "cuervo/src/utils/Functions";
import { COVER_ITEM_VALUES } from "cuervo/src/components/LibraryList";
import * as Movie from "cuervo/src/api/Movie";
import { AppContext } from "cuervo/src/AppContext";
import Definitions from "cuervo/src/utils/Definitions";
import Styles from "cuervo/src/utils/Styles";

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
        const { cover } = this.props;
        const releaseDate = cover.release_date.substr(0, 4);
        if(cover.runtime) {
            timeInfo = hoursMinutesFormat(cover.runtime * 60);
        }
        return (
            <View style={{ flexDirection: "row" }}>
                { releaseDate && <Text style={[ Styles.mediumText, { marginRight: Definitions.DEFAULT_MARGIN } ]}>{ releaseDate }</Text> }
                { timeInfo && <Text style={[ Styles.mediumText, { marginRight: Definitions.DEFAULT_MARGIN } ]}>{ timeInfo }</Text> }
                { cover.vote_average && <Text style={[ Styles.mediumText, { marginRight: Definitions.DEFAULT_MARGIN } ]}>{ cover.vote_average + "/10" }</Text> }
            </View>
        );
    }

    render() {
        const { style, cover } = this.props;
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
                    cover.mediaInfo.poster ? 
                        <Image
                            style={{
                                width: COVER_ITEM_VALUES.WIDTH,
                                backgroundColor: "rgba(128, 128, 128, 0.2)"
                            }}
                            source={{ uri: Movie.getPoster(this.context, cover.id) }}
                            resizeMethod="resize"
                        />
                    :
                        <View
                            style={{
                                width: COVER_ITEM_VALUES.WIDTH,
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
                    <Text style={[ Styles.bigText, { fontWeight: "bold" } ]}>{ cover.title }</Text>
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
                        { cover.overview }   
                    </Text>
                </View>
            </TouchableOpacityFix>
        );
    }
}