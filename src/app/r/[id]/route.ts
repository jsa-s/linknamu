import { NextResponse } from "next/server";
import { getLinkForRedirect } from "@/lib/data";

// 링크 클릭 집계용 리다이렉트 엔드포인트: 클릭 수를 올리고 대상 URL로 보냅니다.
export async function GET(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const url = await getLinkForRedirect(id);

  if (!url || !/^https?:\/\//i.test(url)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.redirect(url, 302);
}
