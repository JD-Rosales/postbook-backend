import { PrismaClient } from '@prisma/client';

let db: PrismaClient;

declare global {
  var _db: PrismaClient | undefined;
}

if (!globalThis._db) {
  globalThis._db = new PrismaClient();
}

db = globalThis._db;

export { db };
