//Imports
import "react-native-gesture-handler";
import React from "react";
import { Platform, BackHandler } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFonts } from '@use-expo/font';
import "./src/utils/Translations";

//Components Imports
import LoadingView from "./src/components/LoadingView";

//Navigator Imports
import Container from "./src/navigation/Container";

//Code
export default () => {
	//TV Only
	if(!Platform.isTV) {
		return BackHandler.exitApp();
	}

	//Lock screen orientation to Landscape
	ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

	//Fonts
	let [fontsLoaded] = useFonts({
        "Roboto-Bold": require("cuervo/assets/fonts/Roboto-Bold.ttf"),
		"Roboto-Light": require("cuervo/assets/fonts/Roboto-Light.ttf"),
		"Roboto-Regular": require("cuervo/assets/fonts/Roboto-Regular.ttf")
	});
	
	if(fontsLoaded) return <Container/>;
	else return <LoadingView/>;
}