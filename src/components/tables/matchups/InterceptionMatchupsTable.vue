<script>
import Loading from '../../shared/Loading.vue';

export default {
    name: "InterceptionMatchupsTable",
    data() {
        return {
            dataLoaded: false,
            weekWithActuals: false,
            interceptionColumns: [
                'Team',
                'Starting QB',
                'Next Opponent',
                'Starting QB Avg Interceptions Thrown',
                'Next Opponent Avg Interceptions Caught',
                'Expected Interceptions',                
            ],
            numericColumns: [
                "Starting QB Avg Interceptions Thrown",
                "Next Opponent Avg Interceptions Caught", 
                "Expected Interceptions", 
                "Actual Interceptions Thrown", 
            ],
            HTMLHeaderToDatabaseColumnMapping: {
                "Team": null,
                "Starting QB": 0,
                "Next Opponent": 2,
                "Starting QB Avg Interceptions Thrown": 1,
                "Next Opponent Avg Interceptions Caught": 3,
                "Expected Interceptions": 4,
                "Actual Interceptions Thrown": 5,
            },
            tableSortOrder: null,
            tableSortColumn: null,        
            selectedColumn: 'Expected Interceptions',       
        }
    },
    computed: {
        sortedInterceptionMatchups() {
            let data = this.interceptionMatchups; // Clone the data array
            let database_column = this.HTMLHeaderToDatabaseColumnMapping[this.tableSortColumn];
            if (this.tableSortColumn != 'Team') {
                const sortedData = Object.entries(data).sort(([keyA, a], [keyB, b]) => {
                    const valA = this.numericColumns.includes(this.tableSortColumn) ? parseFloat(a[database_column], 10) : a[database_column];
                    const valB = this.numericColumns.includes(this.tableSortColumn) ? parseFloat(b[database_column], 10) : b[database_column];
                    const order = this.tableSortOrder === 'desc' ? -1 : 1;
                    return (valA < valB ? -1 : valA > valB ? 1 : 0) * order;
                });
                data = Object.fromEntries(sortedData);
            } else {
                console.log("user wants to filter on team");    
                // Create an array of objects with key and value properties
                const keyValueArray = Object.entries(data).map(([key, value]) => ({ key, value }));

                const order = this.tableSortOrder === 'desc' ? -1 : 1;

                // Sort the array based on the key property
                keyValueArray.sort((a, b) => {
                    const comparison = a.key.localeCompare(b.key)
                    return order * comparison;
                }); 

                // Reconstruct the object using the sorted array
                data = Object.fromEntries(keyValueArray.map(({ key, value }) => [key, value]));

            }
            return data;
        },    
    },
    props: {
        interceptionMatchups: {
            type: Object,
            required: true,
        },
    },    
  mounted() {
    this.tableSortOrder = 'asc';
    //check the 5th element of the first key in the interceptionMatchups to see if this is a week with actuals
    if (this.interceptionMatchups[Object.keys(this.interceptionMatchups)[0]][5] == "N/A") {
        this.sortTable("Expected Interceptions");
    } else {
        this.weekWithActuals = true;
        this.sortTable("Actual Interceptions Thrown");
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
            <option v-for="column in interceptionColumns" :key="column" :value="column">{{ column }}</option>
            <option v-if="weekWithActuals" :value="'Actual Interceptions Thrown'">Actual Interceptions Thrown</option>
        </select>
    </div>    

    <div class="content-table passing-matchups">
        <table class="spreadsheet-table matchup-table" v-if="sortedInterceptionMatchups">
            <th v-for="column in interceptionColumns" @click="sortTable(column)">
                {{ column }}
                <span v-if="tableSortColumn === column">
                    <font-awesome-icon v-if="tableSortOrder === 'asc'" :icon="['fas', 'arrow-up']" />
                    <font-awesome-icon v-if="tableSortOrder === 'desc'" :icon="['fas', 'arrow-down']" />
                </span>
            </th>
            <th v-if="weekWithActuals" @click="sortTable('Actual Interceptions Thrown')" style="color: green;">
                Actual Interceptions Thrown
                <span v-if="tableSortColumn === 'Actual Interceptions Thrown'">
                    <font-awesome-icon v-if="tableSortOrder === 'asc'" :icon="['fas', 'arrow-up']" />
                    <font-awesome-icon v-if="tableSortOrder === 'desc'" :icon="['fas', 'arrow-down']" />
                </span>
            </th>

            <tr v-for="(im,index) in sortedInterceptionMatchups" :key="index">
                <td><router-link :to="{ name: 'team-detail-history', params: { team:index} }">{{ index }}</router-link></td>
                <td><router-link :to="{ name: 'player-history', params: { player:im[0] }, query: { stat:'passing' }}">{{ im[0] }}</router-link></td>
                
                <td v-if="im[2] != 'Bye'">
                    <router-link :to="{ name: 'team-detail-history', params: { team:im[2]} }">{{ im[2] }}</router-link>
                </td>
                <td v-else>
                    Bye
                </td>
                <td>{{ im[1] }}</td>
                <td>{{ im[3] }}</td>
                <td>{{ im[4] }}</td>
                <td v-if="weekWithActuals">
                    {{ im[5] }}
                </td>
            </tr>
        </table>
    </div>
</template>