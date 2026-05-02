const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const client = new MongoClient("mongodb://localhost:27017"); // §s Endereço da host do mongo
app.use(express.json()); // ✅ FIX 1 — sem isso req.body fica undefined

async function main() {
  await client.connect();
  const COLECAO = client.db("Mine");
  const clans = COLECAO.collection("Dados dos Clans"); // ✅ FIX 2 — era db.collections() e variável ClanName errada

// §a POST — Cria e Salva o nome do clã e cria a lista membros --> nome: "", ListaMembros: [ ]
// §e Sempre Verifique se o primeiro parametro é igual ao que você definiu em new httpRequest
  app.get("/carregarClanNames", async (req, res) => {
    const teste = await clans
        .find({}, { projection: { Nome: 1, _id: 0 } })
        .toArray();
      res.json(teste);
  });
  app.post("/adicionarMembro", async (req, res) => {
    try {
      const { recebeu_ClanNome, recebeu_MembroConvidado } = req.body;
      await clans.updateOne(
        { Nome: recebeu_ClanNome },
        { $push: { ListaMembros: recebeu_MembroConvidado } },
      );
      res.status(200).json({ mensagem: "Membro adicionado!" }); // ← faltava isso!
    } 
    catch (err) {
      res.status(500).json({ erro: err.message });
    }
  });
  app.post("/SalvarClan", async (req, res) => {
    
    try {
      const { Nome, ListaMembros } = req.body;
      if (!Nome) return res.status(400).json({ erro: "Nome obrigatório" });
      await clans.insertOne({
            Nome,
            ListaMembros,
            Regras: "",
            CriadoEm: dataAtual().toString()
      });
      res.status(200).json({ status: "ok", Nome });
    } catch (err) {
      res.status(500).json({ erro: err.message }
      );
      console.log(err + " Erro ao criar o clã " + Nome)
    }

    

    
  });
  app.get("/carregarListaMembros/:doclan", async (req, res) => {
      const { doclan } = req.params;
      const listandoMembros = await clans.findOne(
        { Nome: doclan },
        { projection: { ListaMembros: 1, _id: 0 } },
      );
      if (!listandoMembros)
        return res.status(404).json({ Erro: "Clã não encontrado" });
      res.status(200).json(listandoMembros.ListaMembros);
  });
  

  app.listen(3000, () => console.log("✅ API rodando na porta 3000"));
}

main();

function dataAtual() {
  const data = Date();
  const Ano = new Date(data).getFullYear();
  const Mes = new Date(data).getMonth() + 1;
  const Dia = new Date(data).getDate();
  const MostrarData = `${Dia}/${Mes}/${Ano}`;
  return MostrarData;
}
