<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "PlayerRushingKpis",
    data() {
        return {
            dataLoaded: false,
            avgCarries: 0,
            avgYds: 0,
            avgTds: 0,
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
        let count = 0;
        let sumOfCarries = 0;
        let sumOfYds = 0;
        let sumOfTds = 0;
        for (let i = 0; i < this.rushingStats.length; i++) {          
            sumOfCarries += parseInt(this.rushingStats[i]["SUM of Att"]);
            sumOfYds += parseInt(this.rushingStats[i]["SUM of Yds"]);
            sumOfTds += parseInt(this.rushingStats[i]["SUM of TD"]);
            count += 1;
        }
        this.avgCarries = Number(sumOfCarries / count).toFixed(1)
        this.avgYds = Number(sumOfYds / count).toFixed(1)
        this.avgTds = Number(sumOfTds / count).toFixed(1)

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
        <div class="player-kpi">Carries<br /><span>{{ avgCarries }}</span></div>
        <div class="player-kpi">Rush Yards<br /><span>{{ avgYds }}</span></div>
        <div class="player-kpi">Rush TDs<br /><span>{{ avgTds }}</span></div>
    </div>
</template>