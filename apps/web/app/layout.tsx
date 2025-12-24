import { Providers } from "@/app/providers";
import "../styles/globals.css";


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="font-sans">
                <Providers themeProps={{ attribute: "class", defaultTheme: "system", enableSystem: true }}>
                    {children}
                </Providers>
            </body>
        </html>
    );
}