//Imports
import { StyleSheet } from "react-native";
import * as Dimensions from "cuervo/src/utils/Dimensions.js";

//Code
const Styles = StyleSheet.create({
	centeredContainer: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center"
	},
	titleText: {
		fontSize: Dimensions.vw(3.5),
		fontFamily: "Roboto-Bold"
	},
	normalText: {
		fontSize: Dimensions.vw(1.3),
		fontFamily: "Roboto-Regular"
	}
});

export default Styles;