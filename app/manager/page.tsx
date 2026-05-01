"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Player = {
  name: string;
  score: string;
};

export default function ManagerPage() {
  const router = useRouter();

  const now = new Date();
  const month = now.getMonth() + 1;
  const weekNumber = Math.ceil(now.getDate() / 7);

  const defaultWeekId = `2026-${String(month).padStart(2, "0")}-week${weekNumber}`;
  const defaultWeekTitle = `${month}월 ${["첫째", "둘째", "셋째", "넷째", "다섯째"][weekNumber - 1]}주`;

  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [weekId, setWeekId] = useState(defaultWeekId);
  const [weekTitle, setWeekTitle] = useState(defaultWeekTitle);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const [players, setPlayers] = useState<Player[]>([
    { name: "", score: "" },
    { name: "", score: "" },
    { name: "", score: "" },
    { name: "", score: "" },
    { name: "", score: "" },
  ]);

  const rankingPreview = useMemo(() => {
    return players
      .filter((p) => p.name.trim() && p.score.trim())
      .map((p) => ({
        name: p.name.trim(),
        score: Number(p.score.replaceAll(",", "")),
      }))
      .filter((p) => !Number.isNaN(p.score))
      .sort((a, b) => b.score - a.score)
      .map((p, index) => ({
        rank: index + 1,
        ...p,
      }));
  }, [players]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const login = () => {
    if (password === process.env.NEXT_PUBLIC_MANAGER_PASSWORD) {
      setIsLogin(true);
      showToast("관리자 로그인 완료");
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const updatePlayer = (index: number, key: "name" | "score", value: string) => {
    const next = [...players];
    next[index][key] = value;
    setPlayers(next);
  };

  const addPlayerRow = () => {
    setPlayers([...players, { name: "", score: "" }]);
  };

  const resetPlayers = () => {
    if (!confirm("입력한 랭킹을 전부 초기화할까요?")) return;

    setPlayers([
      { name: "", score: "" },
      { name: "", score: "" },
      { name: "", score: "" },
      { name: "", score: "" },
      { name: "", score: "" },
    ]);

    showToast("입력값이 초기화되었습니다.");
  };

  const saveRanking = async () => {
    try {
      setSaving(true);

      if (rankingPreview.length === 0) {
        alert("닉네임과 기여도를 입력해주세요.");
        return;
      }

      await setDoc(doc(db, "ranking", weekId), {
        weekId,
        weekTitle,
        players: rankingPreview,
        updatedAt: new Date().toISOString(),
      });

      showToast("랭킹 저장 완료! 메인페이지로 이동합니다.");

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 800);
    } catch (error: any) {
      console.error("저장 에러:", error);
      alert(`저장 실패: ${error.code || error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isLogin) {
    return (
      <main className="manager-page">
        {toast && <div className="toast">{toast}</div>}

        <div className="manager-login">
          <h1>관리자 로그인</h1>

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

  <a href="/manager/notices" className="save-btn">
  공지사항 관리
</a>
  return (
    <main className="manager-page">
      {toast && <div className="toast">{toast}</div>}

      <section className="manager-box">
        <h1>기여도 랭킹 관리</h1>

        <div className="manager-week">
          <select
            value={weekId}
            onChange={(e) => {
              setWeekId(e.target.value);

              const titleMap: Record<string, string> = {
                "2026-05-week1": "5월 첫째주",
                "2026-05-week2": "5월 둘째주",
                "2026-05-week3": "5월 셋째주",
                "2026-05-week4": "5월 넷째주",
                "2026-05-week5": "5월 다섯째주",
              };

              setWeekTitle(titleMap[e.target.value] || weekTitle);
            }}
          >
            <option value="2026-05-week1">2026년 5월 첫째주</option>
            <option value="2026-05-week2">2026년 5월 둘째주</option>
            <option value="2026-05-week3">2026년 5월 셋째주</option>
            <option value="2026-05-week4">2026년 5월 넷째주</option>
            <option value="2026-05-week5">2026년 5월 다섯째주</option>
          </select>

          <input
            value={weekTitle}
            onChange={(e) => setWeekTitle(e.target.value)}
            placeholder="5월 첫째주"
          />
        </div>

        <div className="manager-table">
          {players.map((p, i) => (
            <div className="manager-row" key={i}>
              <strong>{i + 1}</strong>

              <input
                placeholder="닉네임"
                value={p.name}
                onChange={(e) => updatePlayer(i, "name", e.target.value)}
              />

              <input
                placeholder="기여도"
                value={p.score}
                onChange={(e) => updatePlayer(i, "score", e.target.value)}
              />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
          <button type="button" className="save-btn" onClick={addPlayerRow}>
            인원 추가
          </button>

          <button type="button" className="save-btn" onClick={resetPlayers}>
            초기화
          </button>
        </div>

        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            border: "1px solid rgba(150, 80, 255, 0.45)",
            borderRadius: "16px",
            background: "rgba(0,0,0,0.35)",
          }}
        >
          <h3 style={{ marginBottom: "12px" }}>저장 전 미리보기</h3>

          {rankingPreview.length === 0 ? (
            <p style={{ opacity: 0.7 }}>아직 입력된 랭킹이 없습니다.</p>
          ) : (
            rankingPreview.map((p) => (
              <div
                key={`${p.rank}-${p.name}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span>
                  {p.rank}위 {p.name}
                </span>
                <b>{p.score.toLocaleString()}</b>
              </div>
            ))
          )}
        </div>

        <button
          type="button"
          className="save-btn"
          onClick={saveRanking}
          disabled={saving}
          style={{ marginTop: "18px" }}
        >
          {saving ? "저장 중..." : "이번주 랭킹 저장 후 메인으로 이동"}
        </button>
      </section>
    </main>
  );
}