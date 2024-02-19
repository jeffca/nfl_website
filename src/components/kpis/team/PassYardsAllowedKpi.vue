<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "PassYardsAllowedKpis",
    data() {
        return {
            dataLoaded: false,
            avgPassYdsAllowed: 0,
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
        let sumOfPassYdsAllowed = 0;
        for (let i = 0; i < this.teamHistory.length; i++) {          
            sumOfPassYdsAllowed += parseInt(this.teamHistory[i]["Passing Allowed"]);
            count += 1;
        }
        this.avgPassYdsAllowed = Number(sumOfPassYdsAllowed / count).toFixed(1)
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
        <div class="team-kpi">Pass Yards Allowed<br /><span>{{ avgPassYdsAllowed }}</span></div>
    </div>
</template>