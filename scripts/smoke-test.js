const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const SQLITE_PATH = path.join(__dirname, "..", "data", "cyberedukz.sqlite");

async function request(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    redirect: "manual",
    ...options,
  });
  const text = await response.text();
  return { response, text };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  let result = await request("/health");
  assert(result.response.status === 200, `health expected 200, got ${result.response.status}`);
  const health = JSON.parse(result.text);
  assert(health.ok === true, "health response is not ok");
  assert(health.courses >= 5 && health.lessons >= 10 && health.challenges >= 10, "health content counts are too low");

  const routes = ["/", "/roadmap", "/labs", "/courses", "/lesson/linux-networking", "/leaderboard"];
  for (const route of routes) {
    const { response } = await request(route);
    assert(response.status === 200, `${route} expected 200, got ${response.status}`);
  }

  result = await request("/challenge/linux-open-port");
  assert(result.response.status === 302, "challenge page must redirect anonymous users");

  const email = `smoke-${Date.now()}@cyberedukz.local`;
  result = await request("/register", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      name: "Smoke Tester",
      email,
      password: "Password123",
    }),
  });
  assert(result.response.status === 302, `register expected 302, got ${result.response.status}`);
  const cookie = result.response.headers.get("set-cookie")?.split(";")[0];
  assert(cookie, "register did not set a session cookie");

  result = await request("/challenge/linux-open-port/submit", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      cookie,
    },
    body: new URLSearchParams({ flag: "CYB{port_80_http}" }),
  });
  assert(result.response.status === 302, `flag submit expected 302, got ${result.response.status}`);

  result = await request("/profile", { headers: { cookie } });
  assert(result.response.status === 200, `profile expected 200, got ${result.response.status}`);
  assert(result.text.includes("100"), "profile does not show awarded points");
  assert(result.text.includes("Последние решения"), "profile does not show recent solved section");

  result = await request("/login", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      email: "admin@cyberedukz.local",
      password: "Admin12345",
    }),
  });
  assert(result.response.status === 302, `admin login expected 302, got ${result.response.status}`);
  const adminCookie = result.response.headers.get("set-cookie")?.split(";")[0];
  assert(adminCookie, "admin login did not set a session cookie");

  result = await request("/admin", { headers: { cookie: adminCookie } });
  assert(result.response.status === 200, `admin expected 200, got ${result.response.status}`);
  assert(result.text.includes("Админ-панель"), "admin page heading missing");

  result = await request("/admin/course/linux-networks/edit", { headers: { cookie: adminCookie } });
  assert(result.response.status === 200, `course edit expected 200, got ${result.response.status}`);

  result = await request("/admin/lesson/linux-networking/edit", { headers: { cookie: adminCookie } });
  assert(result.response.status === 200, `lesson edit expected 200, got ${result.response.status}`);

  result = await request("/admin/challenge/linux-open-port/edit", { headers: { cookie: adminCookie } });
  assert(result.response.status === 200, `challenge edit expected 200, got ${result.response.status}`);

  assert(fs.existsSync(SQLITE_PATH), "SQLite database file does not exist");
  const db = new DatabaseSync(SQLITE_PATH);
  const columns = db.prepare("PRAGMA table_info(submissions)").all().map((column) => column.name);
  assert(!columns.includes("submittedValue"), "raw submitted flags column must not exist");
  assert(columns.includes("submittedHash"), "submittedHash column is missing");
  assert(db.prepare("SELECT COUNT(*) AS count FROM courses").get().count >= 5, "expected at least 5 courses");
  assert(db.prepare("SELECT COUNT(*) AS count FROM lessons").get().count >= 10, "expected at least 10 lessons");
  assert(db.prepare("SELECT COUNT(*) AS count FROM challenges").get().count >= 10, "expected at least 10 challenges");
  db.close();

  console.log("Smoke test passed");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
