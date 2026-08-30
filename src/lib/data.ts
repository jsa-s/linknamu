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
  name: "링크나무",
  bio: "내 모든 링크를 한 페이지에 모아 두고, 하나의 URL로 공유하세요.",
  avatarUrl: "",
};

const SAMPLE_LINKS: LinkItem[] = [
  { id: "sample-github", title: "GitHub", url: "https://github.com", clicks: 12, order: 0 },
  { id: "sample-blog", title: "블로그", url: "https://example.com", clicks: 34, order: 1 },
  { id: "sample-instagram", title: "Instagram", url: "https://instagram.com", clicks: 7, order: 2 },
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

/**
 * 리다이렉트 대상 URL을 반환하면서 클릭 수를 1 증가시킵니다.
 * 링크가 없으면 null.
 */
export async function getLinkForRedirect(id: string): Promise<string | null> {
  if (!isDbConfigured()) {
    return SAMPLE_LINKS.find((l) => l.id === id)?.url ?? null;
  }
  if (!ObjectId.isValid(id)) return null;

  const db = await getDb();
  const doc = await db
    .collection("links")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { clicks: 1 } },
      { returnDocument: "after" },
    );

  return doc?.url ?? null;
}

/* ------------------------------ 변경 (관리자) ------------------------------ */

export async function saveProfile(data: Profile): Promise<void> {
  const db = await getDb();
  await db.collection<ProfileDoc>("profile").updateOne(
    { _id: PROFILE_ID },
    { $set: { ...data, updatedAt: new Date() } },
    { upsert: true },
  );
}

export async function addLink(input: { title: string; url: string }): Promise<void> {
  const db = await getDb();
  const count = await db.collection("links").countDocuments();
  await db.collection("links").insertOne({
    title: input.title,
    url: input.url,
    clicks: 0,
    order: count,
    createdAt: new Date(),
  });
}

export async function editLink(
  id: string,
  input: { title: string; url: string },
): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await db
    .collection("links")
    .updateOne({ _id: new ObjectId(id) }, { $set: { title: input.title, url: input.url } });
}

export async function removeLink(id: string): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await db.collection("links").deleteOne({ _id: new ObjectId(id) });
}

export async function moveLink(id: string, direction: "up" | "down"): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  const links = await db.collection("links").find().sort({ order: 1, _id: 1 }).toArray();

  const idx = links.findIndex((l) => l._id.toString() === id);
  if (idx === -1) return;

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= links.length) return;

  const a = links[idx];
  const b = links[swapIdx];
  await Promise.all([
    db.collection("links").updateOne({ _id: a._id }, { $set: { order: swapIdx } }),
    db.collection("links").updateOne({ _id: b._id }, { $set: { order: idx } }),
  ]);
}
