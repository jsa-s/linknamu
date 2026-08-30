import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "linknamu";

declare global {
  // dev 환경에서 HMR 시 커넥션이 중복 생성되지 않도록 전역에 캐시합니다.
  // eslint-disable-next-line no-var
  var _linknamuMongo: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | null = null;

/** MONGODB_URI가 설정되어 있는지 여부. 미설정 시 샘플 데이터로 동작합니다. */
export function isDbConfigured(): boolean {
  return Boolean(uri);
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) throw new Error("MONGODB_URI 환경 변수가 설정되지 않았습니다.");

  if (process.env.NODE_ENV === "development") {
    if (!global._linknamuMongo) {
      global._linknamuMongo = new MongoClient(uri).connect();
    }
    return global._linknamuMongo;
  }

  if (!clientPromise) clientPromise = new MongoClient(uri).connect();
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}
