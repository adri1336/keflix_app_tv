//Imports
import { StyleSheet } from "react-native";
import * as Dimensions from "cuervo/src/utils/Dimensions.js";

//Other Imports
import Definitions, { DEFAULT_SIZES } from "cuervo/src/utils/Definitions";

//Code
const Styles = StyleSheet.create({
	//Normal Texts
	bigTitleText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(DEFAULT_SIZES.BIG_TITLE_SIZE),
		fontFamily: "Roboto-Regular"
	},
	titleText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(DEFAULT_SIZES.TITLE_SIZE),
		fontFamily: "Roboto-Regular"
	},
	bigText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(DEFAULT_SIZES.BIG_SIZE),
		fontFamily: "Roboto-Regular"
	},
	normalText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(DEFAULT_SIZES.NORMAL_SIZE),
		fontFamily: "Roboto-Regular"
	},
	mediumText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(DEFAULT_SIZES.MEDIUM_SIZE),
		fontFamily: "Roboto-Regular"
	},
	smallText: {
		color: Definitions.TEXT_COLOR,
		fontSize: Dimensions.vw(DEFAULT_SIZES.SMALL_SIZE),
		fontFamily: "Roboto-Regular"
	}
});

export default Styles;