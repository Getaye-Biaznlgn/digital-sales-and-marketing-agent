<template>
  <div class="m-3">
    <h5>Customers</h5>
    <div>
      In the customer section, you will review and manage all solar product
      customers.
    </div>
    <button
      @click="showAddModal"
      class="btn ms-auto d-flex justify-self-end btn-bg-primary text-light"
    >
      Add New Customer
    </button>
    <hr />
    <div class="d-flex p-2 justify-content-between selection-bar">
      <div class="position-relative w-50 me-2">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="searchCustomers"
          class="form-control rounded-pill pe-5"
          placeholder="Search by name"
          aria-label="Recipient's username"
          aria-describedby="basic-add"
        />
        <span
          @click="searchCustomers"
          role="button"
          class="position-absolute end-0 top-0 p-2 me-2"
          ><i class="fas fa-search"></i
        ></span>
      </div>

      <div>
        <button @click="downloadCSV()" class="btn border">Export</button>
      </div>
    </div>
    <!-- Table -->
    <table class="mt-2">
      <tr>
        <th>No</th>
        <th>Full name</th>
        <th>Phone number</th>
        <th>Joined date</th>
        <th>Location</th>
        <th>Status</th>
        <th><span class="sr-only">Action</span></th>
      </tr>
      <tr v-for="(customer, index) in customers" :key="customer.id">
        <td>{{ pageNo * perPage - perPage + index + 1 }}</td>
        <td class="text-capitalize">
          {{ customer.first_name + " " + customer.last_name }}
        </td>
        <td>{{ customer.phone_number }}</td>
        <td>
          <span v-if="customer.joined_date">{{
            new Date(customer.joined_date)
              .toString()
              .split(" ")
              .slice(0, 4)
              .join(" ")
          }}</span
          ><span v-else>--/--</span>
        </td>
        <td>
          {{ customer.user_region ?? "" }}-{{ customer.user_woreda ?? "" }}
        </td>
        <td>
          <span class="me-2" @click="showEditModal(customer)" role="button"
            ><i class="far fa-eye"></i
          ></span>
          <!-- <span @click="showDeleteModal(customer)" role="button"
            ><i class="fas fa-trash"></i
          ></span> -->
        </td>
      </tr>
    </table>
    <!-- pagination -->
    <div class="d-flex justify-content-end mb-3 me-2">
      <div class="me-3">
        <select
          @change="fetchCustomers()"
          v-model="perPage"
          class="form-select"
          aria-label="perPage"
        >
          <option value="5">5</option>
          <option value="10" selected>10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <paginate
        v-model="pageNo"
        :page-count="totalPage"
        :click-handler="fetchByPageNo"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'d-flex nav page-item'"
      >
      </paginate>
    </div>
  </div>
  <!-- add customers -->
  <base-modal
    :modalState="isAddModalVisible"
    title="Customer"
    @close="closeAddModal"
    :btnLabel="forUpdate ? 'OK' : 'Save'"
    :isLoading="isLoading"
    @submit="addNewCustomer"
  >
    <form @submit.prevent>
      <div class="row">
        <div
          class="mb-1 col-md-6"
          :class="{ warining: v$.customer.first_name.$error }"
        >
          <label for="firstName" class="form-label">First Name</label>
          <input
            :disabled="forUpdate"
            type="text"
            class="form-control"
            id="firstName"
            v-model.trim="customer.first_name"
            @blur="v$.customer.first_name.$touch"
          />
          <span
            class="error-msg mt-1"
            v-for="(error, index) of v$.customer.first_name.$errors"
            :key="index"
          >
            {{ error.$message + ", " }}</span
          >
        </div>
        <div
          class="mb-1 col-md-6"
          :class="{ warining: v$.customer.last_name.$error }"
        >
          <label for="last_name" class="form-label">Last Name</label>
          <input
            :disabled="forUpdate"
            type="text"
            class="form-control"
            id="last_name"
            v-model.trim="customer.last_name"
            @blur="v$.customer.last_name.$touch"
          />
          <span
            class="error-msg mt-1"
            v-for="(error, index) of v$.customer.last_name.$errors"
            :key="index"
          >
            {{ error.$message + ", " }}</span
          >
        </div>
      </div>

      <div class="mb-1" :class="{ warining: v$.customer.phone_number.$error }">
        <label for="phone_number" class="form-label">Phone Number</label>
        <input
          :disabled="forUpdate"
          type="text"
          class="form-control"
          id="phone_number"
          v-model.trim="customer.phone_number"
          @blur="v$.customer.phone_number.$touch"
        />
        <span
          class="error-msg mt-1"
          v-for="(error, index) of v$.customer.phone_number.$errors"
          :key="index"
        >
          {{ error.$message + ", " }}</span
        >
      </div>

      <div class="mb-1" :class="{ warining: v$.customer.email.$error }">
        <label for="email" class="form-label">Email</label>
        <input
          :disabled="forUpdate"
          type="text"
          class="form-control"
          id="email"
          v-model.trim="customer.email"
          @blur="v$.customer.email.$touch"
        />
        <span
          class="error-msg mt-1"
          v-for="(error, index) of v$.customer.email.$errors"
          :key="index"
        >
          {{ error.$message + ", " }}</span
        >
      </div>

      <div class="mb-1">
        <label for="user_region" class="form-label">Region</label>
        <input
          :disabled="forUpdate"
          type="text"
          class="form-control"
          id="user_region"
          v-model.trim="customer.user_region"
        />
      </div>

      <div class="mb-1">
        <label for="user_zone" class="form-label">Zone</label>
        <input
          :disabled="forUpdate"
          type="text"
          class="form-control"
          id="user_zone"
          v-model.trim="customer.user_zone"
          @blur="v$.customer.user_zone.$touch"
        />
      </div>

      <div class="mb-1">
        <label for="user_woreda" class="form-label">Woreda</label>
        <input
          :disabled="forUpdate"
          type="text"
          class="form-control"
          id="user_woreda"
          v-model.trim="customer.user_woreda"
        />
      </div>
    </form>
  </base-modal>

  <!-- delete base modal -->
  <!-- <base-modal
    :modalState="isDeleteModalVisible"
    btnLabel="Delete"
    :isLoading="isLoading"
    title="Delete Customer"
    @close="closeDeleteModal"
    @submit="deleteCustomer"
  >
    <p>
      Do u want to delete? <br />
    <strong>{{ customerForDelete?.first_name+' '+ customerForDelete?.last_name}}</strong>  
    </p>
  </base-modal> -->

  <!--to show delete  is failed  -->
  <the-alert
    :isVisible="isAlertVisible"
    :message="alertMessage"
    :isSucceed="isRequestSucceed"
  />
