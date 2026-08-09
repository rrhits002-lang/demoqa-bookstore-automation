console.log("REQRES_API_KEY =", process.env.REQRES_API_KEY);
// @ts-check
const { test, expect } = require('@playwright/test');

// Shared state across the three chained tests in this file.
let userId;
let createdUserPayload;
const reqresApiKey = process.env.REQRES_API_KEY;

test.describe.serial('reqres.in - User API flow', () => {
  test.skip(!reqresApiKey, 'REQRES_API_KEY is required for reqres.in API tests');

  if (reqresApiKey) {
    test.use({
      baseURL: 'https://reqres.in',
      extraHTTPHeaders: {
        'x-api-key': reqresApiKey,
      },
    });
  }

  test('1. Create a new user', async ({ request }) => {
    createdUserPayload = {
      name: 'Rohit Shinde',
      job: 'SDET',
    };

    const response = await request.post('/api/users', {
      data: createdUserPayload,
    });

    // --- Validate status code ---
    expect(response.status()).toBe(201);

    const body = await response.json();

    // --- Validate response body echoes what we sent ---
    expect(body.name).toBe(createdUserPayload.name);
    expect(body.job).toBe(createdUserPayload.job);
    expect(body.id).toBeDefined();
    expect(body.createdAt).toBeDefined();

    // --- Fetch and store userId for the next tests ---
    userId = body.id;
    console.log(`Created user with id: ${body.id}`);
  });

  test('2. Get the created user and validate details', async ({ request }) => {
    // Guard: this test depends on test 1 having run and stored userId.
    expect(userId, 'userId should have been set by the create-user test').toBeDefined();

    const response = await request.get(`/api/users/2`);

    // --- Validate status code ---
    expect(response.status()).toBe(200);

    const body = await response.json();

    // NOTE: reqres.in's GET /api/users/{id} is a static mock endpoint.
    // It does NOT return the user you just created — it returns fixed
    // seed data for whatever id you pass (e.g. id=2 -> "Janet Weaver").
    // So here we validate the response *structure and id echo*, which is
    // the correct/only thing to assert against this mock API.
    expect(body.data).toBeDefined();
    expect(body.data.id).toBe(2);
    expect(body.data.email).toBeDefined();
    expect(body.data.first_name).toBeDefined();
    expect(body.data.last_name).toBeDefined();
    expect(body.data.avatar).toBeDefined();
    expect(body.support).toBeDefined();

    console.log(`Fetched user: ${JSON.stringify(body.data)}`);
  });

test('3. Update user name and validate', async ({ request }) => {
  const updatedPayload = {
    name: 'Rohit Sharma Updated',
    job: 'SDET',
  };

  const response = await request.put('/api/users/2', {
    data: updatedPayload,
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.name).toBe(updatedPayload.name);
  expect(body.job).toBe(updatedPayload.job);
  expect(body.updatedAt).toBeDefined();
});

});