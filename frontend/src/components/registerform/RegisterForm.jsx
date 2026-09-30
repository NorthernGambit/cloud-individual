import "./index.css";
import Button from "../button/Button";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../api/auth";
import toast from "react-hot-toast";
import { useRef, useState } from "react";

const RegisterForm = () => {
	const usernameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();
	const passwordRepeatRef = useRef();
	const navigate = useNavigate();
	const [pwMismatchCheck, setPwMismatchCheck] = useState(false);

	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: register,
		onSuccess: () => {
			toast.success("Registrering lyckades, nu kan du logga in!");
			navigate(`/login?username=${usernameRef.current.value}`);
		},
	});

	const handleSubmit = async (event) => {
		event.preventDefault();
		setPwMismatchCheck(true);
		if (passwordRef.current.value === passwordRepeatRef.current.value) {
			setPwMismatchCheck(false);

			mutate({
				username: usernameRef.current.value,
				email: emailRef.current.value,
				password: passwordRef.current.value,
			});
		} else {
			setPwMismatchCheck(true);
		}
	};
	return (
		<form className="register-form" onSubmit={handleSubmit}>
			<label className="register-form__label">
				Användarnamn
				<input
					type="text"
					className="register-form__input"
					placeholder="Välj ett användarnamn"
					minLength="3"
					required
					ref={usernameRef}
				/>
			</label>
			<label className="register-form__label">
				E-post
				<input
					type="email"
					className="register-form__input"
					placeholder="namn@exempel.se"
					required
					ref={emailRef}
				/>
			</label>
			<label className="register-form__label">
				Lösenord
				<input
					type="password"
					className="register-form__input"
					placeholder="Minst 8 tecken"
					minLength="8"
					required
					ref={passwordRef}
				/>
			</label>
			<label className="register-form__label">
				Bekräfta lösenord
				<input
					type="password"
					className="register-form__input"
					placeholder="Upprepa ditt lösenord"
					minLength="8"
					required
					ref={passwordRepeatRef}
				/>
			</label>
			{(pwMismatchCheck && <p>Båda lösenord måste matcha!</p>) ||
				(isError && <p>{error.message}</p>) ||
				""}
			<Button
				text={isPending ? "Registrerar..." : "Registrera"}
				type={isPending ? "disabled" : "default"}
				disabled={isPending}
			/>
			<p className="register-form__message">
				Har du redan ett konto?{" "}
				<Link to="/login" className="register-form__message-link">
					Logga in här!
				</Link>
			</p>
		</form>
	);
};

export default RegisterForm;
