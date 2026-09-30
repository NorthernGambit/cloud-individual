import "./index.css";
import BackIcon from "../../components/backicon/BackIcon";
import MessageForm from "../../components/messageform/MessageForm";
import { getPostById, updatePost } from "../../api/posts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";

const EditMessagePage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const token = useAuthStore((state) => state.token);

	useEffect(() => {
		if (!token) {
			toast.error("Du måste logga in för att redigera ett meddelande");
			navigate("/");
		}
	}, [token]);

	const {
		mutate: editPost,
		isPending,
		isError: isEditError,
		error: editError,
	} = useMutation({
		mutationFn: (text) => updatePost({ id, text }),
		onSuccess: () => {
			// refreshes the cache so it doesnt show the old post
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["post", id] });

			toast.success("Meddelandet redigerat!");

			navigate("/");
		},
	});

	const {
		data: post,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["post", id],
		queryFn: () => getPostById(id),
	});

	const handleEditSubmit = (text) => {
		editPost(text);
	};

	return (
		<section className="page new-message-page">
			<div className="wrapper new-message-page__wrapper">
				<BackIcon />
				<section className="page__form-container">
					<h1 className="page__title">Redigera ditt meddelande</h1>
					{isLoading && <p>Loading...</p>}
					{isError && <p>{error.message}</p>}
					{isEditError && <p>{editError.message}</p>}
					{post && (
						<MessageForm
							message={post}
							handleSubmit={handleEditSubmit}
							disabled={isPending ? true : false}
						/>
					)}
				</section>
			</div>
		</section>
	);
};

export default EditMessagePage;
