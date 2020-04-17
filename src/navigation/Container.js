//Imports
import React from "react";
import { AsyncStorage } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

//Navigator Imports
import ConnectNavigator from "./navigators/ConnectNavigator";
import AuthNavigator from "./navigators/AuthNavigator";
import ProfileNavigator from "./navigators/ProfileNavigator";
import MainNavigator from "./navigators/MainNavigator";

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
		case NAVIGATORS.MAIN: {
			return <MainNavigator/>;
		}
	}
}

export default () => {
	const [navigator, setNavigator] = React.useState(NAVIGATORS.CONNECT);
	const [account, setAccount] = React.useState(null);
	const [profile, setProfile] = React.useState(null);
	const appContext = React.useMemo(() => {
		return {
			changeNavigator: (navigator) => {
				setNavigator(navigator);
			},
			changeAccount: (account) => {
				setAccount(account);
			},
			changeProfile: (profile) => {
				setProfile(profile);
			},
			logOut: () => {
				(
					async () => {
						try {
							await AsyncStorage.clear();
						}
						catch(error) {
							console.log(error);
						}
						finally {
							setAccount(null);
							setNavigator(NAVIGATORS.AUTH);
						}
					}
				)();
			},
			profileLogOut: () => {
				setProfile(null);
				setNavigator(NAVIGATORS.PROFILE);
			}
		}
	}, []);

	return (
		<AppContext.Provider value={[appContext, account, profile]}>
			<NavigationContainer>{ getNavigator(navigator) }</NavigationContainer>
		</AppContext.Provider>
	);
}