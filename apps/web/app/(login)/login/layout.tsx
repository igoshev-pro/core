export default async function LoginRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>{children}</main>
  );
}