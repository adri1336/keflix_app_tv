import React from "react";
import { View, BackHandler, Animated, findNodeHandle, Text } from "react-native";
import HeaderMedia from "cuervo/src/components/HeaderMedia";
import { SCREEN_MARGIN_LEFT } from "cuervo/src/components/TVDrawer";
import Definitions, { MEDIA_DEFAULT } from "cuervo/src/utils/Definitions";
import NormalButton from "cuervo/src/components/NormalButton";
import Styles from "cuervo/src/utils/Styles";
import { MaterialIcons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import * as Movie from "cuervo/src/api/Movie";
import { AppContext } from "cuervo/src/AppContext";
import VideoPlayer from "cuervo/src/components/VideoPlayer";
import i18n from "i18n-js";
import ProgressBar from "cuervo/src/components/ProgressBar";
import * as ProfileLibraryMovie from "cuervo/src/api/ProfileLibraryMovie";
import { setStateIfMounted, forceUpdateIfMounted } from "cuervo/src/utils/Functions";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";

const
    BACK_FADE_DURATION = 500;

export default class PlayScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.media = this.props.route.params.media;
        this.lastProfileUpdate = 0;
        this.state = {
            playing: false,
            trailer: false,
            infoOpacity: new Animated.Value(1)
        };
        this.videoIsValid = this.media.mediaInfo.video ? true : false;
    }

    componentDidMount() {
        this._isMounted = true;
        activateKeepAwake();
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", async () => {
            if(!this.videoIsValid) {
                this.props.navigation.goBack();
            }
            else {
                if(this.props.navigation.isFocused()) {
                    if(this.state.playing && this.videoPlayer) {
                        if(this.videoPlayer.areControlsEnabled()) {
                            const positionMillis = await this.videoPlayer.getPositionMillis();
                            this.updateProfilePositionMillis(positionMillis, true);
                            this.stopPlaying();
                        }
                        else {
                            this.videoPlayer.toggleControls(true);
                        }
                    }
                    else {
                        this.props.navigation.goBack();
                    }
                    return true;
                }
            }
            return false;
        });
        
        if(this.videoIsValid) {
            this.setHeaderInfo();
            this.setButtonsNextFocus();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        deactivateKeepAwake();
        this.backHandler.remove();
    }

    shouldComponentUpdate() {
        if(!this._isMounted) {
            return false;
        }
        return true;
    }

    stopPlaying() {
        if(this.videoPlayer){
            this.videoPlayer.stopVideo(true);
            if(this.state.trailer) {
                this.videoPlayer.setUri(Movie.getVideo(this.context, this.media.id));
            }
        }
        setStateIfMounted(this, { playing: false, trailer: false });
    }

    setButtonsNextFocus() {
        this.playButton.setNativeProps({
            nextFocusUp: findNodeHandle(this.playButton),
            nextFocusDown: this.replayButton ? findNodeHandle(this.replayButton) : this.trailerButton ? findNodeHandle(this.trailerButton) : findNodeHandle(this.myListButton),
            nextFocusLeft: findNodeHandle(this.playButton),
            nextFocusRight: findNodeHandle(this.playButton)
        });

        if(this.replayButton) {
            this.replayButton.setNativeProps({
                nextFocusUp: findNodeHandle(this.playButton),
                nextFocusDown: this.trailerButton ? findNodeHandle(this.trailerButton) : findNodeHandle(this.myListButton),
                nextFocusLeft: findNodeHandle(this.replayButton),
                nextFocusRight: findNodeHandle(this.replayButton)
            });
        }

        if(this.trailerButton) {
            this.trailerButton.setNativeProps({
                nextFocusUp:  this.replayButton ? findNodeHandle(this.replayButton) : findNodeHandle(this.playButton),
                nextFocusDown: findNodeHandle(this.myListButton),
                nextFocusLeft: findNodeHandle(this.trailerButton),
                nextFocusRight: findNodeHandle(this.trailerButton)
            });
        }

        this.myListButton.setNativeProps({
            nextFocusUp: this.trailerButton ? findNodeHandle(this.trailerButton) : this.replayButton ? findNodeHandle(this.replayButton) : findNodeHandle(this.playButton),
            nextFocusDown: findNodeHandle(this.myListButton),
            nextFocusLeft: findNodeHandle(this.myListButton),
            nextFocusRight: findNodeHandle(this.myListButton)
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.playing != prevState.playing) {
            Animated.timing(this.state.infoOpacity, {
                toValue: this.state.playing ? 0 : 1,
                duration: BACK_FADE_DURATION,
                useNativeDriver: true
            }).start();
        }
        if(this.state.trailer != prevState.trailer) {
            if(this.state.trailer) {
                if(this.videoPlayer) {
                    this.videoPlayer.playNow(0, Movie.getTrailer(this.context, this.media.id));
                }
                else {
                    setStateIfMounted(this, { trailer: false, playing: false });
                }
            }
        }
    }

    setHeaderInfo() {
        const { id, title, release_date, runtime, vote_average, overview, mediaInfo } = this.media;
        this.headerMedia.setInfo({
            title: {
                text: title,
                image: mediaInfo.logo ? Movie.getLogo(this.context, id) : null
            },
            info: {
                releaseDate: release_date.substr(0, 4),
                runtime: runtime,
                vote_average: vote_average,
            },
            description: overview,
            backdrop: null
        }, false);
    }

    onPlaybackStatusUpdate(playbackStatus) {
        const { positionMillis } = playbackStatus;
        if(playbackStatus.didJustFinish) {
            this.updateProfilePositionMillis(positionMillis, true);
            this.stopPlaying();
        }
        else {
            if(Date.now() - this.lastProfileUpdate > MEDIA_DEFAULT.PLAYBACK_UPDATE_PROFILE_INFO_INTERVAL && positionMillis > MEDIA_DEFAULT.MIN_MILLIS) {
                this.updateProfilePositionMillis(positionMillis);
                this.lastProfileUpdate = Date.now();
            }
        }
    }

    async updateProfilePositionMillis(positionMillis, force_update = false) {
        if(!this.state.trailer) {
            let { runtime, libraryMovieId, profileInfo } = this.media;
            const durationMillis = runtime * 60000;
            const remainingMillis = durationMillis - positionMillis;

            if(!profileInfo) {
                profileInfo = ProfileLibraryMovie.defaultObject(this.context, libraryMovieId);
            }
            
            if(remainingMillis < MEDIA_DEFAULT.REMAINING_MILLIS) {
                profileInfo.completed = true;
            }
            else {
                profileInfo.completed = false;
            }

            profileInfo.current_time = positionMillis;
            await ProfileLibraryMovie.upsert(this.context, profileInfo);
            this.media.profileInfo = profileInfo;
            if(force_update) {
                forceUpdateIfMounted(this);
            }
        }
    }

    renderVideoPlayer() {
        const { id, title, mediaInfo, profileInfo } = this.media;
        let positionMillis = 0;
        if(profileInfo && profileInfo.current_time > MEDIA_DEFAULT.MIN_MILLIS && !profileInfo.completed) {
            positionMillis = profileInfo.current_time;
        }

        return (
            <View
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: -5
                }}
            >
                <VideoPlayer
                    ref={ component => this.videoPlayer = component }
                    inBackground={ true }
                    backdrop={ mediaInfo.backdrop ? Movie.getBackdrop(this.context, id) : null }
                    playIn={ 10 } //seconds
                    title={{
                        text: title,
                        image: mediaInfo.logo ? Movie.getLogo(this.context, id) : null
                    }}
                    videoProps={{
                        source: { uri: Movie.getVideo(this.context, id) },
                        positionMillis: positionMillis
                    }}
                    onPlayStarted={
                        () => {
                            setStateIfMounted(this, { playing: true });
                        }
                    }
                    onVideoBackPressed={
                        async (positionMillis) => {
                            this.updateProfilePositionMillis(positionMillis, true);
                            this.stopPlaying();
                        }
                    }
                    onVideoReplayPressed={ () => this.updateProfilePositionMillis(0) }
                    onSeeked={ (positionMillis) => this.updateProfilePositionMillis(positionMillis) }
                    onPlaybackStatusUpdate={ (playbackStatus) => this.onPlaybackStatusUpdate(playbackStatus) }
                />
            </View>
        );
    }

    renderPlayButtons() {
        const { runtime, profileInfo } = this.media;
        if(profileInfo && profileInfo.current_time > MEDIA_DEFAULT.MIN_MILLIS && !profileInfo.completed) {
            const total_time = runtime * 60000; //min to ms
            const current_time = profileInfo.current_time;
            const remainingMillis = total_time - current_time;
            const progress = 100 - ((remainingMillis * 100) / total_time);

            return (
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <NormalButton
                            touchableRef={ component => this.playButton = component }
                            hasTVPreferredFocus={ this.state.playing ? false : true }
                            accessible={ this.state.playing ? false : true }
                            textStyle={ Styles.bigText }
                            icon={{
                                library: MaterialIcons,
                                name: "play-arrow"
                            }}
                            style={{ marginBottom: Definitions.DEFAULT_MARGIN, marginRight: Definitions.DEFAULT_MARGIN }}
                            onPress={
                                () => {
                                    if(this.videoPlayer) {
                                        this.videoPlayer.playNow(current_time);
                                        setStateIfMounted(this, { playing: true });
                                    }
                                }
                            }
                            onBlur={
                                () => {
                                    if(this.videoPlayer) {
                                        this.videoPlayer.cancelPlayInTimer();
                                    }
                                }
                            }
                        >
                            { i18n.t("play_screen.resume_button") }
                        </NormalButton>
                        <ProgressBar
                            progress={ progress }
                            bgColor="#A9A9A9"
                            style={{
                                width: 100,
                                height: 3,
                                marginBottom: 4
                            }}
                        />
                    </View>

                    <NormalButton
                        touchableRef={ component => this.replayButton = component }
                        accessible={ this.state.playing ? false : true }
                        textStyle={ Styles.bigText }
                        icon={{
                            library: MaterialIcons,
                            name: "skip-next"
                        }}
                        style={{ marginBottom: Definitions.DEFAULT_MARGIN }}
                        onPress={
                            async () => {
                                if(this.videoPlayer) {
                                    this.videoPlayer.playNow(0);
                                    setStateIfMounted(this, { playing: true });
                                }
                            }
                        }
                        onBlur={
                            () => {
                                if(this.videoPlayer) {
                                    this.videoPlayer.cancelPlayInTimer();
                                }
                            }
                        }
                    >
                        { i18n.t("play_screen.replay_button") }
                    </NormalButton>
                </View>
            );
        }
        else {
            return (
                <NormalButton
                    touchableRef={ component => this.playButton = component }
                    hasTVPreferredFocus={ this.state.playing ? false : true }
                    accessible={ this.state.playing ? false : true }
                    textStyle={ Styles.bigText }
                    icon={{
                        library: MaterialIcons,
                        name: "play-arrow"
                    }}
                    style={{ marginBottom: Definitions.DEFAULT_MARGIN }}
                    onPress={
                        () => {
                            if(this.videoPlayer) {
                                this.videoPlayer.playNow(true);
                                setStateIfMounted(this, { playing: true });
                            }
                        }
                    }
                    onBlur={
                        () => {
                            if(this.videoPlayer) {
                                this.videoPlayer.cancelPlayInTimer();
                            }
                        }
                    }
                >
                    { i18n.t("play_screen.play_button") }
                </NormalButton>
            );
        }
    }

    renderMyListButton() {
        let { profileInfo, libraryMovieId } = this.media;
        if(profileInfo && profileInfo.fav) {
            return (
                <NormalButton
                    touchableRef={ component => this.myListButton = component }
                    accessible={ this.state.playing ? false : true }
                    textStyle={ Styles.bigText }
                    icon={{
                        library: MaterialCommunityIcons,
                        name: "playlist-remove"
                    }}
                    style={{ marginBottom: Definitions.DEFAULT_MARGIN }}
                    onPress={
                        async () => {
                            profileInfo.fav = false;
                            await ProfileLibraryMovie.upsert(this.context, profileInfo);
                            this.media.profileInfo = profileInfo;
                            forceUpdateIfMounted(this);
                        }
                    }
                >
                    { i18n.t("play_screen.delete_from_list_button") }
                </NormalButton>
            );
        }
        else {
            return (
                <NormalButton
                    touchableRef={ component => this.myListButton = component }
                    accessible={ this.state.playing ? false : true }
                    textStyle={ Styles.bigText }
                    icon={{
                        library: MaterialIcons,
                        name: "playlist-add"
                    }}
                    style={{ marginBottom: Definitions.DEFAULT_MARGIN }}
                    onPress={
                        async () => {
                            if(!profileInfo) {
                                profileInfo = ProfileLibraryMovie.defaultObject(this.context, libraryMovieId);
                            }
                            profileInfo.fav = true;
                            await ProfileLibraryMovie.upsert(this.context, profileInfo);
                            this.media.profileInfo = profileInfo;
                            forceUpdateIfMounted(this);
                        }
                    }
                >
                    { i18n.t("play_screen.add_to_my_list_button") }
                </NormalButton>
            );
        }
    }

    renderPlayTrailerButton() {
        if(this.media.mediaInfo.trailer) {
            return (
                <NormalButton
                    touchableRef={ component => this.trailerButton = component }
                    accessible={ this.state.playing ? false : true }
                    textStyle={ Styles.bigText }
                    icon={{
                        library: MaterialIcons,
                        name: "local-play"
                    }}
                    style={{ marginBottom: 20 }}
                    onPress={
                        () => {
                            setStateIfMounted(this, { trailer: true, playing: true });
                        }
                    }
                >
                    { i18n.t("play_screen.play_trailer_button") }
                </NormalButton>
            );
        }
    }

    renderInfo() {
        return (
            <Animated.View
                opacity={ this.state.infoOpacity }
                style={{
                    flex: 1,
                    padding: Definitions.DEFAULT_MARGIN,
                    paddingLeft: SCREEN_MARGIN_LEFT,
                    paddingTop: 20,
                    backgroundColor: "transparent"
                }}
            >
                <HeaderMedia
                    ref={ component => this.headerMedia = component }
                />
                <View
                    style={{
                        flex: 1,
                        marginTop: 50,
                        marginLeft: Definitions.DEFAULT_MARGIN,
                        marginBottom: -Definitions.DEFAULT_MARGIN,
                        marginRight: -Definitions.DEFAULT_MARGIN
                    }}
                >
                    { this.renderPlayButtons() }
                    { this.renderPlayTrailerButton() }
                    { this.renderMyListButton() }
                </View>
            </Animated.View>
        );
    }

    render() {
        if(!this.videoIsValid) {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Definitions.PRIMARY_COLOR
                }}>
                    <Text style={[ Styles.bigText ]}>{ i18n.t("play_screen.invalid_video_title") }</Text>
                    <NormalButton
                        hasTVPreferredFocus={ true }
                        icon={{
                            library: Entypo,
                            name: "back"
                        }}
                        onPress={ () => this.props.navigation.goBack() }
                    >
                        { i18n.t("play_screen.back_button") }
                    </NormalButton>
                </View>
            );
        }
        else {
            return (
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "black"
                    }}
                >
                    { this.renderVideoPlayer() }
                    { this.renderInfo() }
                </View>
            );
        }
    }
}