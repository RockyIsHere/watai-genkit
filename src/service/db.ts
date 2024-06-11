import { buttonType } from "../types";
const { db } = require("../firebase");

export type UserData = {
  conversationId: buttonType;
};

export class DatabaseService {
  async setData(docId: string, data: UserData) {
    await db.collection(process.env.COLLECTION_NAME).doc(docId).set(data);
  }
  async getData(docId: string): Promise<UserData | undefined> {
    const docRef = db.collection(process.env.COLLECTION_NAME).doc(docId);
    const doc = await docRef.get();

    if (doc.exists) {
      return doc.data() as UserData;
    } else {
      console.log("No such document!");
      return undefined;
    }
  }
}
