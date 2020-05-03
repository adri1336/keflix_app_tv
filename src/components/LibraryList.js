//Imports
import React from "react";
import { View, Text, Image, FlatList, Dimensions, TVEventHandler } from "react-native";
import Styles from "cuervo/src/utils/Styles";
import Definitions from "cuervo/src/utils/Definitions";
import { AppContext } from "cuervo/src/AppContext";
import * as Movie from "cuervo/src/api/Movie";

//Vars
export const COVER_ITEM_VALUES = {
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
    MAX_COVERS_IN_SCREEN = Math.ceil(SCREEN_VALUES.WIDTH / (COVER_ITEM_VALUES.WIDTH + COVER_ITEM_VALUES.MARGIN)),
    FOCUS_DELAY_TIME = 1000;

//Code
export default class LibraryList extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.focused = this.props.focused || false;
        this.currentCoverIndex = 1;
        this.firstCoverMarginLeft = this.props.firstCoverMarginLeft;
        this.sectionIndex = this.props.sectionIndex;
        this.lastFocusTime = 0;
        this.delayOnFocusTimeout = null;
        this.delayFocusTimeout = null;

        const finalCovers = this.getFinalCovers(this.props.covers);
        this.state = {
            title: this.props.title || null,
            covers: finalCovers,
        };
    }

    componentDidMount() {
        this.enableTVEventHandler();
        if(this.focused) {
            this.onCoverFocus(1);
        }
    }

    componentWillUnmount() {
        this.disableTVEventHandler();
    }

    setFocus(focus, updateCover) {
        if(focus) {
            if(this.delayFocusTimeout) {
                clearTimeout(this.delayFocusTimeout);
                this.delayFocusTimeout = null;
            }
            this.delayFocusTimeout = setTimeout(() => {
                this.delayFocusTimeout = null;
                this.focused = focus;
            }, 300);

            if(updateCover) {
                this.onCoverFocus(this.currentCoverIndex);
            }
        }
        else {
            this.focused = focus;
        }
    }

    onCoverFocus(index) {
        const diff = Date.now() - this.lastFocusTime;
        if(diff > 200) {
            if(this.props.onScrollStarted) {
                this.props.onScrollStarted(index);
            }
        }
        this.lastFocusTime = Date.now();

        if(this.delayOnFocusTimeout) {
            clearTimeout(this.delayOnFocusTimeout);
            this.delayOnFocusTimeout = null;
        }
        this.delayOnFocusTimeout = setTimeout(() => {
            if(this.props.onCoverFocused) {
                this.delayOnFocusTimeout = null;
                this.props.onCoverFocused(this.state.covers[this.currentCoverIndex], index);
            }
        }, FOCUS_DELAY_TIME);
        this.scrollToIndex(index);
    }

    enableTVEventHandler() {
        if(!this.tvEventHandler) {
            this.tvEventHandler = new TVEventHandler();
            this.tvEventHandler.enable(this, (cmp, evt) => {
                if(this.focused && evt && evt.eventKeyAction == 1) {
                    if(evt.eventType == "left") {
                        if(this.currentCoverIndex > 1) {
                            this.onCoverFocus(this.currentCoverIndex - 1);
                        }
                    }
                    else if(evt.eventType == "right") {
                        if(this.currentCoverIndex >= this.state.covers.length - 2) {
                            this.onCoverFocus(1);
                        }
                        else {
                            this.onCoverFocus(this.currentCoverIndex + 1);
                        }
                    }
                    else if(evt.eventType == "select") {
                        if(this.props.onCoverSelected && !this.delayFocusTimeout) {
                            this.props.onCoverSelected(this.state.covers[this.currentCoverIndex]);
                        }
                    }
                }
            });
        }
    }

    disableTVEventHandler() {
        if(this.tvEventHandler) {
            this.tvEventHandler.disable();
        }
    }

    getFinalCovers(covers) {
        if(covers) {
            let finalCovers = covers;
            finalCovers.unshift({ id: "startMargin" });
            finalCovers.push({ id: "endMargin" });
            return finalCovers;
        }
        return null;
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
                <View
                    hasTVPreferredFocus={ index == 1 && this.props.hasTVPreferredFocus ? true : false }
                    style={{
                        width: COVER_ITEM_VALUES.WIDTH,
                        height: COVER_ITEM_VALUES.HEIGHT,
                        marginRight: COVER_ITEM_VALUES.MARGIN,
                        borderWidth: 2,
                        borderColor: "transparent"
                    }}
                >
                    {
                        cover.mediaInfo.poster ? 
                            <Image
                                style={{ flex: 1, backgroundColor: "rgba(128, 128, 128, 0.2)" }}
                                source={{ uri: Movie.getPoster(this.context, cover.id) }}
                            />
                        :
                            <View style={{ flex: 1, backgroundColor: "rgba(128, 128, 128, 0.2)" }}/>
                    }
                </View>
            );
        }
    }

    render() {
        if(this.state.covers) {
            return (
                <View style={{ marginTop: Definitions.DEFAULT_MARGIN }}>
                    <Text
                        style={[
                            Styles.normalText,
                            {
                                fontWeight: "bold",
                                marginLeft: this.firstCoverMarginLeft,
                                marginBottom: Definitions.DEFAULT_MARGIN / 2,
                            }
                        ]}
                    >
                        { this.state.title }
                    </Text>
                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
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
                        initialNumToRender={ MAX_COVERS_IN_SCREEN }
                        maxToRenderPerBatch={ MAX_COVERS_IN_SCREEN }
                        removeClippedSubviews={ true }
                        showsHorizontalScrollIndicator={ false }
                        scrollEnabled={ false }
                        horizontal={ true }
                        style={{ zIndex: -1 }}
                    />
                </View>
            );
        }
        else {
            return <View/>;
        }
    }
}