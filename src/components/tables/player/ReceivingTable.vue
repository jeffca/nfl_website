<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "PlayerRushingTable",
    data() {
        return {
            dataLoaded: false,
            weeks: [],
            targets: [],
            receptions: [],
            receivingYds: [],
            receivingTDs: [],
            pctTeamTotalTargets: [],
            pctTeamTotalPassYards: [],
        }
    },
    props: {
        receivingStats: {
            type: Array,
            required: true,
        },
    },    
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
        for (let i = 0; i < this.receivingStats.length; i++) {
            if (this.receivingStats[i]["Home or Away"] == "Home") {
                this.weeks.push("Week " + this.receivingStats[i]["Week Number"] + " vs " + this.receivingStats[i]["Opponent Abbreviation"]);
            } else {
                this.weeks.push("Week " + this.receivingStats[i]["Week Number"] + " @" + this.receivingStats[i]["Opponent Abbreviation"]);
            }
            this.targets.push(this.receivingStats[i]["SUM of Tar"]);
            this.receptions.push(this.receivingStats[i]["SUM of Rec"]);
            this.receivingYds.push(this.receivingStats[i]["SUM of Yds"]);
            this.receivingTDs.push(this.receivingStats[i]["SUM of TD"]);
            this.pctTeamTotalTargets.push(this.receivingStats[i]["SUM of % of Total Targets"]);
            this.pctTeamTotalPassYards.push(this.receivingStats[i]["SUM of % of Total Yards in Game"]);
        }
        this.weeks.reverse();
        this.targets.reverse();
        this.receptions.reverse();
        this.receivingYds.reverse();
        this.receivingTDs.reverse();
        this.pctTeamTotalTargets.reverse();
        this.pctTeamTotalPassYards.reverse();

        this.dataLoaded = true;
    }
  },
  components: {
    Loading,
  },
};

</script>

<template>
    <div class="player-history-stats-table">
        <table class="spreadsheet-table">
            <th>Week</th>
            <th>Targets</th>
            <th>Receptions</th>
            <th>Receiving Yards</th>
            <th>Receiving TDs</th>
            <th>Pct. of Team Total Targets</th>
            <th>Pct. of Team Total Pass Yards</th>  

            <tr v-for="(week,index) in weeks" :key="index">
                <td>{{ week }}</td>
                <td>{{ targets[index] }}</td>
                <td>{{ receptions[index] }}</td>
                <td>{{ receivingYds[index] }}</td>
                <td>{{ receivingTDs[index] }}</td>
                <td>{{ pctTeamTotalTargets[index] }}</td>
                <td>{{ pctTeamTotalPassYards[index] }}</td>
            </tr>
        </table>
    </div>
</template>