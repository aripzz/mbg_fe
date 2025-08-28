import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import App from "./App.vue";
import "./style.css";
import ApiService from "./services/api.js";

// Import views
import Login from "./views/Login.vue";
import Dashboard from "./views/Dashboard.vue";
import Wilayah from "./views/Wilayah.vue";

// // Authentication guard
// const requireAuth = (to, from, next) => {
//   if (ApiService.isAuthenticated()) {
//     next()
//   } else {
//     next('/login')
//   }
// }

// // Guest guard (redirect to dashboard if already logged in)
// const requireGuest = (to, from, next) => {
//   if (ApiService.isAuthenticated()) {
//     next('/dashboard')
//   } else {
//     next()
//   }
// }

// Authentication guard
const requireAuth = (to, from, next) => {
  const isAuth = ApiService.isAuthenticated();

  if (isAuth) {
    next();
  } else {
    console.warn("[requireAuth] Access denied. Redirecting to /login");
    next("/login");
  }
};

// Guest guard (redirect to dashboard if already logged in)
const requireGuest = (to, from, next) => {
  const isAuth = ApiService.isAuthenticated();

  if (isAuth) {
    next("/dashboard");
  } else {
    next();
  }
};

// Define routes
const routes = [
  {
    path: "/",
    redirect: () => {
      return ApiService.isAuthenticated() ? "/dashboard" : "/login";
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: requireGuest,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: requireAuth,
  },
  {
    path: "/wilayah",
    name: "Wilayah",
    component: Wilayah,
    beforeEnter: requireAuth,
  },
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("auth_token");

  const auth = ApiService.isAuthenticated();

  if (token && !auth) {
    ApiService.clearAuth();
  }
  next();
});

// Create and mount app
const app = createApp(App);
app.use(router);
app.use(VueGoogleMaps, {
  load: {
    // key: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
    key: "AIzaSyDpGqjV40bMx7L8dVnypclnHpPxBaQUK3o",
  },
});
app.mount("#app");
