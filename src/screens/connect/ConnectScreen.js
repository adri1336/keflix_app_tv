//Imports
import React from "react";

//Components Imports
import LoadingView from "cuervo/src/components/LoadingView";

//Other Imports
import { AppContext } from "cuervo/src/AppContext";
import Definitions, { NAVIGATORS } from "cuervo/src/utils/Definitions";
import * as HttpClient from "cuervo/src/utils/HttpClient";

//Code
export default () => {
    const { changeNavigator } = React.useContext(AppContext);

    HttpClient.get("http://" + Definitions.SERVER_IP + "/checkcon").then(([response, data, error]) => {
        if(error == null && response.status == 200 && data == true) {
            changeNavigator(NAVIGATORS.AUTH);
        }
        else {
            console.log("ERROR!");
        }
    });

    return <LoadingView/>;
}