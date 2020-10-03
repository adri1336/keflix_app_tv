//Imports
import React from "react";
import { View, Text, Image, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Video } from "expo-av";
import Styles from "app/src/utils/Styles";
import i18n from "i18n-js";

//Other Imports
import Definitions, { MEDIA_DEFAULT } from "app/src/utils/Definitions";
import { hoursMinutesFormat, setStateIfMounted } from "app/src/utils/Functions";
import ProgressBar from "app/src/components/ProgressBar";

//Vars
const
    VIDEO_PLAY_DELAY = 5000,
    BACK_FADE_DURATION = 500;

//Code
export default class HeaderMedia extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: {
                text: null,
                image: null
            },
            info: {
                releaseDate: null,
                runtime: null,
                vote_average: null,
            },
            description: null,
            backdrop: {
                image: null,
                video: null
            },
            progress: null,
            tagline: null,
            showVideo: false,
            imageTitleAspestRatio: 1 / 1,
            backOpacity: new Animated.Value(0.8)
        };
        this.delayVideoTimeout = null;
        this.videoPaused = false;
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
        if(this.delayVideoTimeout) {
            clearTimeout(this.delayVideoTimeout);
            this.delayVideoTimeout = null;
        }
    }

    shouldComponentUpdate() {
        if(!this._isMounted) {
            return false;
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.title && this.state.title.image && (this.state.title.image != prevState.title.image)) {
            Image.getSize(this.state.title.image, (width, height) => {
                setStateIfMounted(this, {
                    ...this.state,
                    imageTitleAspestRatio: width / height
                });
            });
        }
        if(this.state.backdrop && (this.state.backdrop.video != prevState.backdrop.video)) {
            if(this.delayVideoTimeout) {
                clearTimeout(this.delayVideoTimeout);
                this.delayVideoTimeout = null;
            }

            if(this.videoPlayer && this.state.backdrop.video) {
                this.delayVideoTimeout = setTimeout(async () => {
                    this.delayVideoTimeout = null;
                    try {
                        if(!this.videoPaused) {
                            const playbackStatus = await this.videoPlayer.loadAsync({ uri: this.state.backdrop.video });
                            if(playbackStatus.isLoaded) {
                                this.videoPlayer.playAsync();
                                setStateIfMounted(this, { showVideo: true });
                            }
                        }
                    }
                    catch(error) {
                        console.log(error);
                    }
                }, VIDEO_PLAY_DELAY);
            }
        }
    }

    setInfo(info, fadeBack = true) {
        if(this.state.backdrop.video) {
            this.videoPaused = false;
            this.videoPlayer.stopAsync();
        }
        if(fadeBack) {
            this.fadeBack(false);
        }
        setStateIfMounted(this, { ...info, showVideo: false });
    }

    async fadeBack(fade_in) {
        if(fade_in && this.videoPlayer) {
            const playbackStatus = await this.videoPlayer.getStatusAsync();
            if(playbackStatus.isLoaded) {
                this.videoPlayer.pauseAsync();
            }
        }
        Animated.timing(this.state.backOpacity, {
            toValue: fade_in ? 0.8 : 0.0,
            duration: BACK_FADE_DURATION,
            useNativeDriver: true
        }).start();
    }

    async pauseVideo() {
        if(this.videoPlayer) {
            this.videoPaused = true;
            const playbackStatus = await this.videoPlayer.getStatusAsync();
            if(playbackStatus.isLoaded) {
                this.videoPlayer.pauseAsync();
            }
        }
    }

    stopVideo() {
        if(this.videoPlayer) {
            if(this.delayVideoTimeout) {
                clearTimeout(this.delayVideoTimeout);
                this.delayVideoTimeout = null;
            }
            this.videoPaused = true;
            this.videoPlayer.stopAsync();
            setStateIfMounted(this, { showVideo: false });
        }
    }

    playVideo() {
        if(this.videoPlayer) {
            this.videoPaused = false;
            this.videoPlayer.playAsync();
        }
    }

    renderTitle() {
        if(this.state.title) {
            if(this.state.title.image) {
                return (
                    <View style={{ marginTop: Definitions.DEFAULT_MARGIN, marginBottom: Definitions.DEFAULT_MARGIN }}>
                        <Image
                            style={{
                                maxWidth: 300,
                                height: 100,
                                aspectRatio: this.state.imageTitleAspestRatio
                            }}
                            resizeMode="contain"
                            resizeMethod="resize"
                            source={{ uri: this.state.title.image }}
                        />
                    </View>
                );
            }
            else if(this.state.title.text) {
                return (
                    <View>
                        <Text
                            numberOfLines={ 2 }
                            style={[ Styles.titleText, { fontWeight: "bold" } ]}
                        >
                            { this.state.title.text }
                        </Text>
                    </View>
                );
            }
        }
    }

    renderInfo() {
        if(this.state.info && (this.state.info.releaseDate || this.state.info.runtime || this.state.info.vote_average)) {
            let timeInfo = null;
            if(this.state.info.runtime) {
                timeInfo = hoursMinutesFormat(this.state.info.runtime * 60);
            }
            return (
                <View style={{ flexDirection: "row" }}>
                    { this.state.info.releaseDate && <Text style={[ Styles.normalText, { marginRight: Definitions.DEFAULT_MARGIN } ]}>{ this.state.info.releaseDate }</Text> }
                    { timeInfo && <Text style={[ Styles.normalText, { marginRight: Definitions.DEFAULT_MARGIN } ]}>{ timeInfo }</Text> }
                    { this.state.info.vote_average && <Text style={[ Styles.normalText, { marginRight: Definitions.DEFAULT_MARGIN } ]}>{ this.state.info.vote_average + "/10" }</Text> }
                </View>
            );
        }
    }

    renderDescriptionOrProgress() {
        if(this.state.progress && this.state.progress.current_time > MEDIA_DEFAULT.MIN_MILLIS && !this.state.progress.completed) {
            const { total_time, current_time } = this.state.progress;
            const remainingMillis = total_time - current_time;
            const progress = 100 - ((remainingMillis * 100) / total_time);
            const remaining = hoursMinutesFormat(remainingMillis / 1000);

            return (
                <View
                    style={{
                        marginTop: Definitions.DEFAULT_MARGIN,
                        flexDirection: "column"
                    }}
                >
                    {
                        this.state.tagline &&
                        <Text
                            numberOfLines={ 1 }
                            style={[
                                Styles.bigSubtitleText,
                                {
                                    color: "rgba(255, 255, 255, 0.6)"
                                }
                            ]}
                        >
                            { this.state.tagline }
                        </Text>
                    }
                    <View
                        style={{
                            marginTop: Definitions.DEFAULT_MARGIN,
                            flexDirection: "row",
                            alignItems: "center"
                        }}
                    >
                        <ProgressBar
                            progress={ progress }
                            bgColor="#A9A9A9"
                            style={{
                                width: 100,
                                height: 3
                            }}
                        />
                        <Text
                            numberOfLines={ 1 }
                            style={[
                                Styles.bigSubtitleText,
                                {
                                    color: "rgba(255, 255, 255, 0.6)",
                                    marginLeft: Definitions.DEFAULT_MARGIN
                                }
                            ]}
                        >
                            { i18n.t("header_media.remaining_time", { remaining: remaining }) }
                        </Text>
                    </View>
                </View>
            );
        }
        else if(this.state.description) {
            return (
                <View>
                    <Text
                        numberOfLines={ 7 }
                        style={[
                            Styles.bigSubtitleText,
                            {
                                marginTop: Definitions.DEFAULT_MARGIN,
                                color: "rgba(255, 255, 255, 0.6)"
                            }
                        ]}
                    >
                        { this.state.description }   
                    </Text>
                </View>
            );
        }
    }

    renderBackdropImage() {
        if(this.state.backdrop && this.state.backdrop.image) {
            return (
                <Image
                    style={{ flex: 1 }}
                    source={{
                        uri: this.state.backdrop.image,
                    }}
                    resizeMethod="resize"
                />
            );
        }
    }

    renderBackdropVideo() {
        if(this.state.backdrop && this.state.backdrop.video) {
            return (
                <Video
                    ref={ component => this.videoPlayer = component }
                    /*source={{ uri: this.state.backdrop.video }}*/
                    usePoster={ this.state.backdrop.image ? true : false }
                    posterSource={{ uri: this.state.backdrop.image || null }}
                    rate={ 1.0 } //velocidad
                    resizeMode="cover"
                    opacity={ this.state.showVideo ? 1.0 : 0.0 }
                    onPlaybackStatusUpdate={
                        playbackStatus => {
                            if(this.videoPaused && playbackStatus.isLoaded) {
                                this.videoPlayer.pauseAsync();
                            }
                            if(playbackStatus.didJustFinish) {
                                setStateIfMounted(this, { showVideo: false });
                            }
                        }
                    }
                    style={{
                        position: "absolute",
                        top: "-20%",
                        width: "100%",
                        height: "140%"
                    }}
                />
            );
        }
    }

    renderBackdrop() {
        if(this.state.backdrop) {
            return (
                <View
                    style={{
                        flex: 55,
                        marginTop: -Definitions.DEFAULT_MARGIN,
                        marginRight: -Definitions.DEFAULT_MARGIN,
                        marginLeft: -100,
                        marginBottom: -35,
                        flexDirection: "column"
                    }}
                >
                    <LinearGradient
                        style={{
                            zIndex: -3,
                            position: "absolute",
                            left: 0,
                            width: 80,
                            height: "100%"
                        }}
                        colors={ [Definitions.PRIMARY_COLOR, "transparent"] }
                        start={ [0, 0] }
                        end={ [1, 0] }
                    />
                    <LinearGradient
                        style={{
                            zIndex: -3,
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            height: 40
                        }}
                        colors={ [Definitions.PRIMARY_COLOR, "transparent"] }
                        start={ [0, 1] }
                        end={ [0, 0] }
                    />
                    <View
                        style={{
                            flex: 1,
                            zIndex: -4,
                            overflow: "hidden"
                        }}
                    >
                        { this.renderBackdropImage() }
                        { this.renderBackdropVideo() }
                    </View>
                </View>
            );
        }
        else {
            return (
                <View
                    style={{
                        flex: 55,
                        marginTop: -Definitions.DEFAULT_MARGIN,
                        marginRight: -Definitions.DEFAULT_MARGIN,
                        marginLeft: -100,
                        marginBottom: -35,
                        flexDirection: "column"
                    }}
                />
            );
        }
    }

    renderBackFade() {
        if(this.state.backdrop) {
            return (
                <Animated.View
                    opacity={ this.state.backOpacity }
                    style={{
                        position: "absolute",
                        top: "-50%",
                        width: "150%",
                        height: "300%",
                        backgroundColor: Definitions.PRIMARY_COLOR,
                        zIndex: -1
                    }}
                />
            );
        }
    }

    render () {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    overflowY: "hidden"
                }}
            >
                { this.renderBackFade() }
                <View
                    style={{
                        flex: 45,
                        flexDirection: "column",
                        justifyContent: "center",
                        zIndex: -2
                    }}
                >
                    { this.renderTitle() }
                    { this.renderInfo() }
                    { this.renderDescriptionOrProgress() }
                </View>
                { this.renderBackdrop() }
            </View>
        );
    }
}