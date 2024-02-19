<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "PlayerPassingTable",
    data() {
        return {
            dataLoaded: false,
            weeks: [],
            passCompletions: [],
            passAttempts: [],
            passYards: [],
            passTds: [],
            passInts: [],
            sacks: [],
            sacksYards: [],
        }
    },
    props: {
        passingStats: {
            type: Array,
            required: true,
        },
    },    
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
        for (let i = 0; i < this.passingStats.length; i++) {
            if (this.passingStats[i]["Home or Away"] == "Home") {
                this.weeks.push("Week " + this.passingStats[i]["Week Number"] + " vs " + this.passingStats[i]["Opponent Abbreviation"]);
            } else {
                this.weeks.push("Week " + this.passingStats[i]["Week Number"] + " @" + this.passingStats[i]["Opponent Abbreviation"]);
            }
            this.passCompletions.push(this.passingStats[i]["SUM of Cmp"]);
            this.passAttempts.push(this.passingStats[i]["SUM of Att"]);
            this.passYards.push(this.passingStats[i]["SUM of Yds"]);
            this.passTds.push(this.passingStats[i]["SUM of TD"]);
            this.passInts.push(this.passingStats[i]["SUM of Int"]);
            this.sacks.push(this.passingStats[i]["SUM of Sack"]);
            this.sacksYards.push(this.passingStats[i]["SUM of Loss"]);
        }
        this.weeks.reverse();
        this.passCompletions.reverse();
        this.passAttempts.reverse();
        this.passYards.reverse();
        this.passTds.reverse();
        this.passInts.reverse();
        this.sacks.reverse();
        this.sacksYards.reverse();

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
            <th>Completions</th>
            <th>Attempts</th>
            <th>Pass Yards</th>
            <th>Pass TDs</th>
            <th>Interceptions</th>
            <th>Sacks</th>
            <th>Sack Yards Lost</th>            

            <tr v-for="(week,index) in weeks" :key="index">
                <td>{{ week }}</td>
                <td>{{ passCompletions[index] }}</td>
                <td>{{ passAttempts[index] }}</td>
                <td>{{ passYards[index] }}</td>
                <td>{{ passTds[index] }}</td>
                <td>{{ passInts[index] }}</td>
                <td>{{ sacks[index] }}</td>
                <td>{{ sacksYards[index] }}</td>
            </tr>
        </table>
    </div>
</template>