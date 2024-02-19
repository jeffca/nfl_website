<script>

export default {
    name: "LastWeekStarsTable",
    data() {
        return {
            numericColumns: [
                "Rush Attempts", 
                "Rush Yds", 
                "Avg Rush Yds", 
                "Long", 
                "Rush TDs", 
                "Pct. of Team Total Rush Attempts", 
                "Pct. of Team Total Rush Yards"
            ],
            RBColumns: [
                'Week',
                'Player',
                'Team',
                'Opponent',
                'Rush Attempts',
                'Rush Yds',
                'Avg Rush Yds',
                'Long',
                'Rush TDs',
                'Pct. of Team Total Rush Attempts',
                'Pct. of Team Total Rush Yards',
            ], 
            HTMLHeaderToDatabaseColumnMapping: {
                "Week": "Week Number",
                "Player": "Player",
                "Team": "Team Final",
                "Opponent": "Opponent Final",
                "Rush Attempts": "SUM of Att",
                "Rush Yds": "SUM of Yds",
                "Avg Rush Yds": "SUM of Avg",
                "Long": "SUM of Lg",
                "Rush TDs": "SUM of TD",
                "Pct. of Team Total Rush Attempts": "SUM of % of Attempt Total",
                "Pct. of Team Total Rush Yards": "SUM of % of Total Rush Yards in Game",
            },
            RBSortOrder: null,
            RBSortColumn: null,        
            selectedColumn: 'Rush Yds',                      
        }
    },
    computed: {
        sortedRBs() {
        let data = this.rbs; // Clone the data array
        let database_column = this.HTMLHeaderToDatabaseColumnMapping[this.RBSortColumn];
        if (this.RBSortColumn) {
            if (this.numericColumns.includes(this.RBSortColumn)) {
            data.sort((a, b) => {
                const valA = parseInt(a[database_column].replace(/,/g, ''), 10);
                const valB = parseInt(b[database_column].replace(/,/g, ''), 10);
                const order = this.RBSortOrder === 'desc' ? -1 : 1;
                return (valA < valB ? -1 : (valA > valB ? 1 : 0)) * order;
            });        
            } else {
                data.sort((a, b) => {
                const valA = a[database_column];
                const valB = b[database_column];
                const order = this.RBSortOrder === 'desc' ? -1 : 1;
                return (valA < valB ? -1 : (valA > valB ? 1 : 0)) * order;
            });
            }
        }
        return data;
        },    
    },    
    props: {
        rbs: {
            type: Array,
            required: true,
        }
    },
    mounted() {
        //set this to 'asc' so that when sortRBTable is called, it flips it to desc which is what we want
        this.RBSortOrder = "asc";
        this.sortRBTable("Rush Yds");
    },
    methods: {
        sortRBTable(key) {
            if (this.RBSortColumn === key) {
                this.RBSortOrder = this.RBSortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.RBSortColumn = key;
                if (this.numericColumns.includes(this.RBSortColumn)) {
                    this.RBSortOrder = 'desc';
                } else {
                    this.RBSortOrder = 'asc';
                }
            }
        },            
    }    
}

</script>

<template>

   <div class="table-sort-order-select-div">
        <span>Sort Order:</span>&nbsp;
        <select class="table-sort-order-select" :id="RBSortOrder" v-model="selectedColumn" @change="sortRBTable(selectedColumn)">
            <option v-for="column in RBColumns.slice(1)" :key="column" :value="column">{{ column }}</option>
        </select>
    </div>

    <div class="stars-table">
        <table class="spreadsheet-table last-week-stars-table"> 
            <th v-for="(column, index) in RBColumns" :key="index" @click="sortRBTable(column)">
            {{ column }}
            <span v-if="RBSortColumn === column">
                <font-awesome-icon v-if="RBSortOrder === 'asc'" :icon="['fas', 'arrow-up']" />
                <font-awesome-icon v-if="RBSortOrder === 'desc'" :icon="['fas', 'arrow-down']" />
            </span>
            </th>        

            <tbody>
                <tr v-for="player in sortedRBs" :key="player.id">
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
                    <td>{{ player["SUM of Att"] }}</td>
                    <td>{{ player["SUM of Yds"] }}</td>
                    <td>{{ player["SUM of Avg"] }}</td>
                    <td>{{ player["SUM of Lg"] }}</td>
                    <td>{{ player["SUM of TD"] }}</td>
                    <td>{{ player["SUM of % of Attempt Total"] }}</td>
                    <td>{{ player["SUM of % of Total Rush Yards in Game"] }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

