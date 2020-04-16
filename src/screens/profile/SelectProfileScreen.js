//Imports
import React from "react";
import { View, Text, FlatList } from "react-native";

//Components Imports
import LoadingView from "cuervo/src/components/LoadingView";
import ProfileButtonItem from "cuervo/src/components/ProfileButtonItem";

//Styles Imports
import Styles from "cuervo/src/utils/Styles";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";
import { AppContext } from "cuervo/src/AppContext";

//Code
export default class SelectProfileScreen extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
        this.profiles = [
            {
                id: 1,
                name: "Adrián",
                color: "steelblue"
            },
            {
                id: 0,
                name: "Crear perfil",
                color: "gray"
            }
        ];
    }

    componentDidMount() {
        this.account = this.context[1];
        this.setState({ loading: false });
    }

    renderProfileItem(profileItem) {
        var focus = false;
        if(profileItem.index == 0) {
            focus = true;
        }

        return (
            <ProfileButtonItem
                profile={ profileItem.item }
                focused={ focus }
                hasTVPreferredFocus={ focus }
            />
        );
    }

    render() {
        return (
            this.state.loading ? (
                <LoadingView/>
            ) : (
                <View style={{
                    flex: 1,
                    flexDirection: "row",
                    backgroundColor: Definitions.PRIMARY_COLOR
                }}>
                    <View style={{ flex: 10 }}/>
                    <View style={{ flex: 80 }}>
                        <View style={{
                            flex: 1,
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>

                            <View style={{
                                flex: 30,
                                justifyContent: "flex-end",
                                alignItems: "center",
                                marginBottom: Definitions.DEFAULT_MARGIN
                            }}>
                                <Text style={ Styles.titleText }>¿Quién eres? Elige tu perfil</Text>
                            </View>

                            <View style={{
                                flex: 40,
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <FlatList
                                    horizontal={ true }
                                    data={ this.profiles }
                                    renderItem={ (item) => this.renderProfileItem(item) }
                                    keyExtractor={ item => item.id }
                                />
                            </View>

                            <View style={{
                                flex: 30
                            }}/>

                        </View>
                    </View>
                    <View style={{ flex: 10 }}/>
                </View>
            )
        );
    }
}