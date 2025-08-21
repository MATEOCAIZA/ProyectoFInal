import request from "supertest";
import app from "../src/app.js";

// Datos del usuario de prueba
const testUser = {
  username: "Micaelasalcedo",
  password: "admin",
  email: "micaelasalcedo8go@gmail.com",
  phone_number: "+593962846565",
  role: "lector",
};

let token; // Token global para tests que requieren autorización

// Crear la cuenta antes de los tests y obtener token
beforeAll(async () => {
  // Crear usuario (ignorar error si ya existe)
  await request(app)
    .post("/accounts/create")
    .send(testUser)
    .set("Accept", "application/json");

  // Login para obtener token
  const loginRes = await request(app)
    .post("/accounts/login")
    .send({
      username: testUser.username,
      password: testUser.password,
    });

  token = loginRes.body.token;
});

describe("POST /accounts/create", () => {
  it("Debe crear una cuenta y devolver status 201", async () => {
    const nuevaCuenta = {
      username: "testuser_" + Date.now(),
      password: "Test1234!",
      email: `test${Date.now()}@example.com`,
      role: "lector",
      phone_number: "+593987654321",
    };

    const response = await request(app)
      .post("/accounts/create")
      .send(nuevaCuenta)
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("account_id");
  });
});

describe("POST /accounts/login", () => {
  it("debe devolver 200 si las credenciales son válidas", async () => {
    const response = await request(app).post("/accounts/login").send({
      username: testUser.username,
      password: testUser.password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("debe devolver 401 si las credenciales son inválidas", async () => {
    const response = await request(app).post("/accounts/login").send({
      username: "usuarioinvalido",
      password: "contrainvalida",
    });

    expect(response.statusCode).toBe(401);
  });
});

describe("POST /accounts/recover-password", () => {
  it("debe devolver 200 si el correo se envia correctamente", async () => {
    const response = await request(app)
      .post("/accounts/recover-password")
      .send({ email: testUser.email });

    expect(response.statusCode).toBe(200);
  });

  it("debe devolver 404 si el correo es inválido", async () => {
    const response = await request(app)
      .post("/accounts/recover-password")
      .send({ email: "correo_invalido@example.com" });

    expect(response.statusCode).toBe(404);
  });
});

describe("PUT /accounts/profile", () => {
  it("debe actualizar el perfil del usuario autenticado", async () => {
    const res = await request(app)
      .put("/accounts/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Soy abogada con experiencia en derecho civil.",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("account");
    expect(res.body).toHaveProperty("profile");
    expect(res.body.profile).toHaveProperty(
      "content",
      "Soy abogada con experiencia en derecho civil."
    );
  });

  it("debe rechazar si no hay token", async () => {
    const res = await request(app).put("/accounts/profile").send({
      content: "Actualización sin token",
    });

    expect(res.statusCode).toBe(401);
  });
});
