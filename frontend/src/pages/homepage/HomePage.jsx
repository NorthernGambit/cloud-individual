import "./index.css";
import Header from "../../components/header/Header";
import Button from "../../components/button/Button";
import MessageFlow from "../../components/messageflow/MessageFlow";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts, getCurrentUserPosts } from "../../api/posts";

const HomePage = () => {
	const navigate = useNavigate();
	const token = useAuthStore((state) => state.token);
	const [searchParams] = useSearchParams();
	const username = searchParams.get("username");
	const {
		data: posts,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["posts", username],
		queryFn: () =>
			username
				? username === "me"
					? getCurrentUserPosts()
					: getAllPosts(username)
				: getAllPosts(),
	});

	return (
		<section className="page homepage">
			<Header />
			<div className="wrapper">
				<section className="homepage__top">
					<h2 className="homepage__title">
						{username
							? username === "me"
								? "Dina meddelanden"
								: `Meddelanden från ${username}`
							: "Alla meddelanden"}
					</h2>
					<div className="button-group">
						{username && (
							<Button
								text="Visa alla meddelanden"
								type="default"
								onClick={() => navigate("/")}
							/>
						)}
						{token && (
							<Button
								text="Nytt meddelande"
								type="default"
								onClick={() => navigate("/message/create")}
							/>
						)}
					</div>
				</section>
				{isLoading && <p>Loading posts...</p>}
				{isError && <p>Error: {error.message}</p>}
				{posts && <MessageFlow messages={posts} />}
			</div>
		</section>
	);
};

export default HomePage;
