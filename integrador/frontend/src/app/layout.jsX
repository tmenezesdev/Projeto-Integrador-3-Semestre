import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dashboard de Estoque",
  description: "Sistema de gerenciamento de inventário",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} antialiased bg-primaria text-white`}>
          {children}
      </body>
    </html>
  );
}