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
    View,
} from "react-native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

export default function RegisterScreen() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});

	function onSubmit() {
		const e = {
			name: required(name) ?? undefined,
			email: required(email) ?? undefined,
			password: required(password) ?? undefined,
			confirm: password === confirm ? undefined : "Les mots de passe ne correspondent pas",
		};
		setErrors(e);
		if (!e.name && !e.email && !e.password && !e.confirm) {
			// TODO: call register service
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
							Créer un compte
						</ThemedText>
						<ThemedText type="subtitle" style={styles.subtitle}>
							Rejoignez notre communauté
						</ThemedText>

						<View style={styles.form}>
							<TextInput
								placeholder="Nom"
								placeholderTextColor="#9ca3af"
								style={[styles.input, errors.name && styles.inputError]}
								value={name}
								onChangeText={setName}
							/>
							{errors.name ? <ThemedText style={styles.error}>{errors.name}</ThemedText> : null}

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

							<TextInput
								placeholder="Confirmer le mot de passe"
								placeholderTextColor="#9ca3af"
								secureTextEntry
								style={[styles.input, errors.confirm && styles.inputError]}
								value={confirm}
								onChangeText={setConfirm}
							/>
							{errors.confirm ? <ThemedText style={styles.error}>{errors.confirm}</ThemedText> : null}

							<CustomButton title="S'inscrire" onPress={onSubmit} />

							<View style={styles.bottomRow}>
								<ThemedText>Déjà un compte ? </ThemedText>
								<Link href={"/auth/login" as any} asChild>
									<ThemedText type="link">Se connecter</ThemedText>
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
	bottomRow: { flexDirection: "row", gap: 4, marginTop: 16 },
});

