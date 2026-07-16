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
exports.createBlogHandler = void 0;
const blogs_repository_1 = require("../../repositories/blogs.repository");
const http_statuses_1 = require("../../../core/types/http-statuses");
const map_from_blog_input_dto_to_db_type_1 = require("../mappers/map-from-blog-input-dto-to-db-type");
const map_from_blog_db_type_to_view_model_1 = require("../mappers/map-from-blog-db-type-to-view-model");
const createBlogHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlog = Object.assign(Object.assign({}, (0, map_from_blog_input_dto_to_db_type_1.mapBlogInputDtoToDbType)(req.body)), { createdAt: new Date(), isMembership: false });
    const createdNewBlog = yield blogs_repository_1.blogsRepository.create(newBlog);
    const blogForResponse = (0, map_from_blog_db_type_to_view_model_1.mapToBlogViewModel)(createdNewBlog);
    res.status(http_statuses_1.httpStatuses.Created).json(blogForResponse);
});
exports.createBlogHandler = createBlogHandler;
