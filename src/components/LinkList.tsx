"use client";

import { useEffect, useState } from "react";
import LinkCard from "./LinkCard";
import type { LinkItem } from "@/lib/types";

export default function LinkList({ links }: { links: LinkItem[] }) {
  // 데이터를 받기 전에는 모든 링크가 0회.
  // 페이지가 열리면 /api/clicks 로 전체 클릭 수를 한 번에 가져와 실제 값으로 갱신합니다.
  const [clicks, setClicks] = useState<Record<string, number>>({});

  useEffect(() => {
    let alive = true;
    fetch("/api/clicks")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: { clicks?: Record<string, number> }) => {
        if (alive) setClicks(data.clicks ?? {});
      })
      .catch(() => {
        /* 조회 실패 시 0회를 그대로 유지합니다. */
      });
    return () => {
      alive = false;
    };
  }, []);

  // 카드를 누르면 화면상 즉시 +1 하고, 서버에도 증가를 요청해 정확한 값으로 맞춥니다.
  function handleClick(id: string) {
    setClicks((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    fetch("/api/clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      keepalive: true,
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: { clicks: number }) => {
        setClicks((prev) => ({ ...prev, [id]: data.clicks }));
      })
      .catch(() => {
        /* 요청이 실패해도 낙관적으로 더한 값은 유지합니다. */
      });
  }

  if (links.length === 0) {
    return (
      <p className="text-sm text-[#5c6b78]">아직 등록된 링크가 없습니다.</p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 sm:gap-[18px]">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          clicks={clicks[link.id] ?? 0}
          onCountClick={handleClick}
        />
      ))}
    </div>
  );
}
