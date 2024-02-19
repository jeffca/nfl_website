<script>

export default {
    name: "LastWeekStarsTable",
    data() {
        return {
            numericColumns: [
                "Pass Targets", 
                "Receptions", 
                "Receiving Yds", 
                "Avg Receiving Yds", 
                "Long", 
                "Receiving TDs", 
                "Pct. of Team Total Targets", 
                "Pct. of Team Total Receiving Yds"
            ],
            WRColumns: [
                'Week',
                'Player',
                'Team',
                'Opponent',
                'Pass Targets',
                'Receptions',
                'Receiving Yds',
                'Avg Receiving Yds',
                'Long',
                'Receiving TDs',
                'Pct. of Team Total Targets',
                'Pct. of Team Total Receiving Yds',
            ], 
            HTMLHeaderToDatabaseColumnMapping: {
                "Week": "Week Number",
                "Player": "Player",
                "Team": "Team Final",
                "Opponent": "Opponent Final",
                "Pass Targets": "SUM of Tar",
                "Receptions": "SUM of Rec",
                "Receiving Yds": "SUM of Yds",
                "Avg Receiving Yds": "SUM of Avg",
                "Long": "SUM of Lg",
                "Receiving TDs": "SUM of TD",
                "Pct. of Team Total Targets": "SUM of % of Total Targets",
                "Pct. of Team Total Receiving Yds": "SUM of % of Total Yards in Game",
            },
            WRSortOrder: null,
            WRSortColumn: null,        
            selectedColumn: 'Receiving Yds',     
        }
    },
    computed: {
        sortedWRs() {
        let data = this.wrs; // Clone the data array
        let database_column = this.HTMLHeaderToDatabaseColumnMapping[this.WRSortColumn];
        if (this.WRSortColumn) {
            if (this.numericColumns.includes(this.WRSortColumn)) {
            data.sort((a, b) => {
                const valA = parseInt(a[database_column].replace(/,/g, ''), 10);
                const valB = parseInt(b[database_column].replace(/,/g, ''), 10);
                const order = this.WRSortOrder === 'desc' ? -1 : 1;
                return (valA < valB ? -1 : (valA > valB ? 1 : 0)) * order;
            });        
            } else {
                data.sort((a, b) => {
                const valA = a[database_column];
                const valB = b[database_column];
                const order = this.WRSortOrder === 'desc' ? -1 : 1;
                return (valA < valB ? -1 : (valA > valB ? 1 : 0)) * order;
            });
            }
        }
        return data;
        },    
    },       
    props: {
        wrs: {
            type: Array,
            required: true,
        }
    },
    mounted() {
        //set this to 'asc' so that when sortWRTable is called, it flips it to desc which is what we want
        this.WRSortOrder = "asc";
        this.sortWRTable("Receiving Yds");
    },    
    methods: {
        sortWRTable(key) {
            console.log("user wants a new sort order");
            if (this.WRSortColumn === key) {
                this.WRSortOrder = this.WRSortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.WRSortColumn = key;
                if (this.numericColumns.includes(key)) {
                    this.WRSortOrder = 'desc';
                } else {
                    this.WRSortOrder = 'asc';
                }
            }
        },            
    }    
}

</script>

<template>

    <div class="table-sort-order-select-div">
        <span>Sort Order:</span>&nbsp;
        <select class="table-sort-order-select" :id="WRSortOrder" v-model="selectedColumn" @change="sortWRTable(selectedColumn)">
            <option v-for="column in WRColumns.slice(1)" :key="column" :value="column">{{ column }}</option>
        </select>
    </div>   

    <div class="stars-table">
        <table class="spreadsheet-table last-week-stars-table"> 
            <th v-for="(column, index) in WRColumns" :key="index" @click="sortWRTable(column)">
            {{ column }}
            <span v-if="WRSortColumn === column">
                <font-awesome-icon v-if="WRSortOrder === 'asc'" :icon="['fas', 'arrow-up']" />
                <font-awesome-icon v-if="WRSortOrder === 'desc'" :icon="['fas', 'arrow-down']" />
            </span>
            </th>        

            <tbody>
                <tr v-for="player in sortedWRs" :key="player.id">
                    <td>{{ player["Week Number"] }}</td>
                    <td>
                        <router-link :to="{name: 'player-history', params: { player:player['Player']} }">{{ player["Player"] }}</router-link>
                    </td>
                    <td>
                        <router-link :to="{name: 'team-detail-history', params: { team:player['Team Final']} }">{{ player["Team Final"] }}</router-link>
                    </td>
                    <td>
                        <span v-if="player['Home or Away'] == 'Home'">vs </span>
                        <span v-else>@</span> 
                        <router-link :to="{ name: 'team-detail-history', params: { team:player['Opponent Final']} }">{{ player["Opponent Final"] }}</router-link>
                    </td>
                    <td>{{ player["SUM of Tar"] }}</td>
                    <td>{{ player["SUM of Rec"] }}</td>
                    <td>{{ player["SUM of Yds"] }}</td>
                    <td>{{ player["SUM of Avg"] }}</td>
                    <td>{{ player["SUM of Lg"] }}</td>
                    <td>{{ player["SUM of TD"] }}</td>
                    <td>{{ player["SUM of % of Total Targets"] }}</td>
                    <td>{{ player["SUM of % of Total Yards in Game"] }}</td>
                </tr>
            </tbody>
        </table>
    </div>

</template>

