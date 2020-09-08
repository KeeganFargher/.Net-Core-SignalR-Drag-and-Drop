import { useState, useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

export default function useSignalR(url) {
	const [connection, setConnection] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const newConnection = new HubConnectionBuilder().withUrl(url).withAutomaticReconnect().build();

		newConnection.start().catch((error) => setError(error));

		setConnection(newConnection);
	}, [url]);

	return [connection, error];
}
