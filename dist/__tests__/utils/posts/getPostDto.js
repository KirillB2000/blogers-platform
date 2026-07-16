"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostDto = void 0;
const getPostDto = (blogId) => {
    return {
        title: 'Test title',
        shortDescription: 'Test description',
        content: 'Test content',
        blogId: blogId,
    };
};
exports.getPostDto = getPostDto;
