import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(fas);


import App from './App.vue'
import Home from './components/Home.vue'
import RushingMatchups from './components/matchups/RushingMatchups.vue'
import PassingMatchups from './components/matchups/PassingMatchups.vue'
import LastWeekStars from './components/starplayers/LastWeekStars.vue'
import UpcomingGames from './components/UpcomingGames.vue'
import TeamHistory from './components/TeamHistory.vue'
import PlayerHistory from './components/PlayerHistory.vue'

const routes = [
    { path: '/', name:'home', component: Home },
    { path: '/UpcomingGames', name: 'UpcomingGames', component: UpcomingGames},
    { path: '/teams/:team/history', name: 'team-detail-history', component: TeamHistory, props: route => ({
       team: route.query.team,
      }) 
    },
    { path: '/players/:player', name: 'player-history', component: PlayerHistory, props: (route) => ({ 
      player: encodeURIComponent(route.params.player), 
      stat: route.query.stat }),
      // beforeEnter: (to,from,next) => {
      //   console.log('navigating to player history');
      //   console.log(to.params.player);
      //   next();
      // }
    },
    { path: '/RushingMatchups', name: 'RushingMatchups', component: RushingMatchups},
    { path: '/PassingMatchups', name: 'PassingMatchups', component: PassingMatchups},
    { path: '/Stars/LastWeek', name:'LastWeekStars', component: LastWeekStars},

];


const router = createRouter({
  history: createWebHashHistory(),
    mode: 'hash',
    routes,
});

const app = createApp(App);
app.use(router);

app.component('font-awesome-icon', FontAwesomeIcon);
app.use({
  install() {
    app.config.globalProperties.$fa = FontAwesomeIcon;
  }
});
app.mount('#app');