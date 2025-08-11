const messages = {
	"pt-br": {
		structure: {
			copyright: "Todos os direitos reservados.",
			privacy: "Política de Privacidade",
			terms: "Termos e Condições",
		},
		verify: {
			title: "Confirmação de Registro",
			description:
				"Você se registrou com sucesso. Por favor, verifique seu e-mail para confirmar seu registro.",
			action: "Verificar E-mail",
		},
		email: {
			title: "Você registrou seu email",
			description:
				"Para criar uma conta completa, por favor use o link abaixo.",
			action: "Criar conta",
		},
		reset: {
			title: "Redefinir Sua Senha",
			message:
				"Recebemos uma solicitação para redefinir a senha da sua conta. Se você não solicitou esta redefinição de senha, pode ignorar este e-mail com segurança. Clique no botão abaixo para redefinir sua senha:",
			button: "Redefinir Senha",
			expire: "Este link expirará em 1 hora por motivos de segurança.",
		},
	},
	"en-us": {
		structure: {
			copyright: "All rights reserved.",
			privacy: "Privacy Policy",
			terms: "Terms & Conditions",
		},
		verify: {
			title: "Registration Confirmation",
			description:
				"You have successfully registered. Please check your email to confirm your registration.",
			action: "Verify Email",
		},
		email: {
			title: "You have registered your email",
			description:
				"To create a complete account, please use the link below.",
			action: "Create account",
		},
		reset: {
			title: "Reset Your Password",
			message:
				"We have received a request to reset the password for your account. If you did not request this password reset, you can safely ignore this email. Click the button below to reset your password:",
			button: "Reset Password",
			expire: "This link will expire in 1 hour for security reasons.",
		},
	},
};

function getDeepValue(
	obj: Record<string, unknown>,
	key: string,
): string | undefined {
	const keys = key.split(".");
	let value: unknown = obj;
	for (const k of keys) {
		if (
			value &&
			typeof value === "object" &&
			value !== null &&
			k in value
		) {
			value = (value as Record<string, unknown>)[k];
		} else {
			return undefined;
		}
	}
	return typeof value === "string" ? value : undefined;
}

export function useMessages(locale: "pt-br" | "en-us", namespace?: string) {
	return function t(key: string, defaultValue?: string) {
		return (
			getDeepValue(
				messages[locale],
				namespace ? `${namespace}.${key}` : key,
			) ||
			defaultValue ||
			key
		);
	};
}
