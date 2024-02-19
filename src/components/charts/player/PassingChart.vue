<script>
import Loading from '../../shared/Loading.vue';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: "PlayerPassingChart",
    data() {
        return {
            dataLoaded: false,
            weeks: [],
            passYds: [],
            passTds: [],
            passInts: [],
            chartData: {},
            chartOptions: {responsive:true},
        }
    },
    props: {
        passingStats: {
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
        for (let i = 0; i < this.passingStats.length; i++) {
            if (this.passingStats[i]["Home or Away"] == "Home") {
                this.weeks.push("Week " + this.passingStats[i]["Week Number"] + " vs " + this.passingStats[i]["Opponent Abbreviation"]);
            } else {
                this.weeks.push("Week " + this.passingStats[i]["Week Number"] + " @ " + this.passingStats[i]["Opponent Abbreviation"]);
            }            
            this.passYds.push(this.passingStats[i]["SUM of Yds"]);
            this.passTds.push(this.passingStats[i]["SUM of TD"]);
            this.passInts.push(this.passingStats[i]["SUM of Int"]);
        }
        this.yardsChartData = {
            labels: this.weeks,
            datasets: [
                {
                    label: this.player + " Pass Yards",
                    backgroundColor: "#bf659e",
                    data: this.passYds
                }
            ]
        };
        this.tdsIntsChartData = {
            labels: this.weeks,
            datasets: [
                {
                    label: this.player + " Pass TDs",
                    backgroundColor: "#f34823",
                    data: this.passTds
                },
                {
                    label: this.player + " Interceptions",
                    backgroundColor: "#e8e407",
                    data: this.passInts
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
                :data="yardsChartData"
           />
        </div>
        <div class="tab-container">
            <Bar
                :options="chartOptions"
                :data="tdsIntsChartData"
           />
        </div>        
    </div>
</template>