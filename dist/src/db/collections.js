"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsCollection = exports.blogsCollection = exports.POSTS_COLLECTION_NAME = exports.BLOGS_COLLECTION_NAME = void 0;
exports.initCollections = initCollections;
exports.BLOGS_COLLECTION_NAME = 'blogs';
exports.POSTS_COLLECTION_NAME = 'posts';
function initCollections(db) {
    exports.blogsCollection = db.collection(exports.BLOGS_COLLECTION_NAME);
    exports.postsCollection = db.collection(exports.POSTS_COLLECTION_NAME);
}
