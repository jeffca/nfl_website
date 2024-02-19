<script>
import axios from 'axios';
import Loading from '../shared/Loading.vue';
import PassingMatchupsTable from '../tables/matchups/PassingMatchupsTable.vue';
import InterceptionMatchupsTable from '../tables/matchups/InterceptionMatchupsTable.vue';

export default {
    name: "PassingMatchups",
  data() {
    return {
        initialDataLoaded: false,
        dataLoaded: false,
        selectedPriorWeek: null,
        passingMatchups: [], 
        interceptionMatchups: [],
        passingAtLocationMatchups: [],
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
            this.fetchStartingQB(week_number),
        ]);   
        //wait for passingMatchups to finish rendering before calling TopReceivers which uses it
        await Promise.all([
            this.fetchTopReceivers(week_number),
            this.fetchStartingQBsAndNextOpponent(week_number),
        ]);
        console.log(this.passingMatchups);
        console.log(this.interceptionMatchups);
        this.initialDataLoaded = true;
        this.dataLoaded = true;
    },
    fetchTopReceivers(week_number) {
        return new Promise((resolve,reject) => {
            axios.get('http://127.0.0.1:3000/PassingMatchups/' + week_number)
            .then(response => {
                let promises = [];
                for (let i = 0; i < response.data.length; i++) {
                    this.passingMatchups[i].top_receivers = [];
                    promises.push(
                        axios.get('http://127.0.0.1:3000/TeamWideReceivers/' + response.data[i]["Team"])
                        .then(response => {
                            this.passingMatchups[i].top_receivers.push(response.data[0]["Player"]);
                            this.passingMatchups[i].top_receivers.push(response.data[1]["Player"]);
                        }).catch(error => {
                            console.error('Error fetching data:', error);
                        })
                    );
                }
                Promise.all(promises)
                    .then(() => {
                        resolve(this.passingMatchups);
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
    fetchStartingQB(week_number) {
        return new Promise((resolve,reject) => {
            axios.get('http://127.0.0.1:3000/PassingMatchups/' + week_number)
            .then(response => {
                this.passingMatchups = response.data;
                let promises = [];
                for (let i = 0; i < this.passingMatchups.length; i++) {
                    this.passingMatchups[i].starting_qb = [];
                    promises.push(
                        axios.get('http://127.0.0.1:3000/TeamQuarterbacks/' + this.passingMatchups[i]["Team"])
                        .then(response => {
                            this.passingMatchups[i].starting_qb.push(response.data[0]["Player"]);
                        }).catch(error => {
                            console.error('Error fetching data:', error);
                        })
                    );
                }
                Promise.all(promises)
                    .then(() => {
                        resolve(this.passingMatchups);
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
    fetchStartingQBsAndNextOpponent(week_number) {
        return new Promise((resolve,reject) => {
            axios.get('http://127.0.0.1:3000/TeamQuarterbacks')
            .then(response => {
                this.interceptionMatchups = {};
                for (let i = 0; i < response.data.length; i++) {
                    if (!this.interceptionMatchups.hasOwnProperty(response.data[i]["Team Final"])) {
                        this.interceptionMatchups[response.data[i]["Team Final"]] = [
                            response.data[i]["Player"], 
                            response.data[i]["AVERAGE of Int"]
                        ]
                    }
                }
                let promises = [];
                for (let key in this.interceptionMatchups) {
                    promises.push(
                        axios.get('http://127.0.0.1:3000/PassingMatchups/' + week_number)
                        .then(response => {
                            for (let i = 0; i < response.data.length; i++) {
                                if (response.data[i]["Team"] == key) {
                                    this.interceptionMatchups[key].push(response.data[i]["Next Opponent"]);
                                    this.interceptionMatchups[key].push(response.data[i]["Next Opponent Average Interceptions Caught"]);
                                    if (response.data[i]["Next Opponent"] != 'Bye') {
                                        this.interceptionMatchups[key].push(Number(((parseFloat(response.data[i]["Next Opponent Average Interceptions Caught"]) + parseFloat(this.interceptionMatchups[key][1])) / 2).toFixed(1)));
                                    } else {
                                        this.interceptionMatchups[key].push('');
                                    }

                                    if (response.data[i]["Interceptions Thrown Result"] != 'N/A') {
                                        this.interceptionMatchups[key].push(response.data[i]["Interceptions Thrown Result"]);
                                    } else {
                                        this.interceptionMatchups[key].push('N/A');
                                    }
                                }
                            }
                        }).catch(error => {
                            console.error('Error fetching data:', error);
                        })
                    );
                }
                Promise.all(promises)
                    .then(() => {
                        if (this.interceptionMatchups[Object.keys(this.interceptionMatchups)[0]][5] == 'N/A') {
                            this.interceptionMatchups = Object.fromEntries(
                                Object.entries(this.interceptionMatchups).sort(([, a], [, b]) => {
                                // Handle blank values
                                if (!a[4] && !b[4]) {
                                    return 0; // No change in order for two blank values
                                } else if (!a[4]) {
                                    return 1; // Place blank values at the end
                                } else if (!b[4]) {
                                    return -1; // Place blank values at the end
                                }

                                // Normal numeric comparison when both values are present
                                return b[4] - a[4];
                                })
                           );
                        } else {
                            this.interceptionMatchups = Object.fromEntries(
                                Object.entries(this.interceptionMatchups).sort(([, a], [, b]) => {
                                    // Handle blank values
                                    if (!a[5] && !b[5]) {
                                        return 0; // No change in order for two blank values
                                    } else if (!a[5]) {
                                        return 1; // Place blank values at the end
                                    } else if (!b[5]) {
                                        return -1; // Place blank values at the end
                                    }

                                    // Normal numeric comparison when both values are present
                                    return b[5] - a[5];
                                })
                            );
                        }
                        resolve(this.interceptionMatchups);
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
            this.dataLoaded = false;
            this.selectedWeek = week_number;
            await Promise.all([
                this.fetchStartingQB(week_number),
                this.fetchTopReceivers(week_number),
                this.fetchStartingQBsAndNextOpponent(week_number),
            ]);
            this.dataLoaded = true;
        }
    },    
  },
  components: {
    Loading,
    PassingMatchupsTable,
    InterceptionMatchupsTable,
  }
};
</script>
  
<template>

    <div v-if="initialDataLoaded">
        <h1 class="center">Week {{ selectedWeek }} Passing Matchups</h1>
            <transition name="fade">
                <div v-if="dataLoaded">
                    <PassingMatchupsTable :passingMatchups="passingMatchups"></PassingMatchupsTable>
                </div>
            </transition>

        <h1 class="center">Interception Opportunities</h1>
            <transition name="fade">
                <div v-if="dataLoaded">
                    <InterceptionMatchupsTable :interceptionMatchups="interceptionMatchups"></InterceptionMatchupsTable>
                </div>
            </transition>
        <div class="select-prior-week-div">
            <h3><font-awesome-icon :icon="['fas', 'arrow-down-long']" /> See Prior Passing Matchups</h3>
            <select v-model="selectedPriorWeek" @change="handleSelectChange(selectedPriorWeek)">
                <option value="null">Select a prior week...</option>
                <option v-for="week in [12,13]" :value="week">
                    {{ week }}
                </option>
            </select>
        </div>
    </div>
    <div v-else>
        <Loading />
    </div>
</template>

