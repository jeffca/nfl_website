<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "StartingQBTable",
    data() {
        return {
            dataLoaded: false,
        }
    },
    props: {
        qbs: {
            type: [Array,Object],
            required: true,
            default: function() {
                if (typeof this.qbs === 'object') {
                    return {};
                } else {
                    return [];
                }
            }
        },
    },    
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
        console.log(this.qbs.length);
        if (this.qbs) {
            console.log(this.qbs);
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
    <!-- when the starting QB is sent, it is one object. the length of this object is undefined. when the bench QB(s) are sent,
         it is generally an array but could also be an object when there is only one bench QB (an object with one index) -->
<div v-if="typeof qbs === 'object' && qbs.length === undefined">
    <table class="spreadsheet-table team-players-table">
        
        <th>Games Played</th>
        <th>Player</th>
        <th>Total Yards</th>
        <th>Avg Pass Yards</th>
        <th>Total TDs</th>
        <th>Avg TDs</th>
        <th>Total INTs</th>
        <th>Avg INTs</th>
        <th>Avg Pass Attempts</th>
        <th>Avg Completions</th>
        <th>Avg Completion Pct.</th>

        <!-- this is the starting QB, i.e. the quarterback with the most unique games in Team_Players pivot -->
        <tr>
            <td>{{qbs["COUNTUNIQUE of Game ID"]}}</td>
            <td><router-link :to="{ name: 'player-history', params: { player:qbs['Player'] }, query: {stat:'passing' }}">{{qbs["Player"]}}</router-link></td>
            <td>{{qbs["SUM of Yds"]}}</td>
            <td>{{qbs["AVERAGE of Yds"]}}</td>
            <td>{{qbs["SUM of TD"]}}</td>
            <td>{{qbs["AVERAGE of TD"]}}</td>
            <td>{{qbs["SUM of Int"]}}</td>
            <td>{{qbs["AVERAGE of Int"]}}</td>
            <td>{{qbs["AVERAGE of Att"]}}</td>
            <td>{{qbs["AVERAGE of Cmp"]}}</td>
            <td>{{qbs["AVERAGE of Completion %"]}}</td>
        </tr>
    </table>
</div>
<div v-else-if="qbs.length > 0">
    <table class="spreadsheet-table team-players-table">
    
        <th>Games Played</th>
        <th>Player</th>
        <th>Total Yards</th>
        <th>Avg Pass Yards</th>
        <th>Total TDs</th>
        <th>Avg TDs</th>
        <th>Total INTs</th>
        <th>Avg INTs</th>
        <th>Avg Pass Attempts</th>
        <th>Avg Completions</th>
        <th>Avg Completion Pct.</th>

        <!-- this is the starting QB, i.e. the quarterback with the most unique games in Team_Players pivot -->
        <tr v-for="qb in qbs">
            <td>{{qb["COUNTUNIQUE of Game ID"]}}</td>
            <td><router-link :to="{ name: 'player-history', params: { player:qb['Player'] }, query: {stat:'passing' }}">{{qb["Player"]}}</router-link></td>
            <td>{{qb["SUM of Yds"]}}</td>
            <td>{{qb["AVERAGE of Yds"]}}</td>
            <td>{{qb["SUM of TD"]}}</td>
            <td>{{qb["AVERAGE of TD"]}}</td>
            <td>{{qb["SUM of Int"]}}</td>
            <td>{{qb["AVERAGE of Int"]}}</td>
            <td>{{qb["AVERAGE of Att"]}}</td>
            <td>{{qb["AVERAGE of Cmp"]}}</td>
            <td>{{qb["AVERAGE of Completion %"]}}</td>
        </tr>
    </table>
</div>
</template>