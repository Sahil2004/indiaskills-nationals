"use server";
import { API_BASE_URL } from "@/config/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleLogin(formData: FormData) {
	const username = formData.get("username");
	const password = formData.get("password");
	const res = await fetch(API_BASE_URL + "/api/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, password }),
	});
	const data = await res.json();
	const session = data.data;
	const cookieStorage = await cookies();
	cookieStorage.set("session", JSON.stringify(session), {
		httpOnly: true,
		secure: true,
	});
	redirect("/dashboard");
}
