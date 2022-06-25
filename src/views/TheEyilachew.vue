<template>
//
</template>

<script>
// import { mapGetters } from "vuex";
import apiClient from "../resources/baseUrl";
export default {
  

  methods: {
    
    async fetchQueueProducts() {
      
      try {
        this.$store.commit("setIsLoading", true);
        const response = await apiClient.get(
          `/api/product_distribution_data/${this.user.id}`
        );
        if (response.status === 200) {
          this.queueProducts = response.data.data;
        }
      } catch (e) {
        //
      } finally {
        this.$store.commit("setIsLoading", false);
      }
    },
 
  },
  created() {
    this.fetchQueueProducts();
  },
  beforeUnmount() {
    clearTimeout(this.timeout);
  },
};
</script>
<style scoped></style>
