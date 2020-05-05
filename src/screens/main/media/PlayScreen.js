import React from "react";
import { View, BackHandler, Animated, findNodeHandle } from "react-native";
import HeaderMedia from "cuervo/src/components/HeaderMedia";
import { SCREEN_MARGIN_LEFT } from "cuervo/src/components/TVDrawer";
import Definitions from "cuervo/src/utils/Definitions";
import NormalButton from "cuervo/src/components/NormalButton";
import Styles from "cuervo/src/utils/Styles";
import { MaterialIcons } from "@expo/vector-icons";
import * as Movie from "cuervo/src/api/Movie";
import { AppContext } from "cuervo/src/AppContext";
import VideoPlayer from "cuervo/src/components/VideoPlayer";

const
    BACK_FADE_DURATION = 1000;

export default class PlayScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.media = this.props.route.params.media;
        this.state = {
            playing: false,
            infoOpacity: new Animated.Value(1)
        };
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            if(this.props.navigation.isFocused()) {
                if(this.state.playing && this.videoPlayer) {
                    if(this.videoPlayer.areControlsEnabled()) {
                        this.stopPlaying();
                    }
                    else {
                        this.videoPlayer.toggleControls(true);
                    }
                }
                else {
                    this.props.navigation.navigate(this.props.route.params.backRouteName);
                }
                return true;
            }
            return false;
        });
        
        this.setHeaderInfo();
        this.setButtonsNextFocus();
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    stopPlaying() {
        if(this.videoPlayer){
            this.videoPlayer.stopVideo(true);
        }
        this.setState({ playing: false });
    }

    setButtonsNextFocus() {
        this.playButton.setNativeProps({
            nextFocusUp: findNodeHandle(this.playButton),
            nextFocusDown: findNodeHandle(this.trailerButton),
            nextFocusLeft: findNodeHandle(this.playButton),
            nextFocusRight: findNodeHandle(this.playButton)
        });
        this.trailerButton.setNativeProps({
            nextFocusUp: findNodeHandle(this.playButton),
            nextFocusDown: findNodeHandle(this.myListButton),
            nextFocusLeft: findNodeHandle(this.trailerButton),
            nextFocusRight: findNodeHandle(this.trailerButton)
        });
        this.myListButton.setNativeProps({
            nextFocusUp: findNodeHandle(this.trailerButton),
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
        });
    }

    renderVideoPlayer() {
        const { id, title, mediaInfo } = this.media;
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
                        source: { uri: Movie.getVideo(this.context, id) }
                    }}
                    onPlayStarted={
                        () => {
                            this.setState({ playing: true });
                        }
                    }
                    onVideoBackPressed={
                        () => {
                            this.stopPlaying();
                        }
                    }
                />
            </View>
        );
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
                    <NormalButton
                        touchableRef={ component => this.playButton = component }
                        hasTVPreferredFocus={ this.state.playing ? false : true }
                        accessible={ this.state.playing ? false : true }
                        focusable={ this.state.playing ? false : true }
                        textStyle={ Styles.bigText }
                        icon={{
                            library: MaterialIcons,
                            name: "play-arrow"
                        }}
                        style={{ marginBottom: Definitions.DEFAULT_MARGIN }}
                        onPress={
                            () => {
                                if(this.videoPlayer) {
                                    this.videoPlayer.playNow();
                                    this.setState({ playing: true });
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
                        Reproducir ahora
                    </NormalButton>

                    <NormalButton
                        touchableRef={ component => this.trailerButton = component }
                        accessible={ this.state.playing ? false : true }
                        focusable={ this.state.playing ? false : true }
                        textStyle={ Styles.bigText }
                        icon={{
                            library: MaterialIcons,
                            name: "local-play"
                        }}
                        style={{ marginBottom: 20 }}
                    >
                        Ver tráiler
                    </NormalButton>

                    <NormalButton
                        touchableRef={ component => this.myListButton = component }
                        accessible={ this.state.playing ? false : true }
                        focusable={ this.state.playing ? false : true }
                        textStyle={ Styles.bigText }
                        icon={{
                            library: MaterialIcons,
                            name: "playlist-add"
                        }}
                        style={{ marginBottom: Definitions.DEFAULT_MARGIN }}
                    >
                        Añadir a mi lista
                    </NormalButton>
                </View>
            </Animated.View>
        );
    }

    render() {
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