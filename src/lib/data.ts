import { ObjectId } from "mongodb";
import { getDb, isDbConfigured } from "./mongodb";
import type { LinkItem, Profile } from "./types";

const PROFILE_ID = "profile";

interface ProfileDoc {
  _id: string;
  name?: string;
  bio?: string;
  avatarUrl?: string;
  updatedAt?: Date;
}

const DEFAULT_PROFILE: Profile = {
  name: "안준성",
  bio: "가치 투자자 | 요즘에는 AI 개발에 관심이 많아요",
  avatarUrl: "/profile.jpg",
};

const SAMPLE_LINKS: LinkItem[] = [
  { id: "sample-github", title: "🦋 깃허브", url: "https://github.com/jsa-s", clicks: 12, order: 0 },
  {
    id: "sample-blog",
    title: "📚 블로그",
    url: "https://m.blog.naver.com/PostList.naver?blogId=a3412023",
    clicks: 34,
    order: 1,
  },
  {
    id: "sample-email",
    title: "📮 이메일",
    url: "mailto:albertandnoah@gmail.com",
    clicks: 7,
    order: 2,
  },
];

/* ------------------------------ 조회 ------------------------------ */

export async function getProfile(): Promise<Profile> {
  if (!isDbConfigured()) return DEFAULT_PROFILE;

  const db = await getDb();
  const doc = await db.collection<ProfileDoc>("profile").findOne({ _id: PROFILE_ID });
  if (!doc) return DEFAULT_PROFILE;

  return {
    name: doc.name ?? DEFAULT_PROFILE.name,
    bio: doc.bio ?? "",
    avatarUrl: doc.avatarUrl ?? "",
  };
}

export async function getLinks(): Promise<LinkItem[]> {
  if (!isDbConfigured()) return SAMPLE_LINKS;

  const db = await getDb();
  const docs = await db
    .collection("links")
    .find()
    .sort({ order: 1, _id: 1 })
    .toArray();

  return docs.map((d, i) => ({
    id: d._id.toString(),
    title: d.title ?? "",
    url: d.url ?? "",
    clicks: d.clicks ?? 0,
    order: d.order ?? i,
  }));
}

/** 모든 링크의 현재 클릭 수를 { [id]: clicks } 형태로 한 번에 반환합니다. */
export async function getAllClicks(): Promise<Record<string, number>> {
  if (!isDbConfigured()) {
    return Object.fromEntries(SAMPLE_LINKS.map((l) => [l.id, l.clicks]));
  }

  const db = await getDb();
  const docs = await db
    .collection("links")
    .find({}, { projection: { clicks: 1 } })
    .toArray();

  return Object.fromEntries(docs.map((d) => [d._id.toString(), d.clicks ?? 0]));
}

/**
 * 주어진 링크의 클릭 수를 1 증가시키고 갱신된 값을 반환합니다.
 * 링크가 없으면 null.
 */
export async function incrementClick(id: string): Promise<number | null> {
  if (!isDbConfigured()) {
    const link = SAMPLE_LINKS.find((l) => l.id === id);
    if (!link) return null;
    link.clicks += 1; // 샘플 모드에서는 프로세스 메모리상으로만 증가합니다.
    return link.clicks;
  }
  if (!ObjectId.isValid(id)) return null;

  const db = await getDb();
  const doc = await db
    .collection("links")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { clicks: 1 } },
      { returnDocument: "after", projection: { clicks: 1 } },
    );

  return doc ? doc.clicks ?? 0 : null;
}
