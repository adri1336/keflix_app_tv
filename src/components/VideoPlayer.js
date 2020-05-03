import React from "react";
import { View, Animated, Easing, Text, TVEventHandler } from "react-native";
import { Video } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import IconButton from "cuervo/src/components/IconButton";
import ProgressBar from "cuervo/src/components/ProgressBar";
import Definitions from "cuervo/src/utils/Definitions";
import Styles from "cuervo/src/utils/Styles";
import { timeConverFormatted } from "cuervo/src/utils/Functions";

const
    ICON_SIZE = 30,
    CONTROLLERS_MARGIN = 25,
    CLOSED_CONTROLLER_Y_POSITION = 100,
    CONTROLLER_ANIMATION_DURATION = 500,
    HIDE_CONTROLS_TIME = 4000;

export default class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);
        
        this.videoProps = this.props.videoProps;
        this.hideControlsTimeout = null;

        this.state = {
            controllable: true,
            controlsFocused: false,
            topControlsPosY: new Animated.Value(- CLOSED_CONTROLLER_Y_POSITION),
            bottomControlsPosY: new Animated.Value(CLOSED_CONTROLLER_Y_POSITION),

            playPauseIcon: "pause",
            bottomControlState: {
                currentTime: "0:00",
                progress: 0,
                remainingTime: "0:00"
            }
        };
    }

    enableTVEventHandler() {
        if(!this.tvEventHandler) {
            this.tvEventHandler = new TVEventHandler();
            this.tvEventHandler.enable(this, (cmp, evt) => {
                if(!this.state.controlsFocused) {
                    if(evt && evt.eventKeyAction == 1) {
                        if(evt.eventType == "select") {
                            this.playOrPauseVideo();
                        }
                        this.setState({ controlsFocused: true });
                    }
                }
                else {
                    this.hideControlsTimer();
                }
            });
        }
    }

    disableTVEventHandler() {
        if(this.tvEventHandler) {
            this.tvEventHandler.disable();
        }
    }

    componentDidMount() {
        this.enableTVEventHandler();
        this.setState({ controlsFocused: true });
    }

    componentWillUnmount() {
        this.disableTVEventHandler();
        if(this.hideControlsTimeout) {
            clearTimeout(this.hideControlsTimeout);
            this.hideControlsTimeout = null;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.controlsFocused != prevState.controlsFocused) {
            this.animateControls();
            this.hideControlsTimer();
        }
    }

    hideControlsTimer() {
        if(this.state.controlsFocused) {
            if(this.hideControlsTimeout) {
                clearTimeout(this.hideControlsTimeout);
                this.hideControlsTimeout = null;
            }
            this.hideControlsTimeout = setTimeout(async () => {
                this.hideControlsTimeout = null;
                this.setState({ controlsFocused: false });
            }, HIDE_CONTROLS_TIME);
        }
    }

    async playOrPauseVideo() {
        try {
            if(!this.video) throw "no video";
            const playbackStatus = await this.video.getStatusAsync();
            if(playbackStatus.isPlaying) {
                this.video.pauseAsync();
                this.setState({ playPauseIcon: "play-arrow" });
            }
            else {
                this.video.playAsync();
                this.setState({ playPauseIcon: "pause" });
            }
        }
        catch(error) {
            console.log(error);
        }
    }

    animateControls() {
        Animated.timing(this.state.topControlsPosY, {
            toValue: this.state.controlsFocused ? 0 : - CLOSED_CONTROLLER_Y_POSITION,
            duration: CONTROLLER_ANIMATION_DURATION,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp)
        }).start();
        Animated.timing(this.state.bottomControlsPosY, {
            toValue: this.state.controlsFocused ? 0 :  CLOSED_CONTROLLER_Y_POSITION,
            duration: CONTROLLER_ANIMATION_DURATION,
            useNativeDriver: true,
            easing: Easing.out(Easing.exp)
        }).start();
    }

    onPlaybackStatusUpdate(playbackStatus) {
        if(playbackStatus.isPlaying) {
            const remainingMillis = playbackStatus.durationMillis - playbackStatus.positionMillis;
            const progress = 100 - ((remainingMillis * 100) / playbackStatus.durationMillis);
            const bottomControlState = {
                currentTime: timeConverFormatted(playbackStatus.positionMillis / 1000),
                progress: progress,
                remainingTime: timeConverFormatted(remainingMillis / 1000)
            };
            this.setState({ bottomControlState: bottomControlState });
        }
    }

    render() {
        return (
            <View style={{ width: "100%", height: "100%" }}>
                <View
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1
                    }}
                >
                    <Animated.View
                        style={{
                            position: "absolute",
                            top: 0,
                            width: "80%",
                            height: 50,
                            alignItems: "center",
                            flexDirection: "row",
                            marginTop: CONTROLLERS_MARGIN,
                            transform: [{
                                translateY: this.state.topControlsPosY
                            }]
                        }}
                    >
                        <IconButton
                            size={ ICON_SIZE }
                            icon={{
                                library: MaterialIcons,
                                name: "arrow-back"
                            }}
                            text={ "Salir" }
                            textStyle={ Styles.bigSubtitleText }
                            style={{ margin: Definitions.DEFAULT_MARGIN }}
                        />
                        <IconButton
                            size={ ICON_SIZE }
                            icon={{
                                library: MaterialIcons,
                                name: "skip-previous"
                            }}
                            text={ "Reproducir desde el principio" }
                            textStyle={ Styles.bigSubtitleText }
                            style={{ margin: Definitions.DEFAULT_MARGIN }}
                        />
                    </Animated.View>

                    
                    <Animated.View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            width: "80%",
                            height: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            marginBottom: CONTROLLERS_MARGIN,
                            transform: [{
                                translateY: this.state.bottomControlsPosY
                            }]
                        }}
                    >
                        <IconButton
                            hasTVPreferredFocus={ true }
                            size={ ICON_SIZE }
                            icon={{
                                library: MaterialIcons,
                                name: this.state.playPauseIcon
                            }}
                            style={{ margin: Definitions.DEFAULT_MARGIN }}
                            onPress={ () => this.playOrPauseVideo() }
                        />
                        <Text style={ Styles.bigSubtitleText }>{ this.state.bottomControlState.currentTime }</Text>
                        <ProgressBar
                            progress={ this.state.bottomControlState.progress }
                            style={{
                                flex: 1,
                                height: 3,
                                margin: Definitions.DEFAULT_MARGIN
                            }}
                        />
                        <Text style={ Styles.bigSubtitleText }>{ this.state.bottomControlState.remainingTime }</Text>
                    </Animated.View>
                </View>
                <Video
                    ref={ component => this.video = component }
                    resizeMode="contain"
                    style={{ width: "100%", height: "100%" }}
                    onPlaybackStatusUpdate={ (playbackStatus) => this.onPlaybackStatusUpdate(playbackStatus) }
                    {...this.videoProps}
                />
            </View>
        );
    }
}