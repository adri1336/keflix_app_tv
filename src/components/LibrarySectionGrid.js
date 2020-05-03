//Imports
import React from "react";
import { View, Text, FlatList, Dimensions, TVEventHandler } from "react-native";
import Styles from "cuervo/src/utils/Styles";
import Definitions from "cuervo/src/utils/Definitions";
import LibraryList, { COVER_ITEM_VALUES } from "cuervo/src/components/LibraryList";

//Vars
const MAX_SECTIONS_IN_SCREEN = 3;

const SCREEN_VALUES = {
    HEIGHT: Dimensions.get("window").height
};

//Code
export default class LibrarySectionGrid extends React.Component {
    constructor(props) {
        super(props);
        
        this.focused = true;
        this.listRefs = [];
        this.firstCoverMarginLeft = this.props.firstCoverMarginLeft;
        this.currentSectionIndex = 0;
        this.state = {
            sections: null
        };
    }

    enableTVEventHandler() {
        if(!this.tvEventHandler) {
            this.tvEventHandler = new TVEventHandler();
            this.tvEventHandler.enable(this, (cmp, evt) => {
                if(this.focused && evt && evt.eventKeyAction == 1) {
                    if(evt.eventType == "up") {
                        if(this.currentSectionIndex > 0) {
                            this.scrollToIndex(this.currentSectionIndex - 1);
                        }
                    }
                    else if(evt.eventType == "down") {
                        if(this.currentSectionIndex >= this.state.sections.length - 2) {
                            this.scrollToIndex(0);
                        }
                        else {
                            this.scrollToIndex(this.currentSectionIndex + 1);
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

    componentDidMount() {
        this.enableTVEventHandler();
    }

    componentWillUnmount() {
        this.disableTVEventHandler();
    }

    setFocus(focus, updateCover = true) {
        this.focused = focus;
        if(this.listRefs[this.currentSectionIndex]) {
            this.listRefs[this.currentSectionIndex].setFocus(focus, updateCover);
        }
    }

    getCurrentRowIndex() {
        if(this.listRefs[this.currentSectionIndex]) {
            return this.listRefs[this.currentSectionIndex].currentCoverIndex;
        }
        return 0;
    }

    setSections(sections) {
        sections.push("endMargin");
        this.setState({ sections: sections });
    }

    renderSection(section, index) {
        if(index == this.state.sections.length - 1) {
            return <View style={{ height: SCREEN_VALUES.HEIGHT }}/>;
        }
        else {
            return (
                <LibraryList
                    ref={ component => this.listRefs[index] = component }
                    firstCoverMarginLeft={ this.firstCoverMarginLeft }
                    focused={ index == 0 ? true : false }
                    title={ section.title }
                    covers={ section.covers }
                    sectionIndex={ index }
                    onScrollStarted={ toRowIndex => this.props.onScrollStarted(toRowIndex) }
                    onCoverFocused={ (movie, rowIndex) => this.props.onCoverFocused(movie, rowIndex) }
                    onCoverSelected={ this.props.onCoverSelected }
                />
            );
        }
    }

    scrollToIndex(index) {
        if(this.currentSectionIndex != index) {
            this.listRefs[this.currentSectionIndex].setFocus(false);

            this.currentSectionIndex = index;
            this.flatList.scrollToIndex({ index: this.currentSectionIndex, animated: true });

            this.listRefs[this.currentSectionIndex].setFocus(true);
        }
    }

    render() {
        if(this.state.sections) {
            return (
                <View
                    style={{
                        flex: 1,
                        marginBottom: -Definitions.DEFAULT_MARGIN,
                        marginRight: -Definitions.DEFAULT_MARGIN
                    }}
                >
                    <View
                        style={{
                            position: "absolute",
                            top: 0,
                            marginTop: Definitions.DEFAULT_MARGIN
                        }}
                    >
                        <Text //el mismo que libraryList
                            style={[
                                Styles.normalText,
                                {
                                    fontWeight: "bold",
                                    marginLeft: this.firstCoverMarginLeft,
                                    marginBottom: Definitions.DEFAULT_MARGIN / 2,
                                }
                            ]}
                        />
                        <View
                            style={{
                                width: COVER_ITEM_VALUES.WIDTH,
                                height: COVER_ITEM_VALUES.HEIGHT,
                                borderWidth: COVER_ITEM_VALUES.BORDER,
                                borderColor: "white"
                            }}
                        />
                    </View>
                    <FlatList
                        ref={ component => this.flatList = component }
                        data={ this.state.sections }
                        keyExtractor={ (item, index) => String(index) }
                        renderItem={ ({ item, index }) => this.renderSection(item, index) }
                        initialNumToRender={ MAX_SECTIONS_IN_SCREEN }
                        maxToRenderPerBatch={ MAX_SECTIONS_IN_SCREEN }
                        removeClippedSubviews={ true }
                        showsVerticalScrollIndicator={ false }
                        scrollEnabled={ false }
                        scrollToOverflowEnabled={ false }
                        nestedScrollEnabled={false}
                        style={{
                            marginLeft: -this.firstCoverMarginLeft,
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