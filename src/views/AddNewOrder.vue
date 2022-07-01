<template>
  <DetailPage title="Add New Order">
    <keep-alive>
       <component
      :cart="cart"
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
      selectedComponent: "AddToCart",
      paymentMethods:[],
      cart: [],

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
 
  },
  created() {
    this.fetchPaymentMethods();
  },
};
</script>

<style></style>
