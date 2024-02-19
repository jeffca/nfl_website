<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "RushingMatchupsTable",
    data() {
        return {
            weekWithActuals: false,
            rushingColumns: [
                'Team',
                'Top Rushers',
                'Next Opponent',
                'Team Avg Rush Yds',
                'Next Opponent Avg Rush Yds Allowed',
                'Expected Rush Yds',                
            ],
            numericColumns: [
                "Team Avg Rush Yds",
                "Next Opponent Avg Rush Yds Allowed", 
                "Expected Rush Yds", 
                "Actual Rush Yds", 
            ],
            HTMLHeaderToDatabaseColumnMapping: {
                "Team": "Team",
                "Top Rushers": "top_rushers",
                "Next Opponent": "Next Opponent",
                "Team Avg Rush Yds": "Rushing Yards Average",
                "Next Opponent Avg Rush Yds Allowed": "Next Opponent Rushing Yards Allowed",
                "Expected Rush Yds": "Expected Rush Yards",
                "Actual Rush Yds": "Rushing Yards Result",
            },
            tableSortOrder: null,
            tableSortColumn: null,        
            selectedColumn: 'Expected Rush Yds',                 
        }
    },
    computed: {
        sortedRushingMatchups() {
            let data = this.rushingMatchups; // Clone the data array
            let database_column = this.HTMLHeaderToDatabaseColumnMapping[this.tableSortColumn];
            if (this.tableSortColumn) {
                console.log("sorting the data...");
                if (this.numericColumns.includes(this.tableSortColumn)) {
                    data.sort((a, b) => {
                        const valA = parseInt(a[database_column].replace(/,/g, ''), 10);
                        const valB = parseInt(b[database_column].replace(/,/g, ''), 10);
                        const order = this.tableSortOrder === 'desc' ? -1 : 1;

                        // Handle null values
                        if (isNaN(valA)) return 1;
                        if (isNaN(valB)) return -1;
                        
                        return (valA < valB ? -1 : (valA > valB ? 1 : 0)) * order;
                    });        
                } else {
                    data.sort((a, b) => {
                        const valA = a[database_column];
                        const valB = b[database_column];
                        const order = this.tableSortOrder === 'desc' ? -1 : 1;
                        return (valA < valB ? -1 : (valA > valB ? 1 : 0)) * order;
                    });
                }
            }
            return data;
        },    
    },
    props: {
        rushingMatchups: {
            type: Array,
            required: true,
        },
    },    
  mounted() {
    this.tableSortOrder = 'asc';
    if (this.rushingMatchups[0]['Rushing Yards Result'] == 'N/A') {
        this.sortTable("Expected Rush Yds");
    } else {
        this.weekWithActuals = true;
        this.sortTable("Actual Rush Yds");
    }
  },
  methods: {
    sortTable(key) {
        if (this.tableSortColumn === key) {
            this.tableSortOrder = this.tableSortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.tableSortColumn = key;
            if (this.numericColumns.includes(this.tableSortColumn)) {
                this.tableSortOrder = 'desc';
            } else {
                this.tableSortOrder = 'asc';
            }
        }
    },        
  },
  components: {
    Loading,
  },
};

</script>

<template>

    <div class="table-sort-order-select-div">
        <span>Sort Order:</span>&nbsp;
        <select class="table-sort-order-select" :id="tableSortOrder" v-model="selectedColumn" @change="sortTable(selectedColumn)">
            <option v-for="column in rushingColumns" :key="column" :value="column">{{ column }}</option>
            <option v-if="weekWithActuals" value="Actual Rush Yds">Actual Rush Yds  </option>
        </select>
    </div>
    <div class="content-table rushing-matchups">
        <table class="spreadsheet-table matchup-table" v-if="sortedRushingMatchups">
            <th v-for="(col,index) in rushingColumns" :key="index" @click="sortTable(col)">
                {{ col }}
                <span v-if="tableSortColumn === col">
                    <font-awesome-icon v-if="tableSortOrder === 'asc'" :icon="['fas', 'arrow-up']" />
                    <font-awesome-icon v-if="tableSortOrder === 'desc'" :icon="['fas', 'arrow-down']" />
                </span>
            </th>
            <th v-if="weekWithActuals" @click="sortTable('Actual Rush Yds')" style="color: green;">
                Actual Rush Yds
                <span v-if="tableSortColumn === 'Actual Rush Yds'">
                    <font-awesome-icon v-if="tableSortOrder === 'asc'" :icon="['fas', 'arrow-up']" />
                    <font-awesome-icon v-if="tableSortOrder === 'desc'" :icon="['fas', 'arrow-down']" />
                </span>
            </th>
            <tr v-for="rm in sortedRushingMatchups">
                <td>
                    <router-link :to="{ name: 'team-detail-history', params: { team:rm['Team']} }">{{ rm["Team"] }}</router-link>
                </td>
                <td>
                    <router-link :to="{ name: 'player-history', params: { player:rm['top_rushers'][0] }, query: { stat:'rushing' }}">
                        {{ rm["top_rushers"][0] }}
                    </router-link>, 
                    <router-link :to="{ name: 'player-history', params: { player:rm['top_rushers'][1] }, query: { stat:'rushing' }}">
                        {{ rm["top_rushers"][1] }}
                    </router-link>
                </td>
                <td v-if="rm['Next Opponent'] != 'Bye'">
                    <span v-if="rm['Home or Away'] == 'Home'">vs </span>
                    <span v-else-if="rm['Home or Away'] == 'Away'">@</span>
                    <router-link :to="{ name: 'team-detail-history', params: { team:rm['Next Opponent']} }">{{ rm["Next Opponent"] }}</router-link>
                </td>
                <td v-else>
                    Bye
                </td>
                <td>{{ rm["Rushing Yards Average"] }}</td>
                <td>{{ rm["Next Opponent Rushing Yards Allowed"] }}</td>
                <td>{{ rm["Expected Rush Yards"] }}</td>
                <td v-if="this.rushingMatchups[0]['Rushing Yards Result'] != 'N/A'">
                    {{ rm["Rushing Yards Result"] }}
                </td>
            </tr>
        </table>
    </div>

</template>