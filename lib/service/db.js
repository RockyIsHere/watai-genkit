"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const { db } = require("../firebase");
class DatabaseService {
    async setData(docId, data) {
        await db.collection(process.env.COLLECTION_NAME).doc(docId).set(data);
    }
    async getData(docId) {
        const docRef = db.collection(process.env.COLLECTION_NAME).doc(docId);
        const doc = await docRef.get();
        if (doc.exists) {
            return doc.data();
        }
        else {
            console.log("No such document!");
            return undefined;
        }
    }
}
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=db.js.map