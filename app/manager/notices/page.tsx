"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
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

  useEffect(() => {
    const load = async () => {
      try {
        const q = query(
          collection(db, "notices"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);

        let list = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Notice),
        }));

        // 🔥 DB 비어있으면 기본 공지 사용
        if (list.length === 0) {
          list = defaultNotices;
        }

        setNotices(list);
        setSelected(list[0]);
      } catch (e) {
        // 🔥 에러나면 기본 공지 fallback
        setNotices(defaultNotices);
        setSelected(defaultNotices[0]);
      }
    };

    load();
  }, []);

  return (
    <main className="notice-page">
      <section className="notice-layout">

        {/* 리스트 */}
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

        {/* 상세 */}
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

/* ================= 기본 공지 ================= */

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
기간 중에 일정 잡아서 클리어해주세요.

16일~31일
기간 중에 일정 잡아서 클리어해주세요.

#. 나타 필수 사항

1. 저깍 조합 필수
2. 금전은 6시 방향 잡기
3. 속성몹은 파장 사천왕에 맞는 속성몹 잡기
4. 정령: 일석이조 적용 안 됨
5. 수호부 오 착용
6. 디스코드 필수 참여

#. 운명상단 나타 파티

1파티
파장 : 솔(각광목)
불사 : 시원사이다(각지국)
속성 : 지니쁨(각지국)

2파티
파장 : 제이형(각증장)

3파티
파장 : 싸패(각지국)

4파티
파장 : 허숙희(각다문)

5파티
파장 : 님자(각증장)

#. 나타 글공략
https://cafe.naver.com/fkatjs/371
    `,
  },
  {
    title: "상단 토벌 진행 안내",
    type: "NEW",
    date: "2026.05.16",
    content: `
🗡️ 운명상단 토벌
매일 20시 30분
독도에서 진행됩니다

✔ 시간 엄수
✔ 기여도 및 기부 확인 필수
    `,
  },
];