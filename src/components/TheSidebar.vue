<template>
  <nav class="navbar-light side-bar">
    <div class="fw-bold fs-5 ps-1 my-2">Menu</div>
    <ul class="navbar-nav pt-2 px-2">
      <TheSidebar
        label="Dashboard"
        routeName="TheDashboard"
        @click="setSelected('TheDashboard')"
        :isSelected="selectedRoute == 'TheDashboard'"
      />
      <TheSidebar
        label="My Shop"
        routeName="MyShop"
        @click="setSelected('MyShop')"
        :isSelected="selectedRoute == 'MyShop'"
      />
      <TheSidebar
        label="Order"
        routeName="TheOrder"
        @click="setSelected('TheOrder')"
        :isSelected="selectedRoute == 'TheOrder'"
      />
      <TheSidebar
        label="Customer"
        routeName="TheCustomer"
        @click="setSelected('TheCustomer')"
        :isSelected="selectedRoute == 'TheCustomer'"
      />
      <TheSidebar
        label="Queue Product"
        routeName="QueueProduct"
        @click="setSelected('QueueProduct')"
        :isSelected="selectedRoute == 'QueueProduct'"
      />
      <!-- <TheSidebar label="Sales" routeName="TheSales" /> -->
      <!-- <TheSidebar label="Report" routeName="TheReport"
         @click="setSelected('TheReport')"
        :isSelected="selectedRoute == 'TheReport'"
       /> -->
      <TheSidebar
        label="Setting"
        routeName="TheSetting"
        @click="setSelected('TheSetting')"
        :isSelected="selectedRoute == 'TheSetting'"
      />

      <!-- <TheSidebar
        label="Role"
        routeName="TheRole"
        @click="setSelected('TheRole')"
        :isSelected="selectedRoute == 'TheRole'"
      /> -->
    </ul>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import TheSidebar from "./SidebarItem.vue";
var selectedRoute = ref("");
const setSelected = function (name) {
  selectedRoute.value = name;
};
</script>
