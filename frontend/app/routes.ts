import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "./Authentication/Login/login.tsx"),
  route("signup", "./Authentication/Signup/signup.tsx"),

  route("", "./Layout/ProtectedRoute.tsx", [
    route("home", "./routes/home.tsx"),        
    route("home/new", "./components/Newchat/Newchat.tsx"),    
    route("home/:id", "./components/HistoryChat/HistoryChat.tsx"),   
  ]),
];
