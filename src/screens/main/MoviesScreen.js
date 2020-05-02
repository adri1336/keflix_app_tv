//Imports
import React from "react";
import { View } from "react-native";

//Components Imports
import HeaderMedia from "cuervo/src/components/HeaderMedia";
import LibrarySectionGrid from "cuervo/src/components/LibrarySectionGrid";

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

        this.onDrawerOpenedEvent = this.props.navigation.addListener("onDrawerOpened", () => {
            if(this.librarySectionGrid) {
                this.librarySectionGrid.setFocus(false);
                this.headerMedia.pauseVideo();
            }
        });
        this.onDrawerClosedEvent = this.props.navigation.addListener("onDrawerClosed", () => {
            this.librarySectionGrid.setFocus(true);
            this.headerMedia.playVideo();
        });
    }

    componentWillUnmount() {
        this.onDrawerOpenedEvent();
        this.onDrawerClosedEvent();
    }

    async refreshMovies() {
        const movies = await Movie.discover(this.context);
        const sections = [
            { title: "Últimas películas añadidas", covers: movies }
        ];
        this.librarySectionGrid.setSections(sections);
    }

    setHeaderInfo(movie) {
        const { title, release_date, runtime, vote_average, overview } = movie;

        this.mediaInfo = {
            logo: movie.mediaInfo.logo ? Movie.getLogo(this.context, movie.id) : null,
            image: movie.mediaInfo.backdrop ? Movie.getBackdrop(this.context, movie.id) : null,
            trailer: movie.mediaInfo.trailer ? Movie.getTrailer(this.context, movie.id) : null
        };

        this.headerMedia.setInfo({
            title: {
                text: title,
                image: this.mediaInfo.logo
            },
            info: {
                releaseDate: release_date.substr(0, 4),
                runtime: runtime,
                vote_average: vote_average,
            },
            description: overview,
            backdrop: {
                image: this.mediaInfo.image,
                video: this.mediaInfo.trailer
            }
        });
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    margin: Definitions.DEFAULT_MARGIN,
                    marginLeft: SCREEN_MARGIN_LEFT,
                    backgroundColor: Definitions.PRIMARY_COLOR
                }}
            >
                <HeaderMedia
                    ref={ component => this.headerMedia = component }
                />
                <LibrarySectionGrid
                    ref={ component => this.librarySectionGrid = component }
                    firstCoverMarginLeft={ SCREEN_MARGIN_LEFT }
                    onScrollStarted={
                        toRowIndex => {
                            this.headerMedia.fadeBack(true);
                            this.props.navigation.setOptions({ drawerCanOpen: toRowIndex == 1 ? true : false });
                        }
                    }
                    onCoverFocused={
                        (movie, rowIndex) => {
                            this.setHeaderInfo(movie);
                            this.props.navigation.setOptions({ drawerCanOpen: rowIndex == 1 ? true : false });
                        }
                    }
                    onCoverSelected={
                        movie => {
                            this.props.navigation.navigate("MediaNavigator", {
                                screen: "InfoScreen",
                                params: {
                                    backRouteName: this.props.route.name,
                                    media: movie,
                                    mediaInfo: this.mediaInfo
                                }
                            });
                        }
                    }
                />
            </View>
        );
    }
}