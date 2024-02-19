<script>
import Loading from '../../shared/Loading.vue';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: "TeamPointsChart",
    data() {
        return {
            dataLoaded: false,
            weeks: [],
            pointsScored: [],
            pointsAllowed: [],
            chartData: {},
            chartOptions: {responsive:true},
        }
    },
    props: {
        teamHistory: {
            type: Array,
            required: true,
        },
        team: {
            type: String,
            required: true,
        }
    },    
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
        for (let i = this.teamHistory.length-1; i > 0; i--) {
            if (this.teamHistory[i]["Home/Away"] == "Home") {
                this.weeks.push("Week " + this.teamHistory[i]["Week"] + " vs " + this.teamHistory[i]["Opponent Abbreviation"]);
            } else {
                this.weeks.push("Week " + this.teamHistory[i]["Week"] + " @ " + this.teamHistory[i]["Opponent Abbreviation"]);
            }            
            this.pointsScored.push(this.teamHistory[i]["Points Scored"]);
            this.pointsAllowed.push(this.teamHistory[i]["Points Allowed"]);
        }
        this.chartData = {
            labels: this.weeks,
            datasets: [
                {
                    label: this.team + " Points Scored",
                    backgroundColor: "#0cf552",
                    data: this.pointsScored
                },
                {
                    label: this.team + " Points Allowed",
                    backgroundColor: "#608f01",
                    data: this.pointsAllowed
                },        
            ]
        };

        this.dataLoaded = true;
    }
  },
  components: {
    Loading,
    Bar
  },
};

</script>

<template>
    <div v-if="dataLoaded" class="team-history-charts">
        <div class="tab-container">
            <Bar
                :options="chartOptions"
                :data="chartData"
           />
        </div>    
    </div>
</template>