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
import { NAVIGATORS, STORAGE_KEYS } from "cuervo/src/utils/Definitions";
import { _fetch } from "cuervo/src/utils/HttpClient";

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
	const [state, dispatch] = React.useReducer(
		(prevState, action) => {
			switch (action.type) {
				case "CONNECTED":
				{
					return {
						...prevState,
						navigator: NAVIGATORS.AUTH
					};
				}
				case "NEW_TOKENS":
				{
					return {
						...prevState,
						accessToken: action.accessToken,
						refreshToken: action.refreshToken
					};
				}
				case "LOGIN": {
					return {
						...prevState,
						accessToken: action.accessToken,
						refreshToken: action.refreshToken,
						account: action.account,
						remember: action.remember,
						profile: null,
						navigator: NAVIGATORS.PROFILE
					};
				}
				case "LOGOUT": {
					return {
						...prevState,
						accessToken: null,
						refreshToken: null,
						account: null,
						profile: null,
						remember: false,
						navigator: NAVIGATORS.AUTH
					};
				}
				case "PROFILE_LOGIN": {
					return {
						...prevState,
						profile: action.profile,
						navigator: NAVIGATORS.MAIN
					}
				}
				case "PROFILE_LOGOUT": {
					return {
						...prevState,
						profile: null,
						navigator: NAVIGATORS.PROFILE
					}
				}
				case "UPDATE_PROFILE": {
					return {
						...prevState,
						profile: action.profile
					}
				}
			}
		},
		{
			navigator: NAVIGATORS.CONNECT,
			accessToken: null,
			refreshToken: null,
			account: null,
			profile: null,
			remember: false
		}
	);

	const funcs = React.useMemo(() => {
		return {
			connect: async () => {
				let accessToken, refreshToken;
				try {
					accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
					refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

					if(accessToken && refreshToken) {
						let [response, data, error] = await _fetch("/account", "GET", accessToken);
						if(!error && response.status == 200) {
							const account = data;
							dispatch({ type: "LOGIN", accessToken: accessToken, refreshToken: refreshToken, account: account, remember: true });
						}
						else {
							//try refresh_token
							[response, data, error] = await _fetch("/auth/token", "POST", null, { refresh_token: refreshToken });
							if(!error && response.status == 200) {
								//new tokens
								const { account, token, refresh_token } = data;
								await AsyncStorage.multiSet([[STORAGE_KEYS.ACCESS_TOKEN, token], [STORAGE_KEYS.REFRESH_TOKEN, refresh_token]]);
								dispatch({ type: "LOGIN", accessToken: token, refreshToken: refresh_token, account: account, remember: true });
							}
							else {
								//todo mal :(
								await AsyncStorage.clear();
								dispatch({ type: "CONNECTED" });
							}
						}
					}
					else {
						dispatch({ type: "CONNECTED" });
					}
				}
				catch(error) {
					console.log(error);
				}
			},
			setNewTokens: async (accessToken, refreshToken) => {
				if(state.remember) {
					await AsyncStorage.multiSet([[STORAGE_KEYS.ACCESS_TOKEN, accessToken], [STORAGE_KEYS.REFRESH_TOKEN, refreshToken]]);
				}
				dispatch({ type: "NEW_TOKENS", accessToken: accessToken, refreshToken: refreshToken });
			},
			login: async (data, remember) => {
				const { account, access_token, refresh_token } = data;
				if(remember) {
					await AsyncStorage.multiSet([[STORAGE_KEYS.ACCESS_TOKEN, access_token], [STORAGE_KEYS.REFRESH_TOKEN, refresh_token]]);
				}
				dispatch({ type: "LOGIN", accessToken: access_token, refreshToken: refresh_token, account: account, remember: remember });
			},
			logout: async () => {
				try {
					await AsyncStorage.clear();
				}
				catch(error) {
					console.log(error);
				}
				finally {
					dispatch({ type: "LOGOUT" });
				}
			},
			profileLogin: (profile) => {
				dispatch({ type: "PROFILE_LOGIN", profile: profile });
			},
			profileLogout: () => {
				dispatch({ type: "PROFILE_LOGOUT" });
			},
			updateProfile: (profile) => {
				dispatch({ type: "UPDATE_PROFILE", profile: profile });
			}
		}
	}, []);

	return (
		<AppContext.Provider value={{ funcs: funcs, state: state }}>
			<NavigationContainer>{ getNavigator(state.navigator) }</NavigationContainer>
		</AppContext.Provider>
	);
}