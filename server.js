const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const PORT = Number(process.env.PORT || 3000);
const DB_PATH = path.join(__dirname, "data", "db.json");
const SQLITE_PATH = path.join(__dirname, "data", "cyberedukz.sqlite");
const sessions = new Map();

const COURSES = [
  {
    slug: "linux-networks",
    title: "Linux & Networks Basics",
    track: "Основы",
    difficulty: "Beginner",
    description:
      "Команды Linux, файловая система, TCP/IP, DNS и первые практические задания.",
  },
  {
    slug: "web-security",
    title: "Web Security Starter",
    track: "Web",
    difficulty: "Easy",
    description:
      "SQL Injection, XSS, авторизация и безопасные мини-лабораторные задания.",
  },
  {
    slug: "blue-team",
    title: "Blue Team Fundamentals",
    track: "SOC",
    difficulty: "Beginner",
    description:
      "Логи, инциденты, подозрительные события и базовое мышление SOC-аналитика.",
  },
  {
    slug: "red-team-basics",
    title: "Red Team Basics",
    track: "Red Team",
    difficulty: "Easy",
    description:
      "Разведка, базовая методология и безопасные учебные сценарии без атаки на реальные системы.",
  },
  {
    slug: "digital-forensics",
    title: "Digital Forensics Starter",
    track: "Forensics",
    difficulty: "Easy",
    description:
      "Файловые артефакты, метаданные, таймлайны и базовая аналитика цифровых следов.",
  },
  {
    slug: "appsec-kz",
    title: "AppSec & Secure SDLC KZ",
    track: "AppSec",
    difficulty: "Easy",
    description:
      "Secure SDLC, OWASP Top 10, обработка персональных данных и практики безопасной разработки для продуктовых команд Казахстана.",
  },
];

const LESSONS = [
  {
    id: "linux-files",
    courseSlug: "linux-networks",
    order: 1,
    title: "Файлы и навигация в Linux",
    summary: "pwd, ls, cd, cat и скрытые файлы как первый навык для CTF.",
    theory:
      "Большая часть практики в кибербезопасности начинается с уверенной навигации по файловой системе. В Linux скрытые файлы начинаются с точки, а базовые команды помогают быстро понять, где вы находитесь и какие данные доступны.",
  },
  {
    id: "linux-networking",
    courseSlug: "linux-networks",
    order: 2,
    title: "Сеть: порты, DNS и HTTP",
    summary: "Как читать адреса, порты и простые HTTP-запросы.",
    theory:
      "Сетевые основы нужны и pentester'у, и SOC-аналитику. Порт показывает сервис, DNS связывает имя с адресом, а HTTP-запрос раскрывает метод, путь, заголовки и тело.",
  },
  {
    id: "web-sqli",
    courseSlug: "web-security",
    order: 1,
    title: "SQL Injection без магии",
    summary: "Почему склейка SQL-строк опасна и как выглядит первый обход.",
    theory:
      "SQL Injection возникает, когда пользовательский ввод попадает в SQL-запрос без параметризации. В учебной среде мы не атакуем реальные сайты, а разбираем принцип: ввод меняет логику запроса.",
  },
  {
    id: "web-xss",
    courseSlug: "web-security",
    order: 2,
    title: "XSS и доверие к вводу",
    summary: "Как пользовательский текст становится скриптом на странице.",
    theory:
      "XSS появляется, когда приложение выводит пользовательский ввод как HTML/JavaScript. Защита строится на экранировании, Content Security Policy и аккуратной работе с шаблонами.",
  },
  {
    id: "blue-logs",
    courseSlug: "blue-team",
    order: 1,
    title: "Логи и первые признаки атаки",
    summary: "Как увидеть подозрительное событие в потоке записей.",
    theory:
      "Blue Team начинает с наблюдения. В логах важны время, источник, действие, результат и повторяемость. Серия неудачных входов из одного источника часто указывает на brute force.",
  },
  {
    id: "blue-incident",
    courseSlug: "blue-team",
    order: 2,
    title: "Мини-таймлайн инцидента",
    summary: "Как собрать события в понятную последовательность.",
    theory:
      "Инцидент легче объяснить, когда события собраны в таймлайн: что произошло первым, что было следующим, где появился риск и какой вывод можно сделать.",
  },
  {
    id: "red-recon",
    courseSlug: "red-team-basics",
    order: 1,
    title: "Разведка в учебной среде",
    summary: "Как собирать информацию о цели в рамках разрешенного лабораторного сценария.",
    theory:
      "Red Team начинается с границ и разрешения. В учебной среде цель заранее определена, а разведка сводится к чтению описания, открытых подсказок и безопасных сервисных признаков.",
  },
  {
    id: "red-methodology",
    courseSlug: "red-team-basics",
    order: 2,
    title: "Методология и отчётность",
    summary: "Как описывать находку так, чтобы она была полезна защитникам.",
    theory:
      "Хороший отчёт содержит контекст, шаг воспроизведения в лаборатории, риск, доказательство и рекомендацию. Даже простая учебная находка должна объяснять, что именно нужно исправить.",
  },
  {
    id: "forensics-metadata",
    courseSlug: "digital-forensics",
    order: 1,
    title: "Метаданные файлов",
    summary: "Как базовые свойства файла помогают в расследовании.",
    theory:
      "Метаданные помогают понять происхождение и историю файла: время создания, изменение, расширение, размер и иногда автора. В MVP мы работаем с безопасными учебными артефактами.",
  },
  {
    id: "forensics-timeline",
    courseSlug: "digital-forensics",
    order: 2,
    title: "Таймлайн артефактов",
    summary: "Как собрать несколько следов в единую историю.",
    theory:
      "Таймлайн связывает события по времени. Это помогает отделить первичное событие от последствий и объяснить инцидент без хаоса в деталях.",
  },
  {
    id: "appsec-threat-model",
    courseSlug: "appsec-kz",
    order: 1,
    title: "Threat Modeling для веб-продукта",
    summary: "Как до разработки найти активы, злоупотребления и защитные меры.",
    theory:
      "Threat Modeling помогает команде заранее понять, какие данные и сценарии важны, где возможны ошибки доступа, какие доверенные границы есть в системе и какие меры защиты нужно добавить до релиза.",
  },
  {
    id: "appsec-data-protection",
    courseSlug: "appsec-kz",
    order: 2,
    title: "Персональные данные и безопасное хранение",
    summary: "Минимизация данных, хеширование секретов и аккуратная работа с логами.",
    theory:
      "Для продукта в Казахстане важно проектировать обработку персональных данных осознанно: хранить только нужное, не писать секреты в логи, разделять роли доступа и фиксировать действия администратора.",
  },
];

