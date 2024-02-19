<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "UpcomingGameTeamStatsTable",
    inject: [
      'homeTeamStatsColumns', 
      'homeTeamHomeStatsColumns', 
      'awayTeamStatsColumns', 
      'awayTeamAwayStatsColumns',
      
      'homeTeamStatsColumnsMore',
      'homeTeamHomeStatsColumnsMore',
      'awayTeamStatsColumnsMore',
      'awayTeamAwayStatsColumnsMore',
      ],
    data() {
        return {
            dataLoaded: false,
            teamName: null,
            activeColumn: [],
            showTeamNames: true,
        }
    },
    props: {
        team: {
            type: Object,
            required: true,
        },
        columns: {
          type: String,
          required: true,
        }
    },    
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
        if (this.team) {
          // console.log(this.team);
            this.dataLoaded = true;
        }
        if (this.columns) {
          if (this.columns.includes("away")) {
            this.teamName = "Opponent";
            if (this.columns.includes("AwayStats")) {
              if (this.columns.includes("ColumnsMore")) {
                this.activeColumn = this.awayTeamAwayStatsColumnsMore;
                this.showTeamNames = false;
              } else {
                this.activeColumn = this.awayTeamStatsColumns;
              }
            } else {
              if (this.columns.includes("ColumnsMore")) {
                this.activeColumn = this.awayTeamStatsColumnsMore;
                this.showTeamNames = false;
              } else {
                this.activeColumn = this.awayTeamStatsColumns;
              }
            }
          } else {
            this.teamName = "Team";
            if (this.columns.includes("HomeStats")) {
              if (this.columns.includes("ColumnsMore")) {
                this.activeColumn = this.homeTeamHomeStatsColumnsMore;
                this.showTeamNames = false;
              } else {
                this.activeColumn = this.homeTeamStatsColumns;
              }
            } else {
                if (this.columns.includes("ColumnsMore")) {
                  this.activeColumn = this.homeTeamStatsColumnsMore;
                  this.showTeamNames = false;
                } else {
                  this.activeColumn = this.homeTeamStatsColumns;
                }
              }
          }
        }
    }
  },
  components: {
    Loading,
  },
};
</script>

<template>
    <table class="upcoming-games-table" v-if="teamName">
        <tr v-if="showTeamNames">
          <td colspan="2">
            <span class="upcoming-game-team center">
              <router-link :to="{ name: 'team-detail-history', params: { team:team[teamName + ' Final']} }">{{ team[teamName + ' Final'] }}</router-link> 
            </span>
            <br />
            <span class="upcoming-game-record">{{ team[teamName + ' Wins'] }}-{{ team[teamName + ' Losses'] }}</span>
          </td>
        </tr>

        <tr v-for="(stat,index) in team[columns]">
            <td  class="upcoming-game-column">{{ activeColumn[index] }}:</td>
            <td>{{ stat[0] }} (#{{ stat[1] }} in NFL)</td>
        </tr>
    </table>
</template>