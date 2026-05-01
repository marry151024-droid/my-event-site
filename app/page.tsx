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
      <header className="mobile-top-nav">
        <a href="/" className="mobile-brand">
          <img src="/logo.png" alt="거상 운명상단 로고" />
          <div>
            <h1>거상 운명상단</h1>
            <p>命 運 商 團</p>
          </div>
        </a>

        <nav className="mobile-menu">
          <a className="active" href="/">랭킹</a>
          <a href="/notice">공지</a>
          <a href="/event">이벤트</a>
          <a href="/manager">관리자</a>
          <a href="/ocr">OCR</a>
        </nav>

        <div className="mobile-socials">
          <a href="https://discord.gg/6nFStakm" target="_blank">
            <img src="/discord.png" alt="디스코드" />
            디스코드
          </a>

          <a href="https://open.kakao.com/o/p5yHmnai" target="_blank">
            <img src="/kakao.png" alt="오픈채팅" />
            오픈채팅
          </a>
        </div>
      </header>

      <section className="mobile-hero">
        <img src="/crown.png" alt="왕관" />
        <h2>
          운명상단 <span>기여도 랭킹</span>
        </h2>
         <p className="hero-sub">
    항상 즐겁게 매너있게 게임하는 운명상단
  </p>

        <p>운명상단의 전설은, 당신의 기여도로 완성됩니다.</p>
      </section>

      <section className="mobile-ranking">
        <div className="mobile-section-title">
          <span></span>
          <h3>TOP 5 기여도 랭킹</h3>
          <span></span>
        </div>

        <div className="mobile-rank-list">
          {ranks.map((r) => (
            <article
              key={r.rank}
              className={`mobile-rank-card ${
                r.rank === 1
                  ? "gold"
                  : r.rank === 2
                  ? "silver"
                  : r.rank === 3
                  ? "bronze"
                  : "purple"
              }`}
            >
              <div className="mobile-rank-top">
                <img src={getMedal(r.rank)} alt={`${r.rank}위`} />
                <strong>{r.rank}위</strong>
              </div>

              <div className="mobile-avatar">
                <img src="/avatar.png" alt="캐릭터" />
              </div>

              <h4>{r.name}</h4>
              <b>{r.score.toLocaleString()}</b>
              <p>기여도</p>
            </article>
          ))}
        </div>

        <div className="mobile-rank-note">
          매주 일요일 22시 집계 후 보상 지급
        </div>
      </section>

      <section className="mobile-info">
        <article className="mobile-notice">
          <div className="mobile-card-head">
            <h3>📣 공지사항</h3>
            <a href="/notice">더보기 →</a>
          </div>

         <a href="/notice" className="mobile-line">
  <span>NEW</span>
  <b>나타 파티 진행 안내</b>
</a>

<a href="/notice" className="mobile-line">
  <span>NEW</span>
  <b>상단창고 이용수칙</b>
</a>

<a href="/notice" className="mobile-line">
  <span>NEW</span>
  <b>상단 연구 지원 참여 안내</b>
</a>

        </article>

        <article className="mobile-event">
          <div>
            <h3>5월 상단 이벤트 진행중!</h3>
            <p>주간 기여도 보상과 참여 이벤트까지 함께 진행됩니다.</p>
            <a href="/event">이벤트 자세히 보기 →</a>
          </div>

          <img src="/treasure.png" alt="이벤트 보상" />
        </article>
      </section>

      <footer className="mobile-footer">
        © 2026 거상 운명상단. ALL RIGHTS RESERVED.
      </footer>
    </main>
  );
}