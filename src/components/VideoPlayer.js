import React from "react";
import { View, Animated, Easing, Text } from "react-native";
import { Video } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import IconButton from "cuervo/src/components/IconButton";
import ProgressBar from "cuervo/src/components/ProgressBar";
import Definitions from "cuervo/src/utils/Definitions";
import Styles from "cuervo/src/utils/Styles";

const
    ICON_SIZE = 30,
    CONTROLLERS_MARGIN = 25,
    CLOSED_CONTROLLER_Y_POSITION = 100,
    CONTROLLER_ANIMATION_DURATION = 500;

export default class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);
        
        this.videoProps = this.props.videoProps;

        this.state = {
            controllable: true,
            controlsFocused: false,
            topControlsPosY: new Animated.Value(- CLOSED_CONTROLLER_Y_POSITION),
            bottomControlsPosY: new Animated.Value(CLOSED_CONTROLLER_Y_POSITION)
        };
    }

    componentDidMount() {
        this.setState({ controlsFocused: true });
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.controlsFocused != prevState.controlsFocused) {
            this.animateControls();
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
                            width: "70%",
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
                            width: "70%",
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
                                name: "play-arrow"
                            }}
                            style={{ margin: Definitions.DEFAULT_MARGIN }}
                        />
                        <Text style={ Styles.bigSubtitleText }>11:10</Text>
                        <ProgressBar
                            style={{
                                flex: 1,
                                height: 3,
                                margin: Definitions.DEFAULT_MARGIN
                            }}
                        />
                        <Text style={ Styles.bigSubtitleText }>11:10</Text>
                    </Animated.View>
                </View>
                <Video
                    ref={ component => this.video = component }
                    resizeMode="contain"
                    style={{ width: "100%", height: "100%" }}
                    {...this.videoProps}
                />
            </View>
        );
    }
}