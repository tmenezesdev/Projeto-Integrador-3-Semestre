import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext/themecontext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SmartBench",
  description: "Sistema de gestão inteligente de ferramentas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-primaria text-white`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
