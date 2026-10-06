export const POSTS_PATH = "/posts";

export const POSTS_ROUTES = {
  ROOT: "",
  BY_ID: "/:id",
  BY_POST_ID: "/:postId",
  LIKE_STATUS: '/like-status'
} as const;
