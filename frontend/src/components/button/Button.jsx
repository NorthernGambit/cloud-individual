import "./index.css";

const Button = ({ text, type, onClick, disabled }) => {
	return (
		<button
			className={`button button--${type}`}
			onClick={onClick}
			disabled={disabled}
		>
			{text}
		</button>
	);
};

export default Button;
