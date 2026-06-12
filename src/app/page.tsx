export default function HomePage() {
  return (
    <section className="page">
      <div className="hero">
        <h1>Практическое обучение кибербезопасности для Казахстана и СНГ</h1>
        <p>
          CyberEdu KZ объединяет курсы, задания с флагами, прогресс и рейтинг,
          чтобы новичок мог пройти путь от базовых сетей до web security и blue
          team практики.
        </p>
        <p>
          Первый MVP строится вокруг одного сценария: зарегистрироваться, открыть
          курс, пройти урок, отправить флаг и увидеть прогресс.
        </p>
        <div className="actions">
          <a className="button-link primary" href="/register">
            Начать обучение
          </a>
          <a className="button-link" href="/courses">
            Смотреть курсы
          </a>
        </div>
      </div>
    </section>
  );
}
