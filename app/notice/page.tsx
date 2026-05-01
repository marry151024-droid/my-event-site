"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Notice = {
  id?: string;
  title: string;
  type: string;
  date: string;
  content: string;
};

export default function NoticePage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selected, setSelected] = useState<Notice | null>(null);

  // ✅ 기본 공지 (DB 비어있을 때)
  const defaultNotices: Notice[] = [
    {
      title: "운명상단 필수 공지",
      type: "공지",
      date: "2026.05.16",
      content: `
- 디스코드 및 오픈채팅 필수 참여
- 상단 이벤트 및 공지 확인 필수
- 비매너 / 분쟁 유발 행위 금지
- 운영진 판단에 따라 경고 또는 추방 가능
      `,
    },
    {
      title: "나타 파티 진행 안내",
      type: "NEW",
      date: "2026.05.16",
      content: `
#. 나타 진행

1일~15일
기간 중 일정 잡아서 클리어

16일~31일
기간 중 일정 잡아서 클리어

#. 나타 필수 사항

1. 저깍 조합 필수
2. 금전은 6시 방향
3. 속성몹 위치
 - 물: 12시
 - 바람: 9시
 - 불: 6시
 - 뇌: 3시
4. 정령: 바람정령 사용
5. 수호부 착용
6. 디스코드 필수

#. 나타 공략
https://cafe.naver.com/fkatjs/371
      `,
    },
    {
      title: "상단 토벌 진행 안내",
      type: "NEW",
      date: "2026.05.16",
      content: `
📢 매일 20시 30분
📍 독도 진행

✔ 토벌 전 확인
- 소환 기여도 체크
- 벌 토벌 기부 확인

👉 시간 맞춰 필수 참여

🔥 항상 즐겁게, 매너있게 플레이
      `,
    },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "notices"));

        let list: Notice[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Notice),
        }));

        // 👉 DB 비어있으면 기본 공지
        if (list.length === 0) {
          list = defaultNotices;
        }

        setNotices(list);
        setSelected(list[0]);
      } catch (e) {
        // 👉 에러나면 기본 공지
        setNotices(defaultNotices);
        setSelected(defaultNotices[0]);
      }
    };

    load();
  }, []);

  return (
    <main className="notice-page">
      {/* 상단 */}
      <header className="notice-top">
        <a href="/" className="notice-brand">
          <img src="/logo.png" alt="로고" />
          <div>
            <h1>거상 운명상단</h1>
            <p>命 運 商 團</p>
          </div>
        </a>

        <nav className="notice-menu">
          <a href="/">랭킹</a>
          <a className="active" href="/notice">공지</a>
          <a href="/event">이벤트</a>
          <a href="/manager">관리자</a>
        </nav>
      </header>

      <section className="notice-layout">

        {/* 왼쪽 리스트 */}
        <div className="notice-list">
          {notices.map((n, i) => (
            <div
              key={i}
              className="notice-item"
              onClick={() => setSelected(n)}
              style={{ cursor: "pointer" }}
            >
              <div className="notice-left">
                <span className="notice-badge">{n.type}</span>
                <span className="notice-title">{n.title}</span>
              </div>
              <span className="notice-date">{n.date}</span>
            </div>
          ))}
        </div>

        {/* 오른쪽 상세 */}
        {selected && (
          <div className="notice-detail">
            <h3>{selected.title}</h3>
            <p className="detail-date">{selected.date}</p>

            <pre className="detail-content">
              {selected.content}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}