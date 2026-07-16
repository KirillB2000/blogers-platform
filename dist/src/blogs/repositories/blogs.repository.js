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
exports.blogsRepository = void 0;
const mongodb_1 = require("mongodb");
const collections_1 = require("../../db/collections");
exports.blogsRepository = {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return collections_1.blogsCollection.find().toArray();
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return collections_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
        });
    },
    create(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdBlog = yield collections_1.blogsCollection.insertOne(newBlog);
            return Object.assign(Object.assign({}, newBlog), { _id: createdBlog.insertedId });
        });
    },
    update(id, blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield collections_1.blogsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: blog });
            return updateResult.matchedCount > 0;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield collections_1.blogsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return deleteResult.deletedCount > 0;
        });
    },
};
