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

const routes = [
  { path: "/", components: { header: Header, default: Home, footer: Footer } },
  { path: "/game", component: GameComponent },
  { path: "/about", component: About },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

const app = createApp(App);

app.use(router);

app.mount("#app");
