"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function NoticePage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const loadNotices = async () => {
      const q = query(
        collection(db, "notices"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotices(list);
      if (list.length > 0) setSelected(list[0]);
    };

    loadNotices();
  }, []);

  return (
    <main className="notice-page">
      <section className="notice-layout">

        {/* 왼쪽 리스트 */}
        <div className="notice-list">
          {notices.map((n) => (
            <div
              key={n.id}
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