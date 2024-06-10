const { db } = require("../firebase");

export type UserData = {
  message: string;
  response: string;
};

export class DatabaseService {
  async setData(docId: string, data: UserData) {
    await db.collection(process.env.COLLECTION_NAME).doc(docId).set(data);
  }
}
