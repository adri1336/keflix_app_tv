import React from "react";
import { View, Animated, Easing, Text, TVEventHandler, findNodeHandle, ActivityIndicator } from "react-native";
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
    HIDE_CONTROLS_TIME = 4000,
    
    SEEKING_MILLIS = 10000,
    SEEKING_ACCEL = 1.5;

export default class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);
        
        this.videoProps = this.props.videoProps;
        this.hideControlsTimeout = null;
        this.canSeek = false;
        this.durationMillis = 0;
        this.seekingAccel = 0;
        this.seekingPositionMillis = 0;
        this.lastTvSeek = 0;

        this.state = {
            controlsFocused: false,
            topControlsPosY: new Animated.Value(- CLOSED_CONTROLLER_Y_POSITION),
            bottomControlsPosY: new Animated.Value(CLOSED_CONTROLLER_Y_POSITION),

            seeking: false,
            paused: false,
            buffering: true,
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
                if(evt) {
                    if(this.state.seeking) {
                        if(evt.eventKeyAction == 1) {
                            this.stopSeeking();
                        }
                        else {
                            if(Date.now() - this.lastTvSeek > 200) {
                                if(evt.eventType == "left") {
                                    this.seek(-SEEKING_MILLIS);
                                }
                                else if(evt.eventType == "right") {
                                    this.seek(SEEKING_MILLIS);
                                }
                                this.lastTvSeek = Date.now();
                            }
                        }
                    }
                    else {
                        if(!this.state.controlsFocused) {
                            if(evt.eventKeyAction == 1) {
                                this.setState({ controlsFocused: true });
                            }
                        }
                        else {
                            if(this.canSeek && !this.state.buffering) {
                                if(evt.eventType == "left") {
                                    this.startSeeking(-SEEKING_MILLIS);
                                }
                                else if(evt.eventType == "right") {
                                    this.startSeeking(SEEKING_MILLIS);
                                }
                            }
                            this.hideControlsTimer();
                        }
                    }
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
        this.setButtonsNextFocus();
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
            this.setButtonsNextFocus();
        }
    }

    async startSeeking(amount = 0) {
        if(this.video) {
            this.video.pauseAsync();
            const { positionMillis } = await this.video.getStatusAsync();
            this.seekingPositionMillis = positionMillis + amount;
            this.updateBottomControls(this.seekingPositionMillis, true);
        }
    }

    async stopSeeking() {
        if(this.video) {
            await this.video.setStatusAsync({ positionMillis: this.seekingPositionMillis });
            if(!this.state.paused) {
                this.video.playAsync();
            }
            this.seekingAccel = 0;
            this.setState({ seeking: false });
        }
    }

    seek(amount) {
        this.seekingAccel += SEEKING_ACCEL;
        this.seekingPositionMillis += amount * this.seekingAccel;
        this.updateBottomControls(this.seekingPositionMillis, true);
    }

    setButtonsNextFocus() {
        if(this.state.seeking) {
            if(this.go_back_button) {
                this.go_back_button.setNativeProps({
                    nextFocusUp: findNodeHandle(this.go_back_button),
                    nextFocusDown: findNodeHandle(this.go_back_button),
                    nextFocusLeft: findNodeHandle(this.go_back_button),
                    nextFocusRight: findNodeHandle(this.go_back_button)
                });
            }

            if(this.replay_button) {
                this.replay_button.setNativeProps({
                    nextFocusUp: findNodeHandle(this.replay_button),
                    nextFocusDown: findNodeHandle(this.replay_button),
                    nextFocusLeft: findNodeHandle(this.replay_button),
                    nextFocusRight: findNodeHandle(this.replay_button)
                });
            }

            if(this.playPause_button) {
                this.playPause_button.setNativeProps({
                    nextFocusUp: findNodeHandle(this.playPause_button),
                    nextFocusDown: findNodeHandle(this.playPause_button),
                    nextFocusLeft: findNodeHandle(this.playPause_button),
                    nextFocusRight: findNodeHandle(this.playPause_button)
                });
            }
        }
        else {
            if(this.state.controlsFocused) {
                if(this.go_back_button) {
                    this.go_back_button.setNativeProps({
                        nextFocusUp: findNodeHandle(this.go_back_button),
                        nextFocusDown: findNodeHandle(this.playPause_button),
                        nextFocusLeft: findNodeHandle(this.go_back_button),
                        nextFocusRight: findNodeHandle(this.replay_button)
                    });
                }

                if(this.replay_button) {
                    this.replay_button.setNativeProps({
                        nextFocusUp: findNodeHandle(this.replay_button),
                        nextFocusDown: findNodeHandle(this.playPause_button),
                        nextFocusLeft: findNodeHandle(this.go_back_button),
                        nextFocusRight: findNodeHandle(this.replay_button)
                    });
                }

                if(this.playPause_button) {
                    this.playPause_button.setNativeProps({
                        nextFocusUp: findNodeHandle(this.go_back_button),
                        nextFocusDown: findNodeHandle(this.playPause_button),
                        nextFocusLeft: findNodeHandle(this.playPause_button),
                        nextFocusRight: findNodeHandle(this.playPause_button)
                    });
                }
            }
            else {
                if(this.go_back_button) {
                    this.go_back_button.setNativeProps({
                        nextFocusUp: findNodeHandle(this.go_back_button),
                        nextFocusDown: findNodeHandle(this.go_back_button),
                        nextFocusLeft: findNodeHandle(this.go_back_button),
                        nextFocusRight: findNodeHandle(this.go_back_button)
                    });
                }

                if(this.replay_button) {
                    this.replay_button.setNativeProps({
                        nextFocusUp: findNodeHandle(this.replay_button),
                        nextFocusDown: findNodeHandle(this.replay_button),
                        nextFocusLeft: findNodeHandle(this.replay_button),
                        nextFocusRight: findNodeHandle(this.replay_button)
                    });
                }

                if(this.playPause_button) {
                    this.playPause_button.setNativeProps({
                        nextFocusUp: findNodeHandle(this.playPause_button),
                        nextFocusDown: findNodeHandle(this.playPause_button),
                        nextFocusLeft: findNodeHandle(this.playPause_button),
                        nextFocusRight: findNodeHandle(this.playPause_button)
                    });
                }
            }
        }
    }

    hideControlsTimer() {
        if(this.state.controlsFocused) {
            if(this.hideControlsTimeout) {
                clearTimeout(this.hideControlsTimeout);
                this.hideControlsTimeout = null;
            }
            this.hideControlsTimeout = setTimeout(async () => {
                if(!this.state.seeking) {
                    this.hideControlsTimeout = null;
                    this.setState({ controlsFocused: false });
                }
            }, HIDE_CONTROLS_TIME);
        }
    }

    playOrPauseVideo() {
        if(this.video) {
            if(this.state.paused) {
                this.video.playAsync();
                this.setState({ paused: false });
            }
            else {
                this.video.pauseAsync();
                this.setState({ paused: true });
            }
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
        if(!this.state.seeking) {
            if(playbackStatus.isPlaying) {
                this.updateBottomControls(playbackStatus.positionMillis);   
            }
            else if(playbackStatus.isBuffering) {
                if(!this.state.paused && !this.state.buffering) {
                    this.setState({ buffering: true });
                }
                else if(this.state.paused && this.state.buffering) {
                    this.setState({ buffering: false });
                }
            }
        }
    }

    updateBottomControls(positionMillis, seeking = false) {
        if(positionMillis < 0) positionMillis = 0;
        else if(positionMillis > this.durationMillis) positionMillis = this.durationMillis;
        
        const remainingMillis = this.durationMillis - positionMillis;
        const progress = 100 - ((remainingMillis * 100) / this.durationMillis);
        
        const bottomControlState = {
            currentTime: timeConverFormatted(positionMillis / 1000),
            progress: progress,
            remainingTime: timeConverFormatted(remainingMillis / 1000)
        };

        if(this.state.buffering) this.setState({ seeking: seeking, buffering: false, bottomControlState: bottomControlState });
        else this.setState({ seeking: seeking, bottomControlState: bottomControlState });
    }

    onReadyForDisplay(info) {
        this.durationMillis = info.status.durationMillis;
    }

    renderBufferingIcon() {
        if(this.state.buffering) {
            return <ActivityIndicator size="large" color={Definitions.SECONDARY_COLOR}/>;
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
                    { this.renderBufferingIcon() }
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
                            touchableRef={ component => this.go_back_button = component }
                            size={ ICON_SIZE }
                            icon={{
                                library: MaterialIcons,
                                name: "arrow-back"
                            }}
                            text={ "Salir" }
                            textStyle={ Styles.bigSubtitleText }
                            style={{ margin: Definitions.DEFAULT_MARGIN }}
                            onFocus={ () => this.canSeek = false }
                        />
                        <IconButton
                            touchableRef={ component => this.replay_button = component }
                            size={ ICON_SIZE }
                            icon={{
                                library: MaterialIcons,
                                name: "skip-previous"
                            }}
                            text={ "Reproducir desde el principio" }
                            textStyle={ Styles.bigSubtitleText }
                            style={{ margin: Definitions.DEFAULT_MARGIN }}
                            onFocus={ () => this.canSeek = false }
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
                            touchableRef={ component => this.playPause_button = component }
                            hasTVPreferredFocus={ true }
                            size={ ICON_SIZE }
                            icon={{
                                library: MaterialIcons,
                                name: this.state.paused ? "play-arrow" : "pause"
                            }}
                            style={{ margin: Definitions.DEFAULT_MARGIN }}
                            onPress={ () => this.playOrPauseVideo() }
                            onFocus={ () => this.canSeek = true }
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
                    onReadyForDisplay={ (info) => this.onReadyForDisplay(info) }
                    {...this.videoProps}
                />
            </View>
        );
    }
}