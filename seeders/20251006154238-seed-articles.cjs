"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1) Obtener ids de usuarios sembrados (o existentes)
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users ORDER BY id ASC;"
    );
    if (!users.length) {
      throw new Error("No hay usuarios en la tabla `users`. Corre primero el seeder de users.");
    }

    // helper para rotar ids
    const pickUserId = (idx) => users[idx % users.length].id;

    // 2) Define aquí tus artículos (mínimo 30). Ejemplo con 12; duplica/cambia títulos para llegar a 30.
    const base = [
      {
        title: "El vuelo hipnótico de la mariposa monarca",
        description: "Migración épica desde Norteamérica hasta Oceanía",
        content: "Las mariposas monarca realizan uno de los viajes más largos...",
        category: "Migración",
        species: "Danaus plexippus",
        image: "https://images.unsplash.com/photo-1504198458649-3128b932f49b",
        references: "National Geographic, 2023",
      },
      {
        title: "Camuflaje natural en mariposas hoja",
        description: "El arte de pasar desapercibidas",
        content: "Kallima inachus imita hojas secas...",
        category: "Adaptación",
        species: "Kallima inachus",
        image: "https://images.unsplash.com/photo-1470115636492-6d2b56f9146e",
        references: "Journal of Natural History, 2022",
      },
      {
        title: "Ulysses: el azul brillante de Oceanía",
        description: "Ícono del norte australiano",
        content: "Papilio ulysses destaca por su iridiscencia...",
        category: "Biodiversidad",
        species: "Papilio ulysses",
        image: "https://images.unsplash.com/photo-1598970434795-0c54fe7c0642",
        references: "Australian Butterfly Sanctuary, 2024",
      },
      {
        title: "Polinizadores nocturnos subestimados",
        description: "Mariposas activas al anochecer",
        content: "Varias esfíngidas polinizan flores nocturnas...",
        category: "Polinización",
        species: "Agrius convolvuli",
        image: "https://images.unsplash.com/photo-1618160703438-3d5f22d3b5b0",
        references: "Royal Entomological Society, 2023",
      },
      {
        title: "Metamorfosis: cuatro etapas esenciales",
        description: "De huevo a imago",
        content: "El ciclo incluye huevo, larva, pupa y adulto...",
        category: "Ciclo de vida",
        species: "Morpho peleides",
        image: "https://images.unsplash.com/photo-1508182311256-e3f7d7c8f21f",
        references: "Smithsonian, 2021",
      },
      {
        title: "Iridiscencia y microestructuras",
        description: "Colores por física, no por pigmento",
        content: "En Morpho menelaus, nanoescamas refractan la luz...",
        category: "Evolución",
        species: "Morpho menelaus",
        image: "https://images.unsplash.com/photo-1549638441-b787d2e11f87",
        references: "Science Advances, 2023",
      },
      {
        title: "Mariposas como bioindicadores",
        description: "Sensibles al clima",
        content: "Cambios de temperatura alteran fenología y rangos...",
        category: "Ecología",
        species: "Vanessa cardui",
        image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6",
        references: "WWF Report, 2024",
      },
      {
        title: "Feromonas y comunicación química",
        description: "Mensajes volátiles",
        content: "Escamas masculinas liberan feromonas detectables...",
        category: "Comportamiento",
        species: "Idea leuconoe",
        image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd",
        references: "Butterfly Research Center, 2023",
      },
      {
        title: "Conservación en Cairns",
        description: "Refugio tropical australiano",
        content: "Más de 2000 ejemplares endémicos en programas de conservación...",
        category: "Conservación",
        species: "Papilio ulysses",
        image: "https://images.unsplash.com/photo-1592194996503-26b91e3d6d9a",
        references: "Cairns Butterfly Sanctuary, 2022",
      },
      {
        title: "Lacrifagia: beber lágrimas",
        description: "Estrategia curiosa",
        content: "Algunas mariposas obtienen sodio bebiendo lágrimas...",
        category: "Curiosidades",
        species: "Gorgone macarea",
        image: "https://images.unsplash.com/photo-1505489304215-1c2b60e9f7fc",
        references: "National Geographic, 2020",
      },
      {
        title: "Genética y patrones de color",
        description: "Genes que pintan alas",
        content: "Se han identificado loci que controlan bandas en Heliconius...",
        category: "Genética",
        species: "Heliconius erato",
        image: "https://images.unsplash.com/photo-1610552258213-3c09b3b5a01a",
        references: "Nature Genetics, 2024",
      },
      {
        title: "Monarca australiana: rutas locales",
        description: "Migraciones cortas en Oceanía",
        content: "Poblaciones introducidas muestran desplazamientos estacionales...",
        category: "Migración",
        species: "Danaus plexippus",
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
        references: "Oceania Journal of Ecology, 2022",
      }
    ];

    // duplica para llegar a 30 variando ligeramente los títulos
    const articles = [];
    const needed = 30;
    for (let i = 0; i < needed; i++) {
      const b = base[i % base.length];
      articles.push({
        creator_id: pickUserId(i),
        title: `${b.title} #${(i + 1).toString().padStart(2,"0")}`,
        description: b.description,
        content: b.content,
        category: b.category,
        species: b.species,
        image: b.image,
        references: b.references,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert("articles", articles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("articles", null, {});
  }
};
