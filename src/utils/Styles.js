//Imports
import { StyleSheet } from "react-native";
import * as Dimensions from "cuervo/src/utils/Dimensions.js";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
const Styles = StyleSheet.create({
	//Slim Texts
	bigTitleSlimText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(5.0),
		fontFamily: "Roboto-Light"
	},
	titleSlimText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(3.5),
		fontFamily: "Roboto-Light"
	},
	normalSlimText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(1.3),
		fontFamily: "Roboto-Light"
	},
	smallSlimText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(0.9),
		fontFamily: "Roboto-Light"
	},

	//Normal Texts
	bigTitleText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(5.0),
		fontFamily: "Roboto-Regular"
	},
	titleText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(3.5),
		fontFamily: "Roboto-Regular"
	},
	normalText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(1.3),
		fontFamily: "Roboto-Regular"
	},
	smallText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(0.9),
		fontFamily: "Roboto-Regular"
	}
});

export default Styles;