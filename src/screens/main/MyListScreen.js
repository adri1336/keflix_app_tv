//Imports
import React from "react";
import { View, ActivityIndicator, FlatList, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import HeaderMedia from "app/src/components/HeaderMedia";
import NormalButton from "app/src/components/NormalButton";
import CoverButton from "app/src/components/CoverButton";

//Styles Imports
import Styles from "app/src/utils/Styles";

//Other Imports
import Definitions from "app/src/utils/Definitions";
import { SCREEN_MARGIN_LEFT } from "app/src/components/TVDrawer";
import { AppContext } from "app/src/AppContext";
import * as ProfileMovie from "app/src/api/ProfileMovie";
import { setStateIfMounted } from "app/src/utils/Functions";
import { COVER_ITEM_VALUES } from "app/src/components/LibraryList";
import * as Movie from "app/src/api/Movie";
import { enableAllButtons, disableAllButtons } from "app/src/components/TouchableOpacityFix";

//Vars
const
    NUM_COLUMNS = 7,
    FOCUS_DELAY_TIME = 1000;

//Code
export default class MyListScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.firstFocus = true;
        this.currentDrawerCanOpen = true;
        this.currentIndex = 0;
        this.delayOnFocusTimeout = null;
        this.coversButtons = [];
        this.state = {
            loading: true,
            covers: null
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.getCovers();

        this.onFocusEvent = this.props.navigation.addListener("focus", () => {
            this.props.navigation.dangerouslyGetParent().setOptions({ drawer: true, drawerCanOpen: this.drawerCanOpen(this.currentIndex) });

            if(this.state.covers && this.coversButtons.length > 0 && this.state.covers[this.currentIndex] && !this.state.covers[this.currentIndex].profileInfo.fav) {
                let covers = [];
                for (let index = 0; index < this.state.covers.length; index++) {
                    const cover = this.state.covers[index];
                    if(!cover.invalid) {
                        covers.push(cover);
                    }
                }

                covers.splice(this.currentIndex, 1);
                setStateIfMounted(this, { covers: covers }, () => {
                    let newFocus = null;
                    if(covers.length > 0) {
                        let newFocusIndex = this.currentIndex - 1;
                        if(newFocusIndex < 0) newFocusIndex = 0;
                        
                        this.currentIndex = newFocusIndex;
                        newFocus = this.coversButtons[newFocusIndex];
                    }
                    enableAllButtons(newFocus);
                });
            }
            else {
                enableAllButtons();
            }
        });
        this.onDrawerOpenedEvent = this.props.navigation.dangerouslyGetParent().addListener("onDrawerOpened", () => {
            this.isDrawerOpened = true;
            if(this.headerMedia) {
                this.headerMedia.pauseVideo();
            }
        });
        this.onDrawerClosedEvent = this.props.navigation.dangerouslyGetParent().addListener("onDrawerClosed", () => {
            this.isDrawerOpened = false;
            if(this.headerMedia) {
                this.headerMedia.playVideo();
            }
        });
    }
    
    componentWillUnmount() {
        this._isMounted = false;
        this.clearTimers();
        this.onFocusEvent();
        this.onDrawerOpenedEvent();
        this.onDrawerClosedEvent();
    }

    clearTimers() {
        if(this.delayOnFocusTimeout) {
            clearTimeout(this.delayOnFocusTimeout);
            this.delayOnFocusTimeout = null;
        }
    }

    shouldComponentUpdate() {
        if(!this._isMounted) {
            return false;
        }
        return true;
    }

    async getCovers() {
        const covers = await ProfileMovie.favs(this.context, this.context.state.profile.id);
        if(covers) {
            setStateIfMounted(this, { loading: false, covers: covers });
        }
        else {
            setStateIfMounted(this, { loading: false });
        }
    }

    drawerCanOpen(index) {
        if(index % NUM_COLUMNS == 0) return true;
        return false;
    }

    setHeaderInfo(cover) {
        const { title, release_date, runtime, vote_average, overview, profileInfo } = cover;

        let progress = null;
        if(profileInfo) {
            progress = {
                completed: profileInfo.completed,
                current_time: profileInfo.current_time,
                total_time: runtime * 60000 //min to ms
            }
        }

        this.headerMedia.setInfo({
            title: {
                text: title,
                image: cover.mediaInfo.logo ? Movie.getLogo(this.context, cover.id) : null
            },
            info: {
                releaseDate: release_date.substr(0, 4),
                runtime: runtime,
                vote_average: vote_average,
            },
            description: overview,
            backdrop: {
                image: cover.mediaInfo.backdrop ? Movie.getBackdrop(this.context, cover.id) : null,
                video: (this.props.navigation.isFocused() && cover.mediaInfo.trailer && !this.isDrawerOpened) ? Movie.getTrailer(this.context, cover.id) : null
            },
            progress: progress
        });
    }

    formatData(data, numColumns) {
        const numberOfFullRows = Math.floor(data.length / numColumns);
        var numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
        while(numberOfElementsLastRow != numColumns) {
            data.push({ invalid: true });
            numberOfElementsLastRow ++;
        }
        return data;
    }

    setDrawerCanOpen(toggle) {
        if(this.currentDrawerCanOpen != toggle) {
            this.currentDrawerCanOpen = toggle;
            this.props.navigation.dangerouslyGetParent().setOptions({ drawer: true, drawerCanOpen: this.currentDrawerCanOpen });            
        }
    }

    render() {
        if(this.state.loading) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Definitions.PRIMARY_COLOR
                    }}
                >
                    <ActivityIndicator size="large" color={ Definitions.SECONDARY_COLOR }/>
                </View>
            );
        }

        if(!this.state.covers || this.state.covers.length <= 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Definitions.PRIMARY_COLOR
                    }}
                >
                    <NormalButton
                        hasTVPreferredFocus={ true }
                        textStyle={[ Styles.bigText ]}
                    >
                        { i18n.t("main.my_list.no_data_title") }
                    </NormalButton>
                </View>
            );
        }

        return (
            <View
                style={{
                    flex: 1,
                    padding: Definitions.DEFAULT_MARGIN,
                    paddingLeft: SCREEN_MARGIN_LEFT,
                    paddingBottom: 0,
                    backgroundColor: Definitions.PRIMARY_COLOR
                }}
            >
                <HeaderMedia ref={ component => this.headerMedia = component }/>
                <View
                    style={{
                        flex: 1,
                        marginTop: 20
                    }}
                >
                    <Text
                        style={[
                            Styles.normalText,
                            {
                                fontWeight: "bold",
                                marginBottom: Definitions.DEFAULT_MARGIN / 2,
                            }
                        ]}
                    >
                        { i18n.t("main.my_list.title") }
                    </Text>
                    <FlatList
                        data={ this.formatData(this.state.covers, NUM_COLUMNS) }
                        numColumns={ NUM_COLUMNS }
                        keyExtractor={ (item, index) => String(index) }
                        renderItem={
                            ({ item, index }) => {
                                if(item.invalid) {
                                    return <View style={{ flex: 1, height: COVER_ITEM_VALUES.HEIGHT, margin: 4 }}/>;
                                }
                                return (
                                    <CoverButton
                                        touchableFixRef={ component => this.coversButtons[index] = component }
                                        hasTVPreferredFocus={ this.firstFocus && index == 0 ? true : false }
                                        style={{ flex: 1, height: COVER_ITEM_VALUES.HEIGHT, margin: 2 }}
                                        poster={ item.mediaInfo.poster ? Movie.getPoster(this.context, item.id) : null }
                                        onFocus={
                                            () => {
                                                this.clearTimers();
                                                if(this.headerMedia) {
                                                    this.headerMedia.stopVideo();
                                                    this.headerMedia.fadeBack(true);
                                                }

                                                this.currentIndex = index;
                                                const drawerCanOpen = this.drawerCanOpen(this.currentIndex);
                                                if(!drawerCanOpen) {
                                                    this.setDrawerCanOpen(false);
                                                }
                                                
                                                this.delayOnFocusTimeout = setTimeout(() => {
                                                    if(drawerCanOpen) {
                                                        this.setDrawerCanOpen(true);
                                                    }

                                                    this.delayOnFocusTimeout = null;
                                                    this.setHeaderInfo(item);
                                                }, FOCUS_DELAY_TIME);
                                            }
                                        }
                                        onPress={
                                            () => {
                                                disableAllButtons();
                                                this.firstFocus = null;
                                                this.props.navigation.dangerouslyGetParent().setOptions({ drawer: false, drawerCanOpen: false });
                                                if(this.headerMedia) {
                                                    this.headerMedia.stopVideo();
                                                }
                                                this.props.navigation.navigate("PlayScreen", { media: item });
                                            }
                                        }
                                    />
                                );
                            }
                        }
                    />
                </View>
            </View>
        );
    }
}