// src/__tests__/auth.test.ts

import supertest from "supertest";
import { app } from "../src/app.js"; // Importamos la app de express


// Creamos un agente de supertest para hacer peticiones
const request = supertest(app);
// --- TESTS PARA REGISTRO ---
describe("POST /auth/register", () => {
  
  it("debería registrar un nuevo usuario y devolver un token", async () => {
    const newUser = {
      username: "testuser",
      name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
    };

    const response = await request.post("/auth/register").send(newUser);

    // 1. Comprobamos el Status Code
    expect(response.status).toBe(201);
    
    // 2. Comprobamos que la respuesta tenga un token
    expect(response.body).toHaveProperty("token");

    // 3. Comprobamos que el usuario devuelto sea el correcto (sin la contraseña)
    expect(response.body.user).toMatchObject({
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      last_name: newUser.last_name
    });
  });

  it("debería devolver un error 409 si el email ya existe", async () => {
    // Primero creamos un usuario
     const user = {
      username: "testuser",
      name: "Test",
      last_name: "User",
      email: "test@example.com",
      password: "password123",
    };
    // await UserModel.create(user);
    await request.post("/auth/register").send(user);

    // Intentamos registrarlo de nuevo con el mismo email
    const response = await request.post("/auth/register").send({
      ...user,
      username: "anotheruser" // cambiamos el username para que el error sea solo por el email
    });

    // Comprobamos el error
    expect(response.status).toBe(409);
    expect(response.body.message).toBe("El email ya está registrado");
  });

  it("debería devolver un error 422 por datos de validación inválidos", async () => {
     const invalidUser = {
      username: "a", // muy corto
      name: "Test",
      last_name: "User",
      email: "not-an-email", // email inválido
      password: "123", // muy corta
    };

    const response = await request.post("/auth/register").send(invalidUser);

    expect(response.status).toBe(422); // 422 Unprocessable Entity
    expect(response.body.errors).toBeInstanceOf(Array);
    // Comprobamos que contiene al menos un error para el campo 'username'
    expect(response.body.errors.some((err: any) => err.field === "username")).toBe(true);
  });
});

// --- TESTS PARA LOGIN ---
describe("POST /auth/login", () => {

  // Preparamos un usuario en la BD antes de cada test de login
  beforeEach(async () => {
    const user = {
      username: "loginuser",
      name: "Login",
      last_name: "User",
      email: "login@example.com",
      password: "password123", // La contraseña se hasheará en el controlador
      role: "user"
    };
    // Simulamos el proceso de registro para tener una contraseña hasheada
     await request.post("/auth/register").send(user);
  });
  
  it("debería loguear a un usuario existente y devolver un token", async () => {
    const credentials = {
      email: "login@example.com",
      password: "password123",
    };

    const response = await request.post("/auth/login").send(credentials);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe(credentials.email);
  });

  it("debería devolver un error 401 con contraseña incorrecta", async () => {
     const credentials = {
      email: "login@example.com",
      password: "wrongpassword",
    };

    const response = await request.post("/auth/login").send(credentials);
    
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Contraseña incorrecta");
  });

   it("debería devolver un error 404 si el usuario no existe", async () => {
     const credentials = {
      email: "nonexistent@example.com",
      password: "anypassword",
    };

    const response = await request.post("/auth/login").send(credentials);
    
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuario no encontrado");
  });

});