/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import * as VueRouter from "vue-router";
import GameComponent from "@/components/GameComponent.vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Home from "@/components/Home.vue";
import About from "@/components/About.vue";

// const Home = { template: "<div>Home</div>" };
// const GameComponent = { template: "<div>Game</div>" };
// const About = { template: "<div>About</div>" };

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
  { path: "/", components: { header: Header, default: Home, footer: Footer } },
  { path: "/game", component: GameComponent },
  { path: "/about", component: About },
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHashHistory(),
  routes, // short for `routes: routes`
});

const app = createApp(App);

app.use(router);

app.mount("#app");
