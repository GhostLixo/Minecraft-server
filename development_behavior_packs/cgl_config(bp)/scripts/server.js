const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const client = new MongoClient("mongodb://localhost:27017");

app.use(express.json()); // ✅ FIX 1 — sem isso req.body fica undefined

async function main() {
  await client.connect();
  const db = client.db("Mine");
  const jogadores = db.collection("jogadores");
  const clans = db.collection("dbClan"); // ✅ FIX 2 — era db.collections() e variável ClanName errada

  // GET — buscar jogadores
  app.get("/jogadores", async (req, res) => {
    const dados = await jogadores.find({}, { projection: { xp: 1, fabricio: 1, _id: 0 } }).toArray();
    res.json(dados);
  }); 

// Retornar e consulta o nome de todos os clãs
  app.get("/carregarClanNames", async (req, res) => { 
    const teste = await clans.find({}, { projection: { nome: 1, _id: 0 } }).toArray();
    res.json(teste);
  });

  // POST — Cria e Salva o clã
  app.post("/SalvaClan", async (req, res) => { // ✅ FIX 3 — rota corrigida para /clans (igual ao Minecraft)
    try {
      const { nome, ListaMembros } = req.body;
      if (!nome) return res.status(400).json({ erro: "nome obrigatório" });
      await clans.insertOne({ nome, ListaMembros, criadoEm: Date.now() });
      res.status(200).json({ status: "ok", nome });
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }


  });
  app.post("/adicionarMembro", async (req, res) => {
    const { nome, ADDmembro } = req.body;
    await clans.updateOne(
        { nome: nome },
        { $push: { ListaMembros: ADDmembro } }
    );
   });

  app.listen(3000, () => console.log("✅ API rodando na porta 3000"));
}

main();



