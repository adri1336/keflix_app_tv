//Imports
import React from "react";
import { View, Text, Image, Easing, Animated, FlatList, Dimensions, TVEventHandler } from "react-native";
import Styles from "cuervo/src/utils/Styles";
import Definitions from "cuervo/src/utils/Definitions";
import TouchableOpacityFix from "cuervo/src/components/TouchableOpacityFix";

//Vars
const COVER_ITEM_VALUES = {
    WIDTH: 115,
    HEIGHT: 165,
    MARGIN: 4,
    BORDER: 2,
    ANIMATION_DURATION: 200
};

const SCREEN_VALUES = {
    WIDTH: Dimensions.get("window").width
};

const
    TOTAL_COVERS_IN_SCREEN = Math.ceil(SCREEN_VALUES.WIDTH / (COVER_ITEM_VALUES.WIDTH + COVER_ITEM_VALUES.MARGIN)),
    FOCUS_DELAY_TIME = 1000;

//Code
export default class LibraryList extends React.Component {
    constructor(props) {
        super(props);

        this.firstCoverMarginLeft = this.props.firstCoverMarginLeft;
        this.currentCoverIndex = 0;
        this.lastFocusTime = 0;
        this.delayOnFocusTimeout = null;

        this.state = {
            title: null,
            covers: null
        };
    }

    setData(title, covers) {
        this.setState({
            title: title,
            covers: covers
        });
    }

    scrollToIndex(index) {
        this.currentCoverIndex = index;
        //this.flatList.scrollToIndex({ index: index, viewOffset: this.firstCoverMarginLeft, animated: true });
        this.flatList.scrollToOffset({ offset: ((COVER_ITEM_VALUES.WIDTH + COVER_ITEM_VALUES.MARGIN) * (this.currentCoverIndex - 1)), animated: true });
    }

    renderCover(cover, index) {
        if(index == 0) {
            return <View style={{ width: this.firstCoverMarginLeft }}/>;
        }
        else if(index == this.state.covers.length - 1) {
            return <View style={{ width: SCREEN_VALUES.WIDTH }}/>;
        }
        else {
            return (
                <TouchableOpacityFix
                    activeOpacity={ 1 }
                    onFocus={
                        () => {
                            const diff = Date.now() - this.lastFocusTime;
                            if(diff > 200) {
                                if(this.props.onScrollStarted) {
                                    this.props.onScrollStarted();
                                }
                            }
                            this.lastFocusTime = Date.now();

                            if(this.delayOnFocusTimeout) {
                                clearTimeout(this.delayOnFocusTimeout);
                                this.delayOnFocusTimeout = null;
                            }
                            this.delayOnFocusTimeout = setTimeout(() => {
                                if(this.props.onCoverFocused) {
                                    this.props.onCoverFocused(cover);
                                }
                            }, FOCUS_DELAY_TIME);
                            this.scrollToIndex(index);
                        }
                    }
                    hasTVPreferredFocus={ index == 1 && this.props.hasTVPreferredFocus ? true : false }
                    style={{
                        width: COVER_ITEM_VALUES.WIDTH,
                        height: COVER_ITEM_VALUES.HEIGHT,
                        marginRight: COVER_ITEM_VALUES.MARGIN,
                        borderWidth: 2,
                        borderColor: "transparent"
                    }}
                >
                    <Image
                        style={{ flex: 1 }}
                        source={{
                            uri: "https://image.tmdb.org/t/p/original" + cover.poster_path
                        }}
                    />
                </TouchableOpacityFix>
            );
        }
    }

    render() {
        if(this.state.covers) {
            return (
                <View style={{ marginTop: Definitions.DEFAULT_MARGIN }}>
                    <Text style={[ Styles.normalText, { fontWeight: "bold", marginBottom: Definitions.DEFAULT_MARGIN / 2 } ]}>Últimas películas añadidas</Text>
                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            width: COVER_ITEM_VALUES.WIDTH,
                            height: COVER_ITEM_VALUES.HEIGHT,
                            borderWidth: COVER_ITEM_VALUES.BORDER,
                            borderColor: "white"
                        }}
                    />
                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: -this.firstCoverMarginLeft,
                            width: this.firstCoverMarginLeft,
                            height: COVER_ITEM_VALUES.HEIGHT,
                            backgroundColor: Definitions.PRIMARY_COLOR,
                            opacity: 0.8
                        }}
                    />
                    <FlatList
                        ref={ component => this.flatList = component }
                        data={ this.state.covers }
                        keyExtractor={ (item, index) => String(index) }
                        renderItem={ ({ item, index }) => this.renderCover(item, index) }
                        initialNumToRender={ TOTAL_COVERS_IN_SCREEN }
                        maxToRenderPerBatch={ TOTAL_COVERS_IN_SCREEN }
                        removeClippedSubviews={ true }
                        showsHorizontalScrollIndicator={ false }
                        scrollEnabled={ false }
                        horizontal={ true }
                        style={{
                            marginLeft: -this.firstCoverMarginLeft,
                            zIndex: -1
                        }}
                    />
                </View>
            );
        }
        else {
            return <View/>;
        }
    }
}