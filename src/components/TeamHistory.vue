<script>
import axios from 'axios';
import Loading from './shared/Loading.vue';
import TeamPlayers from './TeamPlayers.vue';
import TeamHistoryTable from './tables/team/TeamHistoryTable.vue';
import PointsScoredKpi from './kpis/team/PointsScoredKpi.vue';
import PointsAllowedKpi from './kpis/team/PointsAllowedKpi.vue';
import RushYardsKpi from './kpis/team/RushYardsKpi.vue';
import RushYardsAllowedKpi from './kpis/team/RushYardsAllowedKpi.vue';
import PassYardsKpi from './kpis/team/PassYardsKpi.vue';
import PassYardsAllowedKpi from './kpis/team/PassYardsAllowedKpi.vue';
import PointsChart from './charts/team/PointsChart.vue';


export default {
  data() {
    return {
        dataLoaded: false,
        teams: null,
        teamHistory: [],
        teamAbbrev: null,
        teamWins: null,
        teamLosses: null,
        upcomingWeek: null,
        nextOpponent: null,
        nextOpponentAbbrev: null,
        nextOpponentHomeOrAway: null,       
        nextOpponentWins: null,
        nextOpponentLosses: null,
        showBenchQBs: false,
        showBenchRBs: false,
        showBenchWRs: false,
    };
  },
  computed: {
    teamComputed() {
        return this.$route.params.team;
    },
  },
  watch: {
    teamComputed(newTeam, oldTeam) {
      this.teamHistory = [];
        if (newTeam !== oldTeam) {
          this.dataLoaded = false;
          this.fetchData();
        }
    }
  },    
  mounted() {
    this.fetchData();
  },
  methods: {
    toggleBenchQBs() {
      this.showBenchQBs = !this.showBenchQBs;
    },
    toggleBenchRBs() {
      this.showBenchRBs = !this.showBenchRBs;
    },
    toggleBenchWRs() {
      this.showBenchWRs = !this.showBenchWRs;
    },    
    async fetchData() {
      await Promise.all([
            this.fetchTeamHistory(),
        ]);
        console.log("fetch team history done..");
        this.dataLoaded = true;        
    },
    fetchTeamHistory() {
      return new Promise((resolve,reject) => {
        axios.get('http://127.0.0.1:3000/Schedule')
              .then(response => {
              this.teams = response.data; 
              for (let i = 0; i < this.teams.length; i++) {
                  if (this.teams[i]["Team Final"] == this.teamComputed) {
                      this.teamAbbrev = this.teams[i]["Team Abbrev"];
                      this.teamWins = this.teams[i]["Team Wins"];
                      this.teamLosses = this.teams[i]["Team Losses"];
                      this.upcomingWeek = this.teams[i]["Week"];
                      this.nextOpponent = this.teams[i]["Opponent Final"];
                      this.nextOpponentAbbrev = this.teams[i]["Opponent Abbrev"];
                      this.nextOpponentHomeOrAway = this.teams[i]["Home or Away"];
                      this.nextOpponentWins = this.teams[i]["Opponent Wins"];
                      this.nextOpponentLosses = this.teams[i]["Opponent Losses"];
                      break;
                  }
              }
              let promises = []
              promises.push(
              axios.get('http://127.0.0.1:3000/TeamHistory/' + this.teamComputed)
                  .then(response => {
                      this.teamHistory = response.data;
                      for (let i = 0; i < this.teamHistory.length; i++) {
                          if (this.teamHistory[i]["Home/Away Game"] == "Home") {
                              this.teamHistory[i]["Home/Away"] = this.teamAbbrev;
                          } else {
                              this.teamHistory[i]["Home/Away"] = "@" + this.teamHistory[i]["Opponent Abbreviation"];
                          }

                          if (parseInt(this.teamHistory[i]['Points Scored']) > parseInt(this.teamHistory[i]['Points Allowed'])) {
                              this.teamHistory[i]["Win/Loss"] = "Won"
                          } else if (parseInt(this.teamHistory[i]['Points Scored']) < parseInt(this.teamHistory[i]['Points Allowed'])) {
                              this.teamHistory[i]['Win/Loss'] = "Lost"
                          } else {
                              this.teamhistory[i]['Win/Loss'] = "Tie"
                          }
                      }
                  })
                  .catch(error => {
                      console.error('Error fetching data:', error);
                  }))
              Promise.all(promises)
                    .then(() => {
                        console.log("all promises done");
                        resolve(this.teamHistory);
                    })
                    .catch(error => {
                        console.error('Error waiting for promises:', error);
                        reject(error);
                    });                  
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
      });
    },
  },
  components: {
    Loading,
    TeamPlayers,
    TeamHistoryTable,
    PointsScoredKpi,
    PointsAllowedKpi,
    RushYardsKpi,
    PassYardsKpi,
    RushYardsAllowedKpi,
    PassYardsAllowedKpi,
    PointsChart,
  }
};
</script>
  
<template>

    <div id="team_history" class="body" v-if="dataLoaded">
      <div id="heading">
        <h1 class="center"> 
          <span class="team-name" :id="'team-name-' + teamComputed.replace('Commanders', 'Command').replace('Raiders', 'Raid').slice(-4)">{{ teamComputed }}</span>
           ({{ teamWins }}-{{ teamLosses }})
        </h1>
        <h2 class="center">
        <span v-if="nextOpponentHomeOrAway == 'Home'">vs </span>
        <span v-else>@</span> 
        <router-link :to="{ name: 'team-detail-history', params: { team:nextOpponent} }">{{nextOpponentAbbrev }} ({{ nextOpponentWins }}-{{ nextOpponentLosses }})</router-link> in week {{ upcomingWeek }}
        </h2> 
      </div>

      <div class="team-history-kpis">
        <PointsScoredKpi :teamHistory="teamHistory"></PointsScoredKpi>
        <PointsAllowedKpi :teamHistory="teamHistory"></PointsAllowedKpi>
        <RushYardsKpi :teamHistory="teamHistory"></RushYardsKpi>
        <PassYardsKpi :teamHistory="teamHistory"></PassYardsKpi>
        <RushYardsAllowedKpi :teamHistory="teamHistory"></RushYardsAllowedKpi>
        <PassYardsAllowedKpi :teamHistory="teamHistory"></PassYardsAllowedKpi>
      </div>

      <div class="spreadsheet-table-wrapper">
        <div class="team-history-table" v-if="dataLoaded && teamHistory.length > 0">
            <TeamHistoryTable :teamHistory="teamHistory"></TeamHistoryTable>
        </div>
      </div>

      <h2 class="center">Charts</h2>
      <div>
        <PointsChart :team="teamComputed" :teamHistory="teamHistory"></PointsChart>
      </div>

      <h2 class="center team-players-header">Players on the {{ teamComputed }}</h2>
      <div class="spreadsheet-table-wrapper">
        <div class="team-players-div" v-if="dataLoaded">
          <h2>Starting QB</h2>
          <TeamPlayers :position="'starting_qb'"/>
          <h2>Top Rushers</h2>
          <TeamPlayers :position="'starting_rb'"/>
          <h2>Top Receivers</h2>
          <TeamPlayers :position="'starting_wr'"/>

          <h2 class="team-players-bench" @click="toggleBenchQBs()">
            <span class="team-players-bench-arrow" :class="{ 'arrow-rotated': showBenchQBs }"><font-awesome-icon :icon="['fas', 'square-caret-right']" /></span>
              Other QBs
          </h2>
            <TeamPlayers v-if="showBenchQBs" :position="'bench_qb'"/>

          <h2 class="team-players-bench" @click="toggleBenchRBs()">
            <span class="team-players-bench-arrow" :class="{ 'arrow-rotated': showBenchRBs }"><font-awesome-icon :icon="['fas', 'square-caret-right']" /></span>
              Other Rushers
          </h2>
            <TeamPlayers v-if="showBenchRBs" :position="'bench_rb'"/>

          <h2 class="team-players-bench" @click="toggleBenchWRs()">
            <span class="team-players-bench-arrow" :class="{ 'arrow-rotated': showBenchWRs }"><font-awesome-icon :icon="['fas', 'square-caret-right']" /></span>
              Other Receivers
          </h2>
            <TeamPlayers v-if="showBenchWRs" :position="'bench_wr'"/>

        </div>
      </div>
  
    </div>

    <div v-else>
        <Loading />
    </div>
</template>

