<template>
  <div class="p-3">
    <div class="fw-bold fs-5">Products for approval</div>
    <div>
      In This section, you will review and accept or reject all products sent to
      your shop.
    </div>
    <!-- <button @click="accept" class="btn btn-bg-primary d-block ms-auto">Accept All Products</button> -->
    <!-- <BaseButton
     
      title="Accept All Products"
      :isLoading="isLoading"
    /> -->
    <button @click="acceptSentProduct" :disabled="!queueProducts.length" class="btn btn-bg-primary text-light d-block ms-auto">
       <span v-if="isLoading">
        <span
          class="spinner-border spinner-border-sm mx-2"
          role="status"
          aria-hidden="true"
        ></span>
      </span>
      Accept All Products
    </button>
    <!-- Table -->
    <table class="mt-2">
      <tr>
        <th>No</th>
        <th>Model</th>
        <th>Name</th>
        <th>Send Qty</th>
        <th>Status</th>
      </tr>
      <tr v-for="(product, index) in queueProducts" :key="product.id">
        <td>{{ index + 1 }}</td>
        <td style="white-space: nowrap">{{ product.model }}</td>
        <td>{{ product.name }}</td>
        <td>{{ product.qty }}</td>
        <td style="white-space: nowrap">
          {{ product.status }}
        </td>
      </tr>
    </table>
    <div v-if="!queueProducts.length" class="text-center">No product for approval</div>
  </div>

  <the-alert
    :isVisible="isAlertVisible"
    :message="alertMessage"
    :isSucceed="isRequestSucceed"
  />
</template>

<script>
import apiClient from "../resources/baseUrl";
export default {
  data() {
    return {
      queueProducts: [],
      //
      isLoading: false,
      //alert
      isAlertVisible: false,
      alertMessage: "",
      isRequestSucceed: false,
      timeout: "",
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    setAlertData(isRequestSucceed, message) {
      this.isAlertVisible = true;
      this.alertMessage = message;
      this.isRequestSucceed = isRequestSucceed;
    },
    async acceptSentProduct() {
      try {
        this.isLoading = true;
        const response = await apiClient.post("/api/accept_product_request",{
          shop_id:this.user.shop?.id,
          products:[...this.queueProducts]
        });
        if (response.status === 200) {
          this.queueProducts=[]
          this.setAlertData(
            true,
            "You have accepted sent products successfully!"
          );
        }
      } catch (e) {
        this.setAlertData(false, "Faild to accept sent products");
      } finally {
        this.isLoading = false;
        this.dismissAlert()
      }
    },
    async fetchQueueProducts() {
      try {
        this.$store.commit("setIsLoading", true);
        const response = await apiClient.get(
          `/api/product_distribution_data/${this.user.shop?.id}`
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
    dismissAlert() {
      this.timeout = setTimeout(() => {
        this.isAlertVisible = false;
      }, 2000);
    },
  },
  created() {
    this.fetchQueueProducts();
    console.log('user', this.$store.getters.user)
  },
  beforeUnmount() {
    clearTimeout(this.timeout);
  },
};
</script>

<style></style>
