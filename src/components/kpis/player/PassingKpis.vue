<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "PlayerPassingKpis",
    data() {
        return {
            dataLoaded: false,
            avgYds: 0,
            avgTds: 0,
            avgInts: 0,
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
        let count = 0;
        let sumOfYds = 0;
        let sumOfTds = 0;
        let sumOfInts = 0;
        for (let i = 0; i < this.passingStats.length; i++) {          
            sumOfYds += parseInt(this.passingStats[i]["SUM of Yds"]);
            sumOfTds += parseInt(this.passingStats[i]["SUM of TD"]);
            sumOfInts += parseInt(this.passingStats[i]["SUM of Int"]);
            count += 1;
        }
        this.avgYds = Number(sumOfYds / count).toFixed(1)
        this.avgTds = Number(sumOfTds / count).toFixed(1)
        this.avgInts = Number(sumOfInts / count).toFixed(1)

        this.dataLoaded = true;
    }
  },
  components: {
    Loading,
  },
};

</script>

<template>
    <div v-if="dataLoaded" class="player-history-kpis">
        <div class="player-kpi">Pass Yards<br /><span>{{ avgYds }}</span></div>
        <div class="player-kpi">Pass TDs<br /><span>{{ avgTds }}</span></div>
        <div class="player-kpi">Interceptions<br /><span>{{ avgInts }}</span></div>
    </div>
</template>