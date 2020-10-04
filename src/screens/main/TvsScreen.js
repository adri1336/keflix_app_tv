//Imports
import React from "react";
import { View, ActivityIndicator } from "react-native";
import i18n from "i18n-js";

//Components Imports
import HeaderMedia from "app/src/components/HeaderMedia";
import LibrarySectionGrid from "app/src/components/LibrarySectionGrid";
import NormalButton from "app/src/components/NormalButton";

//Other Imports
import Definitions from "app/src/utils/Definitions";
import { AppContext } from "app/src/AppContext";
import { SCREEN_MARGIN_LEFT } from "app/src/components/TVDrawer";
import * as Tv from "app/src/api/Tv";
import { setStateIfMounted, getEpisodeIndexFromInfo, getMediaUris } from "app/src/utils/Functions";
import Styles from "app/src/utils/Styles";
import * as ProfileTv from "app/src/api/ProfileTv";

//Code
export default class TvsScreen extends React.Component {
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
        this.refreshTvs();
        
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
    
    async refreshTvs() {
        let sections = [];
        let tvs = null;

        //Últimas películas añadidas
        tvs = await Tv.discover(this.context);
        if(tvs && tvs.length > 0) sections.push({ title: "Últimas series añadidas", covers: tvs });

        tvs.forEach(tv => { 
            tv.tagline = "";
            tv.episode_tvs.forEach(episode => {
                episode.tagline = "S" + episode.season + ":E" + episode.episode + ": '" + episode.name + "'";
            });
        });
        
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

    setHeaderInfo(tv) {
        let season = tv.firstSeason,
            episode = tv.firstEpisode;
        
        if(tv.profileInfo && tv.profileInfo.season !== -1 && tv.profileInfo.episode !== -1) {
            season = tv.profileInfo.season;
            episode = tv.profileInfo.episode;
        }

        const episodeIndex = getEpisodeIndexFromInfo(tv, season, episode);
        let runtime = 0;
            tagline = "";

        let { name, first_air_date, vote_average, overview, profileInfo } = tv;
        let backdrop = tv.mediaInfo.backdrop ? Tv.getBackdrop(this.context, tv.id) : null;

        if(episodeIndex !== -1 && tv.profileInfo && tv.profileInfo.season !== -1 && tv.profileInfo.episode !== -1) {
            runtime = tv.episode_tvs[episodeIndex].runtime;
            tagline = tv.episode_tvs[episodeIndex].tagline;
            overview = tagline + "\n\n" + tv.episode_tvs[episodeIndex].overview;

            if(tv.episode_tvs[episodeIndex].mediaInfo.backdrop) {
                backdrop = Tv.getEpisodeBackdrop(this.context, tv.id, season, episode);
            }
        }

        let progress = null;
        if(episodeIndex !== -1 && tv.profileInfo && tv.profileInfo.season !== -1 && tv.profileInfo.episode !== -1) {
            progress = {
                current_time: profileInfo.current_time,
                total_time: runtime * 60000 //min to ms
            }
        }

        this.headerMedia.setInfo({
            title: {
                text: name,
                image: tv.mediaInfo.logo ? Tv.getLogo(this.context, tv.id) : null
            },
            info: {
                releaseDate: first_air_date.substr(0, 4),
                runtime: runtime,
                vote_average: vote_average,
            },
            description: overview,
            backdrop: {
                image: backdrop,
                video: (this.props.navigation.isFocused() && tv.mediaInfo.trailer && !this.isDrawerOpened) ? Tv.getTrailer(this.context, tv.id) : null
            },
            progress: progress,
            tagline: tagline
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
                        { i18n.t("main.tvs.no_data_title") }
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
                        tvs
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
                            (tv, rowIndex) => {
                                this.setHeaderInfo(tv);
                                if(this.props.navigation.isFocused()) {
                                    this.props.navigation.dangerouslyGetParent().setOptions({ drawerCanOpen: rowIndex == 1 ? true : false });
                                }
                            }
                        }
                        onCoverSelected={
                            tv => {
                                const mediaUris = getMediaUris(this.context, tv);

                                this.props.navigation.dangerouslyGetParent().setOptions({ drawer: false, drawerCanOpen: false });
                                if(this.librarySectionGrid) {
                                    this.librarySectionGrid.setFocus(false);
                                }
                                if(this.headerMedia) {
                                    this.headerMedia.stopVideo();
                                }

                                this.props.navigation.navigate("PlayScreen", {
                                    tvs: true,
                                    episodeIndex: mediaUris.episodeIndex,
                                    media: tv,
                                    profileClass: ProfileTv,
                                    mediaUris: mediaUris
                                });
                            }
                        }
                    />
                </View>
            </View>
        );
    }
}