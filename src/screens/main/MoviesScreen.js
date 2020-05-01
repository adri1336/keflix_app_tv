//Imports
import React from "react";
import { View } from "react-native";

//Components Imports
import HeaderMedia from "cuervo/src/components/HeaderMedia";
import LibraryList from "cuervo/src/components/LibraryList";
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
        this.refreshMovies();
    }

    async refreshMovies() {
        const movies = await Movie.discover(this.context);
        this.libraryList.setData("Últimas películas añadidas", movies);
    }

    setHeaderInfo(movie) {
        const { title, release_date, runtime, vote_average, overview, backdrop_path } = movie;
        this.headerMedia.setInfo({
            title: {
                text: title,
                image: null
            },
            info: {
                releaseDate: "2020",
                runtime: runtime,
                vote_average: vote_average,
            },
            description: overview,
            backdrop: {
                image: "https://image.tmdb.org/t/p/original" + backdrop_path,
                video: null//"http://192.168.1.41:8888/cuervo/peli.mkv"
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
                <View
                    style={{
                        flex: 1,
                        marginBottom: -Definitions.DEFAULT_MARGIN,
                        marginRight: -Definitions.DEFAULT_MARGIN
                    }}
                >
                    <LibraryList
                        ref={ component => this.libraryList = component }
                        firstCoverMarginLeft={ SCREEN_MARGIN_LEFT }
                        hasTVPreferredFocus={ true }
                        onScrollStarted={ () => this.headerMedia.fadeBack(true) }
                        onCoverFocused={ movie => this.setHeaderInfo(movie) }
                    />
                </View>
                <NormalButton/>
            </View>
        );
    }
}