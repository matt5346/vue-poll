import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    redirect: { name: "error" }
  },
  {
    path: "/question/:id",
    name: "question",
    component: HomeView
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import(/* webpackChunkName: "admin" */ "../views/AdminView.vue")
  },
  {
    path: "/:pathMatch(.*)*",
    name: "error",
    component: () => import(/* webpackChunkName: "error" */ "../views/ErrorView.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
