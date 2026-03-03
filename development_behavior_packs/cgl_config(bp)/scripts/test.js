import { world } from "@minecraft/server";
import { http, HttpRequest, HttpRequestMethod } from "@minecraft/server-net";

// Função para buscar dados do banco
async function buscarDadosBanco() {
  const request = new HttpRequest("http://localhost:3000/jogadores");
  request.method = HttpRequestMethod.Get;

  const response = await http.request(request); // ✅ http já é o cliente, sem "new"

  if (response.status === 200) {
    const dados = JSON.parse(response.body);
    dados.forEach(jogador => {
      world.sendMessage(`Fabricio: ${jogador.fabricio}, XP: ${jogador.xp}`);
    });
  } else {
    world.sendMessage(`Erro ao buscar dados: ${response.status}`);
  }
}

// Evento: quando um bloco é quebrado
world.afterEvents.playerBreakBlock.subscribe((ev) => {
    buscarDadosBanco();
});