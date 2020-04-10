import { Dimensions } from "react-native";

export function vw(percentageWidth) {
    return Dimensions.get("window").width * (percentageWidth / 100.0);
}

export function vh(percentageHeight) {
    return Dimensions.get("window").height * (percentageHeight / 100.0);
}