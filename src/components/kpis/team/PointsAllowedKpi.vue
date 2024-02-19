<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "PointsAllowedKpi",
    data() {
        return {
            dataLoaded: false,
            avgPtsAllowed: 0,
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
        let sumOfPtsAllowed = 0;
        for (let i = 0; i < this.teamHistory.length; i++) {          
            sumOfPtsAllowed += parseInt(this.teamHistory[i]["Points Allowed"]);
            count += 1;
        }
        this.avgPtsAllowed = Number(sumOfPtsAllowed / count).toFixed(1)
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
        <div class="team-kpi">Points Allowed<br /><span>{{ avgPtsAllowed }}</span></div>
    </div>
</template>