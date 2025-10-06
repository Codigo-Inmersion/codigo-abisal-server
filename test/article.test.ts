import supertest from "supertest";
import { app } from "../src/app.js";
import { Article } from "../src/models/ArticleModel.js"

//Creamos el "agente" de supertest para enviar requests a la app.
const request = supertest(app);

//Aquí guardaremos el token del admin que creemos en beforeAll.
let adminToken: string;

// 5) Un helper pequeñito para crear payloads de artículo sin repetir mucho.
const makeArticle = (overrides: Partial<Record<string, any>> = {}) => ({
  title: "Nuevo artículo",
  description: "Descripción válida",
  content: "Este es un contenido de prueba con exactamente cien caracteres para la validación, si no los tiene nunca pasará los test porque en las validaciones le hemos puesto ese requisito.",
  category: "General",
  species: "Animal",
  image: "https://imagen.com",
  references: "https://referencia.com",
  creator_id: "admin_id",
    ...overrides,
});


describe("Rutas de Artículos", () => {
  //  Antes de todos los tests:
  //   Registramos un usuario admin
  //   Guardamos su token para las rutas protegidas (POST/PUT/DELETE).
  
  let adminId: string;  // Para almacenar el ID del usuario administrador
   
    beforeAll(async () => {
    const adminUser = {
    username: "adminuser",
    name: "Admin",
    last_name: "User",
    email: "admin.articles@example.com",
    password: "password123",
    role: "admin",
  };

  // Registramos al admin
  const res = await request.post("/auth/register").send(adminUser);

  // Verificamos la respuesta y el token
  console.log("Admin User Registered:", res.body);
 
  
  if (res.body.token) {
    adminToken = res.body.token;
    adminId = res.body.user.id;  // Guardamos el ID del administrador
     console.log("Admin Token:", adminToken);
  } else {
    console.log("Error: No token found in response.");
  }
});

  //  Variable para guardar el id del artículo que creemos.
    let createdId: string;

    
  // TEST: crear artículo (POST /articles).
  it("POST /articles — crea un artículo (201) y lo devuelve", async () => {
    //  Preparamos el body del artículo.
   const body = makeArticle({
   creator_id: adminId,  // Asigna el ID del admin
   });
    console.log("Cuerpo del artículo:", body);  // Verifica los datos enviados
    console.log("Longitud de `content`:", body.content.length); // Verifica la longitud de content

    //  Enviamos la petición con el token de admin.
    const res = await request
      .post("/article")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(body);

    console.log("Response body:", res.body); // Verifica la respuesta del servidor
    //  Comprobamos status y propiedades básicas.
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id"); // Sequelize debería volver con ID
    expect(res.body).toMatchObject({
      title: body.title,
      description: body.description,
      content: body.content,
      category: body.category,
      species: body.species,
      image: body.image,
      references: body.references,
      creator_id: body.creator_id,
    });

    // Guardamos el id para los siguientes tests.
    createdId = String(res.body.id);
  });
  // TEST: POST /article - error 500
it("POST /article — debe devolver un error 500 si falla la creación", async () => {
  // Preparamos un body válido (igual que tu test exitoso)
  const body = makeArticle({
    creator_id: adminId,
    title: "FORCE_ERROR", // solo para identificar este caso si quieres
  });

  // Forzamos que Article.create lance un error temporalmente
  const originalCreate = Article.create;
  Article.create = async () => {
    throw new Error("Error forzado para test 500");
  };

  const res = await request
    .post("/article")
    .set("Authorization", `Bearer ${adminToken}`)
    .send(body);

  expect(res.status).toBe(500);
  expect(res.body).toHaveProperty("message", "No se pudo crear el artículo");

  // Restauramos la función original para que no afecte otros tests
  Article.create = originalCreate;
});



  

 });

