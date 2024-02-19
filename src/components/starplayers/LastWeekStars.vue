<script>
import Loading from '../shared/Loading.vue';
import LastWeekQBStarsTable from '../tables/stars/LastWeekQBStarsTable.vue';
import LastWeekRBStarsTable from '../tables/stars/LastWeekRBStarsTable.vue';
import LastWeekWRStarsTable from '../tables/stars/LastWeekWRStarsTable.vue';
import axios from 'axios';

export default {
    name: "LastWeekStars",
  data() {
    return {
        dataLoaded: false,
        selectedPriorWeek: null,
        qbs: [],
        rbs: [],
        wrs: [],
        activeTab: 'quarterbacks',
        selectedWeek: null,
    };
  },
  watch: {
  },  
  computed: {
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
        await Promise.all([
            this.fetchStars('last')
        ]);
        this.dataLoaded = true;
    },
    fetchStars(week_number) {
        return new Promise((resolve,reject) => {
                axios.get('http://127.0.0.1:3000/QBStars/' + week_number)
                .then(response => {
                    this.qbs = response.data;
                    let promises = [];
                    promises.push(
                        axios.get('http://127.0.0.1:3000/RBStars/' + week_number)
                        .then(response => {
                            this.rbs = response.data;
                            promises.push(
                                axios.get('http://127.0.0.1:3000/WRStars/' + week_number)
                                .then(response => {
                                    this.wrs = response.data;
                                }).catch(error => {
                                    console.log('Error fetching data:', error)
                                })
                            )
                        }).catch(error => {
                            console.error('Error fetching data:', error);
                        })
                    )
                    Promise.all(promises)
                        .then(() => {
                            resolve(this.qbs);
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
            })        
    },      
    async handleSelectChange(week_number) {
        if (week_number != "null") {
            this.selectedWeek = week_number;
            this.dataLoaded = false;
            await Promise.all([
                this.fetchStars(week_number),
            ]);
            this.dataLoaded = true;
        }
    },         
  },
  components: {
    Loading,
    LastWeekQBStarsTable,
    LastWeekRBStarsTable,
    LastWeekWRStarsTable,
  },
};

</script>

<template>

    <div>
        <h1 class="center">Last Week's Stars</h1>
        <div class="tabs">
            <button @click="activeTab = 'quarterbacks'" :class="{ 'active': activeTab === 'quarterbacks' }" class="tab-button">Quarterbacks</button>
            <button @click="activeTab = 'runningbacks'" :class="{ 'active': activeTab === 'runningbacks' }" class="tab-button">Running Backs</button>
            <button @click="activeTab = 'receivers'" :class="{ 'active': activeTab === 'receivers' }" class="tab-button">Receivers</button>
        </div>        

        <transition name="fade">
            <div v-if="dataLoaded">
                <div v-if="activeTab === 'quarterbacks'" class="spreadsheet-table-wrapper stars-div">
                    <span class="stars-help-text">Quarterbacks with at least 200 yards passing.</span>
                    <div>
                        <LastWeekQBStarsTable :qbs="qbs"></LastWeekQBStarsTable>
                    </div>
                </div>
                <div v-if="activeTab === 'runningbacks'" class="spreadsheet-table-wrapper stars-div">
                    <span class="stars-help-text">Rushers with at least 25 yards rushing.</span>
                    <div>
                        <LastWeekRBStarsTable :rbs="rbs"></LastWeekRBStarsTable>
                    </div>
                </div>
                <div v-if="activeTab === 'receivers'" class="spreadsheet-table-wrapper stars-div">
                    <span class="stars-help-text">Receivers with at least 25 yards receiving.</span>
                    <div>
                        <LastWeekWRStarsTable :wrs="wrs"></LastWeekWRStarsTable>
                    </div>
                </div>        
            </div>
        </transition>

        <div class="select-prior-week-div">
            <h3><font-awesome-icon :icon="['fas', 'arrow-down-long']" /> See Prior Week's Stars </h3>
            <select v-model="selectedPriorWeek" @change="handleSelectChange(selectedPriorWeek)">
                <option value="null">Select a prior week...</option>
                <option v-for="week in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]" :value="week">
                    {{ week }}
                </option>
            </select>
        </div>
    </div>
    <!-- <div v-else>
      <Loading />
    </div> -->

</template>

<style :scoped>

</style>