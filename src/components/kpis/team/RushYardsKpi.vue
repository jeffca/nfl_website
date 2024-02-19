<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "RushYardsKpis",
    data() {
        return {
            dataLoaded: false,
            avgRushYds: 0,
        }
    },
    props: {
        teamHistory: {
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
        let sumOfRushYds = 0;
        for (let i = 0; i < this.teamHistory.length; i++) {          
            sumOfRushYds += parseInt(this.teamHistory[i]["Net Rushing"]);
            count += 1;
        }
        this.avgRushYds = Number(sumOfRushYds / count).toFixed(1)
        this.dataLoaded = true;
    }
  },
  components: {
    Loading,
  },
};

</script>


<template>
    <div v-if="dataLoaded">
        <div class="team-kpi">Rush Yards<br /><span>{{ avgRushYds }}</span></div>
    </div>
</template>