"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Notice = {
  id?: string;
  title: string;
  type: string;
  date: string;
  content: string;
};

export default function NoticeManagerPage() {
  const [notices, setNotices] = useState<Notice[]>([]);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("NEW");
  const [date, setDate] = useState("2026.05.16");
  const [content, setContent] = useState("");

  // 🔥 공지 불러오기
  const loadNotices = async () => {
    const snap = await getDocs(collection(db, "notices"));
    const list: Notice[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Notice),
    }));

    // 최신순 정렬
    list.sort((a, b) => (a.date < b.date ? 1 : -1));

    setNotices(list);
  };

  useEffect(() => {
    loadNotices();
  }, []);

  // 🔥 공지 추가
  const addNotice = async () => {
    if (!title || !content) {
      alert("제목 / 내용 입력해라");
      return;
    }

    await addDoc(collection(db, "notices"), {
      title,
      type,
      date,
      content,
    });

    alert("저장 완료");

    setTitle("");
    setContent("");

    loadNotices();
  };

  // 🔥 삭제
  const removeNotice = async (id?: string) => {
    if (!id) return;

    if (!confirm("삭제할거냐?")) return;

    await deleteDoc(doc(db, "notices", id));
    loadNotices();
  };

  return (
    <main className="notice-manager">
      <div className="manager-box">
        <h2>공지사항 관리</h2>

        {/* 입력 */}
        <input
          placeholder="공지 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="NEW">NEW</option>
          <option value="공지">공지</option>
        </select>

        <textarea
          placeholder="공지 내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={addNotice}>공지 저장</button>

        {/* 목록 */}
        <div className="notice-list">
          {notices.map((n) => (
            <div key={n.id} className="notice-item">
              <div>
                <strong>[{n.type}] {n.title}</strong>
                <p>{n.date}</p>
              </div>

              <button onClick={() => removeNotice(n.id)}>
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}