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
			slogan_text: "Películas para ver en tu televisión.",
			register_button: "Registrarse ahora",
			login_button: "Iniciar sesión"
		}
	}
};