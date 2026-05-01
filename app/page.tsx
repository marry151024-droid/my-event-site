"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type RankPlayer = {
  rank: number;
  name: string;
  score: number;
};

export default function HomePage() {
  const [ranks, setRanks] = useState<RankPlayer[]>([
    { rank: 1, name: "닉네임1", score: 999999 },
    { rank: 2, name: "닉네임2", score: 888888 },
    { rank: 3, name: "닉네임3", score: 777777 },
    { rank: 4, name: "닉네임4", score: 666666 },
    { rank: 5, name: "닉네임5", score: 555555 },
  ]);

  useEffect(() => {
    const loadRanking = async () => {
      const settingSnap = await getDoc(doc(db, "settings", "ranking"));
      const activeWeekId = settingSnap.exists()
        ? settingSnap.data().activeWeekId
        : "2026-05-week1";

      const rankingSnap = await getDoc(doc(db, "ranking", activeWeekId));

      if (rankingSnap.exists()) {
        const data = rankingSnap.data();
        if (Array.isArray(data.players)) {
          setRanks(data.players.slice(0, 5));
        }
      }
    };

    loadRanking();
  }, []);

  const getMedal = (rank: number) => `/medal-${rank}.png`;

  return (
    <main className="home">
      <header className="top-nav">
        <a href="/" className="brand">
          <img src="/logo.png" alt="거상 운명상단 로고" />
          <div>
            <h1>거상 운명상단</h1>
            <p>命 運 商 團</p>
          </div>
        </a>

        <nav className="menu">
          <a className="active" href="/">기여도 랭킹</a>
          <a href="/notice">공지사항</a>
          <a href="/event">이벤트</a>
          <a href="/manager">관리자</a>
          <a href="/ocr">OCR</a>
        </nav>

        <div className="socials">
          <a
            href="https://discord.gg/6nFStakm"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <img src="/discord.png" alt="디스코드" />
            <span>디스코드</span>
          </a>

          <a
            href="https://open.kakao.com/o/p5yHmnai"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
          >
            <img src="/kakao.png" alt="오픈채팅" />
            <span>오픈채팅</span>
          </a>
        </div>
      </header>

      <section className="hero">
        <img src="/crown.png" className="hero-crown-img" alt="왕관" />

        <h2>
          거상 운명상단 <span>기여도 랭킹</span>
        </h2>

        <p>운명상단의 전설은, 당신의 기여로 완성됩니다.</p>
      </section>

      <section className="ranking-wrap">
        <div className="ranking-title">
          <span></span>
          <h3>TOP 5 기여도 랭킹</h3>
          <span></span>
        </div>

        <div className="rank-cards">
          {ranks.map((r) => (
            <article
              key={r.rank}
              className={`rank-card ${
                r.rank === 1
                  ? "gold"
                  : r.rank === 2
                  ? "silver"
                  : r.rank === 3
                  ? "bronze"
                  : "purple"
              }`}
            >
              <img src={getMedal(r.rank)} className="medal-img" alt={`${r.rank}위`} />

              <div className="avatar-ring">
                <img src="/avatar.png" className="avatar-img" alt="캐릭터" />
              </div>

              <h4>{r.name}</h4>
              <strong>{r.score.toLocaleString()}</strong>
              <p>기여도</p>
            </article>
          ))}
        </div>

        <div className="rank-note">매주 일요일 22시 집계 후 보상 지급</div>
      </section>

      <section className="info-row">
        <article className="notice-card">
          <div className="section-head">
            <h3>📣 공지사항</h3>
            <a href="/notice">더보기 →</a>
          </div>

          <div className="notice-line">
            <span>NEW</span>
            <b>나타 파티 진행 안내</b>
            <em>2026.05.16</em>
          </div>

          <div className="notice-line">
            <span>NEW</span>
            <b>상단창고 이용수칙</b>
            <em>2026.05.15</em>
          </div>

          <div className="notice-line">
            <span>NEW</span>
            <b>상단 연구 지원 참여 안내</b>
            <em>2026.05.14</em>
          </div>
        </article>

        <article className="event-card">
          <div>
            <h3>5월 상단 이벤트 진행중!</h3>
            <p>
              주간 기여도 보상과 참여 이벤트까지
              <br />
              운명상단 5월 이벤트에 참여하세요!
            </p>
            <a href="/event">이벤트 자세히 보기 →</a>
          </div>

          <img src="/treasure.png" className="treasure-img" alt="이벤트 보상" />
        </article>
      </section>

      <footer>© 2026 거상 운명상단. ALL RIGHTS RESERVED.</footer>
    </main>
  );
}