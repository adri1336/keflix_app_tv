//Imports
import React from "react";
import { NavigationContainer } from "@react-navigation/native";

//Navigator Imports
import ConnectNavigator from "./navigators/ConnectNavigator";
import AuthNavigator from "./navigators/AuthNavigator";
import ProfileNavigator from "./navigators/ProfileNavigator";

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
		case NAVIGATORS.PROFILE: {
			return <ProfileNavigator/>;
		}
	}
}

export default () => {
	const [navigator, setNavigator] = React.useState(NAVIGATORS.CONNECT);
	const [account, setAccount] = React.useState(null);
	const appContext = React.useMemo(() => {
		return {
			changeNavigator: (navigator) => {
				setNavigator(navigator);
			},
			changeAccount: (account) => {
				setAccount(account);
			}
		}
	}, []);

	return (
		<AppContext.Provider value={[appContext, account]}>
			<NavigationContainer>{ getNavigator(navigator) }</NavigationContainer>
		</AppContext.Provider>
	);
}