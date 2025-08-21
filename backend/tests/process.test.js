import request from 'supertest';
import app from '../src/app.js';

// POST localhost:3000/api/processes
describe('POST /processes', () => {
  let token = '';

  beforeAll(async () => {
    const uniqueId = Date.now();
    const newUser = {
      username: `user_${uniqueId}`,
      password: 'Test1234!',
      email: `user${uniqueId}@example.com`,
      role: 'lector',
      phone_number: '+593987654321',
    };

    await request(app).post('/accounts/create').send(newUser);

    const res = await request(app).post('/accounts/login').send({
      username: newUser.username,
      password: newUser.password,
    });
    token = res.body.token;
  });

  it('Debe crear un proceso y devolver status 201', async () => {
    const newProcess = {
      title: 'Proceso penal',
      type: 'Civil',
      offense: 'Robo',
      last_update: '2025-06-01T10:00:00Z',
      denounced: 'Juan Pérez',
      denouncer: 'María López',
      province: 'Buenos Aires',
      carton: 'Carton123',
    };

    const response = await request(app)
      .post('/processes')
      .set('Authorization', `Bearer ${token}`)
      .send(newProcess);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('process_id');
  });
});
// GET localhost:3000/api/processes
describe('GET /processes', () => {
  let token;

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/accounts/login')
      .send({ username: 'string', password: 'string' });

    token = loginResponse.body.token;
  });

  it('debe devolver todos los procesos', async () => {
    const response = await request(app)
      .get('/processes')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
// GET localhost:3000/api/processes/me
describe('GET /processes/me', () => {
  let token;

  beforeAll(async () => {
    // Login para obtener token
    const loginResponse = await request(app)
      .post('/accounts/login')
      .send({ username: 'string', password: 'string' });

    token = loginResponse.body.token;
  });

  it('debe devolver los procesos del usuario autenticado', async () => {
    const response = await request(app)
      .get('/processes/me')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
// GET localhost:3000/api/processes/id
describe('GET /processes/31', () => {
  let token;

  beforeAll(async () => {
    // Login para obtener token con credenciales válidas
    const loginResponse = await request(app).post('/accounts/login').send({
      username: 'user_1748913553072',
      password: 'Test1234!',
    });

    token = loginResponse.body.token;
  });

  it('debe devolver el proceso con ID 31', async () => {
    const response = await request(app)
      .get('/processes/31')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('process_id', 31);
  });
});
// delete localhost:3000/api/processes/id
describe('POST y DELETE /processes', () => {
  let token = '';
  let createdProcessId;

  beforeAll(async () => {
    const uniqueId = Date.now();
    const newUser = {
      username: `user_${uniqueId}`,
      password: 'Test1234!',
      email: `user${uniqueId}@example.com`,
      role: 'lector',
      phone_number: '+593987654321',
    };
    await request(app).post('/accounts/create').send(newUser);
    // Login
    const res = await request(app).post('/accounts/login').send({
      username: newUser.username,
      password: newUser.password,
    });

    token = res.body.token;
  });

  it('Debe crear un proceso y luego eliminarlo', async () => {
    const newProcess = {
      title: 'Proceso penal',
      type: 'Civil',
      offense: 'Robo',
      last_update: '2025-06-01T10:00:00Z',
      denounced: 'Juan Pérez',
      denouncer: 'María López',
      province: 'Buenos Aires',
      carton: 'Carton123',
    };

    // Crear proceso
    const createRes = await request(app)
      .post('/processes')
      .set('Authorization', `Bearer ${token}`)
      .send(newProcess);

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body).toHaveProperty('process_id');

    // Guardar ID del proceso creado
    createdProcessId = createRes.body.process_id;

    // Eliminar proceso
    const deleteRes = await request(app)
      .delete(`/processes/${createdProcessId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.statusCode).toBe(204);
  });
});

// put localhost:3000/api/processes/id
describe('PUT /processes/31', () => {
  let token;

  beforeAll(async () => {
    // Login
    const res = await request(app).post('/accounts/login').send({
      username: 'user_1748913553072',
      password: 'Test1234!',
    });

    token = res.body.token; // Asignar correctamente el token
  });

  it('Debe actualizar el proceso con ID 31', async () => {
    const updatedProcess = {
      title: 'Proceso 31 Actualizado',
      type: 'Laboral',
      offense: 'Incumplimiento de contrato',
      last_update: '2025-06-02T15:30:00Z',
      denounced: 'Empresa XYZ',
      denouncer: 'Pedro Martínez',
      province: 'Pichincha',
      carton: 'Carton789',
    };

    const response = await request(app)
      .put('/processes/31')
      .set('Authorization', `Bearer ${token}`)
      .send(updatedProcess);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'Proceso actualizado correctamente'
    );

    // Confirmar que los datos se actualizaron correctamente
    const confirm = await request(app)
      .get('/processes/31')
      .set('Authorization', `Bearer ${token}`);

    expect(confirm.statusCode).toBe(200);
    expect(confirm.body.title).toBe(updatedProcess.title);
    expect(confirm.body.type).toBe(updatedProcess.type);
    expect(confirm.body.offense).toBe(updatedProcess.offense);
    expect(confirm.body.denounced).toBe(updatedProcess.denounced);
    expect(confirm.body.denouncer).toBe(updatedProcess.denouncer);
    expect(confirm.body.province).toBe(updatedProcess.province);
    expect(confirm.body.carton).toBe(updatedProcess.carton);
  });
});
