"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDto = void 0;
const postDto = (blogId) => {
    return {
        title: "Test title",
        shortDescription: "Test description",
        content: "Test content",
        blogId: blogId,
    };
};
exports.postDto = postDto;
