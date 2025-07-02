require("../../setup"); // shared setup

const request = require("supertest");
const User = require("../../../models/user");

// a group of tests for the GET request - data retrival 
describe("GET /api/users", () => {
  it("returns an empty array when no users exist", async () => {
    // create an HTTP client and send a GET request
    const res = await request(global.app).get("/api/users");
    expect(res.statusCode).toBe(200); // ok
    expect(res.body).toEqual([]); // empty array
  });

  it("returns users when they exist", async () => {
    await User.create({ name: "Alice", email: "alice@example.com" });

    const res = await request(global.app).get("/api/users");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty("email", "alice@example.com");
  });
});
  
