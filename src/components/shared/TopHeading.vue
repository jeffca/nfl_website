
<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchTerm: '',
      searchResults: [],
      showSearchResults: false,
      searchLengthLessThanThreeCharacters: false,
      showTooltip: false,
    };
  },
   props: {
    showTeamsList: Boolean // Receiving showTeamsList as a prop
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    toggleTeamsList() {
      // Emit an event to toggle the showTeamsList state in the parent component
      this.$emit('toggleTeamsList');
    },
    async handleInputChange() {
      if (this.searchTerm.length > 2) {
        try {
          const response = await this.performPlayerSearch(this.searchTerm);
          this.searchResults = response.data;
          this.searchLengthLessThanThreeCharacters = false;
          this.showSearchResults = true;
        } catch (error) {
          console.error('Error during search:', error);
        }
      } else {
        this.searchLengthLessThanThreeCharacters = true;
        this.showSearchResults = false;
      }
    },
    performPlayerSearch(query) {
      return axios.get(`http://127.0.0.1:3000/Players?search=${query}`);
    }, 
    handleClickOutside(event) {
      // User has clicked outside the search results, check if it is the search result the user is searching for
      // if not the user, then blank the search results so as not to clutter the page with search results
      this.searchLengthLessThanThreeCharacters = false;
      if (this.searchTerm && !this.searchTerm.includes(event.target)) {
        // Clicked outside the search input, hide the results
        this.showSearchResults = false;
      }
    },     
    handleSearchResultClick() {
      this.searchTerm = "";
      this.showSearchResults = false;
    },
  }
};
</script>

<template>

<div id="top-heading">
    <ul class="horizontal-menu">
        <li id="hamburger-menu" @click="toggleTeamsList">
            <font-awesome-icon :icon="['fas', 'bars']" />
        </li>
        
        <li id="home-logo">
          <router-link :to="{ name: 'home' }"><font-awesome-icon :icon="['fas', 'home']" /></router-link>
        </li>

        <li>
          <router-link :to="{ name: 'UpcomingGames'}">Week 18 Games</router-link>
        </li>

        <li>
          <router-link :to="{ name: 'RushingMatchups'}">Rushing Matchups</router-link>
        </li>

        <li>
          <router-link :to="{ name: 'PassingMatchups' }">Passing Matchups</router-link>    
        </li>

        <li>
          <div class="tooltip" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
              Star Players
              <div class="tooltip-content" v-show="showTooltip">
                  <ul class="menu-dropdown">
                    <router-link :to="{ name: 'LastWeekStars' }"><li>Last Week's Stars</li></router-link>
                      <!-- <router-link :to="{ name: 'best-qbs' }"><li>Quarterbacks</li></router-link>
                      <router-link :to="{ name: 'best-rbs' }"><li>Running Backs</li></router-link>
                      <router-link :to="{ name: 'best-wrs' }"><li>Wide Receivers</li></router-link> -->
                  </ul>
              </div>                
          </div>        


        </li>


        <li>
          <div id="player-search">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
          <input
            type="text"
            v-model="searchTerm"
            @input="handleInputChange"
            placeholder="Search for a player..."
          />

          </div>
          <span id="player-search-help-text" v-if="searchLengthLessThanThreeCharacters">Please enter at least three (3) characters to search</span>
          <ul v-if="searchResults.length > 0 && showSearchResults" id="player-search-results">
            <li v-for="player in searchResults" :key="player.Player">
              <RouterLink :to="{ name:'player-history', params:{'player': player.Player }}" @click="handleSearchResultClick()">
                {{ player.Player }} &mdash; {{ player.Team }}
              </RouterLink> 
            </li>
          </ul>
        </li>
    </ul>

  </div>

</template>