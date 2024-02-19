<script>
import axios from 'axios';
import UpcomingGameTeamStatsTable from './tables/team/UpcomingGameTeamStatsTable.vue';

export default {
  data() {
    return {
        games: [],
        teams: [],
        firstDateOfGames: null,
        lastDateOfGames: null,
        daysOfWeekWithGames: [],
        datesOfDaysOfWeekWithGames: [],
        daysOfWeekWithGamesData: [],
        isExpanded: new Array(16).fill(false), 
        showMoreColumns: new Array(16).fill(false), 
        dayOfWeekExpanded: [],      
        homeTeamStatsColumns: [
            'Points Scored',
            'Points Allowed',
            'Total Yards',
            'Total Yards Allowed',
            'Rush Yards',
            'Rush Yards Allowed',
            'Pass Yards',
            'Pass Yards Allowed',
        ],
        awayTeamStatsColumns: [
            'Points Scored',
            'Points Allowed',
            'Total Yards',
            'Total Yards Allowed',
            'Rush Yards',
            'Rush Yards Allowed',
            'Pass Yards',
            'Pass Yards Allowed',
        ],
        awayTeamAwayStatsColumns: [
            'Points Scored on Road',
            'Points Allowed on Road',
            'Total Yards on Road',
            'Total Yards Allowed on Road',
            'Rush Yards on Road',
            'Rush Yards Allowed on Road',
            'Pass Yards on Road',
            'Pass Yards Allowed on Road',
        ],
        homeTeamHomeStatsColumns: [
            'Points Scored at Home',
            'Points Allowed at Home',
            'Total Yards at Home',
            'Total Yards Allowed on at Home',
            'Rush Yards at Home',
            'Rush Yards Allowed at Home',
            'Pass Yards at Home',
            'Pass Yards Allowed at Home',
        ],
        homeTeamStatsColumnsMore: [
            'Yards Per Play',
            'Yards Per Play Allowed',
        ],
        homeTeamHomeStatsColumnsMore: [
            'Yards Per Play at Home',
            'Yards Per Play Allowed at Home',
        ],
        awayTeamStatsColumnsMore: [
            'Yards Per Play',
            'Yards Per Play Allowed'
        ],
        awayTeamAwayStatsColumnsMore: [
            'Yards Per Play on Road',
            'Yards Per Play Allowed on Road',
        ],
        awayColumnsChecked: new Array(16).fill(false),
        homeColumnsChecked: new Array(16).fill(false),
    };
  },
  computed: {    
        totalGamesByDay() {
            const totalGamesByDay = [];
            for (let i = 0; i < this.daysOfWeekWithGames.length; i++) {
                totalGamesByDay.push({ day: this.daysOfWeekWithGames[i], totalGames: this.daysOfWeekWithGamesData[i].length });
            }
            return totalGamesByDay;
        }        
    },  
  methods: {
        getCurrentTotalGames(dayIndex, gameIndex) {
            let totalGames = 0;
            for (let i = 0; i < this.totalGamesByDay.length; i++) {
                totalGames += this.totalGamesByDay[i]['totalGames'];
            }
            let count = 1;
            if (dayIndex == 0) {
                count += gameIndex;
            } else if (dayIndex == 1) {
                count = this.totalGamesByDay[0]["totalGames"] + 1;
                count += gameIndex;
            } else if (dayIndex == 2) {
                count = this.totalGamesByDay[0]["totalGames"] + this.totalGamesByDay[1]["totalGames"] + 1;
                count += gameIndex;
            }  else if (dayIndex == 3) {
                count = this.totalGamesByDay[0]["totalGames"] + this.totalGamesByDay[1]["totalGames"] + this.totalGamesByDay[2]["totalGames"] + 1;
                count += gameIndex;

            //should be a maximum of 4 days in a week of NFL games: Thursday, Friday/Saturday, Sunday, Monday
            }  else if (dayIndex == 4) {
                count = this.totalGamesByDay[0]["totalGames"] + this.totalGamesByDay[1]["totalGames"] + this.totalGamesByDay[2]["totalGames"] + this.totalGamesByDay[3]["totalGames"] + 1;
                count += gameIndex;
            }    
            return count;
        },
        getTransitionName(homeAway, index, gameIndex) {
            if (homeAway == 'away') {
                return this.awayColumnsChecked[this.getCurrentTotalGames(index, gameIndex)] ? 'upcoming-game-fade-enter' : 'upcoming-game-fade';
            }
        },
        toggleAwayColumns(index) {
            console.log(this.awayColumnsChecked[index]);
            console.log("user wants to see away columns");
        },  
        toggleHomeColumns(index) {
            console.log("user wants to see home columns");
            console.log(this.awayColumnsChecked[index]);
        },  
        moreColumns(event, index) {
            event.preventDefault();
            this.showMoreColumns[index] = !this.showMoreColumns[index];
            const content = document.getElementById('upcoming-games-content-' + index);
            const moreStatsTable = document.getElementById('upcoming-game-column-5');
            if (content) {
                
                const scrollHeight = content.scrollHeight;
                const clientHeight = content.clientHeight;

                setTimeout(function() {
                    content.scrollTo({
                        top: 575,
                        behavior: 'smooth'
                    })
                    const scrollPosition = scrollHeight + 25; // or any desired scroll position

                    moreStatsTable.scrollIntoView({ behavior: 'smooth', block: 'start' });

                }, 2);                
            }
            console.log(content);

        },
        toggleDayOfWeek(index) {
            this.dayOfWeekExpanded[index] = !this.dayOfWeekExpanded[index];
        },      
        toggleContent(index) {
            this.isExpanded[index] = !this.isExpanded[index];
        },              
    },  
  mounted() {

    //fetch the next games
    axios.get('http://127.0.0.1:3000/Schedule')
      .then(response => {
        this.games = response.data.filter(item => item[0] !== '').filter((item, index) => index % 2 === 1); 
        this.firstDateOfGames = this.games[0]["Date"];
        this.lastDateOfGames = this.games[this.games.length-1]["Date"];
        for (let i = 0; i < this.games.length; i++) {
            this.teams.push(this.games[i]["Team Final"]);
            this.teams.push(this.games[i]["Opponent Final"]);
            this.games[i].homeTeamStatsColumns = [];
            this.games[i].homeTeamHomeStatsColumns = [];
            this.games[i].awayTeamStatsColumns = [];
            this.games[i].awayTeamAwayStatsColumns = [];
            this.games[i].homeTeamStatsColumnsMore = [];
            this.games[i].homeTeamHomeStatsColumnsMore = [];
            this.games[i].awayTeamStatsColumnsMore = [];
            this.games[i].awayTeamAwayStatsColumnsMore = [];
            if (!this.daysOfWeekWithGames.includes(this.games[i]["Day of Week"])) {
                this.daysOfWeekWithGames.push(this.games[i]["Day of Week"]);
                this.datesOfDaysOfWeekWithGames.push(this.games[i]["Date"]);
            }
        }

        let daysOfWeekCounter = 0;
        for (let i = 0; i < this.daysOfWeekWithGames.length; i++) {
            this.dayOfWeekExpanded.push(false);
            for (let j = 0; j < this.games.length; j++) {
                if (this.games[j]["Day of Week"] == this.daysOfWeekWithGames[i]) {
                    if (this.daysOfWeekWithGamesData[daysOfWeekCounter] == null) {
                        this.daysOfWeekWithGamesData[daysOfWeekCounter] = [this.games[j]];
                    } else {
                        this.daysOfWeekWithGamesData[daysOfWeekCounter].push(this.games[j]);
                    }
                }
            }
            daysOfWeekCounter += 1;
        }
        axios.get('http://127.0.0.1:3000/TeamAverages')
          .then(response => {
            let teamAverages = response.data;

            let gameCount = 1;
            let gamesCount = 0;

            for (let i = 0; i < this.teams.length; i++) {
                for (let j = 0; j < teamAverages.length; j++) {
                    if (teamAverages[j]["Team"] == this.teams[i]) {
                        //the first team in the teams array is the home team
                        if (gameCount == 1) {
                            this.games[gamesCount]['homeTeamStatsColumns'].push([teamAverages[j]["Points Scored Average"], teamAverages[j]["Average Points Scored Ranking"]]);
                            this.games[gamesCount]['homeTeamHomeStatsColumns'].push([teamAverages[j]["Points Scored at Home"], teamAverages[j]["Points Scored at Home Ranking"]]);
                            this.games[gamesCount]['homeTeamStatsColumns'].push([teamAverages[j]["Points Allowed Average"], teamAverages[j]["Average Points Allowed Ranking"]]);
                            this.games[gamesCount]['homeTeamHomeStatsColumns'].push([teamAverages[j]["Points Allowed at Home"], teamAverages[j]["Points Allowed at Home Ranking"]]);
                            this.games[gamesCount]['homeTeamStatsColumns'].push([teamAverages[j]["Yards Gained Average"], teamAverages[j]["Average Total Yards Gained Ranking"]]);
                            this.games[gamesCount]['homeTeamHomeStatsColumns'].push([teamAverages[j]["Total Yards at Home"], teamAverages[j]["Total Yards at Home Ranking"]]);
                            this.games[gamesCount]['homeTeamStatsColumns'].push([teamAverages[j]["Yards Allowed Average"], teamAverages[j]["Average Total Yards Allowed Ranking"]]);
                            this.games[gamesCount]['homeTeamHomeStatsColumns'].push([teamAverages[j]["Total Yards Allowed at Home"], teamAverages[j]["Total Yards Allowed at Home Ranking"]]);
                            this.games[gamesCount]['homeTeamStatsColumns'].push([teamAverages[j]["Rushing Yards Average"], teamAverages[j]["Average Rushing Yards Ranking"]]);
                            this.games[gamesCount]['homeTeamHomeStatsColumns'].push([teamAverages[j]["Rush Yards at Home"], teamAverages[j]["Rush Yards at Home Ranking"]]);
                            this.games[gamesCount]['homeTeamStatsColumns'].push([teamAverages[j]["Rushing Allowed Average"], teamAverages[j]["Average Rushing Yards Allowed Ranking"]]);
                            this.games[gamesCount]['homeTeamHomeStatsColumns'].push([teamAverages[j]["Rush Yards Allowed at Home"], teamAverages[j]["Rush Yards Allowed at Home Ranking"]]);
                            this.games[gamesCount]['homeTeamStatsColumns'].push([teamAverages[j]["Passing Yards Average"], teamAverages[j]["Average Passing Yards Ranking"]]);
                            this.games[gamesCount]['homeTeamHomeStatsColumns'].push([teamAverages[j]["Pass Yards at Home"], teamAverages[j]["Pass Yards at Home Ranking"]]);
                            this.games[gamesCount]['homeTeamStatsColumns'].push([teamAverages[j]["Passing Allowed Average"], teamAverages[j]["Average Passing Yards Allowed Ranking"]]);
                            this.games[gamesCount]['homeTeamHomeStatsColumns'].push([teamAverages[j]["Pass Yards Allowed at Home"], teamAverages[j]["Pass Yards Allowed at Home Ranking"]]);
                            
                            //more columns
                            this.games[gamesCount]['homeTeamStatsColumnsMore'].push([teamAverages[j]["Average Yards per Play"], teamAverages[j]["Yards Per Play Ranking"]]);
                            this.games[gamesCount]['homeTeamHomeStatsColumnsMore'].push([teamAverages[j]["Yards Per Play at Home"], teamAverages[j]["Yards Per Play at Home Ranking"]]);
                            this.games[gamesCount]['homeTeamStatsColumnsMore'].push([teamAverages[j]["Average Yards per Play Allowed"], teamAverages[j]["Yards Per Play Allowed Ranking"]]);
                            this.games[gamesCount]['homeTeamHomeStatsColumnsMore'].push([teamAverages[j]["Yards Per Play Allowed at Home"], teamAverages[j]["Yards Per Play Allowed at Home Ranking"]]);
                        } else {
                            this.games[gamesCount]['awayTeamStatsColumns'].push([teamAverages[j]["Points Scored Average"], teamAverages[j]["Average Points Scored Ranking"]]);
                            this.games[gamesCount]['awayTeamAwayStatsColumns'].push([teamAverages[j]["Points Scored on Road"], teamAverages[j]["Points Scored on Road Ranking"]]);
                            this.games[gamesCount]['awayTeamStatsColumns'].push([teamAverages[j]["Points Allowed Average"], teamAverages[j]["Average Points Allowed Ranking"]]);
                            this.games[gamesCount]['awayTeamAwayStatsColumns'].push([teamAverages[j]["Points Allowed on Road"], teamAverages[j]["Points Allowed on Road Ranking"]]);
                            this.games[gamesCount]['awayTeamStatsColumns'].push([teamAverages[j]["Yards Gained Average"], teamAverages[j]["Average Total Yards Gained Ranking"]]);
                            this.games[gamesCount]['awayTeamAwayStatsColumns'].push([teamAverages[j]["Total Yards on Road"], teamAverages[j]["Total Yards on Road Ranking"]]);
                            this.games[gamesCount]['awayTeamStatsColumns'].push([teamAverages[j]["Yards Allowed Average"], teamAverages[j]["Average Total Yards Allowed Ranking"]]);
                            this.games[gamesCount]['awayTeamAwayStatsColumns'].push([teamAverages[j]["Total Yards Allowed on Road"], teamAverages[j]["Total Yards Allowed on Road Ranking"]]);
                            this.games[gamesCount]['awayTeamStatsColumns'].push([teamAverages[j]["Rushing Yards Average"], teamAverages[j]["Average Rushing Yards Ranking"]]);
                            this.games[gamesCount]['awayTeamAwayStatsColumns'].push([teamAverages[j]["Rush Yards on Road"], teamAverages[j]["Rush Yards on Road Ranking"]]);
                            this.games[gamesCount]['awayTeamStatsColumns'].push([teamAverages[j]["Rushing Allowed Average"], teamAverages[j]["Average Rushing Yards Allowed Ranking"]]);
                            this.games[gamesCount]['awayTeamAwayStatsColumns'].push([teamAverages[j]["Rush Yards Allowed on Road"], teamAverages[j]["Rush Yards Allowed on Road Ranking"]]);
                            this.games[gamesCount]['awayTeamStatsColumns'].push([teamAverages[j]["Passing Yards Average"], teamAverages[j]["Average Passing Yards Ranking"]]);
                            this.games[gamesCount]['awayTeamAwayStatsColumns'].push([teamAverages[j]["Pass Yards on Road"], teamAverages[j]["Pass Yards on Road Ranking"]]);
                            this.games[gamesCount]['awayTeamStatsColumns'].push([teamAverages[j]["Passing Allowed Average"], teamAverages[j]["Average Passing Yards Allowed Ranking"]]);
                            this.games[gamesCount]['awayTeamAwayStatsColumns'].push([teamAverages[j]["Pass Yards Allowed on Road"], teamAverages[j]["Pass Yards Allowed on Road Ranking"]]);

                            //more columns
                            this.games[gamesCount]['awayTeamStatsColumnsMore'].push([teamAverages[j]['Average Yards per Play'], teamAverages[j]['Yards Per Play Ranking']]);
                            this.games[gamesCount]['awayTeamAwayStatsColumnsMore'].push([teamAverages[j]['Yards Per Play on Road'], teamAverages[j]['Yards Per Play on Road Ranking']]);
                            this.games[gamesCount]['awayTeamStatsColumnsMore'].push([teamAverages[j]['Average Yards per Play Allowed'], teamAverages[j]['Yards Per Play Allowed Ranking']]);
                            this.games[gamesCount]['awayTeamAwayStatsColumnsMore'].push([teamAverages[j]['Yards Per Play Allowed on Road'], teamAverages[j]['Yards Per Play Allowed on Road Ranking']]);
                        }
                        gameCount += 1;
                        break;
                    }
                }
                if (gameCount > 2) {
                    gameCount = 1;
                    gamesCount +=1;
                }
            }
            console.log(this.games);
            console.log(this.daysOfWeekWithGamesData);
          }).catch(error => {
            console.error("error fetching data:", error);
          });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  },
  components: {
    UpcomingGameTeamStatsTable,
  },
  provide() {
    return {
        homeTeamStatsColumns: this.homeTeamStatsColumns,
        homeTeamHomeStatsColumns: this.homeTeamHomeStatsColumns,
        awayTeamStatsColumns: this.awayTeamStatsColumns,
        awayTeamAwayStatsColumns: this.awayTeamAwayStatsColumns,
        
        homeTeamStatsColumnsMore: this.homeTeamStatsColumnsMore,
        homeTeamHomeStatsColumnsMore: this.homeTeamHomeStatsColumnsMore,
        awayTeamStatsColumnsMore: this.awayTeamStatsColumnsMore,
        awayTeamAwayStatsColumnsMore: this.awayTeamAwayStatsColumnsMore,
    }
  }
};
</script>
  
<template>

    <div class="home-container container upcoming-games-div">
      
      <h1 class="center">NFL Week 18 Schedule</h1>
        <div v-for="(day,index) in daysOfWeekWithGames" class="center day-of-week-with-games">
        <div class="collapsible" @click="toggleDayOfWeek(index)">
            <span class="day-of-week-arrow" :class="{ 'arrow-rotated': dayOfWeekExpanded[index] }"><font-awesome-icon :icon="['fas', 'square-caret-right']" /></span>
            <span class="day-of-week">{{ day }}, <span class="date-of-day-of-week">{{ datesOfDaysOfWeekWithGames[index] }}</span></span>
        </div>
        <div v-show="dayOfWeekExpanded[index]">
            <div v-for="(game, gameIndex) in daysOfWeekWithGamesData[index]" :key="gameIndex" class="upcoming-games">
                <div class="game-preview">
                    <span class="upcoming-game-arrow" :class="{ 'arrow-rotated': isExpanded[getCurrentTotalGames(index, gameIndex)] }"><font-awesome-icon :icon="['fas', 'square-caret-right']" /></span>
                    <span class="upcoming-game-team-matchup" @click="toggleContent(getCurrentTotalGames(index, gameIndex))">
                        <span>{{ game['Opponent Final'] }}</span> 
                        <!-- <span class="team-name" :id="'team-name-' + game['Opponent Final'].replace('Commanders', 'Command').replace('Raiders', 'Raid').slice(-4)">{{ game['Opponent Final'] }}</span>  -->
                        @ 
                        <span>{{ game['Team Final'] }}</span>
                        <!-- <span class="team-name" :id="'team-name-' + game['Team Final'].replace('Commanders', 'Command').replace('Raiders', 'Raid').slice(-4)">{{ game['Team Final'] }}</span> -->
                    </span>
                    <br />
                    <span>{{ game['Time EST'] }} EST</span> <br />
                    <span>{{ game['Opening Line'] }}</span> <br />
                </div>
                <div :id="'upcoming-games-content-' + getCurrentTotalGames(index, gameIndex)" class="upcoming-games-content center" v-show="isExpanded[getCurrentTotalGames(index, gameIndex)]">
                    <br />

                    <div class="upcoming-games-toggle-home-away-columns-div">                        
                        <input type='checkbox' v-model="awayColumnsChecked[getCurrentTotalGames(index, gameIndex)]" @change="toggleAwayColumns(getCurrentTotalGames(index, gameIndex))" :id="'selectAwayColumns' + getCurrentTotalGames(index, gameIndex)" :name="'selectAwayColumns' + getCurrentTotalGames(index, gameIndex)"><label :for="'selectAwayColumns' + getCurrentTotalGames(index, gameIndex)">Show {{ game['Opponent Abbrev'] }} Away Stats</label>
                        <input type='checkbox' v-model="homeColumnsChecked[getCurrentTotalGames(index, gameIndex)]" @change="toggleHomeColumns(getCurrentTotalGames(index, gameIndex))" :id="'selectHomeColumns' + getCurrentTotalGames(index, gameIndex)" :name="'selectHomeColumns' + getCurrentTotalGames(index, gameIndex)"><label :for="'selectHomeColumns' + getCurrentTotalGames(index, gameIndex)">Show {{ game['Team Abbrev'] }} Home Stats</label>
                    </div>
                    <br />
                    <UpcomingGameTeamStatsTable v-show="!awayColumnsChecked[getCurrentTotalGames(index, gameIndex)]" :team="game" :columns="'awayTeamStatsColumns'"></UpcomingGameTeamStatsTable>
                    <UpcomingGameTeamStatsTable v-show="awayColumnsChecked[getCurrentTotalGames(index, gameIndex)]" :team="game" :columns="'awayTeamAwayStatsColumns'"></UpcomingGameTeamStatsTable>
                    <UpcomingGameTeamStatsTable v-show="!homeColumnsChecked[getCurrentTotalGames(index, gameIndex)]" :team="game" :columns="'homeTeamStatsColumns'"></UpcomingGameTeamStatsTable>
                    <UpcomingGameTeamStatsTable v-show="homeColumnsChecked[getCurrentTotalGames(index, gameIndex)]" :team="game" :columns="'homeTeamHomeStatsColumns'"></UpcomingGameTeamStatsTable>
                    <p class="center">
                        <a v-show="!showMoreColumns[getCurrentTotalGames(index, gameIndex)]" @click="moreColumns($event, getCurrentTotalGames(index, gameIndex))">
                            <em>Show More Statistics</em>
                        </a>
                        <a v-show="showMoreColumns[getCurrentTotalGames(index, gameIndex)]" @click="moreColumns($event, getCurrentTotalGames(index, gameIndex))">
                            <em>Hide More Statistics</em>
                        </a>
                        <span class="upcoming-game-more-statistics-arrow" :class="{ 'rotate': showMoreColumns[getCurrentTotalGames(index, gameIndex)] }"><font-awesome-icon :icon="['fas', 'square-caret-down']" /></span>
                    </p>
                    <UpcomingGameTeamStatsTable v-show="showMoreColumns[getCurrentTotalGames(index, gameIndex)] && !awayColumnsChecked[getCurrentTotalGames(index, gameIndex)]" :team="game" :columns="'awayTeamStatsColumnsMore'"></UpcomingGameTeamStatsTable>
                    <UpcomingGameTeamStatsTable v-show="showMoreColumns[getCurrentTotalGames(index, gameIndex)] && awayColumnsChecked[getCurrentTotalGames(index, gameIndex)]" :team="game" :columns="'awayTeamAwayStatsColumnsMore'"></UpcomingGameTeamStatsTable>
                    <UpcomingGameTeamStatsTable v-show="showMoreColumns[getCurrentTotalGames(index, gameIndex)] && !homeColumnsChecked[getCurrentTotalGames(index, gameIndex)]" :team="game" :columns="'homeTeamStatsColumnsMore'"></UpcomingGameTeamStatsTable>
                    <UpcomingGameTeamStatsTable v-show="showMoreColumns[getCurrentTotalGames(index, gameIndex)] && homeColumnsChecked[getCurrentTotalGames(index, gameIndex)]" :team="game" :columns="'homeTeamHomeStatsColumnsMore'"></UpcomingGameTeamStatsTable>
                    <div>
                        <table :id="'more-statistics-table-' + index" class="upcoming-games-table" v-show="showMoreColumns[getCurrentTotalGames(index, gameIndex)]">
                            <tbody>
                                <tr v-for="(stat, tableIndex) in game['awayStatsColumns']" :key="index" :class="{ 'fade-in': showMoreColumns[getCurrentTotalGames(index, gameIndex)], 'fade-out': !showMoreColumns[getCurrentTotalGames(index, gameIndex)] }">
                                    <td :id="'upcoming-game-column-' + tableIndex" class="upcoming-game-column">{{ awayTeamStatsColumns[tableIndex] }}:</td>
                                    <td>{{ stat[0] }} (#{{ stat[1] }} in NFL)</td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="upcoming-games-table" v-show="showMoreColumns[getCurrentTotalGames(index, gameIndex)]">
                            <tbody>
                                <tr v-for="(stat, tableIndex) in game['homeStatsColumns']" :key="index" :class="{ 'fade-in': showMoreColumns[getCurrentTotalGames(index, gameIndex)], 'fade-out': !showMoreColumns[getCurrentTotalGames(index, gameIndex)] }">
                                    <td class="upcoming-game-column">{{ homeTeamStatsColumns  [tableIndex] }}:</td> 
                                    <td>{{ stat[0] }} (#{{ stat[1] }} in NFL)</td>
                                </tr>
                            </tbody>
                        </table>            
                    </div>
                </div>
            </div>
        </div>        
    </div>

    </div>
</template>

