"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapBlogInputDtoToDbType = void 0;
const mapBlogInputDtoToDbType = (dto) => {
    return {
        name: dto.name,
        description: dto.description,
        websiteUrl: dto.websiteUrl
    };
};
exports.mapBlogInputDtoToDbType = mapBlogInputDtoToDbType;
