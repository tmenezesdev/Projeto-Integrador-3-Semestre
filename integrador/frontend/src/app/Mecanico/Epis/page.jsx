'use client';
import Image from 'next/image';

export default function EpisPage() {
    return (
        <div className="p-6 md:p-10 space-y-10">

            {/* HERO */}
            <div className="relative rounded-3xl overflow-hidden h-[350px] md:h-[420px]">
                <img
                    src="https://media.istockphoto.com/id/2244936194/pt/foto/young-female-mechanic-works-on-aircraft-engine-inside-spacious-hangar-during-daylight-hours.webp?a=1&b=1&s=612x612&w=0&k=20&c=Q0fhNU64Z-N-dyeN1OEYjnVPXHC2Xs17EvrUo0FffHs="
                    className="w-full h-full object-cover"
                />


                <div className="absolute inset-0 bg-black/50" />

                <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 max-w-2xl leading-tight">
                        Segurança vem antes de qualquer ferramenta
                    </h1>
                    <p className="text-slate-300 max-w-xl text-sm md:text-base">
                        O uso de EPIs não é opcional. É essencial para preservar sua saúde e evitar acidentes graves.
                    </p>
                </div>
            </div>

            {/* FRASE */}
            <div className="bg-[#13102a] border border-red-500/20 p-6 rounded-2xl text-center">
                <h2 className="text-xl md:text-2xl font-semibold text-red-400 mb-2">
                    Um segundo sem EPI pode causar um acidente para a vida inteira.
                </h2>
                <p className="text-slate-400">
                    Utilize sempre os equipamentos de proteção ao manusear qualquer ferramenta.
                </p>
            </div>

            {/* SEÇÃO DE RISCO */}
            <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="h-[250px] md:h-[300px] rounded-2xl overflow-hidden">
                    <img
                        src="https://plus.unsplash.com/premium_photo-1661503440465-a9ec448adb89?w=800"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        Por que o uso de EPI é obrigatório?
                    </h2>
                    <p className="text-slate-400">
                        Ferramentas podem causar cortes, impactos, queimaduras e lesões permanentes.
                        O EPI reduz drasticamente esses riscos e garante um ambiente de trabalho seguro.
                    </p>
                </div>
            </div>

            {/* GRID EPIs */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* CARD */}
                <div className="bg-[#13102a] rounded-2xl overflow-hidden border border-[#7033ff]/10 hover:scale-[1.02] transition">
                    <div className="h-[180px] overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1567954970774-58d6aa6c50dc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGluZHVzdHJpYWwlMjBzYWZldHklMjBhdmlhdGlvbiUyMGVxdWlwbWVudCUyMGNhcGFjZXRlfGVufDB8fDB8fHww"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold text-lg">Capacete</h3>
                        <p className="text-slate-400 text-sm">
                            Protege contra quedas de objetos e impactos na cabeça.
                        </p>
                    </div>
                </div>

                {/* CARD */}
                <div className="bg-[#13102a] rounded-2xl overflow-hidden border border-[#7033ff]/10 hover:scale-[1.02] transition">
                    <div className="h-[180px] overflow-hidden">
                        <img
                            src="https://media.istockphoto.com/id/2190518272/pt/foto/close-up-technician-engineer-wearing-and-adjust-protective-safety-glove-safety-equipment-for.webp?a=1&b=1&s=612x612&w=0&k=20&c=G8tuzChfclRjDScKICvy6BoNCey4wn6iZusIgxnFTJw="
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold text-lg">Luvas de proteção</h3>
                        <p className="text-slate-400 text-sm">
                            Evitam cortes, queimaduras e contato com materiais perigosos.
                        </p>
                    </div>
                </div>

                {/* CARD */}
                <div className="bg-[#13102a] rounded-2xl overflow-hidden border border-[#7033ff]/10 hover:scale-[1.02] transition">
                    <div className="h-[180px] overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1646119871092-93532e81f391?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kdXN0cmlhbCUyMHNhZmV0eSUyMGF2aWF0aW9uJTIwZXF1aXBtZW50JTIwb2N1bG9zfGVufDB8fDB8fHww"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold text-lg">Óculos de proteção</h3>
                        <p className="text-slate-400 text-sm">
                            Protegem os olhos contra poeira, faíscas e partículas.
                        </p>
                    </div>
                </div>

            </div>

            {/* FINAL */}
            <div className="bg-[#13102a] border border-[#7033ff]/20 p-6 rounded-2xl text-center">
                <h2 className="text-xl font-semibold text-[#a87fff]">
                    Segurança não é escolha. É responsabilidade.
                </h2>
            </div>

        </div>
    );
}