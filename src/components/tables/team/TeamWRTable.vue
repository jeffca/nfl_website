<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "StartingWRTable",
    data() {
        return {
            dataLoaded: false,
        }
    },
    props: {
        wrs: {
            type: Array,
            required: true,
        },
    },    
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
        if (this.wrs) {
            this.dataLoaded = true;
        }
    }
  },
  components: {
    Loading,
  },
};
</script>


<template>
<div v-if="wrs">
    <table class="spreadsheet-table team-players-table">
    
        <th>Games Played</th>
        <th>Player</th>
        <th>Total Receiving Yards</th>
        <th>Avg Receiving Yards</th>
        <th>Total Targets</th>
        <th>Avg Targets</th>
        <th>Total Receptions</th>
        <th>Avg Receptions</th>
        <th>Total Receiving TDs</th>
        <th>Avg Receiving TDs</th>
        <th>Avg Pct. of Total Targets</th>
        <th>Avg Pct. of Total Pass Yards</th>

        <!-- these are the starting WRs, i.e. the 3 WRs with the most unique games in Team_Players pivot -->
        <tr v-for="wr in wrs">
            <td>{{wr["COUNTUNIQUE of Game ID"]}}</td>
            <td><router-link :to="{ name: 'player-history', params: { player:wr['Player'] }, query: { stat:'receiving' }}">{{wr["Player"]}}</router-link></td>
            <td>{{wr["SUM of Yds"]}}</td>
            <td>{{wr["AVERAGE of Yds"]}}</td>
            <td>{{wr["SUM of Tar"]}}</td>
            <td>{{wr["AVERAGE of Tar"]}}</td>
            <td>{{wr["SUM of Rec"]}}</td>       
            <td>{{wr["AVERAGE of Rec"]}}</td>
            <td>{{wr["SUM of TD"]}}</td>
            <td>{{wr["AVERAGE of TD"]}}</td>
            <td>{{wr["AVERAGE of % of Total Targets"]}}</td>
            <td>{{wr["AVERAGE of % of Total Yards in Game"]}}</td>
        </tr>             
    </table>
</div>
</template>