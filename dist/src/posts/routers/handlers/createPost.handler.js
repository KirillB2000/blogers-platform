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
exports.createPost = void 0;
const blogs_repository_1 = require("../../../blogs/repositories/blogs.repository");
const http_statuses_1 = require("../../../core/types/http-statuses");
const posts_repository_1 = require("../../repositories/posts.repository");
const map_from_post_input_dto_to_db_type_1 = require("../mappers/map-from-post-input-dto-to-db-type");
const map_from_post_db_type_to_view_model_1 = require("../mappers/map-from-post-db-type-to-view-model");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogById = yield blogs_repository_1.blogsRepository.findById(req.body.blogId);
    if (!blogById) {
        res
            .status(http_statuses_1.httpStatuses.BadRequest)
            .json({ message: "Blog not found", field: "blogID" }); // Переписать на errorHadler
        return;
    }
    const newPost = Object.assign(Object.assign({}, (0, map_from_post_input_dto_to_db_type_1.mapPostInputDtoToDbType)(req.body)), { blogId: blogById._id.toString(), blogName: blogById.name, createdAt: new Date() });
    const createdPost = yield posts_repository_1.postsRepository.create(newPost);
    const postDataForResponse = (0, map_from_post_db_type_to_view_model_1.mapToPostViewModel)(createdPost);
    res.status(http_statuses_1.httpStatuses.Created).json(postDataForResponse);
});
exports.createPost = createPost;
