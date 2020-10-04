//Imports
import React from "react";
import { View, Text, FlatList, ActivityIndicator, Dimensions } from "react-native";
import i18n from "i18n-js";

//Components Imports
import SearchCoverButton from "app/src/components/SearchCoverButton";
import BoxTextInput from "app/src/components/BoxTextInput";

//Styles Imports
import Styles from "app/src/utils/Styles";

//Other Imports
import Definitions from "app/src/utils/Definitions";
import { SCREEN_MARGIN_LEFT } from "app/src/components/TVDrawer";
import { AppContext } from "app/src/AppContext";
import { setStateIfMounted, getMediaUris } from "app/src/utils/Functions";
import Keyboard, { KeyboardTypes } from "app/src/components/Keyboard";
import * as ProfileMovie from "app/src/api/ProfileMovie";
import * as ProfileTv from "app/src/api/ProfileTv";
import * as Movie from "app/src/api/Movie";
import * as Tv from "app/src/api/Tv";
import { enableAllButtons, disableAllButtons } from "app/src/components/TouchableOpacityFix";
import { COVER_ITEM_VALUES } from "app/src/components/LibraryList";

//Vars
const
    FETCH_IN_TIME = 3000,
    DRAWER_CAN_OPEN_LETTERS = ["0", "Q", "A", "SHIFT", "SPACE"];

