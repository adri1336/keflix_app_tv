//Imports
import React from "react";
import { NavigationContainer } from "@react-navigation/native";

//Navigator Imports
import ConnectNavigator from "./navigators/ConnectNavigator";
import AuthNavigator from "./navigators/AuthNavigator";

//Other Imports
import { AppContext } from "cuervo/src/AppContext";

//Code
function getNavigator(navigator) {
	switch(navigator) {
		case "connect": {
			return <ConnectNavigator/>;
		}
		case "auth": {
			return <AuthNavigator/>;
		}
	}
}

export default () => {
	const [navigator, setNavigator] = React.useState("connect");
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