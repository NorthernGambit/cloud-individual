import "./index.css";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../button/Button";
import { useAuthStore } from "../../stores/authStore";

const Navigation = () => {
	const token = useAuthStore((state) => state.token);
	const username = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();

		logout();
		navigate("/");
	};

	return (
		<nav className="nav">
			<NavLink to="/" className="nav__link">
				Hem
			</NavLink>
			{!token ? (
				<Button
					text="Logga in"
					type="default"
					onClick={() => navigate("/login")}
				/>
			) : (
				<>
					<NavLink to="/?username=me" className="nav__link">
						{username}
					</NavLink>
					<Button
						text="Logga ut"
						type="default"
						onClick={handleSubmit}
					/>
				</>
			)}
		</nav>
	);
};

export default Navigation;
