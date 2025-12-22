"use client";

export default function AdminError({ error }: { error: Error & { digest?: string } }) {
  return (
    <div style={{ padding: 24 }}>
      <h2>Admin render error</h2>
      <div>digest: {error.digest}</div>
      <pre style={{ whiteSpace: "pre-wrap" }}>{error.message}</pre>
    </div>
  );
}