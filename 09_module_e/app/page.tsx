import { handleLogin } from "@/actions/login";

export default function Home() {
	return (
		<main>
			<form action={handleLogin}>
				<label htmlFor="username">
					Username:
					<br />
					<input
						type="text"
						name="username"
						id="username"
						autoComplete="on"
					/>
				</label>
				<br />
				<label htmlFor="password">
					Password:
					<br />
					<input
						type="password"
						name="password"
						id="password"
						autoComplete="on"
					/>
				</label>
				<br />
				<button type="submit">Login</button>
			</form>
		</main>
	);
}
