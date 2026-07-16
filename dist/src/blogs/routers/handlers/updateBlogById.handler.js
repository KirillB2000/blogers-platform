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
exports.updateBlogById = void 0;
const blogs_repository_1 = require("../../repositories/blogs.repository");
const http_statuses_1 = require("../../../core/types/http-statuses");
const updateBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdated = yield blogs_repository_1.blogsRepository.update(req.params.id, req.body);
    if (!isUpdated) {
        res.sendStatus(http_statuses_1.httpStatuses.NotFound);
        return;
    }
    res.sendStatus(http_statuses_1.httpStatuses.NoContent);
});
exports.updateBlogById = updateBlogById;
