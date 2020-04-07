//Imports
import React from "react";
import { NavigationContainer } from "@react-navigation/native";

//Navigator Imports
import ConnectNavigator from "./navigators/ConnectNavigator";
import AuthNavigator from "./navigators/AuthNavigator";

//Other Imports
import { AppContext } from "cuervo/src/AppContext";
import { NAVIGATORS } from "cuervo/src/utils/Definitions";

//Code
function getNavigator(navigator) {
	switch(navigator) {
		case NAVIGATORS.CONNECT: {
			return <ConnectNavigator/>;
		}
		case NAVIGATORS.AUTH: {
			return <AuthNavigator/>;
		}
	}
}

export default () => {
	const [navigator, setNavigator] = React.useState(NAVIGATORS.CONNECT);
	const appContext = React.useMemo(() => {
		return {
			changeNavigator: (navigator) => {
				setNavigator(navigator);
			}
		}
	}, []);

	return (
		<AppContext.Provider value={appContext}>
			<NavigationContainer>{ getNavigator(navigator) }</NavigationContainer>
		</AppContext.Provider>
	);
}