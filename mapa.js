// 1. Inicializa o mapa focado em Natal, RN
const mapaEclipse = L.map('map').setView([-5.83, -35.20], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
}).addTo(mapaEclipse);

// 2. Define o emoji de estrela como marcador usando L.divIcon
const iconeEstrela = L.divIcon({
    html: '<div style="font-size: 30px; text-align: center; line-height: 1; filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.5));">⭐</div>',
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
});

// 3. Sistema de Gamificação (Carteira de Pontos)
let meusPontos = 0;
function registrarCheckin(localNome, pontosGanhos) {
    meusPontos += pontosGanhos;
    alert(`🎉 Check-in realizado em ${localNome}!\nVocê ganhou ${pontosGanhos} Pontos ESTRELA.\n\nSaldo atual do Clube: ${meusPontos} ⭐`);
}

// 4. NOVA FUNÇÃO: Ler o arquivo locais.json e desenhar no mapa
async function carregarLocais() {
    try {
        // O fetch 'pesca' o arquivo JSON externo
        const resposta = await fetch('locais.json');
        
        // Converte a resposta para um formato que o JavaScript entende (Array/Tabela)
        const parceiros = await resposta.json();

        // Faz o loop pela tabela puxando os novos dados estruturados
        parceiros.forEach(local => {
            let marcador = L.marker([local.coordenadas[0], local.coordenadas[1]], { icon: iconeEstrela }).addTo(mapaEclipse);
            
            // Pop-up atualizado com Endereço, Horário, Avaliação e Tipo
            marcador.bindPopup(`
                <strong style="color: #03AED2; font-family: 'Syne', sans-serif; font-size: 16px;">${local.nome}</strong><br>
                <span style="font-size: 11px; color: #7A8394; font-family: 'Inter', sans-serif; text-transform: uppercase;">${local.tipo}</span><br>
                
                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 8px 0;">
                
                <div style="font-family: 'Inter', sans-serif; font-size: 12px; color: #EEF0F3; line-height: 1.5;">
                    📍 <strong>Endereço:</strong> ${local.endereco}<br>
                    🕒 <strong>Horário:</strong> ${local.horario}<br>
                    📈 <strong>Avaliação Média:</strong> ⭐ ${local.avaliacao}
                </div>
                
                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 8px 0;">
                
                <strong style="color: #F45B26; font-family: 'Inter', sans-serif; display: block; margin-bottom: 10px;">
                    🎯 ${local.recompensa}
                </strong>
                
                <button 
                    onclick="registrarCheckin('${local.nome}', ${local.pontosNum})" 
                    style="background-color: #F45B26; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-family: 'Inter', sans-serif; width: 100%; font-weight: bold; transition: 0.2s;">
                    Fazer Check-in
                </button>
            `);
        });
    } catch (erro) {
        console.error("Erro ao carregar a tabela de locais:", erro);
    }
}

// 5. Executa a função para carregar os marcadores assim que o script é lido
carregarLocais();