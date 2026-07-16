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
exports.getPostByIdHandler = void 0;
const posts_repository_1 = require("../../repositories/posts.repository");
const http_statuses_1 = require("../../../core/types/http-statuses");
const map_from_post_db_type_to_view_model_1 = require("../mappers/map-from-post-db-type-to-view-model");
const getPostByIdHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const post = yield posts_repository_1.postsRepository.findById(postId);
    if (!post) {
        res.sendStatus(http_statuses_1.httpStatuses.NotFound);
        return;
    }
    const postDataForResponse = (0, map_from_post_db_type_to_view_model_1.mapToPostViewModel)(post);
    res.status(http_statuses_1.httpStatuses.Ok).json(postDataForResponse);
});
exports.getPostByIdHandler = getPostByIdHandler;
