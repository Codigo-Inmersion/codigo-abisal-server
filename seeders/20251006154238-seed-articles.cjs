"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Obtener los IDs de los usuarios existentes para asignarlos a los artículos
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users ORDER BY id ASC;"
    );
    if (!users.length) {
      throw new Error("No hay usuarios en la tabla `users`. Ejecuta primero el seeder de usuarios.");
    }
    const pickUserId = (idx) => users[idx % users.length].id;

    // 2) Base de datos de prueba con temática abisal y categorías correctas
    const base = [
      {
        title: "El Calamar Vampiro: Un Fósil Viviente de las Profundidades",
        description: "Descubre al Vampyroteuthis infernalis y su bioluminiscencia única.",
        content: "El calamar vampiro no es ni un calamar ni un pulpo, sino un linaje antiguo que sobrevive en la zona de mínimo oxígeno. Su estrategia de defensa, que implica una capa de 'invisibilidad' bioluminiscente, es una de las adaptaciones más fascinantes del océano profundo.",
        category: "Fauna Abisal",
        species: "Vampyroteuthis infernalis",
        image: "https://oceanexplorer.noaa.gov/okeanos/explorations/ex1907/logs/aug10/ex1907_aug10_vampire-squid-600.jpg",
        references: "Monterey Bay Aquarium Research Institute (MBARI), 2023",
      },
      {
        title: "Respiraderos Hidrotermales: Oasis de Vida en la Oscuridad",
        description: "Ecosistemas que prosperan sin la luz del sol.",
        content: "Los respiraderos hidrotermales, o fumarolas negras, son chimeneas geológicas en el fondo del mar que emiten agua sobrecalentada rica en minerales. En lugar de la fotosíntesis, la vida aquí se basa en la quimiosíntesis, un proceso donde las bacterias convierten químicos tóxicos en energía.",
        category: "Ecosistemas",
        species: "Riftia pachyptila (gusano de tubo gigante)",
        image: "https://oceanexplorer.noaa.gov/facts/gallery/vents-hydrothermal-beebe-600.jpg",
        references: "National Geographic, 2024",
      },
      {
        title: "El Reto de Explorar la Fosa de las Marianas",
        description: "La tecnología necesaria para alcanzar el punto más profundo de la Tierra.",
        content: "Descender casi 11,000 metros bajo el nivel del mar requiere vehículos operados remotamente (ROVs) capaces de soportar presiones aplastantes, más de 1,000 veces la presión atmosférica en la superficie. La exploración de estos entornos extremos es crucial para entender la geología y la vida en la Tierra.",
        category: "Exploración",
        species: "N/A",
        image: "https://i.natgeofe.com/n/7b763953-2059-4074-9892-c92c90e0dda3/challenger-deep-sub_3x2.jpg",
        references: "Woods Hole Oceanographic Institution, 2022",
      },
      {
        title: "La Amenaza de la Minería en Aguas Profundas",
        description: "El impacto potencial sobre ecosistemas frágiles y desconocidos.",
        content: "El fondo marino es rico en nódulos polimetálicos, codiciados por sus minerales. Sin embargo, la minería en aguas profundas podría destruir hábitats que han tardado millones de años en formarse, aniquilando especies que aún no hemos descubierto. La conservación de estas zonas es un debate científico y ético de primer orden.",
        category: "Conservación",
        species: "N/A",
        image: "https://media.springernature.com/full/springer-static/image/art%3A10.1038%2Fs41561-019-0424-9/MediaObjects/41561_2019_424_Fig1_HTML.png",
        references: "WWF Global, 2024",
      },
      {
        title: "Peces Dragón: Depredadores Bioluminiscentes",
        description: "El terror de la zona crepuscular con su señuelo luminoso.",
        content: "Los peces dragón del género Stomiidae poseen fotóforos (órganos que producen luz) debajo de sus ojos y un señuelo bioluminiscente que cuelga de su barbilla para atraer a sus presas en la oscuridad total. Son un ejemplo perfecto de la evolución depredadora en el abismo.",
        category: "Fauna Abisal",
        species: "Stomiidae family",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/29/Deep_Sea_Dragonfish_%28Idiacanthus_atlanticus%29.jpg",
        references: "Journal of Marine Biology, 2023",
      },
      {
        title: "La 'Nieve Marina': Fuente de Vida para el Fondo del Océano",
        description: "Cómo llega la energía a las profundidades abisales.",
        content: "La 'nieve marina' es una lluvia continua de detritos orgánicos (restos de plancton, materia fecal, etc.) que cae desde las capas superiores del océano. Es la principal fuente de alimento para la mayoría de los habitantes del fondo marino, conectando la superficie con el abismo.",
        category: "Ecosistemas",
        species: "N/A",
        image: "https://www.whoi.edu/wp-content/uploads/2021/05/929009_1523368297_1400x933-scaled-e1620849226383.jpg",
        references: "NOAA Ocean Exploration, 2022",
      },
    ];

    const articles = [];
    const needed = 30;
    for (let i = 0; i < needed; i++) {
      const b = base[i % base.length];
      articles.push({
        creator_id: pickUserId(i),
        title: `${b.title} #${(i + 1).toString().padStart(2, "0")}`,
        description: b.description,
        content: b.content,
        category: b.category, // Ahora las categorías son correctas
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