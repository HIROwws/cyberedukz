const leaders = [
  { rank: 1, name: "Ayan", track: "Web Security", points: 1240 },
  { rank: 2, name: "Dana", track: "Blue Team", points: 980 },
  { rank: 3, name: "Nazar", track: "Linux & Networks", points: 760 },
  { rank: 4, name: "Miras", track: "SOC", points: 640 },
];

export default function LeaderboardPage() {
  return (
    <section className="page">
      <div className="section-heading">
        <div>
          <h1>Рейтинг</h1>
          <p>
            Рейтинг мотивирует проходить задания, но не заменяет обучение:
            очки начисляются только за правильно решённые практические задачи.
          </p>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <strong>3</strong>
          <span>направления</span>
        </div>
        <div className="stat-card">
          <strong>15</strong>
          <span>заданий MVP</span>
        </div>
        <div className="stat-card">
          <strong>100</strong>
          <span>очков за базовый флаг</span>
        </div>
        <div className="stat-card">
          <strong>RU</strong>
          <span>язык интерфейса</span>
        </div>
      </div>

      <div className="leader-list">
        {leaders.map((user) => (
          <div className="leader-row" key={user.rank}>
            <strong>#{user.rank}</strong>
            <div>
              <strong>{user.name}</strong>
              <br />
              <span>{user.track}</span>
            </div>
            <span>{user.points}</span>
            <span>points</span>
          </div>
        ))}
      </div>
    </section>
  );
}

