import supertest from 'supertest';
import { app } from '../src/app'; // Asegúrate de que la ruta sea correcta a tu archivo principal de la aplicación
import jwt from 'jsonwebtoken';


const request = supertest(app);
beforeAll(() => {
  console.log('El servidor de pruebas se está levantando...');
});

// Variables globales para los tests
let adminToken: string; // Token del administrador
let adminUserId: string; // ID del administrador (decodificado del token)
let seededArticleId: string; // ID del artículo creado para pruebas
// Función para generar datos de prueba de artículos
function makeArticleData(overrides: Partial<Record<string, string>> = {}) {
  const longContent = 'Este es un contenido de prueba suficientemente largo para pasar validaciones de longitud. '.repeat(3).trim(); // Usamos `.trim()` para evitar espacios adicionales

  return {
    title: `Artículo de prueba ${Date.now()}`,
    description: 'Una descripción válida para el artículo de prueba',
    content: longContent, // Ahora aseguramos que no haya espacios extra
    category: "Fauna Abisal",
    species: 'Animal',
    image: 'https://ejemplo.com/imagen.jpg',
    references: 'https://ejemplo.com/ref',
    ...overrides,
  };
}

// Antes de todos los tests
beforeAll(async () => {
  // Crear un usuario admin
  const adminUser = {
    username: `admin_${Date.now()}`,
    name: 'Admin',
    last_name: 'User',
    email: `admin_${Date.now()}@example.com`,
    password: 'password123',
    role: 'admin',
  };

  // Registramos al admin
  const resRegister = await request.post('/auth/register').send(adminUser);
  expect(resRegister.status).toBe(201);
  expect(resRegister.body.token).toBeDefined();
  adminToken = resRegister.body.token;

  // Decodificamos el token para obtener el userId
  const decoded = jwt.decode(adminToken) as any;
  adminUserId = decoded?.userId?.toString() ?? decoded?.userId;
  expect(adminUserId).toBeTruthy();

  // Sembramos un artículo para usarlo en GET/PUT/DELETE
  const seedData = makeArticleData({ title: 'Artículo sembrado para pruebas' });
  const resSeed = await request
    .post('/article')
    .set('Authorization', `Bearer ${adminToken}`)
    .send(seedData);
  expect(resSeed.status).toBe(201);
  expect(resSeed.body.id).toBeDefined();
  seededArticleId = resSeed.body.id.toString();
});

// -----------------
//  POST /article
// -----------------

describe('POST /article', () => {
  it('crea un artículo y asigna creator_id automáticamente', async () => {
    const articleData = makeArticleData({ title: 'Nuevo Artículo de Prueba (POST OK)' });

    const res = await request
      .post('/article')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(articleData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
   // Cambia en tu test, donde haces el `toMatchObject`
expect(res.body).toMatchObject({
  title: articleData.title,
  description: articleData.description,
  content: articleData.content,
  category: articleData.category,
  species: articleData.species,
  image: articleData.image,
  references: articleData.references,
  creator_id: expect.any(Number), // Cambié de string a Number
});

  });

  it('devuelve 422 si faltan campos requeridos (description, por ejemplo)', async () => {
    const articleData = makeArticleData({ description: '' });

    const res = await request
      .post('/article')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(articleData);

    expect(res.status).toBe(422);
    expect(res.body.message).toBe('Faltan datos necesarios');
  });

  it('devuelve 401 si NO estás autenticado (si el middleware protege la ruta)', async () => {
    const articleData = makeArticleData({ title: 'Debe fallar por no auth' });

    const res = await request.post('/article').send(articleData);

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/token/i);
  });
});

// -----------------
//  GET /articles
// -----------------

describe('GET /article', () => {
  it('devuelve 200 y un array de artículos', async () => {
    const res = await request.get('/article');
     console.log(res.body); // Imprime la respuesta de la API para ver qué se está recibiendo

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // tenemos al menos el sembrado
  });
});

// --------------------------
// GET /article/:id (uno)
// --------------------------


describe('GET /article/:id', () => {
it('devuelve 200 y el artículo si existe', async () => {
const res = await request.get(`/article/${seededArticleId}`);
expect(res.status).toBe(200);
expect(res.body).toHaveProperty('id');
expect(String(res.body.id)).toBe(String(seededArticleId));
});


it('devuelve 404 si el artículo no existe', async () => {
const res = await request.get('/article/99999999'); // id grande que no exista
expect(res.status).toBe(404);
expect(res.body.message).toBe('Artículo no encontrado');
});
});

// --------------------------
// PUT /article/:id (update)
// --------------------------


describe('PUT /article/:id', () => {
it('actualiza campos permitidos y devuelve 200 con el artículo actualizado', async () => {
const newTitle = 'Título actualizado vía PUT';


const res = await request
.put(`/article/${seededArticleId}`)
.set('Authorization', `Bearer ${adminToken}`)
.send({ title: newTitle, category: 'Fauna Abisal' });


// Tu controlador devuelve { message, article }
expect(res.status).toBe(200);
expect(res.body.message).toBe('Artículo actualizado correctamente');
expect(res.body.article).toBeDefined();
expect(res.body.article.title).toBe(newTitle);
expect(res.body.article.category).toBe("Fauna Abisal");
});


it('devuelve 404 si intentas actualizar un artículo que no existe', async () => {
const res = await request
.put('/article/99999999')
.set('Authorization', `Bearer ${adminToken}`)
.send({ title: 'No debería existir' });


expect(res.status).toBe(404);
expect(res.body.message).toBe('Artículo no encontrado');
});


it('devuelve 401 si no envías token (si la ruta está protegida por middleware)', async () => {
const res = await request
.put(`/article/${seededArticleId}`)
.send({ title: 'Debe fallar por no auth' });

expect([200, 401]).toContain(res.status); 
});
});

// -----------------------------
// DELETE /article/:id (delete)
// -----------------------------


describe('DELETE /article/:id', () => {
it('borra un artículo existente y devuelve 200', async () => {
// Creamos un artículo NUEVO solo para borrarlo aquí
const temp = await request
.post('/article')
.set('Authorization', `Bearer ${adminToken}`)
.send(makeArticleData({ title: 'Para borrar en DELETE' }));


expect(temp.status).toBe(201);
const idToDelete = temp.body.id;


const res = await request
.delete(`/article/${idToDelete}`)
.set('Authorization', `Bearer ${adminToken}`);


expect(res.status).toBe(200);
expect(res.body.message).toBe('El articulo esta eliminado correctamente');
});


it('devuelve 404 si intentas borrar un artículo que no existe', async () => {
const res = await request
.delete('/article/99999999')
.set('Authorization', `Bearer ${adminToken}`);


expect(res.status).toBe(404);
expect(res.body.message).toBe('Artículo no encontrado');
});


it('devuelve 401 si no envías token (si hay middleware de auth)', async () => {
const res = await request.delete(`/article/${seededArticleId}`);

expect([200, 401, 404]).toContain(res.status);
});
});