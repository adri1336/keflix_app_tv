//Imports
import * as Localization from "expo-localization";
import i18n from "i18n-js";

//Localization
i18n.locale = Localization.locale;
i18n.fallbacks = true;
i18n.translations = {
    es: {
		connect: {
			connect_error_text: "No se ha podido conectar",
			retry_connect_button: "Reintentar"
		},
		auth: {
			welcome_text: "Bienvenido"
		}
	}
};