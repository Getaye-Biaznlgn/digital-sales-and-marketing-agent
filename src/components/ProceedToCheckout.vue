<template>
  <div class="container-fluid mt-2">
    <button @click="back" class="btn border d-block ms-auto me-1 mb-2">
      Back to cart
    </button>

    <div class="row g-3">
      <div class="col-lg-6">
        <div class="bg-white rounded p-3">
          <div class="fw-bold fs-5 mb-3">Select customer to place order</div>
          <div class="position-relative w-5 my-2 me-2">
            <input
              type="text"
              v-model="searchValue"
              class="form-control rounded-pill pe-5"
              placeholder="Search"
              aria-label="Recipient's username"
              aria-describedby="basic-add"
            />
            <span role="button" class="position-absolute end-0 top-0 p-2 me-2"
              ><i class="fas fa-search"></i
            ></span>
          </div>
          <!-- Table -->
          <table class="mt-2">
            <tr>
              <th>No</th>
              <th>Full name</th>
              <th>Phone number</th>
              <th>Location</th>
            </tr>
            <tr
              v-for="(customer, index) in customers"
              @click="selectCustomer(customer)"
              role="button"
              :key="customer.id"
            >
              <td>{{ index + 1 }}</td>
              <td class="text-capitalize">
                {{ customer.first_name + " " + customer.last_name }}
              </td>
              <td>{{ customer.phone_number }}</td>
              <td>
                {{ customer.user_region ?? "" + "-"
                }}{{ customer.user_woreda ?? "" }}
              </td>
            </tr>
          </table>
          <div class="mt-2">
            <div v-if="selectedCustomer">
              <div class="fw-bold">Selected Customer</div>
              <div class="d-flex justify-content-between">
                <div>
                  <div class="text-capitalize">
                    <span class="fw-bold me-2">Full name:</span
                    >{{
                      selectedCustomer.first_name +
                      " " +
                      selectedCustomer.last_name
                    }}
                  </div>
                  <div>
                    <span class="fw-bold me-2">Phone:</span
                    >{{ selectedCustomer.phone_number }}
                  </div>
                </div>
                <div>
                  <div class="text-capitalize">
                    <span class="fw-bold me-2">Region:</span
                    >{{ selectedCustomer.user_region }}
                  </div>
                  <div class="text-capitalize">
                    <span class="fw-bold me-2">Zone:</span
                    >{{ selectedCustomer.user_zone }}
                  </div>
                  <div class="text-capitalize">
                    <span class="fw-bold me-2">Woreda:</span
                    >{{ selectedCustomer.user_woreda }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="selectedCustomer" class="mt-2">
            <label for="">Payment Methods</label>
            <select
              v-model="paymentMethodId"
              id="paymentMethod"
              class="form-select"
            >
              <option v-for="method in paymentMethods" :key="method.id">
                {{ method.payment_name }}
              </option>
            </select>
          </div>
          <button
            :disabled="!selectedCustomer"
            @click="placeOrder(false)"
            class="mt-3 d-block ms-auto btn btn-bg-primary text-white"
          >
            Place Order
          </button>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="bg-white rounded p-3">
          <div class="fw-bold fs-5 mb-3">Place order as a new customer</div>
          <form @submit.prevent>
            <div class="row">
              <div
                class="mb-1 col-md-6"
                :class="{ warining: v$.customer.first_name.$error }"
              >
                <label for="firstName" class="form-label">First Name</label>
                <input
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

            <div
              class="mb-1"
              :class="{ warining: v$.customer.phone_number.$error }"
            >
              <label for="phone_number" class="form-label">Phone Number</label>
              <input
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
                type="text"
                class="form-control"
                id="user_region"
                v-model.trim="customer.user_region"
              />
            </div>

            <div class="mb-1">
              <label for="user_zone" class="form-label">Zone</label>
              <input
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
                type="text"
                class="form-control"
                id="user_woreda"
                v-model.trim="customer.user_woreda"
              />
            </div>
            <div class="mt-2">
              <label for="">Payment Methods</label>
              <select
                v-model="paymentMethodId"
                id="paymentMethod"
                class="form-select mt-1"
              >
                <option v-for="method in paymentMethods" :key="method.id">
                  {{ method.payment_name }}
                </option>
              </select>
            </div>
          </form>
          <BaseButton
            title="Place Order As A New"
            @submit="placeOrder(true)"
            class="mt-3"
          ></BaseButton>
        </div>
      </div>
    </div>
  </div>
  <the-alert
    :isVisible="isAlertVisible"
    :message="alertMessage"
    :isSucceed="isRequestSucceed"
  />
</template>

<script>
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
  props: {
    cart: {
      required: true,
    },
    customers: {
      required: true,
    },
    paymentMethods: {
      required: true,
    },
  },
  data() {
    return {
      v$: useValidate(),
      customer: {},
      pickupDate: "",
      selectedCustomer: null,
      paymentMethodId: "",
      //
      isLoading: false,
      // alert
      isAlertVisible: false,
      alertMessage: "",
      isRequestSucceed: "",
      timeout: "",
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
  methods: {
    dismissAlert() {
      this.timeout = setTimeout(() => {
        this.isAlertVisible = false;
      }, 2000);
    },
    setAlertData(isRequestSucceed, message) {
      this.isAlertVisible = true;
      this.alertMessage = message;
      this.isRequestSucceed = isRequestSucceed;
    },
    async placeOrder(isNew) {
      this.isLoading = true;
      try {
        const response = await apiClient.post("/api/orders", {
          items: [...this.cart],
          user_id: this.selectedCustomer?.customer_id,
          id: this.user.id,
          pickup_date: new Date(),
          isNew: isNew,
          payment_type: this.paymentMethodId,
          ...this.customer,
        });
        if (response.status === 201) {
          // this.customers.push(response.data);
          this.setAlertData(true, "You have added order successfully");
        } else throw "";
      } catch (e) {
        this.setAlertData(false, "Faild to add a new order");
      } finally {
        this.isLoading = false;
        this.dismissAlert();
        this.closeAddModal();
      }
    },
    selectCustomer(customer) {
      this.selectedCustomer = customer;
    },
    back() {
      this.$emit("navigateTo", "AddToCart");
    },
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

<style scoped>
table tr:hover {
  background-color: "#d3f3d3" !important;
}
</style>
