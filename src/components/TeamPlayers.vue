<script>
import Loading from './shared/Loading.vue';
import axios from 'axios';

import TeamQBTable from './tables/team/TeamQBTable.vue';
import TeamRBTable from './tables/team/TeamRBTable.vue';
import TeamWRTable from './tables/team/TeamWRTable.vue';

export default {
    name: "TeamPlayers",
    data() {
        return {
            dataLoaded: false,
            players: [],
            qbs: [],
            rbs: [],
            wrs: [],
            teams: [],   
        }
    },
    computed: {
        teamComputed() {
            return this.$route.params.team;
        },
    },    
    props: {
        position: {
            type: String,
        }
    },    
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        axios.get('http://127.0.0.1:3000/TeamQuarterbacks/' + this.teamComputed)
            .then(response => {
                this.qbs = response.data;
                axios.get('http://127.0.0.1:3000/TeamRunningBacks/' + this.teamComputed)
                .then(response => {
                    this.rbs = response.data;
                    axios.get('http://127.0.0.1:3000/TeamWideReceivers/' + this.teamComputed)
                    .then(response => {
                        this.wrs = response.data;
                        this.dataLoaded = true;
                    }).catch(error => {
                        console.log(error);
                    });
                }).catch(error => {
                    console.log(error);
                });
            }).catch(error => {
                console.log(error);
            });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  },
  components: {
    Loading,
    TeamQBTable,
    TeamRBTable,
    TeamWRTable,
  },
};

</script>





<template>
    
    <div v-if="position == 'starting_qb' && qbs.length > 0">
        <TeamQBTable :qbs="qbs[0]"></TeamQBTable>
    </div>
    
    <div v-if="position == 'bench_qb' && qbs.length > 1">
        <TeamQBTable :qbs="qbs.slice(1)"></TeamQBTable>    
    </div>

    <div v-if="position == 'starting_rb'">
        <div v-if="dataLoaded && rbs.length > 0">
            <TeamRBTable :rbs="rbs.slice(0,2)"></TeamRBTable>
        </div>
        <div v-else>
            <Loading />
        </div>
    </div>
    <div v-if="position == 'bench_rb'">
        <div v-if="dataLoaded && rbs.length > 2">
            <TeamRBTable :rbs="rbs.slice(2)"></TeamRBTable>
        </div>
        <div v-else>
            <Loading />
        </div>
    </div>
    
    <div v-if="position == 'starting_wr'">
        <div v-if="dataLoaded && wrs.length > 0">
            <TeamWRTable :wrs="wrs.slice(0,4)"></TeamWRTable>
        </div>
        <div v-else>
            <Loading />
        </div>
    </div>
    <div v-if="position == 'bench_wr'">
        <div v-if="dataLoaded && wrs.length > 4">
            <TeamWRTable :wrs="wrs.slice(4)"></TeamWRTable>
        </div>
        <div v-else>
            <Loading />
        </div>
    </div>
     
    </template>