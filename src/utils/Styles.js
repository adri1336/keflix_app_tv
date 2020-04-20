//Imports
import { StyleSheet } from "react-native";
import * as Dimensions from "cuervo/src/utils/Dimensions.js";

//Other Imports
import Definitions from "cuervo/src/utils/Definitions";

//Code
const Styles = StyleSheet.create({
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
	bigText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(1.6),
		fontFamily: "Roboto-Regular"
	},
	normalText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(1.3),
		fontFamily: "Roboto-Regular"
	},
	mediumText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(1.1),
		fontFamily: "Roboto-Regular"
	},
	smallText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(0.9),
		fontFamily: "Roboto-Regular"
	}
});

export default Styles;