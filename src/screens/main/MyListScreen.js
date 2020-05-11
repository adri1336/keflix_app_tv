//Imports
import React from "react";
import { View, ActivityIndicator, FlatList, Text } from "react-native";
import i18n from "i18n-js";

//Components Imports
import HeaderMedia from "cuervo/src/components/HeaderMedia";
import NormalButton from "cuervo/src/components/NormalButton";
import CoverButton from "cuervo/src/components/CoverButton";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { SCREEN_MARGIN_LEFT } from "cuervo/src/components/TVDrawer";
import { AppContext } from "cuervo/src/AppContext";
import * as ProfileLibraryMovie from "cuervo/src/api/ProfileLibraryMovie";
import { setStateIfMounted } from "cuervo/src/utils/Functions";
import { COVER_ITEM_VALUES } from "cuervo/src/components/LibraryList";
import * as Movie from "cuervo/src/api/Movie";

//Vars
const
    NUM_COLUMNS = 7,
    FOCUS_DELAY_TIME = 1000;

//Code
export default class MyListScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.currentDrawerCanOpen = true;
        this.currentIndex = 0;
        this.delayOnFocusTimeout = null;
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
            setStateIfMounted(this, { loading: true, covers: null }, () => {
                this.getCovers();
            });
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
        const covers = await ProfileLibraryMovie.favs(this.context, this.context.state.profile.id);
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

        if(!this.state.covers) {
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
                                        hasTVPreferredFocus={ index == this.currentIndex ? true : false }
                                        style={{ flex: 1, height: COVER_ITEM_VALUES.HEIGHT, margin: 2 }}
                                        poster={ item.mediaInfo.poster ? Movie.getPoster(this.context, item.id) : null }
                                        onFocus={
                                            () => {
                                                this.clearTimers();
                                                if(this.headerMedia) {
                                                    this.headerMedia.stopVideo();
                                                    this.headerMedia.fadeBack(true);
                                                }
                                                this.delayOnFocusTimeout = setTimeout(() => {
                                                    this.currentIndex = index;
                                                    const drawerCanOpen = this.drawerCanOpen(this.currentIndex);
                                                    if(this.currentDrawerCanOpen != drawerCanOpen) {
                                                        this.currentDrawerCanOpen = drawerCanOpen;
                                                        if(this.currentDrawerCanOpen) {
                                                            this.props.navigation.dangerouslyGetParent().setOptions({ drawer: true, drawerCanOpen: drawerCanOpen });
                                                        }
                                                        else {
                                                            this.props.navigation.dangerouslyGetParent().setOptions({ drawer: true, drawerCanOpen: drawerCanOpen });
                                                        }
                                                    }
                                                    this.setHeaderInfo(item);
                                                }, FOCUS_DELAY_TIME);
                                            }
                                        }
                                        onPress={
                                            () => {
                                                this.clearTimers();
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