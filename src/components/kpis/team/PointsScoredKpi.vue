<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "PointsScoredKpi",
    data() {
        return {
            dataLoaded: false,
            avgPtsScored: 0,
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
        let sumOfPts = 0;
        for (let i = 0; i < this.teamHistory.length; i++) {          
            sumOfPts += parseInt(this.teamHistory[i]["Points Scored"]);
            count += 1;
        }
        this.avgPtsScored = Number(sumOfPts / count).toFixed(1)
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
        <div class="team-kpi">Points Scored<br /><span>{{ avgPtsScored }}</span></div>
    </div>
</template>