//Imports
import * as Localization from "expo-localization";
import i18n from "i18n-js";

//Localization
i18n.locale = Localization.locale;
i18n.fallbacks = true;
i18n.translations = {
    es: {
		connect: {
			connect: {
				connect_error_text: "No se ha podido conectar",
				retry_connect_button: "Reintentar"
			}
		},
		auth: {
			welcome: {
				slogan_text: "Películas para ver en tu televisión.",
				register_button: "Registrarse ahora",
				login_button: "Iniciar sesión"
			},
			register: {
				register_text: "Registrarse",
				email_placeholder: "Escribe tu dirección de correo",
				password_placeholder: "Escribe tu contraseña",
				repeat_password_placeholder: "Repite tu contraseña",
				autoconnect_checkbox: "Ingresar automáticamente",
				error_alert_title: "Error",
				empty_fields_alert_message: "Rellena todos los campos.",
				passwords_no_match_alert_message: "Las contraseñas no coinciden.",
				register_error_alert_message: "No se ha podido completar el registro, puede que el correo electrónico ya esté en uso."
			}
		},
		keyboard: {
			back: "Atrás",
			next: "Siguiente",
			continue: "Continuar",
			finish: "Finalizar"
		},
		normalAlert: {
			close_button: "Cerrar"
		}
	}
};