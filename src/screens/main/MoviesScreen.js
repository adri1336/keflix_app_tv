//Imports
import React from "react";
import { View } from "react-native";

//Components Imports
import HeaderMedia from "cuervo/src/components/HeaderMedia";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { AppContext } from "cuervo/src/AppContext";
import { DRAWER_VALUES } from "cuervo/src/components/TVDrawer";

//Code
export default class MoviesScreen extends React.Component {
    static contextType = AppContext;

    componentDidMount() {
        this.account = this.context.state.account;
        this.profile = this.context.state.profile;
        this.headerMedia.setInfo({
            title: {
                text: "Bad Boys For Life",
                image: "https://i.imgur.com/HlcljK9.png"
            },
            info: {
                releaseDate: "2020",
                runtime: 128,
                vote_average: 7.2,
            },
            description: "El Departamento de Policía de Miami y su equipo de élite AMMO intentan derribar a Armando Armas, jefe de un cartel de la droga. Armando es un asesino de sangre fría con una naturaleza viciosa y contaminante. Él está comprometido con el trabajo del cartel y es enviado por su madre Isabel, para matar a Mike.",
            backdrop: {
                image: "https://image.tmdb.org/t/p/original/upUy2QhMZEmtypPW3PdieKLAHxh.jpg",
                video: null //"https://cuervo-video.s3.eu-west-3.amazonaws.com/trailers/38700.mp4"
            }
        });
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    margin: Definitions.DEFAULT_MARGIN,
                    marginLeft: (DRAWER_VALUES.DRAWER_CLOSED_ITEMS_MARGIN * 2) + DRAWER_VALUES.DRAWER_ICON_SIZE,
                    backgroundColor: Definitions.PRIMARY_COLOR
                }}
            >
                <HeaderMedia
                    ref={ component => this.headerMedia = component }
                />
                <View
                    style={{
                        flex: 1,
                        marginBottom: -Definitions.DEFAULT_MARGIN,
                        marginRight: -Definitions.DEFAULT_MARGIN
                    }}
                >
                    
                </View>
            </View>
        );
    }
}