import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RegisterView from "../views/RegisterView.vue";
import ChatsView from "../views/chats/ChatsView.vue";
import ChatsLayout from "../layouts/ChatLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/chats",
      name: "chats",
      component: ChatsLayout,
      children: [
        {
          name: "ChatsView",
          path: '',
          component: ChatsView,
          props: route => ({ activeChat: route.params.activeChat }),
        }
      ],
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (to.meta.requiresAuth && !isAuthenticated) {
    alert("Sessione scaduta! Effettuta il login.")
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    next("/");
  } else {
    if (to.name === "home" && isAuthenticated) {
      next("/chats");
    } else {
      next();
    }
  }
});

export default router;
