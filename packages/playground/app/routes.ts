import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("chat", "routes/chat.tsx"),
  route("image", "routes/image.tsx"),
  route("embedding", "routes/embedding.tsx"),
] satisfies RouteConfig;