//Code
export default class SearchScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        
        this.currentDrawerCanOpen = true;
        this.canDrawerOpenTimeout = null;
        this.fetchTimeout = null;
        this.lastFetchDate = null;
        this.lastKeyFocused = null;

        this.state = {
            loading: false,
            covers: null            
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.keyboard.setTextInput(this.textInputSearch);

        this.onFocusEvent = this.props.navigation.addListener("focus", () => {
            this.props.navigation.dangerouslyGetParent().setOptions({ drawer: true, drawerCanOpen: this.drawerCanOpen() });
            enableAllButtons();
        });
    }
    
    componentWillUnmount() {
        this._isMounted = false;
        this.clearFetchTimeout();
        this.clearCanDrawerOpenTimeout();
        this.onFocusEvent();
    }

    shouldComponentUpdate() {
        if(!this._isMounted) {
            return false;
        }
        return true;
    }

    clearFetchTimeout() {
        if(this.fetchTimeout) {
            clearTimeout(this.fetchTimeout);
            this.fetchTimeout = null;
        }
    }

    clearCanDrawerOpenTimeout() {
        if(this.canDrawerOpenTimeout) {
            clearTimeout(this.canDrawerOpenTimeout);
            this.canDrawerOpenTimeout = null;
        }
    }

    onTextChanged(text) {
        this.clearFetchTimeout();
        if(text.length <= 0) {
            setStateIfMounted(this, { loading: false, covers: null });
        }
        else {
            if(!this.state.loading) {
                setStateIfMounted(this, { loading: true });
            }

            this.lastFetchDate = Date.now();
            this.fetchTimeout = setTimeout(async (fetchDate = this.lastFetchDate) => {
                this.fetchTimeout = null;
                
                let covers = [];
                const movies = await Movie.discover(this.context, text, "title.ASC");
                const tvs = await Tv.discover(this.context, text, "name.ASC");
                tvs.forEach(tv => {
                    tv.tv = true;
                    tv.tagline = "";
                    tv.episode_tvs.forEach(episode => {
                        episode.tagline = "S" + episode.season + ":E" + episode.episode + ": '" + episode.name + "'";
                    });
                });
                
                covers = [ ...movies, ...tvs ];

                if(this.lastFetchDate == fetchDate) {
                    if(covers.length > 0) {
                        covers.push({ id: "endMargin" });
                    }
                    setStateIfMounted(this, { loading: false, covers: covers });
                }
            }, FETCH_IN_TIME);
        }
    }

    onKeyFocused(letter) {
        const finalLetter = letter.toUpperCase();
        this.lastKeyFocused = finalLetter;
        this.setDrawerCanOpen(this.drawerCanOpen());
    }

    drawerCanOpen() {
        for (let index = 0; index < DRAWER_CAN_OPEN_LETTERS.length; index++) {
            if(this.lastKeyFocused == DRAWER_CAN_OPEN_LETTERS[index]) {
                return true;
            }
        }
        return false;
    }

    onCoverSelected(cover) {
        disableAllButtons();
        this.props.navigation.dangerouslyGetParent().setOptions({ drawer: false, drawerCanOpen: false });
        
        if(cover.tv) {
            const mediaUris = getMediaUris(this.context, cover);
            this.props.navigation.navigate("PlayScreen", {
                tvs: true,
                episodeIndex: mediaUris.episodeIndex,
                media: cover,
                profileClass: ProfileTv,
                mediaUris: mediaUris
            });
        }
        else {
            this.props.navigation.navigate("PlayScreen", {
                media: cover,
                profileClass: ProfileMovie,
                mediaUris: {
                    video: Movie.getVideo(this.context, cover.id),
                    trailer: Movie.getTrailer(this.context, cover.id),
                    logo: Movie.getLogo(this.context, cover.id),
                    backdrop: Movie.getBackdrop(this.context, cover.id)
                }
            });
        }
    }

    setDrawerCanOpen(toggle) {
        if(this.currentDrawerCanOpen != toggle) {
            this.clearCanDrawerOpenTimeout();
            if(toggle) {
                this.canDrawerOpenTimeout = setTimeout(() => {
                    this.canDrawerOpenTimeout = null;
                    this.currentDrawerCanOpen = toggle;
                    this.props.navigation.dangerouslyGetParent().setOptions({ drawer: true, drawerCanOpen: this.currentDrawerCanOpen });
                }, 500);
            }
            else {
                this.currentDrawerCanOpen = toggle;
                this.props.navigation.dangerouslyGetParent().setOptions({ drawer: true, drawerCanOpen: this.currentDrawerCanOpen });
            }
        }
    }

    renderCovers() {
        if(this.state.loading) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: Definitions.DEFAULT_MARGIN
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
                        marginBottom: Definitions.DEFAULT_MARGIN
                    }}
                >
                    <Text
                        style={[
                            Styles.bigText,
                            { fontWeight: "bold" }
                        ]}
                    >
                        { this.state.covers && this.state.covers.length == 0 ? i18n.t("main.search.no_results") : i18n.t("main.search.no_data") }
                    </Text>
                </View>
            );
        }

        return (
            <View
                style={{
                    flex: 1,
                    marginTop: Definitions.DEFAULT_MARGIN
                }}
            >
                <FlatList
                    ref={ component => this.flatList = component }
                    data={ this.state.covers }
                    keyExtractor={ (item, index) => String(index) }
                    showsVerticalScrollIndicator={ false }
                    scrollEnabled={ false }
                    renderItem={
                        ({ item, index }) => {
                            if(item.id == "endMargin") {
                                return (
                                    <View
                                        style={{
                                            flex: 1,
                                            margin: 2,
                                            height: Dimensions.get("window").height,
                                            backgroundColor: "transparent"
                                        }}
                                    />
                                );
                            }
                            else {
                                return (
                                    <SearchCoverButton
                                        style={{
                                            flex: 1,
                                            margin: 2
                                        }}
                                        cover={ item }
                                        onPress={ () => this.onCoverSelected(item) }
                                        onFocus={
                                            () => {
                                                this.flatList.scrollToOffset({ offset: (COVER_ITEM_VALUES.HEIGHT * index), animated: true });
                                            }
                                        }
                                    />
                                );
                            }
                        }
                    }
                />
            </View>
        );
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    padding: Definitions.DEFAULT_MARGIN,
                    paddingTop: 50,
                    paddingLeft: SCREEN_MARGIN_LEFT,
                    paddingBottom: 0,
                    backgroundColor: Definitions.PRIMARY_COLOR
                }}
            >
                <View
                    style={{
                        flex: 40,
                        height: 200
                    }}
                >
                    <Keyboard 
                        ref={ component => this.keyboard = component }
                        keboardType={ KeyboardTypes.ABC }
                        keyPadding={ 1 }
                        onKeyFocused={ (letter) => this.onKeyFocused(letter) }
                        deactivable={ true }
                    />
                </View>
                <View
                    style={{
                        flex: 60,
                        marginLeft: Definitions.DEFAULT_MARGIN
                    }}
                >
                    <BoxTextInput
                        ref={ component => this.textInputSearch = component }
                        placeholder={ i18n.t("main.search.input_placeholder") }
                        maxLength={ 128 }
                        onTextSet={ (text) => this.onTextChanged(text) }
                    />
                    { this.renderCovers() }
                </View>
            </View>
        );
    }
}