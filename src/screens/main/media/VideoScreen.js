import React from "react";
import { View, Text } from "react-native";
import Definitions from "cuervo/src/utils/Definitions";
import * as Movie from "cuervo/src/api/Movie";
import { AppContext } from "cuervo/src/AppContext";
import Styles from "cuervo/src/utils/Styles";
import NormalButton from "cuervo/src/components/NormalButton";
import VideoPlayer from "cuervo/src/components/VideoPlayer";
import { Entypo } from "@expo/vector-icons";

export default class InfoScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.media = this.props.route.params.media;
    }

    renderVideoPlayer() {
        const { mediaInfo, id } = this.media;
        if(mediaInfo.video) {
            return (
                <VideoPlayer
                    ref={ component => this.videoPlayer = component }
                    videoProps={{
                        source: { uri: Movie.getVideo(this.context, id) },
                        shouldPlay: true
                    }}
                />
            );
        }
        else {
            return (
                <View style={{ alignItems: "center" }}>
                    <Text style={ Styles.titleText }>No se puede reproducir</Text>
                    <NormalButton
                        hasTVPreferredFocus={ true }
                        icon={{
                            library: Entypo,
                            name: "back"
                        }}
                        onPress={ () => this.props.navigation.navigate("InfoScreen") }
                    >
                        Volver
                    </NormalButton>
                </View>
            );
        }
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: Definitions.PRIMARY_COLOR,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                { this.renderVideoPlayer() }
            </View>
        );
    }
}