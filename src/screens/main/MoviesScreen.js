//Imports
import React from "react";
import { View, Text, Image, FlatList, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

//Components Imports
import NormalButton from "cuervo/src/components/NormalButton";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { AppContext } from "cuervo/src/AppContext";
import { DRAWER_VALUES } from "cuervo/src/components/TVDrawer";

//Code
export default class MoviesScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.movies = [
            {
                id: 0,
                poster: "https://image.tmdb.org/t/p/original/hIX9L34Zq6TMr81LhKMMZHYJYJ5.jpg"
            },
            {
                id: 1,
                poster: "https://image.tmdb.org/t/p/original/kK6Oq4JywUNXmJ299efUkv1h6Mn.jpg"
            },
            {
                id: 3,
                poster: "https://image.tmdb.org/t/p/original/A7hhUj9Fq6E6FhGsENJTCmnCmt4.jpg"
            },
            {
                id: 4,
                poster: "https://image.tmdb.org/t/p/original/jlHL2BH176JApGiLnNQLQgdjMFd.jpg"
            },
            {
                id: 5,
                poster: "https://image.tmdb.org/t/p/original/16G2wZAkmKqSGK3it2VPjco5oyn.jpg"
            },
            {
                id: 6,
                poster: "https://image.tmdb.org/t/p/original/im0jKiVtVyxynKVnzOyd6efbqYE.jpg"
            },
            {
                id: 7,
                poster: "https://image.tmdb.org/t/p/original/dicP4RZkcgJi9udelg6QuYxf4K7.jpg"
            },
            {
                id: 8,
                poster: "https://image.tmdb.org/t/p/original/b1bTpxh0lRfw7kwRrWPeMOo7jbY.jpg"
            },
        ];
    }

    componentDidMount() {
        this.account = this.context.account;
        this.profile = this.context.profile;
    }

    renderMovie(item) {
        const movie = item.item;
        return (
            <View
                style={{
                    width: 115,
                    height: 165,
                    marginRight: 4,
                    borderWidth: 2,
                    borderColor: movie.id == 0 ? "white" : "#00000000"
                }}
            >
                <Image
                    style={{
                        flex: 1
                    }}
                    source={{
                        uri: movie.poster
                    }}
                />
            </View>
        );
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
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row"
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "column",
                            justifyContent: "center"
                        }}
                    >
                        <Text style={[ Styles.titleText, { fontWeight: "bold" } ]}>Bad Boys For Life</Text>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={[ Styles.normalText, { marginRight: Definitions.DEFAULT_MARGIN } ]}>2009</Text>
                            <Text style={[ Styles.normalText, { marginRight: Definitions.DEFAULT_MARGIN } ]}>2h 30min</Text>
                            <Text style={[ Styles.normalText, { marginRight: Definitions.DEFAULT_MARGIN } ]}>7.2/10</Text>
                        </View>
                        <Text style={[ Styles.normalText, { marginTop: Definitions.DEFAULT_MARGIN } ]}>
                            El Departamento de Policía de Miami y su equipo de élite AMMO intentan derribar a Armando Armas, jefe de un cartel de la droga. Armando es un asesino de sangre fría con una naturaleza viciosa y contaminante. Él está comprometido con el trabajo del cartel y es enviado por su madre Isabel, para matar a Mike.
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            marginTop: -Definitions.DEFAULT_MARGIN,
                            marginRight: -Definitions.DEFAULT_MARGIN,
                            marginLeft: -50,
                            flexDirection: "column",
                        }}
                    >
                        <LinearGradient
                            style={{
                                zIndex: -1,
                                position: "absolute",
                                left: 0,
                                width: 30,
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
                                height: 30
                            }}
                            colors={ [Definitions.PRIMARY_COLOR, "transparent"] }
                            start={ [0, 1] }
                            end={ [0, 0] }
                        />
                        <Image
                            style={{
                                flex: 1,
                                zIndex: -2,
                            }}
                            source={{
                                uri: "https://image.tmdb.org/t/p/original/upUy2QhMZEmtypPW3PdieKLAHxh.jpg",
                            }}
                        />
                    </View>

                </View>
                <View
                    style={{
                        flex: 1,
                        marginBottom: -Definitions.DEFAULT_MARGIN,
                        marginRight: -Definitions.DEFAULT_MARGIN
                    }}
                >
                    <View style={{ marginTop: Definitions.DEFAULT_MARGIN }}>
                        <Text style={[ Styles.normalText, { fontWeight: "bold", marginBottom: Definitions.DEFAULT_MARGIN / 2 } ]}>Últimas películas añadidas</Text>
                        <FlatList
                            horizontal={ true }
                            data={ this.movies }
                            renderItem={ (item) => this.renderMovie(item) }
                            keyExtractor={ item => item.id.toString() }
                        />
                    </View>

                    <View style={{ marginTop: Definitions.DEFAULT_MARGIN }}>
                        <Text style={[ Styles.normalText, { fontWeight: "bold", marginBottom: Definitions.DEFAULT_MARGIN / 2 } ]}>Más mierda aquí abajo</Text>
                        <FlatList
                            horizontal={ true }
                            data={ this.movies }
                            renderItem={ (item) => this.renderMovie(item) }
                            keyExtractor={ item => item.id.toString() }
                        />
                    </View>
                </View>
            </View>
        );
    }
}