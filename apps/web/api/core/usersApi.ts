import { withProjectId } from "../utils/withProjectId";

export type UserDto = { id: string; name: string };

export async function getUsers(): Promise<UserDto[]> {
  const res = await fetch(`/api/proxy/users${withProjectId()}`, {
    method: "GET",
    // если у тебя auth через HttpOnly cookie — этого достаточно (cookie уйдут сами)
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`searchUsers failed (${res.status}): ${text || res.statusText}`);
  }

  return res.json();
}