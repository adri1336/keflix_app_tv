import React from "react";
import { View, BackHandler, Animated, findNodeHandle, Text, FlatList } from "react-native";
import HeaderMedia from "app/src/components/HeaderMedia";
import { SCREEN_MARGIN_LEFT } from "app/src/components/TVDrawer";
import Definitions, { MEDIA_DEFAULT } from "app/src/utils/Definitions";
import NormalButton from "app/src/components/NormalButton";
import Styles from "app/src/utils/Styles";
import { MaterialIcons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AppContext } from "app/src/AppContext";
import VideoPlayer from "app/src/components/VideoPlayer";
import i18n from "i18n-js";
import ProgressBar from "app/src/components/ProgressBar";
import { setStateIfMounted, forceUpdateIfMounted, getMediaUris } from "app/src/utils/Functions";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import { COVER_ITEM_VALUES } from "app/src/components/LibraryList";
import EpisodeListCoverButton from "app/src/components/EpisodeListCoverButton";

const
    BACK_FADE_DURATION = 500;

export default class PlayScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.media = this.props.route.params.media;
        this.mediaUris = this.props.route.params.mediaUris;
        this.profileClass = this.props.route.params.profileClass;
        this.tvs = this.props.route.params?.tvs || false;
        this.episodeIndex = this.props.route.params?.episodeIndex;
        this.lastProfileUpdate = 0;
        this.state = {
            playing: false,
            trailer: false,
            infoOpacity: new Animated.Value(1),
            episodesList: false
        };
        if(this.tvs) this.videoIsValid = true;
        else this.videoIsValid = this.media.mediaInfo.video ? true : false;
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

    stopPlaying(updateHeader = false) {
        if(this.videoPlayer){
            this.videoPlayer.stopVideo(true);
            if(this.state.trailer) {
                this.videoPlayer.setUri(this.mediaUris.video);
            }
        }
        setStateIfMounted(this, { playing: false, trailer: false }, () => {
            if(updateHeader) {
                this.setHeaderInfo();
                this.setButtonsNextFocus();
            }
        });
    }

    setButtonsNextFocus() {
        let up = null, down = null;

        if(this.state.episodesList) {
            this.episodesListBackButton.setNativeProps({
                nextFocusUp: findNodeHandle(this.episodesListBackButton),
                nextFocusLeft: findNodeHandle(this.episodesListBackButton),
                nextFocusRight: findNodeHandle(this.episodesListBackButton)
            });
        }
        else {
            up = findNodeHandle(this.playButton);
            if(this.replayButton) down = findNodeHandle(this.replayButton);
            else if(this.trailerButton) down = findNodeHandle(this.trailerButton);
            else if(this.episodesButton) down = findNodeHandle(this.episodesButton);
            else down = findNodeHandle(this.myListButton);
            this.playButton.setNativeProps({
                nextFocusUp: up,
                nextFocusDown: down,
                nextFocusLeft: findNodeHandle(this.playButton),
                nextFocusRight: findNodeHandle(this.playButton)
            });

            if(this.replayButton) {
                up = findNodeHandle(this.playButton);
                if(this.trailerButton) down = findNodeHandle(this.trailerButton);
                else if(this.episodesButton) down = findNodeHandle(this.episodesButton);
                else down = findNodeHandle(this.myListButton);
                this.replayButton.setNativeProps({
                    nextFocusUp: up,
                    nextFocusDown: down,
                    nextFocusLeft: findNodeHandle(this.replayButton),
                    nextFocusRight: findNodeHandle(this.replayButton)
                });
            }

            if(this.trailerButton) {
                if(this.replayButton) up = findNodeHandle(this.replayButton);
                else up = findNodeHandle(this.playButton);
                if(this.episodesButton) down = findNodeHandle(this.episodesButton);
                else down = findNodeHandle(this.myListButton);
                this.trailerButton.setNativeProps({
                    nextFocusUp: up,
                    nextFocusDown: down,
                    nextFocusLeft: findNodeHandle(this.trailerButton),
                    nextFocusRight: findNodeHandle(this.trailerButton)
                });
            }

            if(this.episodesButton) {
                if(this.trailerButton) up = findNodeHandle(this.trailerButton);
                else if(this.replayButton) up = findNodeHandle(this.replayButton);
                else up = findNodeHandle(this.playButton);
                down = findNodeHandle(this.myListButton);
                this.episodesButton.setNativeProps({
                    nextFocusUp: up,
                    nextFocusDown: down,
                    nextFocusLeft: findNodeHandle(this.trailerButton),
                    nextFocusRight: findNodeHandle(this.trailerButton)
                });
            }

            if(this.episodesButton) up = findNodeHandle(this.episodesButton);
            else if(this.trailerButton) up = findNodeHandle(this.trailerButton);
            else if(this.replayButton) up = findNodeHandle(this.replayButton);
            else up = findNodeHandle(this.playButton);
            down = findNodeHandle(this.myListButton);
            this.myListButton.setNativeProps({
                nextFocusUp: this.episodesButton ? findNodeHandle(this.episodesButton) : (this.trailerButton ? findNodeHandle(this.trailerButton) : this.replayButton ? findNodeHandle(this.replayButton) : findNodeHandle(this.playButton)),
                nextFocusDown: findNodeHandle(this.myListButton),
                nextFocusLeft: findNodeHandle(this.myListButton),
                nextFocusRight: findNodeHandle(this.myListButton)
            });
        }
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
                    this.videoPlayer.playNow(0, this.mediaUris.trailer);
                }
                else {
                    setStateIfMounted(this, { trailer: false, playing: false });
                }
            }
        }
        if(this.state.episodesList != prevState.episodesList) {
            if(this.state.episodesList) {
                let index = this.episodeIndex;
                if(index < 0) index = 0;
                else if(index >= this.media.episode_tvs.length) index = 0;

                if(index > 0) {
                    requestAnimationFrame(() => {
                        this.flatList.scrollToOffset({ offset: (COVER_ITEM_VALUES.HEIGHT * index), animated: false });
                    });
                }
            }
            else this.setHeaderInfo();
        }
    }

    setHeaderInfo() {
        let { title, name, release_date, first_air_date, runtime, vote_average, overview, mediaInfo } = this.media;
        if(this.tvs) {
            if(this.episodeIndex < 0) runtime = 0;
            else {
                runtime = this.media.episode_tvs[this.episodeIndex].runtime;

                const episode = this.media.episode_tvs[this.episodeIndex];
                if(this.media.profileInfo && this.media.profileInfo.season !== -1 && this.media.profileInfo.episode !== -1) {
                    overview = (episode.tagline + "\n\n" + episode.overview) || this.media.overview;
                }
            }
        }
        this.headerMedia.setInfo({
            title: {
                text: title || name,
                image: mediaInfo.logo ? this.mediaUris.logo : null
            },
            info: {
                releaseDate: release_date ? release_date.substr(0, 4) : first_air_date.substr(0, 4),
                runtime: runtime,
                vote_average: vote_average,
            },
            description: overview,
            backdrop: null
        }, false);
    }

    async onPlaybackStatusUpdate(playbackStatus) {
        const { positionMillis } = playbackStatus;
        if(playbackStatus.didJustFinish) {
            if(this.tvs && this.episodeIndex !== -1) {
                const episode = this.media.episode_tvs[this.episodeIndex];
                
                const { nextSeason, nextEpisode } = episode.mediaInfo;
                let { profileInfo } = this.media;
                let finished = false;
                
                profileInfo.current_time = 0;
                if(nextSeason !== null && nextEpisode !== null) {
                    profileInfo.season = nextSeason;
                    profileInfo.episode = nextEpisode;
                }
                else {
                    finished = true;
                    profileInfo.season = -1;
                    profileInfo.episode = -1;
                }
                
                const newMediaUris = getMediaUris(this.context, this.media);
                if(!finished) {
                    profileInfo.season = newMediaUris.season;
                    profileInfo.episode = newMediaUris.episode;
                }
                this.episodeIndex = newMediaUris.episodeIndex;
                this.mediaUris = newMediaUris;

                this.videoPlayer.stopVideo(true);
                this.videoPlayer.setUri(this.mediaUris.video);

                await this.profileClass.upsert(this.context, profileInfo);
            }
            else this.updateProfilePositionMillis(0, false);
            this.stopPlaying(true);
        }
        else {
            if(Date.now() - this.lastProfileUpdate > MEDIA_DEFAULT.PLAYBACK_UPDATE_PROFILE_INFO_INTERVAL && (positionMillis > 0 && (positionMillis > MEDIA_DEFAULT.MIN_MILLIS || this.tvs))) {
                this.updateProfilePositionMillis(positionMillis);
                this.lastProfileUpdate = Date.now();
            }
        }
    }

    async updateProfilePositionMillis(positionMillis, force_update = false) {
        if(!this.state.trailer) {
            let { runtime, id, profileInfo } = this.media;
            if(this.tvs) {
                runtime = this.media.episode_tvs[this.episodeIndex].runtime;
            }
            const durationMillis = runtime * 60000;
            const remainingMillis = durationMillis - positionMillis;

            if(!profileInfo) {
                profileInfo = this.profileClass.defaultObject(this.context, id);
                this.media.profileInfo = profileInfo;
            }
            
            if(!this.tvs) {
                if(remainingMillis < MEDIA_DEFAULT.REMAINING_MILLIS) {
                    profileInfo.completed = true;
                }
                else {
                    profileInfo.completed = false;
                }
            }
            else {
                if(profileInfo.season === -1 || profileInfo.episode === -1) {
                    const newMediaUris = getMediaUris(this.context, this.media);
                    profileInfo.season = newMediaUris.season;
                    profileInfo.episode = newMediaUris.episode;
                    
                    this.episodeIndex = newMediaUris.episodeIndex;
                    this.mediaUris = newMediaUris;
                    this.setHeaderInfo();
                }
            }

            profileInfo.current_time = positionMillis;
            await this.profileClass.upsert(this.context, profileInfo);
            this.media.profileInfo = profileInfo;
            if(force_update) {
                forceUpdateIfMounted(this);
            }
        }
    }

    renderVideoPlayer() {
        let { runtime, title, name, tagline, mediaInfo, profileInfo } = this.media;
        if(this.tvs && this.episodeIndex !== -1) {  
            tagline = this.episodeIndex < 0 ? "" : (this.media.episode_tvs[this.episodeIndex].tagline || "");
            runtime = this.media.episode_tvs[this.episodeIndex].runtime;
        }

        let positionMillis = 0;
        if((profileInfo && profileInfo.current_time > MEDIA_DEFAULT.MIN_MILLIS && !profileInfo.completed) || (profileInfo && this.tvs)) {
            positionMillis = profileInfo.current_time;
            if(positionMillis > (runtime * 60000) - 10000) positionMillis -= 20000;
            if(positionMillis < 0) positionMillis = 0;
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
                    backdrop={ mediaInfo.backdrop ? this.mediaUris.backdrop : null }
                    playIn={ 10 } //seconds
                    title={{
                        text: title || name,
                        subtext: tagline,
                        image: mediaInfo.logo ? this.mediaUris.logo : null
                    }}
                    videoProps={{
                        source: { uri: this.mediaUris.video },
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
        let { runtime, profileInfo } = this.media;
        if(this.tvs && this.episodeIndex !== -1) {
            runtime = this.media.episode_tvs[this.episodeIndex].runtime;
        }
        if((!this.tvs && profileInfo && profileInfo.current_time > MEDIA_DEFAULT.MIN_MILLIS && !profileInfo.completed) || (this.tvs && profileInfo && profileInfo.season !== -1 && profileInfo.episode !== -1)) {
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
        let { profileInfo, id } = this.media;
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
                            await this.profileClass.upsert(this.context, profileInfo);
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
                                profileInfo = this.profileClass.defaultObject(this.context, id);
                            }
                            profileInfo.fav = true;
                            await this.profileClass.upsert(this.context, profileInfo);
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

    renderEpisodesButton() {
        if(this.tvs) {
            return (
                <NormalButton
                    touchableRef={ component => this.episodesButton = component }
                    accessible={ this.state.playing ? false : true }
                    textStyle={ Styles.bigText }
                    icon={{
                        library: Ionicons,
                        name: "ios-photos"
                    }}
                    style={{ marginBottom: 20 }}
                    onPress={
                        () => {
                            if(this.media.episode_tvs.length > 0) {
                                setStateIfMounted(this, { ...this.state, episodesList: true });
                                this.setButtonsNextFocus();
                            }
                        }
                    }
                >
                    { i18n.t("play_screen.episodes_button") }
                </NormalButton>
            );
        }
    }

    renderButtonsOrEpisodesList() {
        if(this.state.episodesList) {
            return (
                <View
                    style={{
                        flex: 1,
                        marginTop: 50,
                        marginLeft: Definitions.DEFAULT_MARGIN,
                        marginBottom: -Definitions.DEFAULT_MARGIN,
                        marginRight: -Definitions.DEFAULT_MARGIN
                    }}
                >
                    <NormalButton
                        touchableRef={ component => this.episodesListBackButton = component }
                        hasTVPreferredFocus={ true }
                        accessible={ this.state.playing ? false : true }
                        textStyle={ Styles.bigText }
                        icon={{
                            library: Entypo,
                            name: "back"
                        }}
                        style={{ marginBottom: 20 }}
                        onPress={
                            () => {
                                setStateIfMounted(this, { ...this.state, episodesList: false });
                                this.setButtonsNextFocus();
                            }
                        }
                    >
                        { i18n.t("play_screen.episodes_list_back_button") }
                    </NormalButton>
                    <FlatList
                        ref={ component => this.flatList = component }
                        data={ this.media.episode_tvs }
                        keyExtractor={ (item, index) => String(index) }
                        showsVerticalScrollIndicator={ false }
                        scrollEnabled={ false }
                        renderItem={
                            ({ item, index }) => {
                                return (
                                    <EpisodeListCoverButton
                                        style={{
                                            flex: 1,
                                            margin: 2
                                        }}
                                        tv={ item }
                                        tvId={ this.media.id }
                                        onPress={
                                            async () => {
                                                let { profileInfo } = this.media;
                                                if(!(item.season === profileInfo.season && item.episode === profileInfo.episode)) {
                                                    profileInfo.season = item.season;
                                                    profileInfo.episode = item.episode;
                                                    profileInfo.current_time = 0;

                                                    const newMediaUris = getMediaUris(this.context, this.media);
                                                    profileInfo.season = newMediaUris.season;
                                                    profileInfo.episode = newMediaUris.episode;
                                                    this.episodeIndex = newMediaUris.episodeIndex;
                                                    this.mediaUris = newMediaUris;
                                                    this.videoPlayer.setUri(this.mediaUris.video);
                                                    await this.profileClass.upsert(this.context, profileInfo);
                                                }
                                                setStateIfMounted(this, { ...this.state, episodesList: false });
                                                this.setButtonsNextFocus();
                                            }
                                        }
                                        onFocus={
                                            () => {
                                                this.flatList.scrollToOffset({ offset: (COVER_ITEM_VALUES.HEIGHT * index), animated: true });
                                            }
                                        }
                                    />
                                );
                            }
                        }
                    />
                </View>
            );
        }
        else {
            return (
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
                    { this.renderEpisodesButton() }
                    { this.renderMyListButton() }
                </View>
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
                { this.renderButtonsOrEpisodesList() }
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