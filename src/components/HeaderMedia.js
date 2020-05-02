//Imports
import React from "react";
import { View, Text, Image, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Video } from "expo-av";
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { timeConvert } from "cuervo/src/utils/Functions";

//Vars
const
    VIDEO_PLAY_DELAY = 2000,
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
            showVideo: false,
            imageTitleAspestRatio: 1 / 1,
            backOpacity: new Animated.Value(0.8)
        };
        this.delayVideoTimeout = null;
        this.videoPaused = false;
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.title && (this.state.title.image != prevState.title.image)) {
            Image.getSize(this.state.title.image, (width, height) => {
                this.setState({
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
                    try {
                        if(!this.videoPaused) {
                            const playbackStatus = await this.videoPlayer.loadAsync({ uri: this.state.backdrop.video });
                            if(playbackStatus.isLoaded) {
                                this.videoPlayer.playAsync();
                                this.setState({ showVideo: true });
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

    setInfo(info) {
        if(this.state.backdrop.video) {
            this.videoPlayer.stopAsync();
        }
        this.fadeBack(false);
        this.setState({ ...info, showVideo: false });
    }

    fadeBack(fade_in) {
        if(fade_in && this.videoPlayer) {
            this.videoPlayer.pauseAsync();
        }
        Animated.timing(this.state.backOpacity, {
            toValue: fade_in ? 0.8 : 0.0,
            duration: BACK_FADE_DURATION,
            useNativeDriver: true
        }).start();
    }

    async pauseVideo() {
        if(this.videoPlayer) {
            const playbackStatus = await this.videoPlayer.getStatusAsync();
            if(playbackStatus.isLoaded) {
                this.videoPaused = true;
                this.videoPlayer.pauseAsync();
            }
        }
    }

    playVideo() {
        this.videoPaused = false;
    }

    renderTitle() {
        if(this.state.title) {
            if(this.state.title.image) {
                return (
                    <View style={{ marginTop: Definitions.DEFAULT_MARGIN, marginBottom: Definitions.DEFAULT_MARGIN }}>
                        <Image
                            style={{
                                height: 100,
                                aspectRatio: this.state.imageTitleAspestRatio
                            }}
                            resizeMode="contain"
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
                timeInfo = timeConvert(this.state.info.runtime * 60);
            }
            return (
                <View style={{ flexDirection: "row" }}>
                    { this.state.info.releaseDate && <Text style={[ Styles.normalText, { marginRight: Definitions.DEFAULT_MARGIN } ]}>{ this.state.info.releaseDate }</Text> }
                    { this.state.info.runtime && <Text style={[ Styles.normalText, { marginRight: Definitions.DEFAULT_MARGIN } ]}>{ timeInfo.hours + "h" + " " + timeInfo.minutes + "min" }</Text> }
                    { this.state.info.vote_average && <Text style={[ Styles.normalText, { marginRight: Definitions.DEFAULT_MARGIN } ]}>{ this.state.info.vote_average + "/10" }</Text> }
                </View>
            );
        }
    }

    renderDescription() {
        if(this.state.description) {
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
                    style={{
                        flex: 1,
                        zIndex: -2,
                    }}
                    source={{
                        uri: this.state.backdrop.image,
                    }}
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

    render () {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    overflowY: "hidden"
                }}
            >
                <Animated.View
                    opacity={ this.state.backOpacity }
                    style={{
                        position: "absolute",
                        top: "-50%",
                        width: "150%",
                        height: "150%",
                        backgroundColor: Definitions.PRIMARY_COLOR,
                        zIndex: 1
                    }}
                />
                <View
                    style={{
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "center"
                    }}
                >
                    { this.renderTitle() }
                    { this.renderInfo() }
                    { this.renderDescription() }
                </View>
                <View
                    style={{
                        flex: 1,
                        marginTop: -Definitions.DEFAULT_MARGIN,
                        marginRight: -Definitions.DEFAULT_MARGIN,
                        marginLeft: -100,
                        flexDirection: "column",
                    }}
                >
                    <LinearGradient
                        style={{
                            zIndex: -1,
                            position: "absolute",
                            left: 0,
                            width: 120,
                            height: "100%"
                        }}
                        colors={ [Definitions.PRIMARY_COLOR, "transparent"] }
                        start={ [0, 0] }
                        end={ [1, 0] }
                    />
                    <LinearGradient
                        style={{
                            zIndex: -1,
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            height: 60
                        }}
                        colors={ [Definitions.PRIMARY_COLOR, "transparent"] }
                        start={ [0, 1] }
                        end={ [0, 0] }
                    />
                    <View
                        style={{
                            flex: 1,
                            zIndex: -2,
                            overflow: "hidden"
                        }}
                    >
                        { this.renderBackdropImage() }
                        { this.renderBackdropVideo() }
                    </View>
                </View>
            </View>
        );
    }
}