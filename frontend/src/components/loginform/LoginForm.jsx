import "./index.css";
import Button from "../button/Button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/auth";
import { useAuthStore } from "../../stores/authStore";
import { useRef } from "react";
import toast from "react-hot-toast";

const LoginForm = () => {
	const usernameOrEmailRef = useRef();
	const passwordRef = useRef();
	const saveToken = useAuthStore((state) => state.login);
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const username = searchParams.get("username");

	const handleSubmit = (event) => {
		event.preventDefault();

		mutate({
			usernameOrEmail: usernameOrEmailRef.current.value.toLowerCase(),
			password: passwordRef.current.value,
		});
	};
	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: login,
		onSuccess: (data) => {
			saveToken(data.token, data.username);
			toast.success("Inloggning lyckades!");
			navigate("/");
		},
	});
	return (
		<form className="login-form" onSubmit={handleSubmit}>
			<label className="login-form__label">
				E-post / Användarnamn
				<input
					type="text"
					className="login-form__input"
					placeholder="namn@exempel.se"
					defaultValue={username ? username : ""}
					ref={usernameOrEmailRef}
					minLength="3"
					required
				/>
			</label>
			<label className="login-form__label">
				Lösenord
				<input
					type="password"
					className="login-form__input"
					placeholder="********"
					ref={passwordRef}
					minLength="8"
					required
				/>
			</label>
			{isError ? <p>{error.message}</p> : ""}
			<Button
				text={isPending ? "Loggar in..." : "Logga in"}
				type={isPending ? "disabled" : "default"}
				disabled={isPending}
			/>
			<p className="login-form__message">
				Har du inget konto?{" "}
				<Link to="/register" className="login-form__message-link">
					Registrera dig här!
				</Link>
			</p>
		</form>
	);
};

export default LoginForm;
