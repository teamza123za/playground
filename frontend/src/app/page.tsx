"use client";

import { useEffect, useState } from "react";

type User = {
    id: number;
    name: string;
    role: string;
};

type ApiResponse = {
    success: boolean;
    data: User[];
};

export default function Home() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`)
            .then((res) => res.json())
            .then((result: ApiResponse) => {
                setUsers(result.data);
            })
            .catch((error) => console.error("API Error:", error));
    }, []);

    return (
        <main className="p-10">
            <h1 className="text-3xl font-bold">Playground Users</h1>

            <div className="mt-5 rounded border p-4">
                {users.map((user) => (
                    <div key={user.id} className="mb-3 rounded border p-3">
                        <p>
                            <strong>Name:</strong> {user.name}
                        </p>
                        <p>
                            <strong>Role:</strong> {user.role}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
}