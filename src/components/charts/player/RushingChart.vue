<script>
import Loading from '../../shared/Loading.vue';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: "PlayerRushingChart",
    data() {
        return {
            dataLoaded: false,
            weeks: [],
            carries: [],
            rushYds: [],
            rushTds: [],
            chartData: {},
            chartOptions: {responsive:true},
        }
    },
    props: {
        rushingStats: {
            type: Array,
            required: true,
        },
        player: {
            type: String,
            required: true,
        }
    },    
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
        for (let i = 0; i < this.rushingStats.length; i++) {
            if (this.rushingStats[i]["Home or Away"] == "Home") {
                this.weeks.push("Week " + this.rushingStats[i]["Week Number"] + " vs " + this.rushingStats[i]["Opponent Abbreviation"]);
            } else {
                this.weeks.push("Week " + this.rushingStats[i]["Week Number"] + " @ " + this.rushingStats[i]["Opponent Abbreviation"]);
            }            
            this.carries.push(this.rushingStats[i]["SUM of Att"]);
            this.rushYds.push(this.rushingStats[i]["SUM of Yds"]);
            this.rushTds.push(this.rushingStats[i]["SUM of TD"]);
        }
        this.carriesChartData = {
            labels: this.weeks,
            datasets: [
                {
                    label: this.player + " Carries",
                    backgroundColor: "#0ec975",
                    data: this.carries
                }
            ]
        };
        this.yardsChartData = {
            labels: this.weeks,
            datasets: [
                {
                    label: this.player + " Rush Yards",
                    backgroundColor: "#b50e1f",
                    data: this.rushYds
                }
            ]
        };
        this.tdsChartData = {
            labels: this.weeks,
            datasets: [
                {
                    label: this.player + " Rush TDs",
                    backgroundColor: "#e64e79",
                    data: this.rushTds
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
    <div v-if="dataLoaded" class="player-history-charts">
        <div class="tab-container">
            <Bar
                :options="chartOptions"
                :data="carriesChartData"
           />
        </div>
        <div class="tab-container">
            <Bar
                :options="chartOptions"
                :data="yardsChartData"
           />
        </div>
        <div class="tab-container">
            <Bar
                :options="chartOptions"
                :data="tdsChartData"
           />
        </div>        
    </div>
</template>