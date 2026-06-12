const courses = [
  {
    title: "Linux & Networks Basics",
    track: "Основы",
    difficulty: "Beginner",
    progress: 35,
    description:
      "Команды Linux, файловая система, TCP/IP, DNS и первые задания с флагами.",
  },
  {
    title: "Web Security Starter",
    track: "Web",
    difficulty: "Easy",
    progress: 12,
    description:
      "SQL Injection, XSS, авторизация и безопасные мини-лабораторные задания.",
  },
  {
    title: "Blue Team Fundamentals",
    track: "SOC",
    difficulty: "Beginner",
    progress: 0,
    description:
      "Логи, инциденты, подозрительные события и базовое мышление SOC-аналитика.",
  },
];

export default function CoursesPage() {
  return (
    <section className="page">
      <div className="section-heading">
        <div>
          <h1>Курсы</h1>
          <p>
            Стартовый каталог MVP. Каждый курс ведёт пользователя от короткой
            теории к практическому заданию и проверке флага.
          </p>
        </div>
      </div>

      <div className="grid">
        {courses.map((course) => (
          <article className="course-card" key={course.title}>
            <div className="badge-row">
              <span className="badge accent">{course.track}</span>
              <span className="badge">{course.difficulty}</span>
            </div>
            <div className="stack">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
            <div className="stack">
              <div className="progress" aria-label={`Прогресс ${course.progress}%`}>
                <span style={{ width: `${course.progress}%` }} />
              </div>
              <span className="badge">{course.progress}% завершено</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

