<template>
  <DetailPage title="Add New Order">
    <keep-alive>
       <component
      :products="products"
      :cart="cart"
      :customers="customers"
      :paymentMethods="paymentMethods"
      @checkout="checkout"
      @navigateTo="setSelectedComponent"
      :is="selectedComponent"
    ></component>
    </keep-alive>
   
  </DetailPage>
</template>

<script>
import apiClient from "../resources/baseUrl";
import AddToCart from "../components/AddToCart.vue";
import Checkout from "../components/ProceedToCheckout.vue";
export default {
  components: {
    AddToCart,
    Checkout,
  },
  data() {
    return {
      products: [],
      selectedComponent: "AddToCart",
      paymentMethods:[],
      cart: [],
      customers:[]

    };
  },
  methods: {
    setSelectedComponent(comp) {
      this.selectedComponent=comp;
    },
    checkout(cart) {
      this.cart = cart;
      this.selectedComponent = "Checkout";
    },
    async fetchCustomers() {
      try {
        this.$store.commit("setIsLoading", true);
        const response = await apiClient.get(`/api/users`);
        if (response.status === 200) {
          this.customers = response.data.data;
        }
      } catch (e) {
        //
      } finally {
        this.$store.commit("setIsLoading", false);
      }
    },
     async fetchPaymentMethods() {
      try {
        this.$store.commit("setIsLoading", true);
        const response = await apiClient.get(`/api/payment_types`);
        if (response.status === 200) {
          this.paymentMethods = response.data;
        }
      } catch (e) {
        //
      } finally {
        this.$store.commit("setIsLoading", false);
      }
    },
    async fetchProducts(query) {
      try {
        this.$store.commit("setIsLoading", true);
        const response = await apiClient.get(
          "/api/products" + "?filter=" + query
        );
        if (response.status === 200) {
          this.products = response.data.data;
          console.log("product=" + this.products);
        }
      } catch (e) {
        //
      } finally {
        this.$store.commit("setIsLoading", false);
      }
    },
  },
  created() {
    this.fetchProducts("active");
    this.fetchCustomers();
    this.fetchPaymentMethods();
  },
};
</script>

<style></style>