const CHALLENGES = [
  {
    id: "linux-hidden-file",
    lessonId: "linux-files",
    courseSlug: "linux-networks",
    title: "Найти скрытый файл",
    points: 100,
    difficulty: "Beginner",
    description:
      "В Linux скрытые файлы начинаются с точки. Представь, что в домашней директории найден файл .flag. Какой флаг лежит внутри?",
    hint: "Формат флага: CYB{...}. Для демо используй тему hidden file.",
    flag: "CYB{hidden_file_found}",
  },
  {
    id: "linux-open-port",
    lessonId: "linux-networking",
    courseSlug: "linux-networks",
    title: "Определить открытый порт",
    points: 100,
    difficulty: "Beginner",
    description:
      "В учебном отчете указано: сервис HTTP отвечает на 80/tcp. Отправь флаг, подтверждающий найденный web-порт.",
    hint: "Флаг связан с port 80.",
    flag: "CYB{port_80_http}",
  },
  {
    id: "web-basic-sqli",
    lessonId: "web-sqli",
    courseSlug: "web-security",
    title: "Первый SQL Injection",
    points: 150,
    difficulty: "Easy",
    description:
      "Форма входа уязвима к простому обходу проверки. Найди учебный флаг, который подтверждает понимание SQL Injection.",
    hint: "Демо-флаг связан с фразой sqli basics.",
    flag: "CYB{sqli_basics}",
  },
  {
    id: "web-reflected-xss",
    lessonId: "web-xss",
    courseSlug: "web-security",
    title: "Reflected XSS",
    points: 150,
    difficulty: "Easy",
    description:
      "Страница поиска возвращает введенный текст без экранирования. Отправь флаг, подтверждающий XSS-риск.",
    hint: "Флаг связан с reflected xss.",
    flag: "CYB{reflected_xss}",
  },
  {
    id: "blue-team-ip",
    lessonId: "blue-logs",
    courseSlug: "blue-team",
    title: "Подозрительный IP",
    points: 120,
    difficulty: "Beginner",
    description:
      "SOC-аналитик видит серию неудачных попыток входа из одного адреса. Классифицируй событие и отправь флаг расследования.",
    hint: "Демо-флаг связан с brute force alert.",
    flag: "CYB{brute_force_alert}",
  },
  {
    id: "blue-timeline",
    lessonId: "blue-incident",
    courseSlug: "blue-team",
    title: "Собрать таймлайн",
    points: 120,
    difficulty: "Beginner",
    description:
      "События: сканирование порта, неудачные входы, успешный вход, изменение файла. Отправь флаг, если понял порядок инцидента.",
    hint: "Флаг связан с incident timeline.",
    flag: "CYB{incident_timeline}",
  },
  {
    id: "red-scope-check",
    lessonId: "red-recon",
    courseSlug: "red-team-basics",
    title: "Проверить scope",
    points: 130,
    difficulty: "Easy",
    description:
      "Перед тестом нужно убедиться, что цель входит в разрешенный scope. Отправь флаг, подтверждающий безопасный подход к разведке.",
    hint: "Флаг связан со словом scope.",
    flag: "CYB{scope_checked}",
  },
  {
    id: "red-report-finding",
    lessonId: "red-methodology",
    courseSlug: "red-team-basics",
    title: "Описать находку",
    points: 130,
    difficulty: "Easy",
    description:
      "В учебной лаборатории найден слабый пароль. Выбери флаг, который подтверждает, что находка должна быть оформлена с риском и рекомендацией.",
    hint: "Флаг связан с report finding.",
    flag: "CYB{report_the_finding}",
  },
  {
    id: "forensics-file-owner",
    lessonId: "forensics-metadata",
    courseSlug: "digital-forensics",
    title: "Найти автора файла",
    points: 140,
    difficulty: "Easy",
    description:
      "В учебном артефакте найдено поле author. Отправь флаг, если понял, что метаданные могут быть доказательством.",
    hint: "Флаг связан с metadata author.",
    flag: "CYB{metadata_author}",
  },
  {
    id: "forensics-event-order",
    lessonId: "forensics-timeline",
    courseSlug: "digital-forensics",
    title: "Порядок событий",
    points: 140,
    difficulty: "Easy",
    description:
      "События A, B и C нужно расположить по времени. Отправь флаг, подтверждающий корректный таймлайн.",
    hint: "Флаг связан с timeline order.",
    flag: "CYB{timeline_ordered}",
  },
  {
    id: "appsec-asset-map",
    lessonId: "appsec-threat-model",
    courseSlug: "appsec-kz",
    title: "Карта активов",
    points: 160,
    difficulty: "Easy",
    description:
      "Команда проектирует учебную платформу. Нужно определить самый чувствительный актив в сценарии: пароль, флаг, публичное описание курса или цвет кнопки.",
    hint: "Флаг связан с идеей secret asset.",
    flag: "CYB{secret_asset_mapped}",
  },
  {
    id: "appsec-log-hygiene",
    lessonId: "appsec-data-protection",
    courseSlug: "appsec-kz",
    title: "Гигиена логов",
    points: 160,
    difficulty: "Easy",
    description:
      "В логах обнаружили email, session token и submitted flag. Отправь флаг, если понял, что секреты и ответы нельзя хранить в открытом виде.",
    hint: "Флаг связан с log hygiene.",
    flag: "CYB{clean_logs_no_secrets}",
  },
];

function ensureDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    const now = new Date().toISOString();
    const challenges = [
      {
        id: "linux-hidden-file",
        courseSlug: "linux-networks",
        title: "Найти скрытый файл",
        points: 100,
        difficulty: "Beginner",
        description:
          "В Linux скрытые файлы начинаются с точки. Представь, что в домашней директории найден файл .flag. Какой флаг лежит внутри?",
        hint: "Формат флага: CYB{...}. Для демо используй тему hidden file.",
        flagHash: hashFlag("CYB{hidden_file_found}"),
      },
      {
        id: "web-basic-sqli",
        courseSlug: "web-security",
        title: "Первый SQL Injection",
        points: 150,
        difficulty: "Easy",
        description:
          "Форма входа уязвима к простому обходу проверки. Найди учебный флаг, который подтверждает понимание SQL Injection.",
        hint: "Демо-флаг связан с фразой sqli basics.",
        flagHash: hashFlag("CYB{sqli_basics}"),
      },
      {
        id: "blue-team-ip",
        courseSlug: "blue-team",
        title: "Подозрительный IP",
        points: 120,
        difficulty: "Beginner",
        description:
          "SOC-аналитик видит серию неудачных попыток входа из одного адреса. Классифицируй событие и отправь флаг расследования.",
        hint: "Демо-флаг связан с brute force alert.",
        flagHash: hashFlag("CYB{brute_force_alert}"),
      },
    ];

    const db = {
      users: [
        {
          id: "admin",
          email: "admin@cyberedukz.local",
          name: "Admin",
          passwordHash: hashPassword("Admin12345"),
          role: "ADMIN",
          points: 0,
          createdAt: now,
        },
      ],
      courses: [
        {
          slug: "linux-networks",
          title: "Linux & Networks Basics",
          track: "Основы",
          difficulty: "Beginner",
          description:
            "Команды Linux, файловая система, TCP/IP, DNS и первые практические задания.",
        },
        {
          slug: "web-security",
          title: "Web Security Starter",
          track: "Web",
          difficulty: "Easy",
          description:
            "SQL Injection, XSS, авторизация и безопасные мини-лабораторные задания.",
        },
        {
          slug: "blue-team",
          title: "Blue Team Fundamentals",
          track: "SOC",
          difficulty: "Beginner",
          description:
            "Логи, инциденты, подозрительные события и базовое мышление SOC-аналитика.",
        },
      ],
      challenges,
      submissions: [],
    };
    writeDb(db);
  }
}

function migrateDb(db) {
  let changed = false;
  if (!Array.isArray(db.courses)) {
    db.courses = [];
    changed = true;
  }
  if (!Array.isArray(db.lessons)) {
    db.lessons = [];
    changed = true;
  }
  if (!Array.isArray(db.challenges)) {
    db.challenges = [];
    changed = true;
  }

  for (const course of COURSES) {
    const existing = db.courses.find((item) => item.slug === course.slug);
    if (!existing) {
      db.courses.push(course);
      changed = true;
    }
  }

  for (const lesson of LESSONS) {
    const existing = db.lessons.find((item) => item.id === lesson.id);
    if (!existing) {
      db.lessons.push(lesson);
      changed = true;
    }
  }

  const nextChallenges = CHALLENGES.map(({ flag, ...challenge }) => ({
    ...challenge,
    flagHash: hashFlag(flag),
  }));
  for (const challenge of nextChallenges) {
    const existing = db.challenges.find((item) => item.id === challenge.id);
    if (!existing) {
      db.challenges.push(challenge);
      changed = true;
    } else if (!existing.lessonId) {
      existing.lessonId = challenge.lessonId;
      existing.courseSlug = challenge.courseSlug;
      existing.flagHash = challenge.flagHash;
      changed = true;
    }
  }

  if (!Array.isArray(db.submissions)) {
    db.submissions = [];
    changed = true;
  }
  for (const submission of db.submissions) {
    if (submission.submittedValue) {
      submission.submittedHash = hashFlag(submission.submittedValue);
      delete submission.submittedValue;
      changed = true;
    }
  }
  return changed;
}

