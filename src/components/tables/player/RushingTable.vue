<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "PlayerRushingTable",
    data() {
        return {
            dataLoaded: false,
            weeks: [],
            carries: [],
            rushYds: [],
            rushTDs: [],
            pctTeamTotalCarries: [],
            pctTeamTotalRushYards: [],
        }
    },
    props: {
        rushingStats: {
            type: Array,
            required: true,
        },
    },    
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
        for (let i = 0; i < this.rushingStats.length; i++) {
            if (this.rushingStats[i]["Home or Away"] == "Home") {
                this.weeks.push("Week " + this.rushingStats[i]["Week Number"] + " vs " + this.rushingStats[i]["Opponent Abbreviation"]);
            } else {
                this.weeks.push("Week " + this.rushingStats[i]["Week Number"] + " @" + this.rushingStats[i]["Opponent Abbreviation"]);
            }
            this.carries.push(this.rushingStats[i]["SUM of Att"]);
            this.rushYds.push(this.rushingStats[i]["SUM of Yds"]);
            this.rushTDs.push(this.rushingStats[i]["SUM of TD"]);
            this.pctTeamTotalCarries.push(this.rushingStats[i]["SUM of % of Attempt Total"]);
            this.pctTeamTotalRushYards.push(this.rushingStats[i]["SUM of % of Total Rush Yards in Game"]);
        }
        this.weeks.reverse();
        this.carries.reverse();
        this.rushYds.reverse();
        this.rushTDs.reverse();
        this.pctTeamTotalCarries.reverse();
        this.pctTeamTotalRushYards.reverse();

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
            <th>Carries</th>
            <th>Rush Yards</th>
            <th>Rush TDs</th>
            <th>Pct. of Team Total Carries</th>
            <th>Pct. of Team Total Rush Yards</th>  

            <tr v-for="(week,index) in weeks" :key="index">
                <td>{{ week }}</td>
                <td>{{ carries[index] }}</td>
                <td>{{ rushYds[index] }}</td>
                <td>{{ rushTDs[index] }}</td>
                <td>{{ pctTeamTotalCarries[index] }}</td>
                <td>{{ pctTeamTotalRushYards[index] }}</td>
            </tr>
        </table>
    </div>
</template>