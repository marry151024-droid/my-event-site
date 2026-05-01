"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Notice = {
  id: string;
  title: string;
  type: string;
  date: string;
  content: string;
};

export default function NoticeManagerPage() {
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("NEW");
  const [date, setDate] = useState("2026.05.16");
  const [content, setContent] = useState("");

  const login = () => {
    if (password === process.env.NEXT_PUBLIC_MANAGER_PASSWORD) {
      setIsLogin(true);
      loadNotices();
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const loadNotices = async () => {
    const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    const list = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Notice, "id">),
    }));

    setNotices(list);
  };

  const saveNotice = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    await addDoc(collection(db, "notices"), {
      title: title.trim(),
      type,
      date,
      content,
      createdAt: new Date().toISOString(),
    });

    alert("공지 저장 완료");

    setTitle("");
    setType("NEW");
    setContent("");

    loadNotices();
  };

  const removeNotice = async (id: string) => {
    if (!confirm("이 공지를 삭제할까요?")) return;

    await deleteDoc(doc(db, "notices", id));
    loadNotices();
  };

  if (!isLogin) {
    return (
      <main className="manager-page">
        <div className="manager-login">
          <h1>공지 관리자 로그인</h1>

          <input
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") login();
            }}
          />

          <button type="button" onClick={login}>
            로그인
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="manager-page">
      <section className="manager-box">
        <h1>공지사항 관리</h1>

        <div className="manager-week">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="공지 제목"
          />

          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="2026.05.16"
          />

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="NEW">NEW</option>
            <option value="공지">공지</option>
            <option value="중요">중요</option>
          </select>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="공지 내용을 입력하세요."
          style={{
            width: "100%",
            minHeight: "220px",
            marginTop: "14px",
            padding: "14px",
            borderRadius: "16px",
            background: "rgba(0,0,0,0.5)",
            color: "white",
            border: "1px solid rgba(168,85,247,0.5)",
            resize: "vertical",
          }}
        />

        <button
          type="button"
          className="save-btn"
          onClick={saveNotice}
          style={{ marginTop: "14px" }}
        >
          공지 저장
        </button>

        <div style={{ marginTop: "28px" }}>
          <h2>등록된 공지</h2>

          {notices.length === 0 ? (
            <p style={{ opacity: 0.7 }}>등록된 공지가 없습니다.</p>
          ) : (
            notices.map((n) => (
              <div
                key={n.id}
                style={{
                  marginTop: "12px",
                  padding: "14px",
                  borderRadius: "14px",
                  border: "1px solid rgba(168,85,247,0.35)",
                  background: "rgba(0,0,0,0.35)",
                }}
              >
                <strong>
                  [{n.type}] {n.title}
                </strong>
                <p style={{ opacity: 0.6 }}>{n.date}</p>

                <button
                  type="button"
                  onClick={() => removeNotice(n.id)}
                  style={{
                    marginTop: "8px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "0",
                    cursor: "pointer",
                    background: "#ef4444",
                    color: "white",
                    fontWeight: 800,
                  }}
                >
                  삭제
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
const defaultNotices = [
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
침식 : 망지(각다문), 성희형님(각지국)

2파티
파장 : 제이형(각증장)
불사 : 싫(각다문)
속성 : 양밍(광목)
침식 : B상(각지국), 즈토(증장)

3파티
파장 : 싸패(각지국)
불사 : 절터는스님(각증장)
속성 : 최승아(다문)
침식 : 외환카드(지국), 선량배

4파티
파장 : 허숙희(각다문)
불사 : 긁(각다문)
속성 : 새지아(각증장)
침식 : 빠아카(각지국), 세상.(증장)

5파티
파장 : 님자(각증장)
불사 : 박새로이(각광목)
속성 : 뮤젤i(광목)
침식 : 놀명(광목), 잿더미(증장)

#. 나타 글공략

https://cafe.naver.com/fkatjs/371
    `,
  },
  {
    title: "상단창고 이용수칙",
    type: "NEW",
    date: "2026.05.15",
    content: `
주 1회 지급
- 타락죽 1000개
- 반계탕 100개

창고 물품은 상단 운영 목적입니다.
개인 사용 및 무단 수령 금지

필요 시 운영진 문의
    `,
  },
  {
    title: "상단 연구 지원 참여 안내",
    type: "NEW",
    date: "2026.05.14",
    content: `
상단 연구는 모든 인원이 참여해야 합니다.
가능한 인원은 적극 참여 부탁드립니다.
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

✔ 참여 가능 인원 시간 엄수 필수
✔ 토벌 전 소환 기여도 및 벌 토벌 기부 확인 필수

가능한 인원은 적극 참여 부탁드립니다!

항상 즐겁게, 매너있게 게임하는 운명상단
    `,
  },
];