</template>

<script>
import Paginate from "vuejs-paginate-next";
import exportFromJSON from "export-from-json";
import apiClient from "../resources/baseUrl";
import useValidate from "@vuelidate/core";
import {
  required,
  helpers,
  email,
  maxLength,
  numeric,
} from "@vuelidate/validators";
export default {
  components: {
    Paginate,
  },
  data() {
    return {
      v$: useValidate(),
      isAddModalVisible: false,
      //   isDeleteModalVisible: false,
      customerForDelete: {},
      searchQuery: "",
      isLoading: false,
      customers: [],
      customer: {
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        user_region: "",
        user_zone: "",
        user_woreda: "",
      },
      // alert
      isAlertVisible: false,
      alertMessage: "",
      isRequestSucceed: "",
      timeout: "",

      //
      // to use add modal as edit depend on the condition and #forUpdate to
      //chage the action which should be performed
      forUpdate: false,
      //paginate
      perPage: 10,
      pageNo: 1,
      totalPage: 0,
    };
  },
  methods: {
    downloadCSV() {
      const data = this.customers;
      const fileName = "customers";
      const exportType = exportFromJSON.types.csv;
      if (data) exportFromJSON({ data, fileName, exportType });
    },
    dismissAlert() {
      this.timeout = setTimeout(() => {
        this.isAlertVisible = false;
      }, 2000);
    },
    resetFieldEmpity() {
      this.customer = {
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
        user_region: "",
        user_zone: "",
        user_woreda: "",
      };
    },
    // showDeleteModal({ ...customer }) {
    //   this.customerForDelete = customer;
    //   this.isDeleteModalVisible = true;
    // },
    closeDeleteModal() {
      this.isDeleteModalVisible = false;
    },
    showEditModal({ ...customer }) {
      this.forUpdate = true;
      this.customer = customer;
      this.isAddModalVisible = true;
    },
    closeAddModal() {
      this.v$.$reset();
      this.resetFieldEmpity();
      this.isAddModalVisible = false;
    },
    showAddModal() {
      this.forUpdate = false;
      this.isAddModalVisible = true;
    },
    setAlertData(isRequestSucceed, message) {
      this.isAlertVisible = true;
      this.alertMessage = message;
      this.isRequestSucceed = isRequestSucceed;
    },
    // async updateCustomer() {
    //   this.v$.$validate();
    //   if (!this.v$.$error) {
    //     this.isLoading = true;
    //     try {
    //       const response = await apiClient.put(
    //         `/api/users/${this.customer.customer_id}`,
    //         this.customer
    //       );
    //       if (response.status === 200) {
    //         const editedIndex = this.customers.findIndex((customer) => {
    //           return this.customer.id === customer.id;
    //         });
    //         this.customers[editedIndex] = this.customer;
    //         this.setAlertData(true, "Customer updated successfully");
    //         ///
    //       } else throw "";
    //     } catch (e) {
    //       this.setAlertData(false, "Faild to update customer");
    //     } finally {
    //       this.isLoading = false;
    //       this.closeAddModal();
    //       this.dismissAlert();
    //       this.forUpdate = false;
    //     }
    //   }
    // },
    async addNewCustomer() {
      if (this.forUpdate) {
        // this.updateCustomer();
        this.closeAddModal();
        // return;
      }
      this.v$.$validate();
      if (!this.v$.$error) {
        this.isLoading = true;
        try {
          const response = await apiClient.post("/api/users", this.customer);
          if (response.status === 201) {
            this.customers.push(response.data);
            this.setAlertData(true, "You have added customers successfully");
          } else throw "";
        } catch (e) {
          this.setAlertData(false, "Faild to add a new customer");
        } finally {
          this.isLoading = false;
          this.dismissAlert();
          this.closeAddModal();
        }
      }
    },
    // async deleteCustomer() {
    //   this.isLoading = true;
    //   try {
    //     const response = await apiClient.delete(
    //       `/api/users/${this.customerForDelete.customer_id}`
    //     );
    //     if (response.status === 200) {
    //       const deletedIndex = this.customers.findIndex((customer) => {
    //         return customer.customer_id === this.customerForDelete.customer_id;
    //       });
    //       this.customers.splice(deletedIndex, 1);
    //     }
    //   } catch (e) {
    //     this.isAlertVisible = true;
    //     this.alertMessage = "Faild to delete a customer";
    //     this.dismissAlert();
    //   } finally {
    //     this.isLoading = false;
    //     this.closeDeleteModal();
    //   }
    // },
    async searchCustomers() {
      this.pageNo = 1;
      this.fetchCustomers();
    },
    //paginations
    fetchByPageNo(no) {
      this.pageNo = no;
      this.fetchCustomers();
    },

    async fetchCustomers() {
      try {
        this.$store.commit("setIsLoading", true);
        const response = await apiClient.get(
          `/api/shop_users?search=${this.searchQuery}&&page=${this.pageNo}&&per_page=${this.perPage}`
        );
        if (response.status === 200) {
          this.customers = response.data.data;
          this.perPage = response.data.meta.per_page;
          this.pageNo = response.data.meta.current_page;
          this.totalPage = response.data.meta.last_page;
        }
      } catch (e) {
        //
      } finally {
        this.$store.commit("setIsLoading", false);
      }
    },
  },
  created() {
    this.fetchCustomers();
  },
  beforeUnmount() {
    clearTimeout(this.timeout);
  },
  validations() {
    return {
      customer: {
        first_name: {
          required: helpers.withMessage("First name is required", required),
        },
        last_name: {
          required: helpers.withMessage("Last name is required", required),
        },
        phone_number: {
          numeric,
          max: maxLength(10),
          required: helpers.withMessage("Phone number is required", required),
        },
        email: {
          email,
        },
      },
    };
  },
};
</script>