function readDb() {
  ensureDb();
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  if (migrateDb(db)) writeDb(db);
  return db;
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

let sqliteDb;

function getSqlite() {
  if (!sqliteDb) {
    fs.mkdirSync(path.dirname(SQLITE_PATH), { recursive: true });
    sqliteDb = new DatabaseSync(SQLITE_PATH);
    sqliteDb.exec("PRAGMA journal_mode = WAL");
    sqliteDb.exec("PRAGMA foreign_keys = ON");
  }
  return sqliteDb;
}

function ensureSchema() {
  const db = getSqlite();
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL,
      points INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS courses (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      track TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      description TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      courseSlug TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      theory TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS challenges (
      id TEXT PRIMARY KEY,
      lessonId TEXT NOT NULL,
      courseSlug TEXT NOT NULL,
      title TEXT NOT NULL,
      points INTEGER NOT NULL,
      difficulty TEXT NOT NULL,
      description TEXT NOT NULL,
      hint TEXT NOT NULL,
      flagHash TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      challengeId TEXT NOT NULL,
      submittedHash TEXT NOT NULL,
      isCorrect INTEGER NOT NULL,
      createdAt TEXT NOT NULL
    );
  `);
}

function tableCount(table) {
  return getSqlite().prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count;
}

function seedDbObject() {
  const now = new Date().toISOString();
  return {
    users: [
      {
        id: "admin",
        email: "admin@cyberedukz.local",
        name: "Admin",
        passwordHash: hashPassword("Admin12345"),
        role: "ADMIN",
        points: 0,
        createdAt: now,
      },
    ],
    courses: [...COURSES],
    lessons: [...LESSONS],
    challenges: CHALLENGES.map(({ flag, ...challenge }) => ({
      ...challenge,
      flagHash: hashFlag(flag),
    })),
    submissions: [],
  };
}

function readLegacyOrSeed() {
  if (fs.existsSync(DB_PATH)) {
    const legacy = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    migrateDb(legacy);
    return legacy;
  }
  return seedDbObject();
}

function ensureDb() {
  ensureSchema();
  if (tableCount("users") === 0 && tableCount("courses") === 0) {
    writeDb(readLegacyOrSeed());
  } else {
    const current = readDbRaw();
    if (migrateDb(current)) writeDb(current);
  }
}

function readDbRaw() {
  const db = getSqlite();
  return {
    users: db.prepare("SELECT id, email, name, passwordHash, role, points, createdAt FROM users ORDER BY createdAt").all(),
    courses: db.prepare("SELECT slug, title, track, difficulty, description FROM courses ORDER BY rowid").all(),
    lessons: db.prepare('SELECT id, courseSlug, "order", title, summary, theory FROM lessons ORDER BY courseSlug, "order"').all(),
    challenges: db.prepare("SELECT id, lessonId, courseSlug, title, points, difficulty, description, hint, flagHash FROM challenges ORDER BY rowid").all(),
    submissions: db
      .prepare("SELECT id, userId, challengeId, submittedHash, isCorrect, createdAt FROM submissions ORDER BY createdAt")
      .all()
      .map((submission) => ({
        ...submission,
        isCorrect: Boolean(submission.isCorrect),
      })),
  };
}

function readDb() {
  ensureSchema();
  const db = readDbRaw();
  if (migrateDb(db)) writeDb(db);
  return db;
}

function writeDb(next) {
  const db = getSqlite();
  db.exec("BEGIN IMMEDIATE");
  try {
    db.exec("DELETE FROM submissions; DELETE FROM challenges; DELETE FROM lessons; DELETE FROM courses; DELETE FROM users;");

    const insertUser = db.prepare("INSERT INTO users (id, email, name, passwordHash, role, points, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)");
    for (const user of next.users) {
      insertUser.run(user.id, user.email, user.name, user.passwordHash, user.role, user.points || 0, user.createdAt || new Date().toISOString());
    }

    const insertCourse = db.prepare("INSERT INTO courses (slug, title, track, difficulty, description) VALUES (?, ?, ?, ?, ?)");
    for (const course of next.courses) {
      insertCourse.run(course.slug, course.title, course.track, course.difficulty, course.description);
    }

    const insertLesson = db.prepare('INSERT INTO lessons (id, courseSlug, "order", title, summary, theory) VALUES (?, ?, ?, ?, ?, ?)');
    for (const lesson of next.lessons) {
      insertLesson.run(lesson.id, lesson.courseSlug, lesson.order, lesson.title, lesson.summary, lesson.theory);
    }

    const insertChallenge = db.prepare("INSERT INTO challenges (id, lessonId, courseSlug, title, points, difficulty, description, hint, flagHash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    for (const challenge of next.challenges) {
      insertChallenge.run(challenge.id, challenge.lessonId, challenge.courseSlug, challenge.title, challenge.points, challenge.difficulty, challenge.description, challenge.hint, challenge.flagHash);
    }

    const insertSubmission = db.prepare("INSERT INTO submissions (id, userId, challengeId, submittedHash, isCorrect, createdAt) VALUES (?, ?, ?, ?, ?, ?)");
    for (const submission of next.submissions) {
      insertSubmission.run(submission.id, submission.userId, submission.challengeId, submission.submittedHash || hashFlag(submission.submittedValue || ""), submission.isCorrect ? 1 : 0, submission.createdAt || new Date().toISOString());
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function hashPassword(password) {
  const salt = "cyberedukz-demo-salt";
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function hashFlag(flag) {
  return crypto
    .createHash("sha256")
    .update(flag.trim().toLowerCase())
    .digest("hex");
}

function parseCookies(req) {
  const raw = req.headers.cookie || "";
  return Object.fromEntries(
    raw
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([key, value]) => key && value)
  );
}

function getCurrentUser(req) {
  const sid = parseCookies(req).sid;
  const userId = sid ? sessions.get(sid) : null;
  if (!userId) return null;
  return readDb().users.find((user) => user.id === userId) || null;
}

function isAdmin(user) {
  return Boolean(user && user.role === "ADMIN");
}

function makeId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function createSession(res, userId) {
  const sid = crypto.randomBytes(24).toString("hex");
  sessions.set(sid, userId);
  res.setHeader("Set-Cookie", `sid=${sid}; HttpOnly; Path=/; SameSite=Lax`);
}

function clearSession(req, res) {
  const sid = parseCookies(req).sid;
  if (sid) sessions.delete(sid);
  res.setHeader("Set-Cookie", "sid=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function send(res, html, status = 200) {
  res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

function sendJson(res, payload, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(new URLSearchParams(body)));
  });
}

function solvedChallengeIds(db, user) {
  if (!user) return new Set();
  return new Set(
    db.submissions
      .filter((submission) => submission.userId === user.id && submission.isCorrect)
      .map((submission) => submission.challengeId)
  );
}

function courseProgress(db, user, courseSlug) {
  const challenges = db.challenges.filter((challenge) => challenge.courseSlug === courseSlug);
  const solved = solvedChallengeIds(db, user);
  const done = challenges.filter((challenge) => solved.has(challenge.id)).length;
  return {
    total: challenges.length,
    done,
    percent: challenges.length ? Math.round((done / challenges.length) * 100) : 0,
  };
}

function totalProgress(db, user) {
  const solved = solvedChallengeIds(db, user);
  const total = db.challenges.length;
  const done = db.challenges.filter((challenge) => solved.has(challenge.id)).length;
  return {
    total,
    done,
    percent: total ? Math.round((done / total) * 100) : 0,
  };
}

function difficultyLabel(value) {
  return (
    {
      Beginner: "Новичок",
      Easy: "Лёгкий",
      Medium: "Средний",
      Hard: "Сложный",
    }[value] || value
  );
}

function layout({ title, user, body }) {
  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} | CyberEdu KZ</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <header class="app-header">
      <a class="brand" href="/">CyberEdu KZ</a>
      <nav class="nav">
        <a href="/courses">Курсы</a>
        <a href="/leaderboard">Рейтинг</a>
        ${
          user
            ? `${isAdmin(user) ? `<a href="/admin">Админ</a>` : ""}<a href="/profile">Профиль</a><form method="post" action="/logout"><button>Выйти</button></form>`
            : `<a href="/login">Войти</a><a href="/register">Регистрация</a>`
        }
      </nav>
    </header>
    <main>${body}</main>
  </body>
</html>`;
}

function css() {
  return `:root{--bg:#070b14;--surface:#0f172a;--surface2:#111827;--ink:#e5edf7;--muted:#94a3b8;--line:#253247;--accent:#14b8a6;--blue:#60a5fa;--danger:#fb7185}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at top left,rgba(20,184,166,.12),transparent 32rem),var(--bg);color:var(--ink);font-family:Arial,Helvetica,sans-serif}a{color:inherit;text-decoration:none}.muted{color:var(--muted);line-height:1.5}.app-header{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;min-height:64px;padding:0 32px;background:rgba(7,11,20,.92);border-bottom:1px solid var(--line);backdrop-filter:blur(16px)}.brand{font-size:20px;font-weight:800}.nav{display:flex;align-items:center;gap:18px;color:var(--muted);font-size:14px}.nav a:hover{color:white}.nav form{margin:0}.nav button{border:0;background:transparent;color:var(--muted);font:inherit;cursor:pointer}.page{width:min(1120px,calc(100% - 32px));margin:0 auto;padding:44px 0}.hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,.82fr);gap:40px;min-height:620px;align-items:center}.hero h1{margin:14px 0 0;font-size:52px;line-height:1.05}.hero p,.section-copy{color:var(--muted);font-size:18px;line-height:1.6}.visual{min-height:360px;border:1px solid var(--line);border-radius:8px;background:linear-gradient(90deg,rgba(7,11,20,.2),rgba(7,11,20,.4)),url('/cyber-grid.svg') center/cover;box-shadow:0 24px 80px rgba(0,0,0,.35)}.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}.button,.button-link{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;border:1px solid var(--line);border-radius:6px;background:transparent;color:var(--ink);font-weight:800;cursor:pointer}.button:hover,.button-link:hover{border-color:#5eead4}.primary{border-color:var(--accent);background:var(--accent);color:#041311}.panel{max-width:460px;padding:28px;background:linear-gradient(180deg,rgba(15,23,42,.98),rgba(15,23,42,.88));border:1px solid var(--line);border-radius:8px}.wide-panel{max-width:none}.panel h1,.section-heading h1{margin:0 0 8px}.panel p{margin:0;color:var(--muted);line-height:1.5}.form{display:grid;gap:14px;margin-top:24px}.field{display:grid;gap:6px}.field label{font-weight:800;font-size:14px}.field input,.field textarea,.field select{width:100%;min-height:42px;padding:10px 12px;border:1px solid var(--line);border-radius:6px;background:#0b1220;color:var(--ink);font:inherit}.field textarea{min-height:110px;resize:vertical}.notice{margin:0 0 16px;padding:12px 14px;border:1px solid rgba(251,113,133,.45);border-radius:6px;color:#fecdd3;background:rgba(251,113,133,.08)}.notice.ok{border-color:rgba(20,184,166,.45);color:#99f6e4;background:rgba(20,184,166,.08)}.helper{margin-top:16px;color:var(--muted);font-size:14px}.helper a{color:#5eead4;font-weight:800}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.admin-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.card,.leader-row,.stat{background:linear-gradient(180deg,rgba(15,23,42,.98),rgba(15,23,42,.82));border:1px solid var(--line);border-radius:8px}.card{display:grid;gap:16px;min-height:250px;padding:20px}.card:hover,.challenge:hover{border-color:#38506d}.card h3{margin:0;font-size:20px}.card p{margin:0;color:var(--muted);line-height:1.5}.badges{display:flex;flex-wrap:wrap;gap:8px}.badge{display:inline-flex;align-items:center;min-height:26px;padding:0 10px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:12px;font-weight:800}.badge.accent{border-color:rgba(20,184,166,.45);color:#5eead4}.progress{height:8px;overflow:hidden;background:#0b1220;border-radius:999px}.progress span{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--blue))}.course-layout{display:grid;grid-template-columns:1fr 360px;gap:20px}.challenge-list{display:grid;gap:12px}.challenge{padding:18px;background:linear-gradient(180deg,rgba(15,23,42,.98),rgba(15,23,42,.84));border:1px solid var(--line);border-radius:8px}.challenge h3{margin:0 0 8px}.challenge p{color:var(--muted);line-height:1.5}.challenge-workspace{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:20px;align-items:start}.challenge-main{display:grid;gap:14px}.workspace-top{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:22px;background:linear-gradient(180deg,rgba(17,24,39,.96),rgba(15,23,42,.8));border:1px solid var(--line);border-radius:8px}.workspace-top h1{margin:14px 0 0;font-size:34px;line-height:1.15}.submit-panel{position:sticky;top:84px;padding:22px;background:#0b1220;border:1px solid var(--line);border-radius:8px}.submit-panel h2{margin:0 0 8px}.submit-panel p{color:var(--muted);line-height:1.5}.attempts{display:grid;gap:8px;margin-top:18px}.attempts h3{margin:0}.attempt{display:flex;justify-content:space-between;gap:12px;padding:10px 12px;border:1px solid rgba(251,113,133,.32);border-radius:6px;color:#fecdd3;background:rgba(251,113,133,.06);font-size:13px}.attempt.ok{border-color:rgba(20,184,166,.36);color:#99f6e4;background:rgba(20,184,166,.06)}.attempt span{color:var(--muted)}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:22px 0}.stat{padding:18px}.stat strong{display:block;font-size:30px}.stat span,.leader-row span{color:var(--muted)}.leader-list{display:grid;gap:10px}.leader-row{display:grid;grid-template-columns:64px 1fr 140px;gap:16px;align-items:center;padding:14px 18px}.table{width:100%;border-collapse:collapse;margin-top:16px;background:var(--surface);border:1px solid var(--line);border-radius:8px;overflow:hidden}.table th,.table td{padding:12px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.table th{color:#cbd5e1;font-size:13px}.table td{color:var(--muted);font-size:14px}@media(max-width:860px){.app-header{align-items:flex-start;flex-direction:column;gap:10px;padding:16px}.nav{width:100%;overflow-x:auto}.hero,.grid,.course-layout,.stats,.admin-grid,.challenge-workspace{grid-template-columns:1fr}.hero{min-height:auto}.hero h1{font-size:36px}.visual{min-height:220px}.leader-row{grid-template-columns:42px 1fr}.workspace-top{display:grid}.submit-panel{position:static}}`;
}

const baseCss = css;
css = function enhancedCss() {
  return `${baseCss()}
body{background:linear-gradient(180deg,#060914 0%,#08101b 46%,#0a111d 100%);letter-spacing:0}
.app-header{box-shadow:0 12px 40px rgba(0,0,0,.28)}
.brand{letter-spacing:.2px}
.hero{width:min(1180px,calc(100% - 32px));grid-template-columns:minmax(0,.9fr) minmax(440px,1.1fr);gap:30px;min-height:660px}
.hero h1{font-size:clamp(40px,5vw,72px);max-width:860px}
.hero p{max-width:720px;color:#b6c6d9}
.visual{position:relative;min-height:500px;border-color:rgba(94,234,212,.32);background:linear-gradient(90deg,rgba(6,9,20,.18),rgba(6,9,20,.36)),url('/cyberedukz-hero.png') center/cover;border-radius:8px;box-shadow:0 30px 90px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.03) inset}
.visual:after{content:"";position:absolute;inset:auto 18px 18px 18px;height:76px;border:1px solid rgba(94,234,212,.22);border-radius:8px;background:linear-gradient(90deg,rgba(8,16,27,.82),rgba(8,16,27,.42));backdrop-filter:blur(12px)}
.card,.challenge,.leader-row,.stat,.panel,.submit-panel,.workspace-top{box-shadow:0 18px 50px rgba(0,0,0,.18)}
.card:hover,.challenge:hover{transform:translateY(-2px);transition:transform .18s ease,border-color .18s ease}
.primary{box-shadow:0 12px 30px rgba(20,184,166,.18)}
.section-heading{max-width:760px;margin-bottom:22px}
@media(max-width:980px){.hero{grid-template-columns:1fr;min-height:auto}.visual{min-height:340px;order:-1}.hero h1{font-size:40px}}
@media(max-width:560px){.hero{width:min(100% - 24px,1180px);padding-top:24px}.visual{min-height:260px}.visual:after{display:none}.hero h1{font-size:34px}.actions .button-link{width:100%}.stats{grid-template-columns:1fr}}`;
};

function home(req, res) {
  const user = getCurrentUser(req);
  const db = readDb();
  send(
    res,
    layout({
      title: "Главная",
      user,
      body: `<section class="page hero">
  <div>
    <div class="badges"><span class="badge accent">MVP Sprint</span><span class="badge">Kazakhstan/CIS</span><span class="badge">RU Interface</span></div>
    <h1>Практическое обучение кибербезопасности для Казахстана и СНГ</h1>
    <p>Курсы, задания с флагами, прогресс и рейтинг в одной учебной платформе для начинающих SOC-аналитиков, pentester'ов и студентов.</p>
    <div class="actions">
      <a class="button-link primary" href="${user ? "/courses" : "/register"}">Начать обучение</a>
      <a class="button-link" href="/courses">Смотреть курсы</a>
    </div>
    <div class="stats">
      <div class="stat"><strong>${db.courses.length}</strong><span>курса</span></div>
      <div class="stat"><strong>${db.lessons.length}</strong><span>уроков</span></div>
      <div class="stat"><strong>${db.challenges.length}</strong><span>заданий</span></div>
    </div>
  </div>
  <div class="visual" aria-label="CyberEdu KZ visual"></div>
</section>`,
    })
  );
}

function authPage(req, res, mode, error = "") {
  const isRegister = mode === "register";
  const user = getCurrentUser(req);
  send(
    res,
    layout({
      title: isRegister ? "Регистрация" : "Вход",
      user,
      body: `<section class="page"><div class="panel">
  <h1>${isRegister ? "Регистрация" : "Вход"}</h1>
  <p>${isRegister ? "Создайте аккаунт студента, чтобы проходить курсы и сохранять прогресс." : "Войдите, чтобы продолжить обучение."}</p>
  ${error ? `<div class="notice">${escapeHtml(error)}</div>` : ""}
  <form class="form" method="post" action="/${mode}">
    ${
      isRegister
        ? `<div class="field"><label for="name">Имя</label><input id="name" name="name" minlength="2" required></div>`
        : ""
    }
    <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" required></div>
    <div class="field"><label for="password">Пароль</label><input id="password" name="password" type="password" minlength="8" required></div>
    <button class="button primary" type="submit">${isRegister ? "Создать аккаунт" : "Войти"}</button>
  </form>
  <div class="helper">${isRegister ? `Уже есть аккаунт? <a href="/login">Войти</a>` : `Нет аккаунта? <a href="/register">Зарегистрироваться</a>`}</div>
</div></section>`,
    })
  );
}

async function register(req, res) {
  const form = await readBody(req);
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  if (name.length < 2 || !email.includes("@") || password.length < 8) {
    return authPage(req, res, "register", "Проверьте имя, email и пароль от 8 символов.");
  }

  const db = readDb();
  if (db.users.some((user) => user.email === email)) {
    return authPage(req, res, "register", "Пользователь с таким email уже существует.");
  }

  const user = {
    id: crypto.randomUUID(),
    email,
    name,
    passwordHash: hashPassword(password),
    role: "STUDENT",
    points: 0,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDb(db);
  createSession(res, user.id);
  redirect(res, "/profile");
}

async function login(req, res) {
  const form = await readBody(req);
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const db = readDb();
  const user = db.users.find((item) => item.email === email);
  if (!user || user.passwordHash !== hashPassword(password)) {
    return authPage(req, res, "login", "Неверный email или пароль.");
  }
  createSession(res, user.id);
  redirect(res, "/profile");
}

function profile(req, res) {
  const user = getCurrentUser(req);
  if (!user) return redirect(res, "/login");
  const db = readDb();
  const solved = db.submissions.filter((s) => s.userId === user.id && s.isCorrect);
  const uniqueSolved = new Set(solved.map((s) => s.challengeId));
  const overall = totalProgress(db, user);
  const recentSolved = [...solved]
    .slice(-4)
    .reverse()
    .map((submission) => {
      const challenge = db.challenges.find((item) => item.id === submission.challengeId);
      const course = challenge ? db.courses.find((item) => item.slug === challenge.courseSlug) : null;
      return `<div class="leader-row"><strong>OK</strong><div><strong>${escapeHtml(challenge?.title || "Задание")}</strong><br><span>${escapeHtml(course?.title || "Курс")}</span></div><span>${new Date(submission.createdAt).toLocaleDateString("ru-RU")}</span></div>`;
    })
    .join("");
  const progressRows = db.courses
    .map((course) => {
      const progress = courseProgress(db, user, course.slug);
      return `<div class="challenge">
        <div class="badges"><span class="badge accent">${escapeHtml(course.track)}</span><span class="badge">${progress.done}/${progress.total} заданий</span></div>
        <h3>${escapeHtml(course.title)}</h3>
        <div class="progress"><span style="width:${progress.percent}%"></span></div>
        <p>${progress.percent}% завершено</p>
      </div>`;
    })
    .join("");
  send(
    res,
    layout({
      title: "Профиль",
      user,
      body: `<section class="page">
  <div class="section-heading">
    <h1>Профиль</h1>
    <p>Ваш прогресс по CyberEdu KZ MVP.</p>
  </div>
  <div class="stats">
    <div class="stat"><strong>${escapeHtml(user.name)}</strong><span>${escapeHtml(user.email)}</span></div>
    <div class="stat"><strong>${user.points}</strong><span>очков</span></div>
    <div class="stat"><strong>${overall.percent}%</strong><span>${uniqueSolved.size}/${overall.total} заданий решено</span></div>
  </div>
  <div class="progress"><span style="width:${overall.percent}%"></span></div>
  <div class="section-heading"><h1>Прогресс по курсам</h1><p>Процент считается по решенным практическим заданиям.</p></div>
  <div class="challenge-list">${progressRows}</div>
  <div class="section-heading"><h1>Последние решения</h1><p>Краткая история успешных флагов для демонстрации результата обучения.</p></div>
  <div class="leader-list">${recentSolved || `<div class="challenge"><p class="muted">Пока нет решенных заданий. Начните с курса Linux & Networks Basics.</p></div>`}</div>
  <a class="button-link primary" href="/courses">Продолжить обучение</a>
</section>`,
    })
  );
}

function courses(req, res) {
  const user = getCurrentUser(req);
  const db = readDb();
  const cards = db.courses
    .map((course) => {
      const progress = courseProgress(db, user, course.slug);
      const lessonCount = db.lessons.filter((lesson) => lesson.courseSlug === course.slug).length;
      return `<article class="card">
  <div class="badges"><span class="badge accent">${escapeHtml(course.track)}</span><span class="badge">${escapeHtml(difficultyLabel(course.difficulty))}</span></div>
  <h3>${escapeHtml(course.title)}</h3>
  <p>${escapeHtml(course.description)}</p>
  <div class="progress"><span style="width:${progress.percent}%"></span></div>
  <div class="badges"><span class="badge">${lessonCount} урока</span><span class="badge">${progress.done}/${progress.total} заданий</span><span class="badge">${progress.percent}% завершено</span></div>
  <a class="button-link primary" href="/courses/${course.slug}">${progress.percent > 0 ? "Продолжить" : "Начать курс"}</a>
</article>`;
    })
    .join("");
  send(
    res,
    layout({
      title: "Курсы",
      user,
      body: `<section class="page">
  <div class="section-heading"><h1>Курсы</h1><p>Стартовый каталог MVP: теория, задания, флаги и прогресс.</p></div>
  <div class="grid">${cards}</div>
</section>`,
    })
  );
}

function coursePage(req, res, slug) {
  const user = getCurrentUser(req);
  const db = readDb();
  const course = db.courses.find((item) => item.slug === slug);
  if (!course) return send(res, "Курс не найден", 404);
  const progress = courseProgress(db, user, course.slug);
  const solved = solvedChallengeIds(db, user);
  const lessons = db.lessons
    .filter((lesson) => lesson.courseSlug === course.slug)
    .sort((a, b) => a.order - b.order)
    .map((lesson) => {
      const challenges = db.challenges.filter((challenge) => challenge.lessonId === lesson.id);
      const solvedCount = challenges.filter((challenge) => solved.has(challenge.id)).length;
      return `<div class="challenge">
        <div class="badges"><span class="badge accent">Урок ${lesson.order}</span><span class="badge">${solvedCount}/${challenges.length} заданий</span></div>
        <h3>${escapeHtml(lesson.title)}</h3>
        <p>${escapeHtml(lesson.summary)}</p>
        <a class="button-link primary" href="/lesson/${lesson.id}">Открыть урок</a>
      </div>`;
    })
    .join("");
  send(
    res,
    layout({
      title: course.title,
      user,
      body: `<section class="page course-layout">
  <div>
    <div class="section-heading"><h1>${escapeHtml(course.title)}</h1><p>${escapeHtml(course.description)}</p></div>
    <div class="progress"><span style="width:${progress.percent}%"></span></div>
    <p class="section-copy">${progress.done}/${progress.total} заданий решено, ${progress.percent}% курса завершено.</p>
    <div class="challenge-list">${lessons}</div>
  </div>
  <aside class="panel">
    <h1>Цель курса</h1>
    <p>Пройти задания, отправить флаги и закрепить базовый навык в безопасной учебной среде.</p>
  </aside>
</section>`,
    })
  );
}

function lessonPage(req, res, id) {
  const user = getCurrentUser(req);
  const db = readDb();
  const lesson = db.lessons.find((item) => item.id === id);
  if (!lesson) return send(res, "Урок не найден", 404);
  const course = db.courses.find((item) => item.slug === lesson.courseSlug);
  const solved = solvedChallengeIds(db, user);
  const challenges = db.challenges
    .filter((challenge) => challenge.lessonId === lesson.id)
    .map((challenge) => `<div class="challenge">
      <div class="badges"><span class="badge">${escapeHtml(challenge.difficulty)}</span><span class="badge accent">${challenge.points} points</span>${solved.has(challenge.id) ? `<span class="badge accent">Решено</span>` : ""}</div>
      <h3>${escapeHtml(challenge.title)}</h3>
      <p>${escapeHtml(challenge.description)}</p>
      <a class="button-link primary" href="/challenge/${challenge.id}">Перейти к заданию</a>
    </div>`)
    .join("");
  send(
    res,
    layout({
      title: lesson.title,
      user,
      body: `<section class="page course-layout">
  <div>
    <div class="section-heading"><h1>${escapeHtml(lesson.title)}</h1><p>${escapeHtml(lesson.summary)}</p></div>
    <div class="challenge"><p>${escapeHtml(lesson.theory)}</p></div>
    <div class="section-heading"><h1>Практика</h1><p>Решите задания урока и отправьте флаги.</p></div>
    <div class="challenge-list">${challenges}</div>
  </div>
  <aside class="panel">
    <h1>${escapeHtml(course.title)}</h1>
    <p>${escapeHtml(course.description)}</p>
    <div class="helper"><a href="/courses/${course.slug}">Вернуться к курсу</a></div>
  </aside>
</section>`,
    })
  );
}

function challengePage(req, res, id, message = "") {
  const user = getCurrentUser(req);
  if (!user) return redirect(res, "/login");
  const db = readDb();
  const challenge = db.challenges.find((item) => item.id === id);
  if (!challenge) return send(res, "Задание не найдено", 404);
  const course = db.courses.find((item) => item.slug === challenge.courseSlug);
  const lesson = db.lessons.find((item) => item.id === challenge.lessonId);
  const attempts = db.submissions
    .filter((submission) => submission.userId === user.id && submission.challengeId === challenge.id)
    .slice(-5)
    .reverse();
  const solved = attempts.some((submission) => submission.isCorrect);
  const attemptRows = attempts.length
    ? attempts
        .map(
          (submission) =>
            `<div class="attempt ${submission.isCorrect ? "ok" : ""}"><strong>${submission.isCorrect ? "Верно" : "Неверно"}</strong><span>${new Date(submission.createdAt).toLocaleString("ru-RU")}</span></div>`
        )
        .join("")
    : `<p class="muted">Попыток пока нет. Отправьте первый флаг.</p>`;
  send(
    res,
    layout({
      title: challenge.title,
      user,
      body: `<section class="page challenge-workspace">
  <div class="challenge-main">
    <div class="workspace-top">
      <div>
        <div class="badges"><span class="badge accent">${escapeHtml(course.title)}</span><span class="badge">Урок: ${escapeHtml(lesson.title)}</span><span class="badge">${challenge.points} points</span>${solved ? `<span class="badge accent">Решено</span>` : ""}</div>
        <h1>${escapeHtml(challenge.title)}</h1>
      </div>
      <a class="button-link" href="/lesson/${lesson.id}">Назад к уроку</a>
    </div>
    <div class="challenge">
      <h3>Сценарий</h3>
      <p>${escapeHtml(challenge.description)}</p>
    </div>
    <div class="challenge">
      <h3>Подсказка</h3>
      <p>${escapeHtml(challenge.hint)}</p>
    </div>
  </div>
  <aside class="submit-panel">
    <h2>Отправка флага</h2>
    <p>Проверка выполняется на сервере. Ответ хранится как hash, не в клиентском коде.</p>
    ${solved ? `<div class="notice ok">Задание уже решено. Повторная отправка не начислит очки второй раз.</div>` : ""}
    ${message ? `<div class="notice">${escapeHtml(message)}</div>` : ""}
    <form class="form" method="post" action="/challenge/${challenge.id}/submit">
      <div class="field"><label for="flag">Флаг</label><input id="flag" name="flag" placeholder="CYB{example_flag}" required autocomplete="off"></div>
      <button class="button primary" type="submit">Отправить флаг</button>
    </form>
    <div class="attempts">
      <h3>Последние попытки</h3>
      ${attemptRows}
    </div>
  </aside>
</section>`,
    })
  );
}

async function submitFlag(req, res, id) {
  const user = getCurrentUser(req);
  if (!user) return redirect(res, "/login");
  const form = await readBody(req);
  const flag = String(form.get("flag") || "");
  const db = readDb();
  const challenge = db.challenges.find((item) => item.id === id);
  if (!challenge) return send(res, "Задание не найдено", 404);

  const isCorrect = hashFlag(flag) === challenge.flagHash;
  const alreadySolved = db.submissions.some((s) => s.userId === user.id && s.challengeId === id && s.isCorrect);
  db.submissions.push({
    id: crypto.randomUUID(),
    userId: user.id,
    challengeId: id,
    submittedHash: hashFlag(flag),
    isCorrect,
    createdAt: new Date().toISOString(),
  });
  if (isCorrect && !alreadySolved) {
    const dbUser = db.users.find((item) => item.id === user.id);
    dbUser.points += challenge.points;
  }
  writeDb(db);
  if (isCorrect) return redirect(res, "/profile");
  return challengePage(req, res, id, "Флаг неверный. Проверь формат и попробуй ещё раз.");
}

function adminPage(req, res, message = "") {
  const user = getCurrentUser(req);
  if (!isAdmin(user)) return redirect(res, "/login");
  const db = readDb();
  const courseOptions = db.courses
    .map((course) => `<option value="${escapeHtml(course.slug)}">${escapeHtml(course.title)}</option>`)
    .join("");
  const lessonOptions = db.lessons
    .map((lesson) => {
      const course = db.courses.find((item) => item.slug === lesson.courseSlug);
      return `<option value="${escapeHtml(lesson.id)}">${escapeHtml(course?.title || lesson.courseSlug)} / ${escapeHtml(lesson.title)}</option>`;
    })
    .join("");
  const contentRows = db.courses
    .map((course) => {
      const lessons = db.lessons.filter((lesson) => lesson.courseSlug === course.slug);
      const challenges = db.challenges.filter((challenge) => challenge.courseSlug === course.slug);
      return `<tr><td>${escapeHtml(course.title)}</td><td>${lessons.length}</td><td>${challenges.length}</td><td>${escapeHtml(course.track)}</td><td><a href="/admin/course/${course.slug}/edit">Редактировать</a></td></tr>`;
    })
    .join("");
  const lessonRows = db.lessons
    .map((lesson) => {
      const course = db.courses.find((item) => item.slug === lesson.courseSlug);
      const challenges = db.challenges.filter((challenge) => challenge.lessonId === lesson.id);
      return `<tr><td>${escapeHtml(lesson.title)}</td><td>${escapeHtml(course?.title || lesson.courseSlug)}</td><td>${lesson.order}</td><td>${challenges.length}</td><td><a href="/admin/lesson/${lesson.id}/edit">Редактировать</a></td></tr>`;
    })
    .join("");
  const challengeRows = db.challenges
    .map((challenge) => {
      const lesson = db.lessons.find((item) => item.id === challenge.lessonId);
      return `<tr><td>${escapeHtml(challenge.title)}</td><td>${escapeHtml(lesson?.title || challenge.lessonId)}</td><td>${challenge.points}</td><td>${escapeHtml(difficultyLabel(challenge.difficulty))}</td><td><a href="/admin/challenge/${challenge.id}/edit">Редактировать</a></td></tr>`;
    })
    .join("");

  send(
    res,
    layout({
      title: "Админ",
      user,
      body: `<section class="page">
  <div class="section-heading"><h1>Админ-панель контента</h1><p>Минимальный CRUD для MVP: можно добавить курс, урок и практическое задание без изменения кода.</p></div>
  ${message ? `<div class="notice ok">${escapeHtml(message)}</div>` : ""}
  <div class="stats">
    <div class="stat"><strong>${db.courses.length}</strong><span>курса в каталоге</span></div>
    <div class="stat"><strong>${db.lessons.length}</strong><span>уроков опубликовано</span></div>
    <div class="stat"><strong>${db.challenges.length}</strong><span>заданий с флагами</span></div>
  </div>
  <div class="admin-grid">
    <div class="panel wide-panel">
      <h1>Новый курс</h1>
      <form class="form" method="post" action="/admin/course">
        <div class="field"><label>Название</label><input name="title" required placeholder="Web Security Advanced"></div>
        <div class="field"><label>Slug</label><input name="slug" placeholder="web-security-advanced"></div>
        <div class="field"><label>Направление</label><input name="track" required placeholder="Web"></div>
        <div class="field"><label>Сложность</label><select name="difficulty"><option>Beginner</option><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
        <div class="field"><label>Описание</label><textarea name="description" required></textarea></div>
        <button class="button primary" type="submit">Добавить курс</button>
      </form>
    </div>

    <div class="panel wide-panel">
      <h1>Новый урок</h1>
      <form class="form" method="post" action="/admin/lesson">
        <div class="field"><label>Курс</label><select name="courseSlug">${courseOptions}</select></div>
        <div class="field"><label>Название</label><input name="title" required></div>
        <div class="field"><label>Краткое описание</label><input name="summary" required></div>
        <div class="field"><label>Теория</label><textarea name="theory" required></textarea></div>
        <button class="button primary" type="submit">Добавить урок</button>
      </form>
    </div>

    <div class="panel wide-panel">
      <h1>Новое задание</h1>
      <form class="form" method="post" action="/admin/challenge">
        <div class="field"><label>Урок</label><select name="lessonId">${lessonOptions}</select></div>
        <div class="field"><label>Название</label><input name="title" required></div>
        <div class="field"><label>Описание</label><textarea name="description" required></textarea></div>
        <div class="field"><label>Подсказка</label><input name="hint" required></div>
        <div class="field"><label>Флаг</label><input name="flag" required placeholder="CYB{new_flag}"></div>
        <div class="field"><label>Очки</label><input name="points" type="number" value="100" min="10" max="1000"></div>
        <div class="field"><label>Сложность</label><select name="difficulty"><option>Beginner</option><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
        <button class="button primary" type="submit">Добавить задание</button>
      </form>
    </div>

    <div class="panel wide-panel">
      <h1>Сводка контента</h1>
      <table class="table"><thead><tr><th>Курс</th><th>Уроки</th><th>Задания</th><th>Трек</th><th></th></tr></thead><tbody>${contentRows}</tbody></table>
    </div>

    <div class="panel wide-panel">
      <h1>Уроки</h1>
      <table class="table"><thead><tr><th>Урок</th><th>Курс</th><th>Порядок</th><th>Задания</th><th></th></tr></thead><tbody>${lessonRows}</tbody></table>
    </div>

    <div class="panel wide-panel">
      <h1>Задания</h1>
      <table class="table"><thead><tr><th>Задание</th><th>Урок</th><th>Очки</th><th>Сложность</th><th></th></tr></thead><tbody>${challengeRows}</tbody></table>
    </div>
  </div>
</section>`,
    })
  );
}

async function createCourse(req, res) {
  const user = getCurrentUser(req);
  if (!isAdmin(user)) return redirect(res, "/login");
  const form = await readBody(req);
  const title = String(form.get("title") || "").trim();
  const slug = makeId(form.get("slug") || title);
  const track = String(form.get("track") || "").trim();
  const difficulty = String(form.get("difficulty") || "Beginner").trim();
  const description = String(form.get("description") || "").trim();
  const db = readDb();
  if (!title || !slug || !track || !description) return adminPage(req, res, "Заполните все поля курса.");
  if (db.courses.some((course) => course.slug === slug)) return adminPage(req, res, "Курс с таким slug уже существует.");
  db.courses.push({ slug, title, track, difficulty, description });
  writeDb(db);
  redirect(res, "/admin");
}

function editCoursePage(req, res, slug, message = "") {
  const user = getCurrentUser(req);
  if (!isAdmin(user)) return redirect(res, "/login");
  const db = readDb();
  const course = db.courses.find((item) => item.slug === slug);
  if (!course) return send(res, "Курс не найден", 404);
  send(
    res,
    layout({
      title: `Редактирование ${course.title}`,
      user,
      body: `<section class="page">
  <div class="panel wide-panel">
    <h1>Редактировать курс</h1>
    ${message ? `<div class="notice ok">${escapeHtml(message)}</div>` : ""}
    <form class="form" method="post" action="/admin/course/${course.slug}/edit">
      <div class="field"><label>Название</label><input name="title" value="${escapeHtml(course.title)}" required></div>
      <div class="field"><label>Направление</label><input name="track" value="${escapeHtml(course.track)}" required></div>
      <div class="field"><label>Сложность</label><select name="difficulty">
        ${["Beginner", "Easy", "Medium", "Hard"].map((item) => `<option ${item === course.difficulty ? "selected" : ""}>${item}</option>`).join("")}
      </select></div>
      <div class="field"><label>Описание</label><textarea name="description" required>${escapeHtml(course.description)}</textarea></div>
      <button class="button primary" type="submit">Сохранить</button>
      <a class="button-link" href="/admin">Назад в админку</a>
    </form>
  </div>
</section>`,
    })
  );
}

async function updateCourse(req, res, slug) {
  const user = getCurrentUser(req);
  if (!isAdmin(user)) return redirect(res, "/login");
  const form = await readBody(req);
  const db = readDb();
  const course = db.courses.find((item) => item.slug === slug);
  if (!course) return send(res, "Курс не найден", 404);
  course.title = String(form.get("title") || "").trim();
  course.track = String(form.get("track") || "").trim();
  course.difficulty = String(form.get("difficulty") || "Beginner").trim();
  course.description = String(form.get("description") || "").trim();
  if (!course.title || !course.track || !course.description) {
    return editCoursePage(req, res, slug, "Заполните все поля курса.");
  }
  writeDb(db);
  redirect(res, "/admin");
}

async function createLesson(req, res) {
  const user = getCurrentUser(req);
  if (!isAdmin(user)) return redirect(res, "/login");
  const form = await readBody(req);
  const courseSlug = String(form.get("courseSlug") || "").trim();
  const title = String(form.get("title") || "").trim();
  const summary = String(form.get("summary") || "").trim();
  const theory = String(form.get("theory") || "").trim();
  const db = readDb();
  const course = db.courses.find((item) => item.slug === courseSlug);
  if (!course || !title || !summary || !theory) return adminPage(req, res, "Заполните все поля урока.");
  const order = db.lessons.filter((lesson) => lesson.courseSlug === courseSlug).length + 1;
  let id = makeId(`${courseSlug}-${title}`);
  if (db.lessons.some((lesson) => lesson.id === id)) id = `${id}-${Date.now()}`;
  db.lessons.push({ id, courseSlug, order, title, summary, theory });
  writeDb(db);
  redirect(res, "/admin");
}

function editLessonPage(req, res, id, message = "") {
  const user = getCurrentUser(req);
  if (!isAdmin(user)) return redirect(res, "/login");
  const db = readDb();
  const lesson = db.lessons.find((item) => item.id === id);
  if (!lesson) return send(res, "Урок не найден", 404);
  const courseOptions = db.courses
    .map((course) => `<option value="${escapeHtml(course.slug)}" ${course.slug === lesson.courseSlug ? "selected" : ""}>${escapeHtml(course.title)}</option>`)
    .join("");
  send(
    res,
    layout({
      title: `Редактирование ${lesson.title}`,
      user,
      body: `<section class="page">
  <div class="panel wide-panel">
    <h1>Редактировать урок</h1>
    ${message ? `<div class="notice ok">${escapeHtml(message)}</div>` : ""}
    <form class="form" method="post" action="/admin/lesson/${lesson.id}/edit">
      <div class="field"><label>Курс</label><select name="courseSlug">${courseOptions}</select></div>
      <div class="field"><label>Порядок</label><input name="order" type="number" min="1" value="${lesson.order}" required></div>
      <div class="field"><label>Название</label><input name="title" value="${escapeHtml(lesson.title)}" required></div>
      <div class="field"><label>Краткое описание</label><input name="summary" value="${escapeHtml(lesson.summary)}" required></div>
      <div class="field"><label>Теория</label><textarea name="theory" required>${escapeHtml(lesson.theory)}</textarea></div>
      <button class="button primary" type="submit">Сохранить</button>
      <a class="button-link" href="/admin">Назад в админку</a>
    </form>
  </div>
</section>`,
    })
  );
}

async function updateLesson(req, res, id) {
  const user = getCurrentUser(req);
  if (!isAdmin(user)) return redirect(res, "/login");
  const form = await readBody(req);
  const db = readDb();
  const lesson = db.lessons.find((item) => item.id === id);
  if (!lesson) return send(res, "Урок не найден", 404);
  const courseSlug = String(form.get("courseSlug") || "").trim();
  const course = db.courses.find((item) => item.slug === courseSlug);
  lesson.courseSlug = course ? courseSlug : lesson.courseSlug;
  lesson.order = Math.max(1, Number(form.get("order") || lesson.order));
  lesson.title = String(form.get("title") || "").trim();
  lesson.summary = String(form.get("summary") || "").trim();
  lesson.theory = String(form.get("theory") || "").trim();
  if (!lesson.title || !lesson.summary || !lesson.theory) {
    return editLessonPage(req, res, id, "Заполните все поля урока.");
  }
  for (const challenge of db.challenges.filter((item) => item.lessonId === lesson.id)) {
    challenge.courseSlug = lesson.courseSlug;
  }
  writeDb(db);
  redirect(res, "/admin");
}

async function createChallenge(req, res) {
  const user = getCurrentUser(req);
  if (!isAdmin(user)) return redirect(res, "/login");
  const form = await readBody(req);
  const lessonId = String(form.get("lessonId") || "").trim();
  const title = String(form.get("title") || "").trim();
  const description = String(form.get("description") || "").trim();
  const hint = String(form.get("hint") || "").trim();
  const flag = String(form.get("flag") || "").trim();
  const points = Number(form.get("points") || 100);
  const difficulty = String(form.get("difficulty") || "Beginner").trim();
  const db = readDb();
  const lesson = db.lessons.find((item) => item.id === lessonId);
  if (!lesson || !title || !description || !hint || !flag) return adminPage(req, res, "Заполните все поля задания.");
  let id = makeId(`${lessonId}-${title}`);
  if (db.challenges.some((challenge) => challenge.id === id)) id = `${id}-${Date.now()}`;
  db.challenges.push({
    id,
    lessonId,
    courseSlug: lesson.courseSlug,
    title,
    points: Number.isFinite(points) ? points : 100,
    difficulty,
    description,
    hint,
    flagHash: hashFlag(flag),
  });
  writeDb(db);
  redirect(res, "/admin");
}

function editChallengePage(req, res, id, message = "") {
  const user = getCurrentUser(req);
  if (!isAdmin(user)) return redirect(res, "/login");
  const db = readDb();
  const challenge = db.challenges.find((item) => item.id === id);
  if (!challenge) return send(res, "Задание не найдено", 404);
  const lessonOptions = db.lessons
    .map((lesson) => {
      const course = db.courses.find((item) => item.slug === lesson.courseSlug);
      return `<option value="${escapeHtml(lesson.id)}" ${lesson.id === challenge.lessonId ? "selected" : ""}>${escapeHtml(course?.title || lesson.courseSlug)} / ${escapeHtml(lesson.title)}</option>`;
    })
    .join("");
  send(
    res,
    layout({
      title: `Редактирование ${challenge.title}`,
      user,
      body: `<section class="page">
  <div class="panel wide-panel">
    <h1>Редактировать задание</h1>
    ${message ? `<div class="notice ok">${escapeHtml(message)}</div>` : ""}
    <form class="form" method="post" action="/admin/challenge/${challenge.id}/edit">
      <div class="field"><label>Урок</label><select name="lessonId">${lessonOptions}</select></div>
      <div class="field"><label>Название</label><input name="title" value="${escapeHtml(challenge.title)}" required></div>
      <div class="field"><label>Описание</label><textarea name="description" required>${escapeHtml(challenge.description)}</textarea></div>
      <div class="field"><label>Подсказка</label><input name="hint" value="${escapeHtml(challenge.hint)}" required></div>
      <div class="field"><label>Новый флаг</label><input name="flag" placeholder="Оставьте пустым, чтобы не менять"></div>
      <div class="field"><label>Очки</label><input name="points" type="number" value="${challenge.points}" min="10" max="1000"></div>
      <div class="field"><label>Сложность</label><select name="difficulty">
        ${["Beginner", "Easy", "Medium", "Hard"].map((item) => `<option ${item === challenge.difficulty ? "selected" : ""}>${item}</option>`).join("")}
      </select></div>
      <button class="button primary" type="submit">Сохранить</button>
      <a class="button-link" href="/admin">Назад в админку</a>
    </form>
  </div>
</section>`,
    })
  );
}

async function updateChallenge(req, res, id) {
  const user = getCurrentUser(req);
  if (!isAdmin(user)) return redirect(res, "/login");
  const form = await readBody(req);
  const db = readDb();
  const challenge = db.challenges.find((item) => item.id === id);
  if (!challenge) return send(res, "Задание не найдено", 404);
  const lesson = db.lessons.find((item) => item.id === String(form.get("lessonId") || "").trim());
  if (lesson) {
    challenge.lessonId = lesson.id;
    challenge.courseSlug = lesson.courseSlug;
  }
  challenge.title = String(form.get("title") || "").trim();
  challenge.description = String(form.get("description") || "").trim();
  challenge.hint = String(form.get("hint") || "").trim();
  challenge.points = Number(form.get("points") || challenge.points);
  challenge.difficulty = String(form.get("difficulty") || "Beginner").trim();
  const newFlag = String(form.get("flag") || "").trim();
  if (newFlag) challenge.flagHash = hashFlag(newFlag);
  if (!challenge.title || !challenge.description || !challenge.hint) {
    return editChallengePage(req, res, id, "Заполните все поля задания.");
  }
  writeDb(db);
  redirect(res, "/admin");
}

function leaderboard(req, res) {
  const user = getCurrentUser(req);
  const db = readDb();
  const rows = [...db.users]
    .sort((a, b) => b.points - a.points)
    .map(
      (item, index) => `<div class="leader-row"><strong>#${index + 1}</strong><div><strong>${escapeHtml(item.name)}</strong><br><span>${escapeHtml(item.role)}</span></div><span>${item.points} points</span></div>`
    )
    .join("");
  send(
    res,
    layout({
      title: "Рейтинг",
      user,
      body: `<section class="page"><div class="section-heading"><h1>Рейтинг</h1><p>Очки начисляются за правильно решенные задания.</p></div><div class="leader-list">${rows}</div></section>`,
    })
  );
}

function roadmap(req, res) {
  const user = getCurrentUser(req);
  const items = [
    ["День 1", "ТЗ, Jira, структура проекта", "Done"],
    ["День 2", "Регистрация, вход, профиль", "Done"],
    ["День 3", "Курсы, уроки, задания", "Done"],
    ["День 4", "Флаги, очки, прогресс", "Done"],
    ["День 5", "Админка контента", "Done"],
    ["День 6-7", "Полировка UI и демо-сценарий", "In Progress"],
    ["День 8-10", "Расширение контента и тестирование", "Next"],
    ["День 11-14", "Защита, документация, финальные правки", "Next"],
  ];
  const rows = items
    .map(
      ([day, focus, status]) => `<div class="leader-row"><strong>${day}</strong><div><strong>${focus}</strong><br><span>MVP Sprint 1</span></div><span>${status}</span></div>`
    )
    .join("");
  send(
    res,
    layout({
      title: "План",
      user,
      body: `<section class="page">
  <div class="section-heading"><h1>План MVP</h1><p>Короткая дорожная карта проекта для защиты и контроля прогресса в Jira.</p></div>
  <div class="stats">
    <div class="stat"><strong>14</strong><span>дней на MVP</span></div>
    <div class="stat"><strong>6</strong><span>основных блоков готово</span></div>
    <div class="stat"><strong>1</strong><span>демо-сценарий</span></div>
  </div>
  <div class="leader-list">${rows}</div>
</section>`,
    })
  );
}

function labsPage(req, res) {
  const user = getCurrentUser(req);
  const catalogPath = path.join(__dirname, "labs", "catalog.json");
  const labs = fs.existsSync(catalogPath) ? JSON.parse(fs.readFileSync(catalogPath, "utf8")) : [];
  const cards = labs
    .map(
      (lab) => `<article class="card">
        <div class="badges"><span class="badge accent">${escapeHtml(lab.runtime)}</span><span class="badge">${escapeHtml(lab.status)}</span><span class="badge">network: ${escapeHtml(lab.isolation.network)}</span></div>
        <h3>${escapeHtml(lab.title)}</h3>
        <p>${escapeHtml(lab.goal)}</p>
        <div class="badges"><span class="badge">memory ${escapeHtml(lab.isolation.memory)}</span><span class="badge">cpu ${escapeHtml(lab.isolation.cpu)}</span><span class="badge">cap-drop ${escapeHtml(lab.isolation.capDrop.join(","))}</span></div>
      </article>`
    )
    .join("");
  send(
    res,
    layout({
      title: "Лабы",
      user,
      body: `<section class="page">
  <div class="section-heading"><h1>Изолированные лаборатории</h1><p>Проект готовит переход от простых flag-заданий к Docker/VM labs. На текущей машине Docker и WSL не установлены, поэтому labs пока находятся в статусе planned.</p></div>
  <div class="stats">
    <div class="stat"><strong>${labs.length}</strong><span>lab manifests</span></div>
    <div class="stat"><strong>Docker</strong><span>целевой runtime</span></div>
    <div class="stat"><strong>Safe</strong><span>без реальных целей</span></div>
  </div>
  <div class="notice ok">Следующий технический шаг: установить Docker Desktop + WSL2 и подключить launcher start/stop контейнеров.</div>
  <div class="grid">${cards}</div>
</section>`,
    })
  );
}

async function router(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "GET" && url.pathname === "/health") {
    const db = readDb();
    return sendJson(res, {
      ok: true,
      app: "CyberEdu KZ",
      courses: db.courses.length,
      lessons: db.lessons.length,
      challenges: db.challenges.length,
      users: db.users.length,
    });
  }
  if (url.pathname === "/style.css") {
    res.writeHead(200, { "Content-Type": "text/css; charset=utf-8" });
    return res.end(css());
  }
  if (url.pathname === "/cyber-grid.svg") {
    res.writeHead(200, { "Content-Type": "image/svg+xml; charset=utf-8" });
    return res.end(fs.readFileSync(path.join(__dirname, "public", "cyber-grid.svg")));
  }
  if (url.pathname === "/cyberedukz-hero.png") {
    res.writeHead(200, { "Content-Type": "image/png" });
    return res.end(fs.readFileSync(path.join(__dirname, "public", "cyberedukz-hero.png")));
  }
  if (req.method === "GET" && url.pathname === "/") return home(req, res);
  if (req.method === "GET" && url.pathname === "/register") return authPage(req, res, "register");
  if (req.method === "POST" && url.pathname === "/register") return register(req, res);
  if (req.method === "GET" && url.pathname === "/login") return authPage(req, res, "login");
  if (req.method === "POST" && url.pathname === "/login") return login(req, res);
  if (req.method === "POST" && url.pathname === "/logout") {
    clearSession(req, res);
    return redirect(res, "/");
  }
  if (req.method === "GET" && url.pathname === "/profile") return profile(req, res);
  if (req.method === "GET" && url.pathname === "/roadmap") return roadmap(req, res);
  if (req.method === "GET" && url.pathname === "/labs") return labsPage(req, res);
  if (req.method === "GET" && url.pathname === "/admin") return adminPage(req, res);
  if (req.method === "GET" && url.pathname.startsWith("/admin/course/") && url.pathname.endsWith("/edit")) {
    return editCoursePage(req, res, decodeURIComponent(url.pathname.split("/")[3]));
  }
  if (req.method === "POST" && url.pathname.startsWith("/admin/course/") && url.pathname.endsWith("/edit")) {
    return updateCourse(req, res, decodeURIComponent(url.pathname.split("/")[3]));
  }
  if (req.method === "GET" && url.pathname.startsWith("/admin/lesson/") && url.pathname.endsWith("/edit")) {
    return editLessonPage(req, res, decodeURIComponent(url.pathname.split("/")[3]));
  }
  if (req.method === "POST" && url.pathname.startsWith("/admin/lesson/") && url.pathname.endsWith("/edit")) {
    return updateLesson(req, res, decodeURIComponent(url.pathname.split("/")[3]));
  }
  if (req.method === "GET" && url.pathname.startsWith("/admin/challenge/") && url.pathname.endsWith("/edit")) {
    return editChallengePage(req, res, decodeURIComponent(url.pathname.split("/")[3]));
  }
  if (req.method === "POST" && url.pathname.startsWith("/admin/challenge/") && url.pathname.endsWith("/edit")) {
    return updateChallenge(req, res, decodeURIComponent(url.pathname.split("/")[3]));
  }
  if (req.method === "POST" && url.pathname === "/admin/course") return createCourse(req, res);
  if (req.method === "POST" && url.pathname === "/admin/lesson") return createLesson(req, res);
  if (req.method === "POST" && url.pathname === "/admin/challenge") return createChallenge(req, res);
  if (req.method === "GET" && url.pathname === "/courses") return courses(req, res);
  if (req.method === "GET" && url.pathname.startsWith("/courses/")) {
    return coursePage(req, res, decodeURIComponent(url.pathname.split("/")[2]));
  }
  if (req.method === "GET" && url.pathname.startsWith("/lesson/")) {
    return lessonPage(req, res, decodeURIComponent(url.pathname.split("/")[2]));
  }
  if (req.method === "GET" && url.pathname.startsWith("/challenge/")) {
    return challengePage(req, res, decodeURIComponent(url.pathname.split("/")[2]));
  }
  if (req.method === "POST" && url.pathname.startsWith("/challenge/") && url.pathname.endsWith("/submit")) {
    return submitFlag(req, res, decodeURIComponent(url.pathname.split("/")[2]));
  }
  if (req.method === "GET" && url.pathname === "/leaderboard") return leaderboard(req, res);
  send(res, layout({ title: "404", user: getCurrentUser(req), body: `<section class="page"><h1>Страница не найдена</h1></section>` }), 404);
}

ensureDb();
http.createServer((req, res) => {
  router(req, res).catch((error) => {
    console.error(error);
    send(res, "Internal Server Error", 500);
  });
}).listen(PORT, () => {
  console.log(`CyberEdu KZ is running at http://localhost:${PORT}`);
});
