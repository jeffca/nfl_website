<script>

export default {
    name: "LastWeekStarsTable",
    data() {
        return {
            numericColumns: [
                "Passing",
                "Pass Yds", 
                "Long", 
                "Pass TDs", 
                "Interceptions"
            ],
            QBColumns: [
                'Week',
                'Player',
                'Team',
                'Opponent',
                'Passing',
                'Pass Yds',
                'Long',
                'Pass TDs',
                'Interceptions',
            ], 
            HTMLHeaderToDatabaseColumnMapping: {
                "Week": "Week Number",
                "Player": "Player",
                "Team": "Team Final",
                "Opponent": "Opponent Final",
                "Passing": "SUM of Cmp",
                "Pass Yds": "SUM of Yds",
                "Long": "SUM of Lg",
                "Pass TDs": "SUM of TD",
                "Interceptions": "SUM of Int"
            },
            QBSortOrder: null,
            QBSortColumn: null,        
            selectedColumn: 'Pass Yds',        
        }
    },
    computed: {
        sortedQBs() {
        let data = this.qbs; // Clone the data array
        let database_column = this.HTMLHeaderToDatabaseColumnMapping[this.QBSortColumn];
        if (this.QBSortColumn) {
            if (this.numericColumns.includes(this.QBSortColumn)) {
            data.sort((a, b) => {
                const valA = parseInt(a[database_column].replace(/,/g, ''), 10);
                const valB = parseInt(b[database_column].replace(/,/g, ''), 10);
                const order = this.QBSortOrder === 'desc' ? -1 : 1;
                return (valA < valB ? -1 : (valA > valB ? 1 : 0)) * order;
            });        
            } else {
                data.sort((a, b) => {
                const valA = a[database_column];
                const valB = b[database_column];
                const order = this.QBSortOrder === 'desc' ? -1 : 1;
                return (valA < valB ? -1 : (valA > valB ? 1 : 0)) * order;
            });
            }
        }
        return data;
        },    
    },
    props: {
        qbs: {
            type: Array,
            required: true,
        }
    },
    mounted() {
        //set this to 'asc' so that when sortRBTable is called, it flips it to desc which is what we want
        this.QBSortOrder = "asc";
        this.sortQBTable("Pass Yds");
    },
    methods: {
        sortQBTable(key) {
            if (this.QBSortColumn === key) {
                this.QBSortOrder = this.QBSortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.QBSortColumn = key;
                if (this.numericColumns.includes(this.QBSortColumn)) {
                    this.QBSortOrder = 'desc';
                } else {
                    this.QBSortOrder = 'asc';
                }
            }
        },            
    }
}

</script>

<template>

    <div class="table-sort-order-select-div">
        <span>Sort Order:</span>&nbsp;
        <select class="table-sort-order-select" :id="QBSortOrder" v-model="selectedColumn" @change="sortQBTable(selectedColumn)">
            <option v-for="column in QBColumns.slice(1)" :key="column" :value="column">{{ column }}</option>
        </select>
    </div>

    <div class="stars-table">
        <table class="spreadsheet-table last-week-stars-table"> 
            <th v-for="(column, index) in QBColumns" :key="index" @click="sortQBTable(column)">
            {{ column }}
            <span v-if="QBSortColumn === column">
                <font-awesome-icon v-if="QBSortOrder === 'asc'" :icon="['fas', 'arrow-up']" />
                <font-awesome-icon v-if="QBSortOrder === 'desc'" :icon="['fas', 'arrow-down']" />
            </span>
            </th>
            <tbody>
                <tr v-for="player in sortedQBs" :key="player.Player">
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
                    <td><strong>{{ player["SUM of Cmp"] }}/{{ player["SUM of Att"] }}</strong> &ndash; {{ player["SUM of Completion %"] }}</td>
                    <td>{{ player["SUM of Yds"] }}</td>
                    <td>{{ player["SUM of Lg"] }}</td>
                    <td>{{ player["SUM of TD"] }}</td>
                    <td>{{ player["SUM of Int"] }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

