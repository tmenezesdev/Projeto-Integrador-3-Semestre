import Image from "next/image";
import SidebarNav from "../components/Sidebar/page"; 

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">

      <SidebarNav />

      <main className="flex-1 p-8">

        <div className="flex flex-col gap-1 mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Visão Geral do Estoque
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Acompanhe as movimentações, entradas e saídas recentes dos seus produtos.
          </p>
        </div>


      </main>

    </div>
  );
}