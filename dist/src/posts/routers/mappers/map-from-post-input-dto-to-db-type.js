"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapPostInputDtoToDbType = void 0;
const mapPostInputDtoToDbType = (dto) => {
    return {
        title: dto.title,
        shortDescription: dto.shortDescription,
        content: dto.content,
        blogId: dto.blogId
    };
};
exports.mapPostInputDtoToDbType = mapPostInputDtoToDbType;
