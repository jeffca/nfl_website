<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "RushYardsAllowedKpis",
    data() {
        return {
            dataLoaded: false,
            avgRushYdsAllowed: 0,
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
        let sumOfRushYdsAllowed = 0;
        for (let i = 0; i < this.teamHistory.length; i++) {          
            sumOfRushYdsAllowed += parseInt(this.teamHistory[i]["Rush Allowed"]);
            count += 1;
        }
        this.avgRushYdsAllowed = Number(sumOfRushYdsAllowed / count).toFixed(1)
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
        <div class="team-kpi">Rush Yards Allowed<br /><span>{{ avgRushYdsAllowed }}</span></div>
    </div>
</template>