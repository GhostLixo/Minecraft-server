import { world, system } from "@minecraft/server";

function spawn(
  mob_indice = "slime",
  mobtag = "sem tag",
  quantiade,
  x,
  y,
  z,
  raio,
) {
  const minx = x - raio;
  const maxx = x + raio;
  const minz = z - raio;
  const maxz = z + raio;


  const mob = world
    .getDimension("overworld")
    .getEntities({ type: `minecraft:${mob_indice}` })
    .filter((e) => e.hasTag(mobtag)).length;

  for (let i = mob; i < quantiade; i++) {
    const randomIntX = Math.floor(Math.random() * (maxx - minx + 1)) + minx;
    const randomIntz = Math.floor(Math.random() * (maxz - minz + 1)) + minz;

    const topBlock = world.getDimension("overworld").getTopmostBlock({ x: randomIntX, z: randomIntz }, y);
    const spawnY = topBlock ? topBlock.location.y + 1 : y;

    world
      .getDimension("overworld")
      .spawnEntity(
        `minecraft:${mob_indice}`,
        { x: randomIntX, y : y, z: randomIntz },
        { initialPersistence: true },
      )
      .addTag(mobtag);

    const entidades = world
      .getDimension("overworld")
      .getEntities({
        location: { x: randomIntX, y : y, z: randomIntz },
        maxDistance: 1,
        tags: [mobtag],
        type: `minecraft:${mob_indice}`,
      });
    if (entidades.length > 0) {
      entidades[entidades.length - 1].addTag("system_spawn");
    }
  }
}

function teste() {
   spawn("cow", "vaca_louca", 7, 89, 73, 6, 5);
   spawn("pig", "pig_louco", 10, 90, 71, 90, 5)
}


world.afterEvents.entityDie.subscribe((ev) => {
  const { deadEntity } = ev;
  if (deadEntity.isValid && deadEntity) {
    if(deadEntity.hasTag("system_spawn")){
        spawn("pig", "pig_louco", 10, 90, 75, 90, 5);
        spawn("cow", "vaca_louca", 7, 89, 73, 6, 5);
        spawn("parrot", "teste", 5, 70, 70,70, 4);
    console.log("morreu");
    }
  }
});

// Adicione isso ao final do seu arquivo para iniciar o sistema assim que o mundo carregar
system.runTimeout(() => {
    spawn("pig", "pig_louco", 10, 90, 75, 90, 5);
    spawn("cow", "vaca_louca", 7, 89, 73, 6, 5);
    spawn("parrot", "teste", 5, 70, 70,70, 4);
}, 100); // Espera 5 segundos para o mundo carregar