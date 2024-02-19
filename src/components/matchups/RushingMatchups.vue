<script>
import axios from 'axios';
import Loading from '../shared/Loading.vue';
import RushingMatchupsTable from '../tables/matchups/RushingMatchupsTable.vue';

export default {
    name: "RushingMatchups",
  data() {
    return {
        dataLoaded: false,
        selectedPriorWeek: null,
        rushingMatchups: [], 
        rushingAtLocationMatchups: [],
        selectedWeek: null,
    };
  },
  mounted() {
    this.fetchData('last');
  },
  methods: {
    async fetchData(week_number) {
        this.selectedWeek = '18';
        await Promise.all([
            this.fetchTopRushers(week_number),
        ]);
        console.log(this.rushingMatchups);
        this.dataLoaded = true;
    },
    fetchTopRushers(week_number) {
        return new Promise((resolve,reject) => {
            axios.get('http://127.0.0.1:3000/RushingMatchups/' + week_number)
            .then(response => {
                this.rushingMatchups = response.data;
                let promises = [];
                // this.rushingAtLocationMatchups = response.data.sort((a, b) => a["Expected Rush Yards at This Week's Location"] - b["Expected Rush Yards at This Week's Location"]);
                for (let i = 0; i < this.rushingMatchups.length; i++) {
                    this.rushingMatchups[i].top_rushers = [];
                    promises.push(
                        axios.get('http://127.0.0.1:3000/TeamRunningBacks/' + this.rushingMatchups[i]["Team"])
                        .then(response => {
                            this.rushingMatchups[i].top_rushers.push(response.data[0]["Player"]);
                            this.rushingMatchups[i].top_rushers.push(response.data[1]["Player"]);
                        }).catch(error => {
                            console.error('Error fetching data:', error);
                        })
                    );
                }
                Promise.all(promises)
                    .then(() => {
                        resolve(this.rushingMatchups);
                    })
                    .catch(error => {
                        console.error('Error waiting for promises:', error);
                        reject(error);
                    });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                reject(error);
            });
        });
    },
    async handleSelectChange(week_number) {
        if (week_number != "null") {
            this.selectedWeek = week_number;
            this.dataLoaded = false;
            await Promise.all([
                this.fetchTopRushers(week_number),
            ]);
            this.dataLoaded = true;
        }
    },
  },
  components: {
    Loading,
    RushingMatchupsTable,
  }
};
</script>
  
<template>

   <div>
        <h1 class="center">Week {{ selectedWeek }} Rushing Matchups</h1>
        <transition name="fade">
            <div v-if="dataLoaded">
                <RushingMatchupsTable :rushingMatchups="rushingMatchups"></RushingMatchupsTable>
            </div>
        </transition>
        <br />
        <div class="select-prior-week-div">
            <h3><font-awesome-icon :icon="['fas', 'arrow-down-long']" /> See Prior Rushing Matchups</h3>
            <select v-model="selectedPriorWeek" @change="handleSelectChange(selectedPriorWeek)">
                <option value="null">Select a prior week...</option>
                <option :value="12">Week 12</option>
                <option :value="13">Week 13</option>
            </select>
        </div>
    </div>

</template>

