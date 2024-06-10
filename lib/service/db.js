"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const { db } = require("../firebase");
class DatabaseService {
    async setData(docId, data) {
        await db.collection(process.env.COLLECTION_NAME).doc(docId).set(data);
    }
}
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=db.js.map