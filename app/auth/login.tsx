import { CustomButton } from "@/src/components/CustomButton";
import { required } from "@/src/utils/validateForm";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

export default function LoginScreen() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

	function onSubmit() {
		const e = { email: required(email) ?? undefined, password: required(password) ?? undefined };
		setErrors(e);
		if (!e.email && !e.password) {
			// TODO: call auth service
			router.replace("/(tabs)" as any);
		}
	}

	return (
		<ThemedView style={{ flex: 1 }}>
			<LinearGradient colors={["#0ea5e9", "#2563eb"]} style={styles.gradient}>
				<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
					<View style={styles.card}>
						<Image source={require("../../assets/images/react-logo.png")} style={styles.logo} />
						<ThemedText type="title" style={styles.title}>
							Bienvenue
						</ThemedText>
						<ThemedText type="subtitle" style={styles.subtitle}>
							Connectez-vous pour continuer
						</ThemedText>

						<View style={styles.form}>
							<TextInput
								placeholder="Email"
								placeholderTextColor="#9ca3af"
								autoCapitalize="none"
								keyboardType="email-address"
								style={[styles.input, errors.email && styles.inputError]}
								value={email}
								onChangeText={setEmail}
							/>
							{errors.email ? <ThemedText style={styles.error}>{errors.email}</ThemedText> : null}

							<TextInput
								placeholder="Mot de passe"
								placeholderTextColor="#9ca3af"
								secureTextEntry
								style={[styles.input, errors.password && styles.inputError]}
								value={password}
								onChangeText={setPassword}
							/>
							{errors.password ? <ThemedText style={styles.error}>{errors.password}</ThemedText> : null}

							<CustomButton title="Se connecter" onPress={onSubmit} />

							<TouchableOpacity style={styles.linkRow}>
								<Link href={"/auth/forgot-password" as any} asChild>
									<ThemedText type="link">Mot de passe oublié ?</ThemedText>
								</Link>
							</TouchableOpacity>

							<View style={styles.bottomRow}>
								<ThemedText>Pas de compte ? </ThemedText>
								<Link href={"/auth/register" as any} asChild>
									<ThemedText type="link">Inscrivez-vous</ThemedText>
								</Link>
							</View>
						</View>
					</View>
				</KeyboardAvoidingView>
			</LinearGradient>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	gradient: { flex: 1 },
	container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
	card: {
		width: "100%",
		maxWidth: 440,
		backgroundColor: "rgba(255,255,255,0.95)",
		borderRadius: 16,
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.12,
		shadowRadius: 20,
		elevation: 8,
	},
	logo: { width: 72, height: 72, marginBottom: 8, borderRadius: 12 },
	title: { marginTop: 4, textAlign: "center" },
	subtitle: { marginBottom: 12, textAlign: "center", color: "#374151" },
	form: { width: "100%", gap: 10 },
	input: {
		height: 48,
		borderWidth: 1,
		borderColor: "#e5e7eb",
		borderRadius: 12,
		paddingHorizontal: 12,
		backgroundColor: "white",
	},
	inputError: { borderColor: "#ef4444" },
	error: { color: "#ef4444", fontSize: 12 },
	linkRow: { alignSelf: "flex-end", marginTop: 8 },
	bottomRow: { flexDirection: "row", gap: 4, marginTop: 16, justifyContent: "center" },
});

