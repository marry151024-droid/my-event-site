"use client";

import { useState } from "react";

type Notice = {
  title: string;
  type: string;
  date: string;
  content: string;
};

export default function NoticePage() {
  const notices: Notice[] = [
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
   - 물: 12시
   - 바람: 9시
   - 불: 6시
   - 뇌: 3시
4. 정령: 일석이조 적용 안 됨
   - 바람정령(전설 기준) 사용
   - 바람정령 없을 시 알아서 사용
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
  ];

  const [selected, setSelected] = useState<Notice>(notices[0]);

  return (
    <main className="notice-page">
      <header className="notice-top">
        <a href="/" className="notice-brand">
          <img src="/logo.png" alt="운명상단 로고" />
          <div>
            <h1>거상 운명상단</h1>
            <p>命 運 商 團</p>
          </div>
        </a>

        <nav className="notice-menu">
          <a href="/">기여도 랭킹</a>
          <a className="active" href="/notice">
            공지사항
          </a>
          <a href="/event">이벤트</a>
          <a href="/manager">관리자</a>
          <a href="/ocr">OCR</a>
        </nav>
      </header>

      <section className="notice-layout">
        <div className="notice-list">
          {notices.map((n, i) => (
            <button
              type="button"
              key={i}
              className={`notice-item ${
                selected.title === n.title ? "selected" : ""
              }`}
              onClick={() => setSelected(n)}
            >
              <div className="notice-left">
                <span className="notice-badge">{n.type}</span>
                <span className="notice-title">{n.title}</span>
              </div>
              <span className="notice-date">{n.date}</span>
            </button>
          ))}
        </div>

        <div className="notice-detail">
          <h3>{selected.title}</h3>
          <p className="detail-date">{selected.date}</p>
          <pre className="detail-content">{selected.content}</pre>
        </div>
      </section>
    </main>
  );
}