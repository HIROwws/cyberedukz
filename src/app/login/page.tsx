export default function LoginPage() {
  return (
    <section className="page">
      <div className="panel">
        <h1>Вход</h1>
        <p>Войдите, чтобы продолжить обучение и видеть свой прогресс.</p>

        <form className="form">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>

          <div className="field">
            <label htmlFor="password">Пароль</label>
            <input id="password" name="password" type="password" required />
          </div>

          <button className="button" type="submit">
            Войти
          </button>
        </form>

        <div className="helper">
          Нет аккаунта? <a href="/register">Зарегистрироваться</a>
        </div>
      </div>
    </section>
  );
}

