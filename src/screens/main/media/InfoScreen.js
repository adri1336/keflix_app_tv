import React from "react";
import { View, BackHandler } from "react-native";
import HeaderMedia from "cuervo/src/components/HeaderMedia";
import { SCREEN_MARGIN_LEFT } from "cuervo/src/components/TVDrawer";
import Definitions from "cuervo/src/utils/Definitions";
import NormalButton from "cuervo/src/components/NormalButton";
import Styles from "cuervo/src/utils/Styles";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

export default class InfoScreen extends React.Component {
    constructor(props) {
        super(props);
        this.media = this.props.route.params.media;
        this.mediaInfo = this.props.route.params.mediaInfo;
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            if(this.props.navigation.isFocused()) {
                this.props.navigation.navigate(this.props.route.params.backRouteName);
                return true;
            }
            return false;
        });
        
        this.setHeaderInfo();
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    setHeaderInfo() {
        const { title, release_date, runtime, vote_average, overview } = this.media;
        this.headerMedia.setInfo({
            title: {
                text: title,
                image: this.mediaInfo.logo
            },
            info: {
                releaseDate: release_date.substr(0, 4),
                runtime: runtime,
                vote_average: vote_average,
            },
            description: overview,
            backdrop: {
                image: this.mediaInfo.image,
                video: null
            }
        });
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    padding: Definitions.DEFAULT_MARGIN,
                    paddingLeft: SCREEN_MARGIN_LEFT,
                    backgroundColor: Definitions.PRIMARY_COLOR
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
                        hasTVPreferredFocus={ true }
                        textStyle={ Styles.bigText }
                        icon={{
                            library: MaterialIcons,
                            name: "play-arrow"
                        }}
                        style={{ marginBottom: Definitions.DEFAULT_MARGIN }}
                    >
                        Reproducir ahora
                    </NormalButton>

                    <NormalButton
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
            </View>
        );
    }
}