"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToBlogViewModel = void 0;
const mapToBlogViewModel = (blog) => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    };
};
exports.mapToBlogViewModel = mapToBlogViewModel;
