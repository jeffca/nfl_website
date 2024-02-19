<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "PlayerReceivingKpis",
    data() {
        return {
            dataLoaded: false,
            avgTargets: 0,
            avgReceptions: 0,
            avgYds: 0,
            avgTds: 0,
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
        let count = 0;
        let sumOfTargets = 0;
        let sumOfReceptions = 0;
        let sumOfYds = 0;
        let sumOfTds = 0;
        for (let i = 0; i < this.receivingStats.length; i++) {          
            sumOfTargets += parseInt(this.receivingStats[i]["SUM of Tar"]);
            sumOfReceptions += parseInt(this.receivingStats[i]["SUM of Rec"]);
            sumOfYds += parseInt(this.receivingStats[i]["SUM of Yds"]);
            sumOfTds += parseInt(this.receivingStats[i]["SUM of TD"]);
            count += 1;
        }
        this.avgTargets = Number(sumOfTargets / count).toFixed(1)
        this.avgReceptions = Number(sumOfReceptions / count).toFixed(1)
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
        <div class="player-kpi">Targets<br /><span>{{ avgTargets }}</span></div>
        <div class="player-kpi">Receptions<br /><span>{{ avgReceptions }}</span></div>
        <div class="player-kpi">Receiving Yards<br /><span>{{ avgYds }}</span></div>
        <div class="player-kpi">Receiving TDs<br /><span>{{ avgTds }}</span></div>
    </div>
</template>