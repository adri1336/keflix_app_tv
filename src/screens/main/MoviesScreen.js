//Imports
import React from "react";
import { View, ActivityIndicator } from "react-native";
import i18n from "i18n-js";

//Components Imports
import HeaderMedia from "cuervo/src/components/HeaderMedia";
import LibrarySectionGrid from "cuervo/src/components/LibrarySectionGrid";
import NormalButton from "cuervo/src/components/NormalButton";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { AppContext } from "cuervo/src/AppContext";
import { SCREEN_MARGIN_LEFT } from "cuervo/src/components/TVDrawer";
import * as Movie from "cuervo/src/api/Movie";
import { setStateIfMounted } from "cuervo/src/utils/Functions";
import Styles from "cuervo/src/utils/Styles";

//Code
export default class MoviesScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.isDrawerOpened = false;
        this.state = {
            loading: true,
            sections: false,
            focused: true
        };
    }
    
    componentDidMount() {
        this._isMounted = true;
        this.account = this.context.state.account;
        this.profile = this.context.state.profile;
        this.refreshMovies();
        
        this.onFocusEvent = this.props.navigation.addListener("focus", () => {
            setStateIfMounted(this, { focused: true });
            if(this.librarySectionGrid) {
                this.props.navigation.dangerouslyGetParent().setOptions({ drawer: true, drawerCanOpen: this.librarySectionGrid.getCurrentRowIndex() <= 1 ? true : false });
                this.librarySectionGrid.setFocus(true);
            }
        });
        this.onBlurEvent = this.props.navigation.addListener("blur", () => {
            setStateIfMounted(this, { focused: false });
        });
        this.onDrawerOpenedEvent = this.props.navigation.dangerouslyGetParent().addListener("onDrawerOpened", () => {
            this.isDrawerOpened = true;
            if(this.librarySectionGrid) {
                this.librarySectionGrid.setFocus(false);
            }
            if(this.headerMedia) {
                this.headerMedia.pauseVideo();
            }
        });
        this.onDrawerClosedEvent = this.props.navigation.dangerouslyGetParent().addListener("onDrawerClosed", () => {
            this.isDrawerOpened = false;
            if(this.librarySectionGrid) {
                this.librarySectionGrid.setFocus(true, false);
            }
            if(this.headerMedia) {
                this.headerMedia.playVideo();
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.onFocusEvent();
        this.onBlurEvent();
        this.onDrawerOpenedEvent();
        this.onDrawerClosedEvent();
    }

    shouldComponentUpdate() {
        if(!this._isMounted) {
            return false;
        }
        return true;
    }
    
    async refreshMovies() {
        let sections = [];
        let movies = null;

        //Últimas películas añadidas
        movies = await Movie.discover(this.context);
        if(movies) sections.push({ title: "Últimas películas añadidas", covers: movies });

        if(this.librarySectionGrid) {
            if(sections.length > 0) {
                this.librarySectionGrid.setSections(sections);
                setStateIfMounted(this, { loading: false, sections: true });
            }
            else {
                setStateIfMounted(this, { loading: false, sections: false });
            }
        }
    }

    setHeaderInfo(movie) {
        const { title, release_date, runtime, vote_average, overview, profileInfo } = movie;

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
                image: movie.mediaInfo.logo ? Movie.getLogo(this.context, movie.id) : null
            },
            info: {
                releaseDate: release_date.substr(0, 4),
                runtime: runtime,
                vote_average: vote_average,
            },
            description: overview,
            backdrop: {
                image: movie.mediaInfo.backdrop ? Movie.getBackdrop(this.context, movie.id) : null,
                video: (this.props.navigation.isFocused() && movie.mediaInfo.trailer && !this.isDrawerOpened) ? Movie.getTrailer(this.context, movie.id) : null
            },
            progress: progress
        });
    }

    render() {
        if(!this.state.loading && !this.state.sections) {
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
                        { i18n.t("main.movies.no_data_title") }
                    </NormalButton>
                </View>
            );
        }

        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: Definitions.PRIMARY_COLOR
                }}
            >
                {
                    this.state.loading &&
                    <View
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <ActivityIndicator size="large" color={ Definitions.SECONDARY_COLOR }/>
                    </View>
                }
                <View
                    style={{
                        flex: 1,
                        padding: Definitions.DEFAULT_MARGIN,
                        paddingLeft: SCREEN_MARGIN_LEFT
                    }}
                >
                    <HeaderMedia
                        ref={ component => this.headerMedia = component }
                    />
                    <NormalButton
                        hasTVPreferredFocus={ this.state.focused ? true: false }
                        accessible={ this.state.focused ? true: false }
                    />
                    <LibrarySectionGrid
                        ref={ component => this.librarySectionGrid = component }
                        firstCoverMarginLeft={ SCREEN_MARGIN_LEFT }
                        onScrollStarted={
                            toRowIndex => {
                                if(this.headerMedia) {
                                    this.headerMedia.stopVideo();
                                    this.headerMedia.fadeBack(true);
                                }
                                this.props.navigation.dangerouslyGetParent().setOptions({ drawerCanOpen: toRowIndex == 1 ? true : false });
                            }
                        }
                        onCoverFocused={
                            (movie, rowIndex) => {
                                this.setHeaderInfo(movie);
                                if(this.props.navigation.isFocused()) {
                                    this.props.navigation.dangerouslyGetParent().setOptions({ drawerCanOpen: rowIndex == 1 ? true : false });
                                }
                            }
                        }
                        onCoverSelected={
                            movie => {
                                this.props.navigation.dangerouslyGetParent().setOptions({ drawer: false, drawerCanOpen: false });
                                if(this.librarySectionGrid) {
                                    this.librarySectionGrid.setFocus(false);
                                }
                                if(this.headerMedia) {
                                    this.headerMedia.stopVideo();
                                }
                                this.props.navigation.navigate("PlayScreen", { media: movie });
                            }
                        }
                    />
                </View>
            </View>
        );
    }
}