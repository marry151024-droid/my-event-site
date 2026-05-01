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