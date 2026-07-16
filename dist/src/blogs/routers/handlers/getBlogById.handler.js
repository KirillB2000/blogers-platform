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
exports.getBlogByIdHandler = void 0;
const blogs_repository_1 = require("../../repositories/blogs.repository");
const http_statuses_1 = require("../../../core/types/http-statuses");
const map_from_blog_db_type_to_view_model_1 = require("../mappers/map-from-blog-db-type-to-view-model");
const getBlogByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const blog = yield blogs_repository_1.blogsRepository.findById(blogId);
    if (!blog) {
        res.sendStatus(http_statuses_1.httpStatuses.NotFound);
        return;
    }
    const blogForResponse = (0, map_from_blog_db_type_to_view_model_1.mapToBlogViewModel)(blog);
    res.status(http_statuses_1.httpStatuses.Ok).json(blogForResponse);
});
exports.getBlogByIdHandler = getBlogByIdHandler;
