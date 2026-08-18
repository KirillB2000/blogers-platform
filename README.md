
```
02-bloger-patform
├─ jest.config.js
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ README.md
├─ src
│  ├─ auth
│  │  ├─ adapters
│  │  │  ├─ bcrypt.services.ts
│  │  │  ├─ emailExamples.ts
│  │  │  ├─ jwt.services.ts
│  │  │  └─ nodemailer.services.ts
│  │  ├─ constants
│  │  │  └─ auth.paths.ts
│  │  ├─ domain
│  │  │  └─ auth.services.ts
│  │  ├─ input
│  │  │  └─ dto
│  │  │     ├─ loginInputModel.ts
│  │  │     ├─ registrationConfirmationCodeInputModel.ts
│  │  │     └─ registrationEmailResendingInputModel.ts
│  │  ├─ middlewares
│  │  │  ├─ access-token.guard.middleware.ts
│  │  │  └─ super-admin.guard.middleware.ts
│  │  ├─ output
│  │  │  ├─ accessToken-output.type.ts
│  │  │  └─ me-output.type.ts
│  │  ├─ routes
│  │  │  ├─ auth.router.ts
│  │  │  └─ handlers
│  │  │     ├─ login.handler.ts
│  │  │     ├─ me.handler.ts
│  │  │     ├─ registration.handler.ts
│  │  │     ├─ registrationConfirmation.handler.ts
│  │  │     └─ registrationEmailResending.handler.ts
│  │  └─ validation
│  │     ├─ codeInput.validation.ts
│  │     └─ loginInput.validation.ts
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
│  ├─ comments
│  │  ├─ application
│  │  │  └─ comments.services.ts
│  │  ├─ constants
│  │  │  └─ comments.paths.ts
│  │  ├─ input
│  │  │  ├─ comment.ts
│  │  │  ├─ commentQueryInput.ts
│  │  │  ├─ commentSortFields.ts
│  │  │  └─ dto
│  │  │     └─ commentInputModel.ts
│  │  ├─ mappers
│  │  │  ├─ mapFromCommentDbTypeToViewModel.ts
│  │  │  └─ mapFromCommentDomainToPaginatedOutput.ts
│  │  ├─ output
│  │  │  ├─ commentatorInfo.ts
│  │  │  ├─ commentListPaginatorOutput.ts
│  │  │  └─ commentViewModel.ts
│  │  ├─ repository
│  │  │  ├─ comments.queryRepository.ts
│  │  │  └─ comments.repository.ts
│  │  ├─ routes
│  │  │  ├─ comments.router.ts
│  │  │  └─ handlers
│  │  │     ├─ deleteCommentById.handler.ts
│  │  │     ├─ getCommentById.handler.ts
│  │  │     └─ updateCommentById.handler.ts
│  │  └─ validation
│  │     └─ commentInput.validation.ts
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
│  │     ├─ id.ts
│  │     ├─ index.d.ts
│  │     ├─ paginated.output.ts
│  │     ├─ pagination-and-sorting.ts
│  │     ├─ paramsIds.ts
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
│  │  ├─ input
│  │  │  ├─ dto
│  │  │  │  ├─ postBlogInputModel.ts
│  │  │  │  └─ postInputModel.ts
│  │  │  ├─ post-query.input.ts
│  │  │  ├─ post-sort-fields.ts
│  │  │  └─ post.ts
│  │  ├─ mappers
│  │  │  ├─ map-from-post-db-type-to-view-model.ts
│  │  │  ├─ map-from-post-domain-to-post-paginated-output.ts
│  │  │  └─ map-from-post-input-dto-to-db-type.ts
│  │  ├─ output
│  │  │  ├─ post-data.output.ts
│  │  │  └─ post-list-paginator.output.ts
│  │  ├─ repositories
│  │  │  ├─ posts.queryRepository.ts
│  │  │  └─ posts.repository.ts
│  │  ├─ routes
│  │  │  ├─ handlers
│  │  │  │  ├─ createCommentForSpecificPost.handler.ts
│  │  │  │  ├─ createPost.handler.ts
│  │  │  │  ├─ deletePostById.handler.ts
│  │  │  │  ├─ getCommentListForSpecificPost.handler.ts
│  │  │  │  ├─ getPostById.handler.ts
│  │  │  │  ├─ getPostList.handler.ts
│  │  │  │  └─ updatePostById.handler.ts
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
│     ├─ input
│     │  ├─ domain
│     │  │  ├─ emailConfirmationType.ts
│     │  │  └─ iUserDb.ts
│     │  ├─ dto
│     │  │  └─ userInputModel.ts
│     │  ├─ user-query.input.ts
│     │  └─ user-sort-fields.ts
│     ├─ mappers
│     │  ├─ mapToUserListPaginatedOutput.ts
│     │  ├─ mapUserDomainToMeViewModel.ts
│     │  ├─ mapUserDomaiToViewModel.ts
│     │  └─ mapUserInputToIDbType.ts
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
   │  ├─ comments
   │  │  └─ comments.e2e.spec.ts
   │  ├─ posts
   │  │  ├─ posts-body-validation.e2e.spec.ts
   │  │  └─ posts.e2e.spec.ts
   │  └─ users
   │     ├─ users-body-validation.e2e.spec.ts
   │     └─ users.e2e.spec.ts
   ├─ jest.setup.ts
   └─ utils
      ├─ auth
      │  └─ authDto.ts
      ├─ blogs
      │  ├─ blogDto.ts
      │  ├─ createBlogDto.ts
      │  ├─ getBlogById.ts
      │  └─ updateBlogById.ts
      ├─ clearDb.ts
      ├─ comments
      │  ├─ commentDto.ts
      │  └─ createCommentDto.ts
      ├─ generateBasicAuthToken.ts
      ├─ generateJwt.ts
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