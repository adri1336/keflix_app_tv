//Imports
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//Screen Imports
import LoginScreen from "../screens/LoginScreen";

//Vars
const Stack = createStackNavigator();

//Code
export default function StartNavigator() {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
				<Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: "LoginScreen" }}/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}