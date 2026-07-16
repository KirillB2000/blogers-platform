"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const mongodb_1 = require("mongodb");
const collections_1 = require("../../db/collections");
exports.postsRepository = {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return collections_1.postsCollection.find().toArray();
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return collections_1.postsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    },
    create(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertResult = yield collections_1.postsCollection.insertOne(newPost);
            return Object.assign(Object.assign({}, newPost), { _id: insertResult.insertedId });
        });
    },
    update(id, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedResult = yield collections_1.postsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: post });
            return updatedResult.matchedCount > 0;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield collections_1.postsCollection.deleteOne({
                _id: new mongodb_1.ObjectId(id)
            });
            return deleteResult.deletedCount > 0;
        });
    },
};
