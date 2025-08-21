import request from "supertest";
import app from "../src/app.js";
//post http://localhost:3000/api/accounts/create
describe("POST /accounts/create", () => {
  it("Debe crear una cuenta y devolver status 201", async () => {
    const nuevaCuenta = {
      username: "testuser_" + Date.now(), // nombre único por timestamp
      password: "Test1234!",
      email: `test${Date.now()}@example.com`, // email también único
      role: "lector",
      phone_number: "+593987654321",
    };

    const response = await request(app)
      .post("/accounts/create")
      .send(nuevaCuenta)
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("account_id"); // <- Aquí el cambio
  });
});
//post http://localhost:3000/api/accounts/create
describe("POST /accounts/login", () => {
  it("debe devolver 200 si las credenciales son válidas", async () => {
    const response = await request(app).post("/accounts/login").send({
      username: "string",
      password: "string",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token"); // Si tu API devuelve un token
  });

  it("debe devolver 401 si las credenciales son inválidas", async () => {
    const response = await request(app).post("/accounts/login").send({
      username: "usuarioinvalido",
      password: "contrainvalida",
    });

    expect(response.statusCode).toBe(401);
  });
});
//post http://localhost:3000/api/accounts/recover-password
describe("POST /accounts/recover-password", () => {
  it("debe devolver 200 si el correo se envia correctamente", async () => {
    const response = await request(app)
      .post("/accounts/recover-password")
      .send({
        email: "mssalcedo2@espe.edu.ec",
      });

    expect(response.statusCode).toBe(200);
  });

  it("debe devolver 401 si las credenciales son inválidas", async () => {
    const response = await request(app)
      .post("/accounts/recover-password")
      .send({
        email: "mssalcedo2@espe.edu.e",
      });

    expect(response.statusCode).toBe(404);
  });
});
//put http://localhost:3000/api/accounts/profile

const testUser = {
  username: "user_" + Date.now(),
  password: "Test1234!",
  email: `user${Date.now()}@example.com`,
  role: "lector",
  phone_number: "+593987654321",
};

beforeAll(async () => {
  await request(app).post("/accounts/create").send(testUser);
  const res = await request(app).post("/accounts/login").send({
    username: testUser.username,
    password: testUser.password,
  });
  res.body.token;
});

describe("PUT /accounts/profile", () => {
  let token;

  beforeAll(async () => {
    // Primero, crea una cuenta para obtener un token válido
    const uniqueId = Date.now();
    const userData = {
      username: `user_${uniqueId}`,
      password: "testpassword123",
      email: `user${uniqueId}@example.com`,
      phone_number: "+593987654321",
      role: "lector",
    };

    await request(app).post("/accounts/create").send(userData);

    const loginRes = await request(app).post("/accounts/login").send({
      username: userData.username,
      password: userData.password,
    });

    token = loginRes.body.token;
  });

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
