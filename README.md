
```
02-bloger-patform
├─ jest.config.js
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ README.md
├─ src
│  ├─ compostion-root.ts
│  ├─ core
│  │  ├─ exceptions
│  │  │  ├─ app-errors.exeption.ts
│  │  │  └─ error.handler.ts
│  │  ├─ helpers
│  │  │  └─ catchAsync.helper.ts
│  │  ├─ mappers
│  │  │  └─ map-to-paginated-output.ts
│  │  ├─ middlewares
│  │  │  ├─ rateLimiter
│  │  │  │  ├─ infrastructure
│  │  │  │  │  ├─ rateLimit.repository.ts
│  │  │  │  │  └─ types
│  │  │  │  │     └─ apiRequestsLog.ts
│  │  │  │  └─ rateLimit.middleware.ts
│  │  │  └─ validation
│  │  │     ├─ input-validation-result.middleware.ts
│  │  │     ├─ params-id.validation.middleware.ts
│  │  │     ├─ params-uuid.validation.middleware.ts
│  │  │     ├─ query-pagination-sorting.validation.middleware.ts
│  │  │     └─ sanitize-query.middleware.ts
│  │  └─ types
│  │     ├─ codeNames.ts
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
│  │  ├─ indexes.ts
│  │  └─ mongoose.db.ts
│  ├─ index.ts
│  ├─ modules
│  │  ├─ auth
│  │  │  ├─ adapters
│  │  │  │  ├─ bcrypt.services.ts
│  │  │  │  ├─ emailExamples.ts
│  │  │  │  ├─ jwt.services.ts
│  │  │  │  └─ nodemailer.services.ts
│  │  │  ├─ api
│  │  │  │  ├─ auth.controller.ts
│  │  │  │  ├─ auth.router.ts
│  │  │  │  ├─ guards
│  │  │  │  │  ├─ access-token.guard.middleware.ts
│  │  │  │  │  └─ super-admin.guard.middleware.ts
│  │  │  │  ├─ input
│  │  │  │  │  ├─ authCookies.ts
│  │  │  │  │  ├─ dto
│  │  │  │  │  │  ├─ loginInputModel.ts
│  │  │  │  │  │  ├─ newPasswordRecoveryInputModel.ts
│  │  │  │  │  │  ├─ passwordRecoveryInputModel.ts
│  │  │  │  │  │  ├─ registrationConfirmationCodeInputModel.ts
│  │  │  │  │  │  └─ registrationEmailResendingInputModel.ts
│  │  │  │  │  └─ jwtPayloadSessions.ts
│  │  │  │  └─ output
│  │  │  │     ├─ accessToken-output.type.ts
│  │  │  │     └─ me-output.type.ts
│  │  │  ├─ application
│  │  │  │  ├─ auth.serviceHelpers.ts
│  │  │  │  └─ auth.services.ts
│  │  │  ├─ constants
│  │  │  │  └─ auth.paths.ts
│  │  │  ├─ domain
│  │  │  │  └─ session.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ sessions.queryRepository.ts
│  │  │  │  └─ sessions.repository.ts
│  │  │  └─ validation
│  │  │     ├─ codeInput.validation.ts
│  │  │     ├─ loginInput.validation.ts
│  │  │     └─ newPasswordRecoveryInput.validation.ts
│  │  ├─ blogs
│  │  │  ├─ api
│  │  │  │  ├─ blogs.controller.ts
│  │  │  │  ├─ blogs.router.ts
│  │  │  │  ├─ input
│  │  │  │  │  ├─ blog-query.input.ts
│  │  │  │  │  ├─ blog-sort-field.ts
│  │  │  │  │  └─ dto
│  │  │  │  │     └─ blogInputModel.ts
│  │  │  │  └─ output
│  │  │  │     ├─ blog-data.output.ts
│  │  │  │     └─ blog-list-paginator.output.ts
│  │  │  ├─ application
│  │  │  │  └─ blogs.services.ts
│  │  │  ├─ constants
│  │  │  │  └─ blogs.paths.ts
│  │  │  ├─ domain
│  │  │  │  └─ blog.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ blogs.queryRepository.ts
│  │  │  │  └─ blogs.repository.ts
│  │  │  ├─ mappers
│  │  │  │  ├─ map-from-blog-db-type-to-view-model.ts
│  │  │  │  ├─ map-from-blog-domain-to-blog-list-paginated-output.ts
│  │  │  │  └─ map-from-blog-input-dto-to-db-type.ts
│  │  │  └─ validation
│  │  │     └─ blog-input.validation.middleware.ts
│  │  ├─ comments
│  │  │  ├─ api
│  │  │  │  ├─ comments.controller.ts
│  │  │  │  ├─ comments.router.ts
│  │  │  │  ├─ input
│  │  │  │  │  ├─ commentQueryInput.ts
│  │  │  │  │  ├─ commentSortFields.ts
│  │  │  │  │  └─ dto
│  │  │  │  │     └─ commentInputModel.ts
│  │  │  │  └─ output
│  │  │  │     ├─ commentatorInfo.ts
│  │  │  │     ├─ commentListPaginatorOutput.ts
│  │  │  │     └─ commentViewModel.ts
│  │  │  ├─ application
│  │  │  │  └─ comments.services.ts
│  │  │  ├─ constants
│  │  │  │  └─ comments.paths.ts
│  │  │  ├─ domain
│  │  │  │  └─ comment.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ comments.queryRepository.ts
│  │  │  │  └─ comments.repository.ts
│  │  │  ├─ mappers
│  │  │  │  ├─ mapFromCommentDbTypeToViewModel.ts
│  │  │  │  └─ mapFromCommentDomainToPaginatedOutput.ts
│  │  │  └─ validation
│  │  │     └─ commentInput.validation.ts
│  │  ├─ posts
│  │  │  ├─ api
│  │  │  │  ├─ input
│  │  │  │  │  ├─ dto
│  │  │  │  │  │  ├─ postBlogInputModel.ts
│  │  │  │  │  │  └─ postInputModel.ts
│  │  │  │  │  ├─ post-query.input.ts
│  │  │  │  │  └─ post-sort-fields.ts
│  │  │  │  ├─ output
│  │  │  │  │  ├─ post-data.output.ts
│  │  │  │  │  └─ post-list-paginator.output.ts
│  │  │  │  ├─ posts.controller.ts
│  │  │  │  └─ posts.router.ts
│  │  │  ├─ application
│  │  │  │  └─ posts.services.ts
│  │  │  ├─ constants
│  │  │  │  └─ posts.paths.ts
│  │  │  ├─ domain
│  │  │  │  └─ post.ts
│  │  │  ├─ infrastructure
│  │  │  │  ├─ posts.queryRepository.ts
│  │  │  │  └─ posts.repository.ts
│  │  │  ├─ mappers
│  │  │  │  ├─ map-from-post-db-type-to-view-model.ts
│  │  │  │  ├─ map-from-post-domain-to-post-paginated-output.ts
│  │  │  │  └─ map-from-post-input-dto-to-db-type.ts
│  │  │  └─ validation
│  │  │     └─ post-input.validation.middleware.ts
│  │  ├─ securityDevices
│  │  │  ├─ api
│  │  │  │  ├─ output
│  │  │  │  │  └─ sercurityDevicesViewModel.ts
│  │  │  │  ├─ securityDevices.controller.ts
│  │  │  │  └─ securityDevices.router.ts
│  │  │  ├─ application
│  │  │  │  ├─ commands
│  │  │  │  │  └─ securityDevices.services.ts
│  │  │  │  └─ queries
│  │  │  │     └─ securityDevices.queryServices.ts
│  │  │  ├─ constants
│  │  │  │  └─ securityDevices.paths.ts
│  │  │  └─ mappers
│  │  │     ├─ mapActiveSessionDevicesFromDbToViewModel.ts
│  │  │     └─ mapActiveSessionDevicesListFromDbToViewModel.ts
│  │  └─ users
│  │     ├─ api
│  │     │  ├─ input
│  │     │  │  ├─ dto
│  │     │  │  │  └─ userInputModel.ts
│  │     │  │  ├─ user-query.input.ts
│  │     │  │  └─ user-sort-fields.ts
│  │     │  ├─ output
│  │     │  │  ├─ userListPaginatorOutput.ts
│  │     │  │  └─ userViewModel.ts
│  │     │  ├─ users.controller.ts
│  │     │  └─ users.router.ts
│  │     ├─ application
│  │     │  └─ users.services.ts
│  │     ├─ constants
│  │     │  └─ users.paths.ts
│  │     ├─ domain
│  │     │  ├─ emailConfirmationType.ts
│  │     │  ├─ iUserDb.ts
│  │     │  └─ passwordRecoveryType.ts
│  │     ├─ infrastructure
│  │     │  ├─ user.queryRepository.ts
│  │     │  └─ user.repository.ts
│  │     ├─ mappers
│  │     │  ├─ mapToUserListPaginatedOutput.ts
│  │     │  ├─ mapUserDomainToMeViewModel.ts
│  │     │  ├─ mapUserDomaiToViewModel.ts
│  │     │  └─ mapUserInputToIDbType.ts
│  │     └─ validation
│  │        └─ user-input.validation.ts
│  ├─ settings
│  │  └─ config.ts
│  ├─ setup-app.ts
│  └─ testing
│     ├─ constants
│     │  └─ testing.paths.ts
│     └─ routers
│        ├─ handlers
│        │  └─ testingDeleteAllData.handler.ts
│        └─ testing.router.ts
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
   │  ├─ securityDevices
   │  │  └─ sesurityDevices.e2e.spec.ts
   │  └─ users
   │     ├─ users-body-validation.e2e.spec.ts
   │     └─ users.e2e.spec.ts
   ├─ integration
   │  ├─ auth
   │  │  ├─ authService.test.ts
   │  │  └─ authServiceHelpers.test.ts
   │  ├─ securityDevices
   │  └─ utils
   │     └─ testRegisterAndLoginUser.ts
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