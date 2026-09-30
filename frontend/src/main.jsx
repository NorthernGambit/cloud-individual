import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, useNavigate } from "react-router-dom";
import { router } from "./router/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "./stores/authStore";

const queryClient = new QueryClient();

// Used LLM to cleanly handle an out of date token
// Catch any 401 response across the entire app except for login 401 for bad password
axios.interceptors.response.use(
	(response) => response,
	(error) => {
		const isLoginRequest = error.config?.url?.includes("/login");

		if (error.response?.status === 401 && !isLoginRequest) {
			// 1. Wipe the Zustand store and localStorage
			useAuthStore.getState().logout();

			// 2. Alert the user
			toast.error("Sessionen har gått ut. Vänligen logga in igen.");

			router.navigate("/");
		}
		return Promise.reject(error);
	},
);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<Toaster position="top-center" />
		</QueryClientProvider>
	</StrictMode>,
);
