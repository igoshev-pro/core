"use client";

import { getOtp, login } from "@/api/core/authApi";
import { getSuperAdmins } from "@/api/core/superAdminsApi";
import { useState } from "react";

export function UsersSearchClient() {
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const [loading, setLoading] = useState(false);

  const onSend = async () => {
    if (value.trim().length < 2) {
      return;
    }

    setLoading(true);
    try {
      const data = await getOtp({ email: value});
      console.log(data)
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async () => {
    console.log(value2)

    setLoading(true);
    try {
      const data = await login({ otp: value2, email: value});
      console.log(data)
    } finally {
      setLoading(false);
    }
  };

    const getGet = async () => {

    setLoading(true);
    try {
      const data = await getSuperAdmins();
      console.log(data)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center flex-col">
      <input
        className="border rounded px-3 py-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Введите минимум 2 символа"
      />
      <button className="border rounded px-3 py-2" onClick={onSend} disabled={loading}>
        {loading ? "..." : "Отправить"}
      </button>

      <input
        className="border rounded px-3 py-2"
        value={value2}
        onChange={(e) => setValue2(e.target.value)}
        placeholder="Введите минимум 2 символа"
      />
      <button className="border rounded px-3 py-2" onClick={onLogin} disabled={loading}>
        {loading ? "..." : "Login"}
      </button>
      <button className="border rounded px-3 py-2" onClick={getGet} disabled={loading}>
        {loading ? "..." : "Получить"}
      </button>
    </div>
  );
}