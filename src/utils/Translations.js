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
				register_error_alert_message: "No se ha podido completar el registro, puede que el correo electrónico ya esté en uso.",
				invalid_email_text_input_error: "Introduce un correo válido",
				invalid_password_text_input_error: "Introduce una contraseña más segura"
			},
			login: {
				login_text: "Iniciar sesión",
				email_placeholder: "Escribe tu dirección de correo",
				password_placeholder: "Escribe tu contraseña",
				autoconnect_checkbox: "Ingresar automáticamente",
				error_alert_title: "Error",
				empty_fields_alert_message: "Rellena todos los campos.",
				login_error_alert_message: "No se ha podido iniciar sesión, comprueba que el correo y la contraseña sean correctas.",
				invalid_email_text_input_error: "Introduce un correo válido",
				invalid_password_text_input_error: "Introduce una contraseña válida"
			}
		},
		profile: {
			select_profile: {
				profile_text: "¿Quién eres? Elige tu perfil",
				logout_button: "Cerrar sesión",
				create_profile_text: "Crear perfil"
			},
			create_profile: {
				error_alert_title: "Error",
				empty_fields_alert_message: "Rellena todos los campos.",
				passwords_no_match_alert_message: "Los pines no coinciden.",
				invalid_password_text_input_error: "El PIN debe contener {{password_length}} dígitos",
				empty_name_alert_message: "Introduce un nombre para tu perfil.",
				repeat_password_placeholder: "Repite tu PIN de acceso",
				create_profile_text: "Crear perfil",
				name_placeholder: "Escribe tu nombre",
				password_placeholder: "Establece tu PIN de acceso (opcional)",
				adult_content_checkbox: "Permitir mostrar contenido solo para adultos (pornografía)"
			},
			select_profile_color: {
				profile_color_text: "Selecciona tu color preferido, {{name}}",
				error_alert_title: "Error",
				create_profile_error_alert_message: "No se ha podido crear tu perfil, comprueba tu conexión a internet.",
			},
			enter_profile_password: {
				profile_password_text: "Introduce tu PIN de acceso",
				error_alert_title: "Error",
				invalid_password_length_alert_message: "Introduce un PIN válido.",
				invalid_password_alert_message: "El PIN no es correcto."
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
		},
		mainTvNavigator: {
			change_profile_button: "Cambiar de perfil",
			options_button: "Opciones",
			exit_app_button: "Salir de la aplicación"
		}
	}
};