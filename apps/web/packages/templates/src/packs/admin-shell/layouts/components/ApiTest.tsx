"use client";

import { getUsers } from "@/api/core/usersApi";
import { useState } from "react";

type UserDto = { id: string; name: string };

export function UsersSearchClient() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);

  const onSearch = async () => {
    if (q.trim().length < 2) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const data = await getUsers();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        className="border rounded px-3 py-2"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Введите минимум 2 символа"
      />
      <button className="border rounded px-3 py-2" onClick={onSearch} disabled={loading}>
        {loading ? "..." : "Search"}
      </button>

      <div className="mt-3 w-full">
        {items.map((u) => (
          <div key={u.id}>{u.name}</div>
        ))}
      </div>
    </div>
  );
}