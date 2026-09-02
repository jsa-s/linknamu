// MongoDB에 초기 프로필/링크 데이터를 넣는 시드 스크립트.
// 실행: npm run seed
//
// 여러 번 실행해도 안전합니다.
//  - profile 은 _id 로 upsert (내용만 갱신)
//  - links 는 url 을 자연키로 upsert. 이미 있으면 title/order 만 갱신하고
//    clicks 는 건드리지 않습니다($setOnInsert).
import { readFileSync } from "node:fs";
import { MongoClient } from "mongodb";

function loadEnvLocal() {
  const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const env = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnvLocal();
const uri = env.MONGODB_URI;
if (!uri) {
  console.error(".env.local 에 MONGODB_URI 가 없습니다.");
  process.exit(1);
}
const dbName = env.MONGODB_DB || "linknamu";

const PROFILE = {
  _id: "profile",
  name: "안준성",
  bio: "가치 투자자 | 요즘에는 AI 개발에 관심이 많아요",
  avatarUrl: "/profile.jpg",
};

const LINKS = [
  { title: "🦋 깃허브", url: "https://github.com/jsa-s", order: 0 },
  {
    title: "📚 블로그",
    url: "https://m.blog.naver.com/PostList.naver?blogId=a3412023",
    order: 1,
  },
  { title: "📮 이메일", url: "mailto:albertandnoah@gmail.com", order: 2 },
];

const client = new MongoClient(uri);
await client.connect();
try {
  const db = client.db(dbName);

  const { _id, ...profileFields } = PROFILE;
  await db
    .collection("profile")
    .updateOne({ _id }, { $set: profileFields }, { upsert: true });
  console.log(`profile 저장 완료 (_id=${_id})`);

  for (const { url, title, order } of LINKS) {
    const res = await db.collection("links").updateOne(
      { url },
      { $set: { title, order }, $setOnInsert: { clicks: 0 } },
      { upsert: true },
    );
    const state = res.upsertedCount ? "새로 추가" : "이미 있음(갱신)";
    console.log(`link ${state}: ${title}`);
  }

  const links = await db
    .collection("links")
    .find()
    .sort({ order: 1 })
    .toArray();
  console.log(`\n현재 links 컬렉션 (${links.length}개):`);
  for (const l of links) {
    console.log(`  ${l._id}  ${l.title}  clicks=${l.clicks}  ${l.url}`);
  }
} finally {
  await client.close();
}
