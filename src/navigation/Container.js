//Imports
import React from "react";
import { AsyncStorage, AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

//Navigator Imports
import SelectServerNavigator from "./navigators/SelectServerNavigator";
import ConnectNavigator from "./navigators/ConnectNavigator";
import AuthNavigator from "./navigators/AuthNavigator";
import ProfileNavigator from "./navigators/ProfileNavigator";
import MainNavigator from "./navigators/MainNavigator";

//Other Imports
import { AppContext } from "app/src/AppContext";
import { NAVIGATORS, STORAGE_KEYS, CONFIG } from "app/src/utils/Definitions";
import * as Auth from "app/src/api/Auth";
import * as Account from "app/src/api/Account";

//Code
function getNavigator(navigator) {
	switch(navigator) {
		case NAVIGATORS.SELECT_SERVER: {
			return <SelectServerNavigator/>;
		}
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
	navigator: NAVIGATORS.SELECT_SERVER,
	server: null
};

const reducer = (prevState, action) => {
	switch (action.type) {
		case "TRY_CONNECTION": {
			return {
				...prevState,
				server: action.server,
				navigator: NAVIGATORS.CONNECT
			};
		}
		case "NEW_SERVER": {
			return {
				...prevState,
				navigator: NAVIGATORS.SELECT_SERVER
			};
		}
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

let appGoBackgroundTime = 0
	api_server = "";

export default () => {
	const [state, dispatch] = React.useReducer(reducer, initialState);
	const funcs = React.useMemo(() => {
		return {
			selectNewServer: async () => {
				await AsyncStorage.clear();
				dispatch({ type: "NEW_SERVER" });
			},
			tryConnection: async (server, remember = false) => {
				api_server = server;
				if(remember) {
					await AsyncStorage.setItem(STORAGE_KEYS.SERVER, server);
				}
				dispatch({ type: "TRY_CONNECTION", server: server });
			},
			timedOut: () => {
				dispatch({ type: "TIMED_OUT" });
			},
			connect: async () => {
				let accessToken, refreshToken;
				try {
					accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
					refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
					
					if(accessToken && refreshToken) {
						const data = await Account.getPassToken(api_server, accessToken);
						if(data) {
							dispatch({ type: "LOGIN", accessToken: accessToken, refreshToken: refreshToken, account: data, remember: true });
						}
						else {
							//try refresh_token
							const data = await Auth.token(api_server, refreshToken);
							if(data) {
								const { account, access_token, refresh_token } = data;
								await storeTokens(access_token, refresh_token);
								dispatch({ type: "LOGIN", accessToken: access_token, refreshToken: refresh_token, account: account, remember: true });
							}
							else {
								await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);
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
					await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN]);
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
	
	React.useEffect(() => {
		AppState.addEventListener("change", _handleAppStateChange);
		return () => {
			AppState.removeEventListener("change", _handleAppStateChange);
		};
	}, []);

	const _handleAppStateChange = nextAppState => {
		if(nextAppState == "active") {
			if(Date.now() - appGoBackgroundTime > CONFIG.MAX_BACKGROUND_TIME) {
				funcs.timedOut();
			}
		}
		else {
			appGoBackgroundTime = Date.now();
		}
	};

	return (
		<AppContext.Provider value={{ funcs: funcs, state: state }}>
			<NavigationContainer>
				{ getNavigator(state.navigator) }
			</NavigationContainer>
		</AppContext.Provider>
	);
}