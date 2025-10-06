import supertest from 'supertest';
import { app } from '../src/app'; // Asegúrate de que la ruta sea correcta a tu archivo principal de la aplicación
import { User } from '../src/models/UserModel';  // Asegúrate de que tu modelo de usuario esté configurado correctamente
import { Article } from '../src/models/ArticleModel';
import jwt from 'jsonwebtoken';


const request = supertest(app);

// Simulamos un usuario admin para las pruebas
let adminToken: string;
let adminUserId: string;

beforeAll(async () => {
  // 1. Crea un usuario admin para obtener su token de autenticación
  const adminUser = {
    username: "adminuser",
    name: "Admin",
    last_name: "User",
    email: "admin.articles@example.com",
    password: "password123",
    role: "admin",
  };

  // Registramos al admin (esto depende de tu implementación de registro)
  const res = await request.post("/auth/register").send(adminUser);

  // Aseguramos que la respuesta contiene un token
  expect(res.body.token).toBeDefined();
  adminToken = res.body.token;
  // adminUserId = res.body.user.id;  // Guarda el userId para futuras validaciones
 const decoded: any = jwt.verify(adminToken, process.env.JWT_SECRET!);
  adminUserId = decoded.userId;  // Ahora tienes el userId correctamente
  
});


// Test para la creación de artículo (POST /articles)
describe('POST /article', () => {

  it('should create an article and assign creator_id automatically', async () => {
    // 2. Preparamos el artículo sin pasar creator_id
    const articleData = {
      title: "Nuevo Artículo de Prueba",
      description: "Descripción válida",
      content: "Este es un contenido de prueba con exactamente cien caracteres para la validación, si no los tiene nunca pasará los test porque en las validaciones le hemos puesto ese requisito.",
      category: "General",
      species: "Animal",
      image: "https://imagen.com",
      references: "https://referencia.com",
    };

    // 3. Hacemos la solicitud para crear un artículo
    const res = await request
      .post("/article")
      .set("Authorization", `Bearer ${adminToken}`)  // Usamos el token de autenticación
      .send(articleData);

    // 4. Verificamos la respuesta
    expect(res.status).toBe(201);  // 201 significa que el artículo se creó correctamente
    expect(res.body).toHaveProperty("id");  // El artículo debe tener un ID
    expect(res.body).toMatchObject({
      title: articleData.title,
      description: articleData.description,
      content: articleData.content,
      category: articleData.category,
      species: articleData.species,
      image: articleData.image,
      references: articleData.references,
      creator_id: String(adminUserId),  // Verificamos que el creator_id sea el ID del usuario admin
    });
  });

  it('should return 422 if required fields are missing', async () => {
    // 5. Probamos si falta un campo esencial (por ejemplo, description)
    const articleData = {
      title: "Nuevo Artículo sin Descripción",
      content: "Este es un contenido de prueba con exactamente cien caracteres para la validación, si no los tiene nunca pasará los test porque en las validaciones le hemos puesto ese requisito.",
      category: "General",
      species: "Animal",
      image: "https://imagen.com",
      references: "https://referencia.com",
    };

    const res = await request
      .post("/article")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(articleData);

    // 6. Verificamos que se devuelva un error 400 si falta un campo
    expect(res.status).toBe(422);
    expect(res.body.message).toBe("Faltan datos necesarios");
  });

  it('should return 401 if the user is not authenticated', async () => {
    // 7. Probamos un caso donde el usuario no está autenticado
    const articleData = {
      title: "Artículos de prueba",
      description: "Descripción válida",
      content: "Contenido válido para la prueba de creación.",
      category: "General",
      species: "Animal",
      image: "https://imagen.com",
      references: "https://referencia.com",
    };

    const res = await request
      .post("/article")
      .send(articleData);  // No se pasa el token

    // 8. Verificamos que se devuelva un error 401 si no está autenticado
    expect(res.status).toBe(401);
    expect(res.body.message).toBe( "No se proporcionó token de autenticación");
  });

  // it('should return 500 if there is an error creating the article', async () => {
  //   // 9. Simulamos un error en la base de datos
  //   const articleData = {
  //     title: "Forzado para error",
  //     description: "Este artículo causará un error.",
  //     content: "Contenido para forzar error.",
  //     category: "General",
  //     species: "Animal",
  //     image: "https://imagen.com",
  //     references: "https://referencia.com",
  //   };

  //   // Simulamos un error en el modelo (por ejemplo, fallo en la creación)
  //   const originalCreate = Article.create;
  //   Article.create = async () => {
  //     throw new Error("Error forzado en la base de datos");
  //   };

  //   const res = await request
  //     .post("/article")
  //     .set("Authorization", `Bearer ${adminToken}`)
  //     .send(articleData);

  //   // Verificamos que se devuelva un error 500
  //   expect(res.status).toBe(500);
  //   expect(res.body.message).toBe("No se pudo crear el artículo, Error desconocido");

  //   // Restauramos la función original para no afectar otros tests
  //   Article.create = originalCreate;
  // });

});

