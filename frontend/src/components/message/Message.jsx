import "./index.css";
import { NotePencilIcon, TrashIcon } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../../utils";
import { useAuthStore } from "../../stores/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../../api/posts";
import toast from "react-hot-toast";

const Message = ({ message }) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const currentUsername = useAuthStore((state) => state.user);
	const isOwner = Boolean(currentUsername === message.username);

	const { mutate, isPending } = useMutation({
		mutationFn: deletePost,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["post", message.id] });
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Meddelandet togs bort!");
		},
	});

	const handleDelete = () => {
		const result = window.confirm(
			"Är du säker på att du vill ta bort detta meddelande?",
		);
		if (result) {
			mutate(message.id);
		}
	};

	const createdStr = formatDate(message.createdAt);
	const updatedStr = message.updatedAt ? formatDate(message.updatedAt) : null;
	const isEdited = Boolean(updatedStr && updatedStr !== createdStr);

	return (
		<article className="message">
			<h3 className="message__initials">
				{message.username.slice(0, 2)}
			</h3>

			<div className="message__content">
				<div className="message__content-top">
					<Link
						to={`/?username=${message.username}`}
						className="message-link"
					>
						<h4 className="message__user">{message.username}</h4>
					</Link>

					{isOwner && (
						<div className="message__icon-group">
							<NotePencilIcon
								className="icon icon--pencil"
								size={20}
								weight="bold"
								onClick={() =>
									navigate(`/message/edit/${message.id}`)
								}
							/>
							<TrashIcon
								className="icon icon--trash"
								size={20}
								weight="bold"
								color={isPending ? "grey" : "red"}
								onClick={isPending ? () => {} : handleDelete}
							/>
						</div>
					)}
				</div>

				<p className="message__text">{message.text}</p>
			</div>

			<p className="message__date">
				<span title={`Skapad ${createdStr}`}>{createdStr}</span>
				{isEdited && (
					<>
						{" | "}
						<i title={`Redigerad ${updatedStr}`}>{updatedStr}</i>
					</>
				)}
			</p>
		</article>
	);
};

export default Message;
