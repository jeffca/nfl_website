<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "TeamHistoryTable",
    data() {
        return {
            dataLoaded: false,
            historyColumns: [
              'Week',
              'Opponent',
              'Location',
              'Result',
              'Points Scored',
              'Points Allowed',
              'Yards',
              'Yards Allowed',
              'Rush Yards',
              'Rush Yards Allowed',
              'Pass Yards',
              'Pass Yards Allowed',
              'Rush TDs',
              'Rush TDs Allowed',
              'Pass TDs',
              'Pass TDs Allowed',
              'Interceptions',
              'Interceptions Caught',
              'Turnovers',
              'Turnovers Forced',
              'Sacks',
              'Sacks Allowed',
            ],             
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
        if (this.teamHistory) {
            this.dataLoaded = true;
        }
    }
  },
  components: {
    Loading,
  },
};
</script>


<template>
<div v-if="teamHistory">
    <table class="spreadsheet-table">
        <th v-for="(column,index) in historyColumns" :key="index">
            {{ column }}
        </th> 

        <tr v-for="hist in teamHistory">
            <td>{{ hist['Week'] }}</td>
            <td><router-link :to="{ name: 'team-detail-history', params: { team:hist['Opponent Final']} }">{{ hist['Opponent Abbreviation'] }}</router-link></td>
            <td>{{ hist['Home/Away'] }}</td>
            <td :class="{'team-history-table-result-win': hist['Win/Loss'] === 'Won', 'team-history-table-result-loss': hist['Win/Loss'] === 'Lost'}">{{ hist['Win/Loss'] }}</td>
            <td>{{ hist['Points Scored'] }}</td>
            <td>{{ hist['Points Allowed'] }}</td>
            <td>{{ hist['SUM of Total Net Yards'] }}</td>
            <td>{{ hist['SUM of Total Yards Allowed'] }}</td>
            <td>{{ hist['Net Rushing'] }}</td>
            <td>{{ hist['Rush Allowed'] }}</td>
            <td>{{ hist['Net Passing'] }}</td>
            <td>{{ hist['Passing Allowed'] }}</td>
            <td>{{ hist["SUM of Rushing TD's"] }}</td>
            <td>{{ hist["SUM of Rushing TD's Allowed"] }}</td>
            <td>{{ hist["SUM of Passing TD's"] }}</td>
            <td>{{ hist["SUM of Passing TD's Allowed"] }}</td>
            <td>{{ hist["SUM of Interceptions Thrown"] }}</td>
            <td>{{ hist["SUM of Interceptions Caught"] }}</td>
            <td>{{ hist["SUM of Turnovers"] }}</td>
            <td>{{ hist["SUM of Turnovers Forced"] }}</td>
            <td>{{ hist["SUM of Sacks Forced"] }}</td>
            <td>{{ hist["SUM of Sacks Allowed"] }}</td>
        </tr>
    </table>
</div>
</template>