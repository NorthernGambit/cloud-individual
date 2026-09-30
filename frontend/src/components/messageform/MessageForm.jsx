import { useRef, useState } from "react";
import "./index.css";
import Button from "../button/Button";

const MessageForm = ({ message = null, handleSubmit, disabled }) => {
	const [text, setText] = useState(message?.text ?? "");

	const handleClearText = (event) => {
		event.preventDefault();

		setText("");
	};

	return (
		<form className="message-form">
			<label className="message-form__label">
				Meddelande
				<div className="message-form__textarea-wrapper">
					<textarea
						className="message-form__textarea"
						placeholder="Vad vill du säga?"
						maxLength={200}
						value={text}
						onChange={(event) => setText(event.target.value)}
					/>

					<span className="message-form__counter">
						{text.length}/200
					</span>
				</div>
			</label>
			{text.trim().length < 3 ? (
				<Button
					text={!message ? "Publicera" : "Spara ändringar"}
					type="disabled"
					disabled={true}
				/>
			) : (
				<Button
					text={
						disabled
							? !message
								? "Publicerar..."
								: "Sparar..."
							: !message
								? "Publicera"
								: "Spara ändringar"
					}
					type={disabled ? "disabled" : "default"}
					onClick={(e) => {
						e.preventDefault();
						handleSubmit(text.trim());
					}}
					disabled={disabled}
				/>
			)}
			<Button text="Rensa" type="outline" onClick={handleClearText} />
		</form>
	);
};

export default MessageForm;
