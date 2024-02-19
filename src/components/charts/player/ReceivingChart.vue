<script>
import Loading from '../../shared/Loading.vue';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: "PlayerReceivingChart",
    data() {
        return {
            dataLoaded: false,
            weeks: [],
            targets: [],
            receptions: [],
            receivingYds: [],
            receivingTds: [],
            chartData: {},
            chartOptions: {responsive:true},
        }
    },
    props: {
        receivingStats: {
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
        for (let i = 0; i < this.receivingStats.length; i++) {
            if (this.receivingStats[i]["Home or Away"] == "Home") {
                this.weeks.push("Week " + this.receivingStats[i]["Week Number"] + " vs " + this.receivingStats[i]["Opponent Abbreviation"]);
            } else {
                this.weeks.push("Week " + this.receivingStats[i]["Week Number"] + " @ " + this.receivingStats[i]["Opponent Abbreviation"]);
            }            
            this.targets.push(this.receivingStats[i]["SUM of Tar"]);
            this.receptions.push(this.receivingStats[i]["SUM of Rec"]);
            this.receivingYds.push(this.receivingStats[i]["SUM of Yds"]);
            this.receivingTds.push(this.receivingStats[i]["SUM of TD"]);
        }
        this.targetsReceptionsChartData = {
            labels: this.weeks,
            datasets: [
                {
                    label: this.player + " Targets",
                    backgroundColor: "#03a64c",
                    data: this.targets
                },
                {
                    label: this.player + " Receptions",
                    backgroundColor: "#13d651",
                    data: this.receptions
                },                
            ]
        };
        this.yardsChartData = {
            labels: this.weeks,
            datasets: [
                {
                    label: this.player + " Receiving Yards",
                    backgroundColor: "#cf903e",
                    data: this.receivingYds
                }
            ]
        };
        this.tdsChartData = {
            labels: this.weeks,
            datasets: [
                {
                    label: this.player + " Receiving TDs",
                    backgroundColor: "#2098e3",
                    data: this.receivingTds
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
                :data="targetsReceptionsChartData"
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