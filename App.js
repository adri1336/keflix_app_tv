//Imports
import "react-native-gesture-handler";
import React from "react";
import { Platform, BackHandler, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFonts } from '@use-expo/font';
import "./src/utils/Translations";
import { enableScreens } from "react-native-screens";

//Components Imports
import LoadingView from "./src/components/LoadingView";

//Navigator Imports
import Container from "./src/navigation/Container";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Disable Yellow Warnings Box In App
console.disableYellowBox = true;

//Code
export default () => {
	React.useEffect(() => {
		//TV Only
		if(!Platform.isTV) {
			return BackHandler.exitApp();
		}

		//Enable screens (necesario para Expo, sin esto van mal los focos y demás)
		enableScreens();
		
		//Lock screen orientation to Landscape
		ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
	}, []);
	
	//Fonts
	let [fontsLoaded] = useFonts({
        "Roboto-Bold": require("cuervo/assets/fonts/Roboto-Bold.ttf"),
		"Roboto-Light": require("cuervo/assets/fonts/Roboto-Light.ttf"),
		"Roboto-Regular": require("cuervo/assets/fonts/Roboto-Regular.ttf")
	});
	if(fontsLoaded) {
		return (
			<View style={{
				flex: 1,
				backgroundColor: Definitions.PRIMARY_COLOR 
			}}>
				<Container/>
			</View>
		);
	}
	else return <LoadingView/>;
}