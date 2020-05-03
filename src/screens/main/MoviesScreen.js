//Imports
import React from "react";
import { View, BackHandler } from "react-native";

//Components Imports
import HeaderMedia from "cuervo/src/components/HeaderMedia";
import LibrarySectionGrid from "cuervo/src/components/LibrarySectionGrid";
import NormalButton from "cuervo/src/components/NormalButton";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { AppContext } from "cuervo/src/AppContext";
import { SCREEN_MARGIN_LEFT } from "cuervo/src/components/TVDrawer";
import * as Movie from "cuervo/src/api/Movie";

//Code
export default class MoviesScreen extends React.Component {
    static contextType = AppContext;

    componentDidMount() {
        this.account = this.context.state.account;
        this.profile = this.context.state.profile;
        this.mediaInfo = null;
        this.refreshMovies();

        this.onFocusEvent = this.props.navigation.addListener("focus", () => {
            this.props.navigation.dangerouslyGetParent().setOptions({ drawer: true, drawerCanOpen: this.librarySectionGrid.getCurrentRowIndex() == 1 ? true : false });
            if(this.librarySectionGrid) {
                this.librarySectionGrid.setFocus(true, false);
            }
            if(this.headerMedia) {
                this.headerMedia.playVideo();
            }

        });
        this.onDrawerOpenedEvent = this.props.navigation.dangerouslyGetParent().addListener("onDrawerOpened", () => {
            if(this.librarySectionGrid) {
                this.librarySectionGrid.setFocus(false);
            }
            if(this.headerMedia) {
                this.headerMedia.pauseVideo();
            }
        });
        this.onDrawerClosedEvent = this.props.navigation.dangerouslyGetParent().addListener("onDrawerClosed", () => {
            if(this.librarySectionGrid) {
                this.librarySectionGrid.setFocus(true, false);
            }
            if(this.headerMedia) {
                this.headerMedia.playVideo();
            }
        });
    }

    componentWillUnmount() {
        this.onFocusEvent();
        this.onDrawerOpenedEvent();
        this.onDrawerClosedEvent();
    }

    async refreshMovies() {
        const movies = await Movie.discover(this.context);
        const sections = [
            { title: "Últimas películas añadidas", covers: movies }
        ];
        if(this.librarySectionGrid) {
            this.librarySectionGrid.setSections(sections);
        }
    }

    setHeaderInfo(movie) {
        const { title, release_date, runtime, vote_average, overview } = movie;

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
                video: movie.mediaInfo.trailer ? Movie.getTrailer(this.context, movie.id) : null
            }
        });
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    padding: Definitions.DEFAULT_MARGIN,
                    paddingLeft: SCREEN_MARGIN_LEFT,
                    backgroundColor: Definitions.PRIMARY_COLOR
                }}
            >
                <HeaderMedia
                    ref={ component => this.headerMedia = component }
                />
                <NormalButton hasTVPreferredFocus={ true }/>
                <LibrarySectionGrid
                    ref={ component => this.librarySectionGrid = component }
                    firstCoverMarginLeft={ SCREEN_MARGIN_LEFT }
                    onScrollStarted={
                        toRowIndex => {
                            this.headerMedia.fadeBack(true);
                            this.props.navigation.dangerouslyGetParent().setOptions({ drawerCanOpen: toRowIndex == 1 ? true : false });
                        }
                    }
                    onCoverFocused={
                        (movie, rowIndex) => {
                            this.setHeaderInfo(movie);
                            this.props.navigation.dangerouslyGetParent().setOptions({ drawerCanOpen: rowIndex == 1 ? true : false });
                        }
                    }
                    onCoverSelected={
                        movie => {
                            this.props.navigation.dangerouslyGetParent().setOptions({ drawer: false, drawerCanOpen: false });
                            if(this.librarySectionGrid) {
                                this.librarySectionGrid.setFocus(false);
                            }
                            if(this.headerMedia) {
                                this.headerMedia.pauseVideo();
                            }
                            this.props.navigation.navigate("MediaNavigator", {
                                screen: "InfoScreen",
                                params: {
                                    backRouteName: this.props.route.name,
                                    media: movie
                                }
                            });
                        }
                    }
                />
            </View>
        );
    }
}