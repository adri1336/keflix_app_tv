//Imports
import "react-native-gesture-handler";
import React from "react";
import { Platform, BackHandler } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";

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

	return <Container/>;
}