<script>
import Loading from './shared/Loading.vue';
import PlayerPassingKpis from './kpis/player/PassingKpis.vue';
import PlayerPassingChart from './charts/player/PassingChart.vue';
import PlayerPassingTable from './tables/player/PassingTable.vue';
import PlayerRushingKpis from './kpis/player/RushingKpis.vue';
import PlayerRushingTable from './tables/player/RushingTable.vue';
import PlayerRushingChart from './charts/player/RushingChart.vue';
import PlayerReceivingKpis from './kpis/player/ReceivingKpis.vue';
import PlayerReceivingTable from './tables/player/ReceivingTable.vue';
import PlayerReceivingChart from './charts/player/ReceivingChart.vue';
import axios from 'axios';

export default {
    name: "TeamPlayers",
    data() {
        return {
            dataLoaded: false,
            playerPassingStats: [],
            playerRushingStats: [],
            playerReceivingStats: [],
            playerTeam: null,
            activeTab: null, 
        }
    },
    computed: {
        playerComputed() {
            return decodeURIComponent(this.$route.params.player);
        },
    },    
    props: {
        player: {
            type: String,
            required: true,
            default: () => decodeURIComponent(this.$route.params.player),
        },
        stat: {
            type: String,
            required: true,
        },
    },    
    watch: {
        player(newPlayer, oldPlayer) {
        this.playerPassingStats = [];
        this.playerRushingStats = [];
        this.playerReceivingStats = [];
            if (newPlayer !== oldPlayer) {
            this.dataLoaded = false;
            this.activeTab = "";
            this.fetchData();
            }
        }
    },       
  mounted() {
    this.fetchData();
  },
  methods: {
    setActiveTab(tab) {
        this.activeTab = tab;
    },
    async fetchData() {
      try {
        await Promise.all([
            this.fetchPassingStats(),
            this.fetchRushingStats(),
            this.fetchReceivingStats(),
        ]);
        console.log(this.stat);
        if (this.stat != undefined) {
            this.activeTab = this.stat;   
        } else {
            if (this.playerPassingStats.length >= this.playerRushingStats.length && this.playerPassingStats.length >= this.playerReceivingStats.length) {
                this.activeTab = "passing";
                this.setActiveTab("passing");
            } else if (this.playerReceivingStats.length >= this.playerRushingStats.length) {
                this.activeTab = "receiving";
                this.setActiveTab("receiving");
            } else {
                this.activeTab = "rushing";
                this.setActiveTab("rushing");
            }
        }
        this.dataLoaded = true;
      } catch (error) {
        console.error('Error fetching data:', error);
      } 
    },
    fetchPassingStats() {
        return new Promise((resolve,reject) => {
            axios.get('http://127.0.0.1:3000/Quarterbacks/' + this.playerComputed)
            .then(response => {
                if (response.data.length > 0) {
                    this.playerPassingStats = response.data;
                    this.playerTeam = response.data[response.data.length-1]["Team Final"];
                }
                resolve(response.data);
            }).catch(error => {
                console.log(error);
                reject(error);
            });
        });
    },
    fetchRushingStats() {
        return new Promise((resolve,reject) => {
            axios.get('http://127.0.0.1:3000/RunningBacks/' + this.playerComputed)
                .then(response => {
                    if (response.data.length > 0) {
                        this.playerRushingStats = response.data;
                        this.playerTeam = response.data[response.data.length-1]["Team Final"];  
                    }
                    resolve(response.data);
                }).catch(error => {
                    console.log(error);
                    reject(error);
                });     
            });
    },
    fetchReceivingStats() {
        return new Promise((resolve,reject) => {
            axios.get('http://127.0.0.1:3000/WideReceivers/' + this.playerComputed)
                .then(response => {
                    if (response.data.length > 0) {
                        this.playerReceivingStats = response.data;
                        this.playerTeam = response.data[response.data.length-1]["Team Final"]              
                    } 
                    resolve(response.data);
                }).catch(error => {
                    console.log(error);
                    reject(error);
                });                 
            });
    },
  },
  components: {
    Loading,
    PlayerPassingKpis,
    PlayerPassingTable,
    PlayerPassingChart,
    PlayerRushingKpis,
    PlayerRushingTable,
    PlayerRushingChart,
    PlayerReceivingKpis,
    PlayerReceivingTable,
    PlayerReceivingChart,
  },
};

</script>

<template>
    <div v-if="dataLoaded">
        <div>
            <h1 class="center">{{ playerComputed }}</h1>
            <h2 class="center team-name" :id="'team-name-' + playerTeam.replace('Commanders', 'Command').replace('Raiders', 'Raid').slice(-4)">
                <router-link :to="{ name: 'team-detail-history', params: { team:playerTeam} }">{{ playerTeam }}</router-link>
            </h2>
        </div>

        <div class="tabs">
                <button @click="setActiveTab('passing')" :class="{ 'active': activeTab === 'passing' }" class="tab-button">Passing Stats</button>
                <button @click="setActiveTab('rushing')" :class="{ 'active': activeTab === 'rushing' }" class="tab-button">Rushing Stats</button>
                <button @click="setActiveTab('receiving')" :class="{ 'active': activeTab === 'receiving' }" class="tab-button">Receiving Stats</button>
        </div>    

        <div v-if="activeTab === 'passing'">
            <div v-if="playerPassingStats.length > 0">
                <PlayerPassingKpis :passingStats="playerPassingStats"></PlayerPassingKpis>
                <PlayerPassingTable :passingStats="playerPassingStats"></PlayerPassingTable>
                <PlayerPassingChart :passingStats="playerPassingStats" :player="playerComputed"></PlayerPassingChart>
            </div>
            <div v-else>
                <p class="center">{{ playerComputed }} does not have a pass attempt this season.</p>
            </div>
        </div>

        <div v-if="activeTab === 'rushing'">
            <div v-if="playerRushingStats.length > 0">
                <PlayerRushingKpis :rushingStats="playerRushingStats"></PlayerRushingKpis>
                <PlayerRushingTable :rushingStats="playerRushingStats"></PlayerRushingTable>
                <PlayerRushingChart :rushingStats="playerRushingStats" :player="playerComputed"></PlayerRushingChart>
            </div>
            <div v-else>
                <p class="center">{{ playerComputed }} does not have a rush attempt this season.</p>
            </div>
        </div>

        <div v-if="activeTab === 'receiving'">
            <div v-if="playerReceivingStats.length > 0">
                <PlayerReceivingKpis :receivingStats="playerReceivingStats"></PlayerReceivingKpis>  
                <PlayerReceivingTable :receivingStats="playerReceivingStats"></PlayerReceivingTable> 
                <PlayerReceivingChart :receivingStats="playerReceivingStats" :player="playerComputed"></PlayerReceivingChart>    
            </div>
            <div v-else>
                <p class="center">{{ playerComputed }} has not been targeted with a pass this season.</p>
            </div>
        </div>
    </div>
    
    <div v-else>
        <Loading />
    </div>
</template>