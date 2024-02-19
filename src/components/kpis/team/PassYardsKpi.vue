<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "PassYardsKpis",
    data() {
        return {
            dataLoaded: false,
            avgPassYds: 0,
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
        let sumOfPassYds = 0;
        for (let i = 0; i < this.teamHistory.length; i++) {          
            sumOfPassYds += parseInt(this.teamHistory[i]["Net Passing"]);
            count += 1;
        }
        this.avgPassYds = Number(sumOfPassYds / count).toFixed(1)
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
        <div class="team-kpi">Pass Yards<br /><span>{{ avgPassYds }}</span></div>
    </div>
</template>