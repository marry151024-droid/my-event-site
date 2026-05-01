export default function EventPage() {
  const weeklyRewards = [
    { rank: "1위", reward: "4억" },
    { rank: "2위", reward: "3억" },
    { rank: "3위", reward: "1.2억" },
    { rank: "4위", reward: "1억" },
    { rank: "5위", reward: "0.8억" },
  ];

  const weeklyEvents = [
    {
      week: "5월 첫째주",
      title: "릴레이 달리기",
      manager: "koopa",
      desc: "1레벨 캐릭터 생성 후 지정 마을 이동, 아이템 구매 및 전달",
    },
    {
      week: "5월 둘째주",
      title: "독도 OX 퀴즈",
      manager: "비",
      desc: "독도에서 진행되는 OX 퀴즈 이벤트",
    },
    {
      week: "5월 셋째주",
      title: "초성퀴즈",
      manager: "허숙희",
      desc: "상단원 참여형 초성퀴즈 이벤트",
    },
    {
      week: "5월 넷째주",
      title: "팀별 특정 아이템 먹기",
      manager: "놀명",
      desc: "팀을 나눠 지정 아이템을 획득하는 이벤트",
    },
  ];

  return (
    <main className="event-page">
      <header className="event-top">
        <a href="/" className="event-brand">
          <img src="/logo.png" alt="운명상단 로고" />
          <div>
            <h1>거상 운명상단</h1>
            <p>命 運 商 團</p>
          </div>
        </a>

        <nav className="event-menu">
          <a href="/">기여도 랭킹</a>
          <a href="/notice">공지사항</a>
          <a className="active" href="/event">이벤트</a>
          <a href="/manager">관리자</a>
          <a href="/ocr">OCR</a>
        </nav>
      </header>

      <section className="event-hero">
        <span>2026년 5월</span>
        <h2>운명상단 5월 이벤트</h2>
        <p>기여도 보상부터 주간 참여 이벤트까지, 상단원 모두가 함께하는 5월 이벤트</p>
      </section>

      <section className="event-grid">
        <article className="event-main-card">
          <h3>🏆 주간 상단 기여도 이벤트</h3>
          <p className="event-desc">
            매주 일요일 22시 기여도 집계 후 순위에 따라 보상이 지급됩니다.
          </p>

          <div className="reward-list">
            {weeklyRewards.map((r) => (
              <div className="reward-row" key={r.rank}>
                <strong>{r.rank}</strong>
                <span>{r.reward}</span>
              </div>
            ))}
          </div>

          <div className="total-reward">총상금 10억</div>
        </article>

        <article className="event-side-card">
          <h3>⚔️ 경험치 이벤트</h3>
          <p>
            5월 5일 00시부터 상단연회 진행
            <br />
            선조석 / 환수 / 신수 등 경험치 사냥 집중
          </p>
          <em>상재사냥 / 반자사는 하루 휴식 부탁드립니다.</em>
        </article>

        <article className="event-side-card">
          <h3>🎲 주사위 이벤트</h3>
          <p>
            진행 시간은 랜덤!
            <br />
            상단톡방에 숫자 공지 후 당첨자 1억 지급
          </p>
          <em>해당 숫자 당첨자 없을 시 가장 근접한 분 지급</em>
        </article>
      </section>

      <section className="weekly-section">
        <div className="weekly-head">
          <h3>🎮 매주 일요일 오후 8시 이벤트</h3>
          <p>※ 디스코드 필수 참여 / 총상금 10억</p>
        </div>

        <div className="weekly-cards">
          {weeklyEvents.map((e) => (
            <article className="weekly-card" key={e.week}>
              <span>{e.week}</span>
              <h4>{e.title}</h4>
              <p>{e.desc}</p>
              <em>담당 : {e.manager}</em>
            </article>
          ))}
        </div>
      </section>

      <section className="event-rule">
        <h3>⚠️ 이벤트 공통 규칙</h3>
        <ul>
          <li>디스코드 및 오픈채팅 참여 필수</li>
          <li>비정상 플레이 또는 어뷰징 적발 시 보상 제외</li>
          <li>이벤트 진행 및 보상 지급은 운영진 판단을 최종 기준으로 합니다</li>
        </ul>
      </section>
    </main>
  );
}