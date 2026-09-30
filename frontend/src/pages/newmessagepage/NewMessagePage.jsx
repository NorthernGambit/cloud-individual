import "./index.css";
import BackIcon from "../../components/backicon/BackIcon";
import MessageForm from "../../components/messageform/MessageForm";
import { addNewPost } from "../../api/posts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";

const NewMessagePage = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const token = useAuthStore((state) => state.token);

	useEffect(() => {
		if (!token) {
			toast.error("Du måste logga in för att skapa ett meddelande");
			navigate("/");
		}
	}, [token]);

	const {
		mutate: addPost,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: (text) => addNewPost(text),
		onSuccess: () => {
			// refreshes the cache so it shows the new post
			queryClient.invalidateQueries({ queryKey: ["posts"] });

			toast.success("Meddelandet har skapats!");

			navigate("/");
		},
	});

	const handleAddSubmit = (text) => {
		addPost(text);
	};

	return (
		<section className="page new-message-page">
			<div className="wrapper new-message-page__wrapper">
				<BackIcon />
				<section className="page__form-container">
					<h1 className="page__title">Skapa ditt meddelande</h1>
					{isError && <p>{error.message}</p>}
					<MessageForm
						handleSubmit={handleAddSubmit}
						disabled={isPending ? true : false}
					/>
				</section>
			</div>
		</section>
	);
};

export default NewMessagePage;
