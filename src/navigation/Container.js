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
import * as Auth from "cuervo/src/api/Auth";
import * as Account from "cuervo/src/api/Account";

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

const storeTokens = async (accessToken, refreshToken) => {
	await AsyncStorage.multiSet([[STORAGE_KEYS.ACCESS_TOKEN, accessToken], [STORAGE_KEYS.REFRESH_TOKEN, refreshToken]]);
};

const initialState = {
	accessToken: null,
	refreshToken: null,
	account: null,
	profile: null,
	remember: false,
	navigator: NAVIGATORS.CONNECT
};

const reducer = (prevState, action) => {
	switch (action.type) {
		case "TIMED_OUT": {
			return {
				...prevState,
				navigator: NAVIGATORS.CONNECT
			};
		}
		case "CONNECTED": {
			return {
				...prevState,
				navigator: NAVIGATORS.AUTH
			};
		}
		case "NEW_TOKENS": {
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
			};
		}
		case "PROFILE_LOGOUT": {
			return {
				...prevState,
				profile: null,
				navigator: NAVIGATORS.PROFILE
			};
		}
	}
};

export default () => {
	const [state, dispatch] = React.useReducer(reducer, initialState);
	const funcs = React.useMemo(() => {
		return {
			timedOut: () => {
				dispatch({ type: "TIMED_OUT" });
			},
			connect: async () => {
				let accessToken, refreshToken;
				try {
					accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
					refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

					if(accessToken && refreshToken) {
						const data = await Account.getPassToken(accessToken);
						if(data) {
							dispatch({ type: "LOGIN", accessToken: accessToken, refreshToken: refreshToken, account: data, remember: true });
						}
						else {
							//try refresh_token
							const data = await Auth.token(refreshToken);
							if(data) {
								const { account, access_token, refresh_token } = data;
								await storeTokens(access_token, refresh_token);
								dispatch({ type: "LOGIN", accessToken: access_token, refreshToken: refresh_token, account: account, remember: true });
							}
							else {
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
					await storeTokens(accessToken, refreshToken);
				}
				dispatch({ type: "NEW_TOKENS", accessToken: accessToken, refreshToken: refreshToken });
			},
			login: async (data, remember) => {
				const { account, access_token, refresh_token } = data;
				if(remember) {
					await storeTokens(access_token, refresh_token);
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
			}
		}
	}, []);
	
	return (
		<AppContext.Provider value={{ funcs: funcs, state: state }}>
			<NavigationContainer>
				{ getNavigator(state.navigator) }
			</NavigationContainer>
		</AppContext.Provider>
	);
}