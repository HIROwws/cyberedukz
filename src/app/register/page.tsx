import { registerUser } from "@/features/auth/actions";

export default function RegisterPage() {
  return (
    <section className="page">
      <div className="panel">
        <h1>Регистрация</h1>
        <p>Создайте аккаунт студента, чтобы проходить курсы и сохранять прогресс.</p>

        <form className="form" action={registerUser}>
          <div className="field">
            <label htmlFor="name">Имя</label>
            <input id="name" name="name" type="text" minLength={2} required />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>

          <div className="field">
            <label htmlFor="password">Пароль</label>
            <input id="password" name="password" type="password" minLength={8} required />
          </div>

          <button className="button" type="submit">
            Создать аккаунт
          </button>
        </form>

        <div className="helper">
          Уже есть аккаунт? <a href="/login">Войти</a>
        </div>
      </div>
    </section>
  );
}

