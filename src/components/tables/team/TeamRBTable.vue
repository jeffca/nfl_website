<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "StartingRBTable",
    data() {
        return {
            dataLoaded: false,
        }
    },
    props: {
        rbs: {
            type: Array,
            required: true,
        },
    },    
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
        if (this.rbs) {
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
<div v-if="rbs">
    <table class="spreadsheet-table team-players-table">
    
        <th>Games Played</th>
        <th>Player</th>
        <th>Total Rush Yards</th>
        <th>Avg Rush Yards</th>
        <th>Total Rush TDs</th>
        <th>Avg Rush TDs</th>
        <th>Total Carries</th>
        <th>Avg Carries</th>
        <th>Avg Pct of Team Carries</th>
        <th>Avg Pct of Team Rush Yards</th>

        <!-- these are the starting RBs, i.e. the 2 RBs with the most unique games in Team_Players pivot -->
        <tr v-for="rb in rbs">
            <td>{{rb["COUNTUNIQUE of Game ID"]}}</td>
            <td><router-link :to="{ name: 'player-history', params: { player:rb['Player'] }, query: { stat:'rushing' }}">{{rb["Player"]}}</router-link></td>
            <td>{{rb["SUM of Yds"]}}</td>
            <td>{{rb["AVERAGE of Yds"]}}</td>            
            <td>{{rb["SUM of TD"]}}</td>
            <td>{{rb["AVERAGE of TD"]}}</td>
            <td>{{rb["SUM of Att"]}}</td>
            <td>{{rb["AVERAGE of Att"]}}</td>
            <td>{{rb["AVERAGE of % of Attempt Total"]}}</td>
            <td>{{rb["AVERAGE of % of Total Rush Yards in Game"]}}</td>
        </tr>

    </table>
</div>
</template>