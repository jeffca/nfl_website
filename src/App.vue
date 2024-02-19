<script>
import axios from 'axios';

import TopHeading from './components/shared/TopHeading.vue';
import Footer from './components/shared/Footer.vue'

export default {
  data() {
    return {
      showTeamsList: false, // Controls the visibility of the teams list
      nflTeams: [],
    };
  },  
  methods: {
    toggleTeamsList() {
      this.showTeamsList = !this.showTeamsList; // Toggle the state
    }
  },  
  mounted() {
    // Make an HTTP GET request to your backend
    axios.get('http://127.0.0.1:3000/TeamAverages')
      .then(response => {
        this.nflTeams = response.data; // Assign the response data to your component's data
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  },  
    components: {
      Footer,
      TopHeading,
    }
}

</script>

<template>
  <TopHeading :showTeamsList="showTeamsList" @toggleTeamsList="toggleTeamsList" />
    <div v-if="showTeamsList" class="teams-list">
      <!-- Display your list of 32 NFL teams -->
      <ul>
        <li v-for="team in nflTeams">
          {{ team.Team }}
        </li>
      </ul>
    </div>  
<router-view></router-view>


<Footer />


</template>