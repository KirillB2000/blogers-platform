
```
02-bloger-patform
├─ jest.config.js
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ README.md
├─ src
│  ├─ auth
│  │  ├─ application
│  │  │  └─ auth.service.ts
│  │  ├─ constants
│  │  │  └─ auth.paths.ts
│  │  ├─ dto
│  │  │  └─ authInputModel.ts
│  │  ├─ middlewares
│  │  │  └─ super-admin.guard.middleware.ts
│  │  ├─ routes
│  │  │  ├─ auth.router.ts
│  │  │  └─ handlers
│  │  │     └─ auth.handler.ts
│  │  └─ validation
│  │     └─ auth.validation.ts
│  ├─ blogs
│  │  ├─ application
│  │  │  └─ blogs.services.ts
│  │  ├─ constants
│  │  │  └─ blogs.paths.ts
│  │  ├─ domain
│  │  │  └─ blog.ts
│  │  ├─ dto
│  │  │  └─ blogInputModel.ts
│  │  ├─ repositories
│  │  │  ├─ blogs.queryRepository.ts
│  │  │  └─ blogs.repository.ts
│  │  ├─ routes
│  │  │  ├─ blogs.router.ts
│  │  │  ├─ handlers
│  │  │  │  ├─ createBlog.handler.ts
│  │  │  │  ├─ createPostForSpecificBlog.handler.ts
│  │  │  │  ├─ deleteBlogById.handler.ts
│  │  │  │  ├─ getBlogById.handler.ts
│  │  │  │  ├─ getBlogList.handler.ts
│  │  │  │  ├─ getPostListForSpecificBlog.handler.ts
│  │  │  │  └─ updateBlogById.handler.ts
│  │  │  ├─ input
│  │  │  │  ├─ blog-query.input.ts
│  │  │  │  └─ blog-sort-field.ts
│  │  │  ├─ mappers
│  │  │  │  ├─ map-from-blog-db-type-to-view-model.ts
│  │  │  │  ├─ map-from-blog-domain-to-blog-list-paginated-output.ts
│  │  │  │  └─ map-from-blog-input-dto-to-db-type.ts
│  │  │  └─ output
│  │  │     ├─ blog-data.output.ts
│  │  │     └─ blog-list-paginator.output.ts
│  │  └─ validation
│  │     └─ blog-input.validation.middleware.ts
│  ├─ core
│  │  ├─ exceptions
│  │  │  ├─ app-errors.exeption.ts
│  │  │  └─ error.handler.ts
│  │  ├─ helpers
│  │  │  └─ catchAsync.helper.ts
│  │  ├─ mappers
│  │  │  └─ map-to-paginated-output.ts
│  │  ├─ middlewares
│  │  │  └─ validation
│  │  │     ├─ input-validation-result.middleware.ts
│  │  │     ├─ params-id.validation.middleware.ts
│  │  │     ├─ query-pagination-sorting.validation.middleware.ts
│  │  │     └─ sanitize-query.middleware.ts
│  │  └─ types
│  │     ├─ errors.ts
│  │     ├─ http-statuses.ts
│  │     ├─ paginated.output.ts
│  │     ├─ pagination-and-sorting.ts
│  │     └─ sort-direction.ts
│  ├─ db
│  │  ├─ collections.ts
│  │  ├─ db-connection.middleware.ts
│  │  ├─ indexes.ts
│  │  └─ mongo.db.ts
│  ├─ index.ts
│  ├─ posts
│  │  ├─ application
│  │  │  └─ posts.services.ts
│  │  ├─ constants
│  │  │  └─ posts.paths.ts
│  │  ├─ domain
│  │  │  └─ post.ts
│  │  ├─ dto
│  │  │  ├─ postBlogInputModel.ts
│  │  │  └─ postInputModel.ts
│  │  ├─ repositories
│  │  │  ├─ posts.queryRepository.ts
│  │  │  └─ posts.repository.ts
│  │  ├─ routes
│  │  │  ├─ handlers
│  │  │  │  ├─ createPost.handler.ts
│  │  │  │  ├─ deletePostById.handler.ts
│  │  │  │  ├─ getPostById.handler.ts
│  │  │  │  ├─ getPostList.handler.ts
│  │  │  │  └─ updatePostById.handler.ts
│  │  │  ├─ input
│  │  │  │  ├─ post-query.input.ts
│  │  │  │  └─ post-sort-fields.ts
│  │  │  ├─ mappers
│  │  │  │  ├─ map-from-post-db-type-to-view-model.ts
│  │  │  │  ├─ map-from-post-domain-to-post-paginated-output.ts
│  │  │  │  └─ map-from-post-input-dto-to-db-type.ts
│  │  │  ├─ output
│  │  │  │  ├─ post-data.output.ts
│  │  │  │  └─ post-list-paginator.output.ts
│  │  │  └─ posts.router.ts
│  │  └─ validation
│  │     └─ post-input.validation.middleware.ts
│  ├─ settings
│  │  └─ config.ts
│  ├─ setup-app.ts
│  ├─ testing
│  │  ├─ constants
│  │  │  └─ testing.paths.ts
│  │  └─ routers
│  │     ├─ handlers
│  │     │  └─ testingDeleteAllData.handler.ts
│  │     └─ testing.router.ts
│  └─ users
│     ├─ application
│     │  └─ users.services.ts
│     ├─ constants
│     │  └─ users.paths.ts
│     ├─ domain
│     │  └─ user.ts
│     ├─ dto
│     │  └─ userInputModel.ts
│     ├─ input
│     │  ├─ user-query.input.ts
│     │  └─ user-sort-fields.ts
│     ├─ mappers
│     │  ├─ mapToUserListPaginatedOutput.ts
│     │  ├─ mapUserDomaiToViewModel.ts
│     │  └─ mapUserInputToDbType.ts
│     ├─ output
│     │  ├─ userListPaginatorOutput.ts
│     │  └─ userViewModel.ts
│     ├─ repository
│     │  ├─ user.queryRepository.ts
│     │  └─ user.repository.ts
│     ├─ routes
│     │  ├─ handlers
│     │  │  ├─ createUser.handler.ts
│     │  │  ├─ deleteUser.handler.ts
│     │  │  └─ getUserList.handler.ts
│     │  └─ users.router.ts
│     └─ validation
│        └─ user-input.validation.ts
├─ tsconfig.json
├─ vercel.json
└─ __tests__
   ├─ e2e
   │  ├─ auth
   │  │  ├─ auth-body-validation.e2e.spec.ts
   │  │  └─ auth.e2e.spec.ts
   │  ├─ blogs
   │  │  ├─ blogs-body-validation.e2e.spec.ts
   │  │  └─ blogs.e2e.spec.ts
   │  ├─ posts
   │  │  ├─ posts-body-validation.e2e.spec.ts
   │  │  └─ posts.e2e.spec.ts
   │  └─ users
   │     ├─ users-body-validation.e2e.spec.ts
   │     └─ users.e2e.spec.ts
   └─ utils
      ├─ auth
      │  ├─ auth.ts
      │  └─ authDto.ts
      ├─ blogs
      │  ├─ blogDto.ts
      │  ├─ createBlogDto.ts
      │  ├─ getBlogById.ts
      │  └─ updateBlogById.ts
      ├─ clearDb.ts
      ├─ generateBasicAuthToken.ts
      ├─ posts
      │  ├─ createPostDto.ts
      │  ├─ getPostByID.ts
      │  ├─ postDto.ts
      │  ├─ postForBlogDto.ts
      │  └─ updatePostById.ts
      └─ users
         ├─ createUserDto.ts
         └─ userDto.ts

```