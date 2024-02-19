<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "RushingMatchupsTable",
    data() {
        return {
            dataLoaded: false,
            weekWithActuals: false,
            passingColumns: [
                'Team',
                'Starting QB',
                'Top Receivers',
                'Next Opponent',
                'Team Avg Pass Yds',
                'Next Opponent Avg Pass Yds Allowed',
                'Expected Pass Yds',
            ],
            numericColumns: [
                "Team Avg Pass Yds",
                "Next Opponent Avg Pass Yds Allowed", 
                "Expected Pass Yds", 
                "Actual Pass Yds", 
            ],
            HTMLHeaderToDatabaseColumnMapping: {
                "Team": "Team",
                "Top Receivers": "top_receivers",
                "Starting QB": "starting_qb",
                "Next Opponent": "Next Opponent",
                "Team Avg Pass Yds": "Passing Yards Average",
                "Next Opponent Avg Pass Yds Allowed": "Next Opponent Passing Yards Allowed",
                "Expected Pass Yds": "Expected Pass Yards",
                "Actual Pass Yds": "Passing Yards Result",
            },
            tableSortOrder: null,
            tableSortColumn: null,        
            selectedColumn: 'Expected Pass Yds',       
        }
    },
    computed: {
        sortedPassingMatchups() {
            let data = this.passingMatchups; // Clone the data array
            let database_column = this.HTMLHeaderToDatabaseColumnMapping[this.tableSortColumn];
            if (this.tableSortColumn) {
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
        passingMatchups: {
            type: Array,
            required: true,
        },
    },    
  mounted() {
    this.tableSortOrder = 'asc';
    if (this.passingMatchups[0]['Passing Yards Result'] == 'N/A') {
        this.sortTable("Expected Pass Yds");
    } else {
        this.weekWithActuals = true;
        this.sortTable("Actual Pass Yds");
    }
  },
  methods: {
    async sortTable(key) {
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
            <option v-for="column in passingColumns" :key="column" :value="column">{{ column }}</option>
            <option v-if="weekWithActuals" :value="'Actual Pass Yds'">Actual Pass Yds</option>
        </select>
    </div>

    <div class="content-table passing-matchups">
            <table class="spreadsheet-table matchup-table" v-if="sortedPassingMatchups">
            <th v-for="column in passingColumns" @click="sortTable(column)">
                {{ column }}
                <span v-if="tableSortColumn === column">
                    <font-awesome-icon v-if="tableSortOrder === 'asc'" :icon="['fas', 'arrow-up']" />
                    <font-awesome-icon v-if="tableSortOrder === 'desc'" :icon="['fas', 'arrow-down']" />
                </span>
            </th>
            <th v-if="weekWithActuals" @click="sortTable('Actual Pass Yds')" style="color: green;">
                Actual Pass Yds
                <span v-if="tableSortColumn === 'Actual Pass Yds'">
                    <font-awesome-icon v-if="tableSortOrder === 'asc'" :icon="['fas', 'arrow-up']" />
                    <font-awesome-icon v-if="tableSortOrder === 'desc'" :icon="['fas', 'arrow-down']" />
                </span>
            </th>
            <tr v-for="pm in sortedPassingMatchups">
                <td>
                    <router-link :to="{ name: 'team-detail-history', params: { team:pm['Team']} }">{{ pm["Team"] }}</router-link>
                </td>
                <td>
                    <router-link :to="{ name: 'player-history', params: { player:pm['starting_qb'][0] }, query: { stat:'passing' }}">
                        {{ pm["starting_qb"][0] }}
                    </router-link>
                </td>
                <td>
                    <router-link :to="{ name: 'player-history', params: { player:pm['top_receivers'][0] }, query: { stat:'receiving' }}">
                        {{ pm["top_receivers"][0] }}
                    </router-link>, 
                    <router-link :to="{ name: 'player-history', params: { player:pm['top_receivers'][1] }, query: { stat:'receiving' }}">
                        {{ pm["top_receivers"][1] }}
                    </router-link>
                </td>
                <td v-if="pm['Next Opponent'] != 'Bye'">
                    <span v-if="pm['Home or Away'] == 'Home'">vs </span>
                    <span v-else-if="pm['Home or Away'] == 'Away'">@</span>
                    <router-link :to="{ name: 'team-detail-history', params: { team:pm['Next Opponent']} }">{{ pm["Next Opponent"] }}</router-link>
                </td>
                <td v-else>
                    Bye
                </td>
                <td>{{ pm["Passing Yards Average"] }}</td>
                <td>{{ pm["Next Opponent Passing Yards Allowed"] }}</td>
                <td>{{ pm["Expected Pass Yards"] }}</td>
                <td v-if="sortedPassingMatchups[0]['Passing Yards Result'] != 'N/A'">
                    {{ pm["Passing Yards Result"] }}
                </td>
            </tr>
        </table>
    </div>
</template>