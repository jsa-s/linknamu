import { NextResponse } from "next/server";
import { getAllClicks, incrementClick } from "@/lib/data";

// 링크 클릭 수 조회/증가 엔드포인트.
// GET  /api/clicks        → 모든 링크의 현재 클릭 수를 { clicks: { [id]: number } } 로 반환
// POST /api/clicks {id}   → 해당 링크 클릭 수를 1 증가시키고 { clicks: number } 로 반환

export async function GET() {
  const clicks = await getAllClicks();
  return NextResponse.json({ clicks });
}

export async function POST(request: Request) {
  let id: unknown;
  try {
    ({ id } = await request.json());
  } catch {
    return NextResponse.json(
      { error: "요청 본문을 해석할 수 없습니다." },
      { status: 400 },
    );
  }

  if (typeof id !== "string" || id.length === 0) {
    return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });
  }

  const clicks = await incrementClick(id);
  if (clicks === null) {
    return NextResponse.json(
      { error: "링크를 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  return NextResponse.json({ clicks });
}
