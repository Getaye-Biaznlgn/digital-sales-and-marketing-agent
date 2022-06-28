<template>
  <div class="m-3">
    <h5>Product order</h5>
    <div>
      In the order section, you will review and manage all solar product orders.
    </div>
    <div class="d-flex justify-content-between">
      <ul class="nav mt-4">
        <li class="nav-item-tab">
          <a
            class="nav-link text-black"
            :class="{
              'border-bottom border-dark border-2': filterString == 'all',
            }"
            role="button"
            @click="fetchOrders('all')"
          >
            All orders
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link text-black"
            role="button"
            :class="{
              'border-bottom border-dark border-2': filterString == 'completed',
            }"
            @click="fetchOrders('completed')"
          >
            Completed
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link text-black"
            role="button"
            :class="{
              'border-bottom border-dark border-2': filterString == 'pending',
            }"
            @click="fetchOrders('pending')"
          >
            Pending
          </a>
        </li>

        <li class="nav-item">
          <a
            class="nav-link text-black"
            role="button"
            :class="{
              'border-bottom border-dark border-2': filterString == 'canceled',
            }"
            @click="fetchOrders('canceled')"
          >
            Canceled
          </a>
        </li>
      </ul>
      <div>
        <button @click="addOrderPage" class="btn btn-bg-primary text-light">
          Add New Order
        </button>
      </div>
    </div>

    <hr class="my-0" />
    <div class="d-flex p-2 selection-bar justify-content-between">
      <div class="position-relative w-50 me-2">
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
      <div class="d-flex">
        <div class="pe-2">
          <select class="form-select" aria-label="selectFilte">
            <option value=" ">Sort</option>
            <option>Sort</option>
          </select>
        </div>
        <div>
          <select class="form-select" aria-label="selectFilterRegion">
            <option value=" ">Sort</option>
            <option>Sort</option>
          </select>
        </div>
      </div>
    </div>
    <!-- Table -->
    <table class="mt-2">
      <tr>
        <th>No</th>
        <th>Order Id</th>
        <th>Customer</th>
        <th>Order Date</th>
        <th>Shop</th>
        <th>Order Status</th>
        <th>Payment Method</th>
        <th><span class="sr-only">Action</span></th>
      </tr>
      <tr v-for="(order, index) in orders" :key="order.id">
        <td>{{ index + 1 }}</td>
        <td>{{ order.order_ref }}</td>
        <td>{{ order.first_name + " " + order.last_name }}</td>
        <td>
          {{
            new Date(order.order_date)
              .toString()
              .split(" ")
              .slice(0, 4)
              .join(" ")
          }}
        </td>
        <td>{{ order.shop_name }}</td>
        <td>{{ order.order_status }}</td>
        <td>{{ order.payment_type }}</td>
        <td>
          <div class="dropdown">
            <a
              class="dropdown-toggl text-dark"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </a>

            <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                <a
                  class="dropdown-item"
                  @click="showDetail(order.id)"
                  role="button"
                  >View Details</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  @click="showChangeStatusModal(order)"
                  role="button"
                  >Change Status</a
                >
              </li>
            </ul>
          </div>
        </td>
      </tr>
    </table>
  </div>
  <!-- pagination -->
  <div class="d-flex justify-content-end mb-3 me-2">
    <div class="me-3">
      <select
        @change="handlePerPage()"
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
      :page-count="totalPage"
      :click-handler="fetchByPageNo"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'d-flex nav page-item'"
    >
    </paginate>
  </div>
  <!-- add orders -->
  <base-modal
    :modalState="isAddModalVisible"
    title="order"
    @close="closeAddModal"
    btnLabel="Save"
    :isLoading="isLoading"
    @submit="addNewOrder"
  >
    <form @submit.prevent>
      <div class="mb-3" :class="{ warining: v$.order.title.$error }">
        <label for="title" class="form-label">Name</label>
        <input
          type="text"
          class="form-control"
          id="title"
          v-model.trim="order.title"
          @blur="v$.order.title.$touch"
        />
        <span
          class="error-msg mt-1"
          v-for="(error, index) of v$.order.title.$errors"
          :key="index"
        >
          {{ error.$message + ", " }}</span
        >
      </div>

      <div class="mb-3" :class="{ warining: v$.order.description.$error }">
        <label for="description" class="form-label">Description</label>
        <textarea
          rows="5"
          class="form-control"
          id="description"
          v-model.trim="order.description"
          @blur="v$.order.description.$touch"
        />
        <span
          class="error-msg mt-1"
          v-for="(error, index) of v$.order.description.$errors"
          :key="index"
        >
          {{ error.$message + ", " }}</span
        >
      </div>
    </form>
  </base-modal>

  <!-- delete base modal -->
  <!-- <base-modal
    :modalState="isDeleteModalVisible"
    btnLabel="Delete"
    :isLoading="isLoading"
    title="Delete Order"
    @close="closeDeleteModal"
    @submit="deleteOrder"
  >
    <p>
      Do u want to delete? <br />
      {{ orderForDelete?.pin }}
    </p>
  </base-modal> -->

  <!-- change status base modal -->
  <base-modal
    :modalState="isChangeStatusModalVisible"
    btnLabel="Change"
    :isLoading="isLoading"
    title="Change Status"
    @close="closeChangeStatusModal"
    @submit="changeStatus"
  >
    <div>
      <div>Choose order status</div>
      <select
        id="changeStatus"
        v-model="orderForChangeStatus.order_status"
        class="form-control"
      >
        <option
          :disabled="orderForChangeStatus.order_status == 'pending'"
          value="pending"
        >
          Pending
        </option>
        <option
          value="completed"
          :disabled="orderForChangeStatus.order_status == 'completed'"
        >
          Completed
        </option>
        <option
          value="canceled"
          :disabled="orderForChangeStatus.order_status == 'canceled'"
        >
          Canceled
        </option>
      </select>
    </div>
  </base-modal>

  <!--to show delete  is failed  -->
  <the-alert
    :isVisible="isAlertVisible"
    :message="alertMessage"
    :isSucceed="false"
  />
</template>

<script>
import apiClient from "../resources/baseUrl";
import Paginate from "vuejs-paginate-next";
import useValidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
export default {
  components: {
    Paginate,
  },
  data() {
    return {
      v$: useValidate(),
      isAddModalVisible: false,
      isChangeStatusModalVisible: false,
      // orderForDelete: {},
      orderForChangeStatus: {},
      alertMessage: "",
    
      isLoading: false,
      orders: [],
      order: {
        title: "",
        description: "",
      },
      // alert
      isAlertVisible: false,
      timeout: "",
      // to use add modal as edit depend on the condition and #forUpdate to
      //chage the action which should be performed
      forUpdate: false,
      filterString:'all',
      //paginate
      perPage: 10,
      pageNo: 1,
      totalPage: "",
    };
  },
  methods: {
    dismissAlert() {
      this.timeout = setTimeout(() => {
        this.isAlertVisible = false;
      }, 2000);
    },
    resetFieldEmpity() {
      // (this.order.title = ""), (this.order.description = "");
    },
    showChangeStatusModal({ ...order }) {
      this.orderForChangeStatus = order;
      this.isChangeStatusModalVisible = true;
    },
    closeChangeStatusModal() {
      this.isChangeStatusModalVisible = false;
    },
    showDetail(id) {
      this.$router.push({ name: "OrderDetail", params: { id: id } });
    },
    // showEditModal({ ...order }) {
    //   this.forUpdate = true;
    //   this.order = order;
    //   this.isAddModalVisible = true;
    // },
    closeAddModal() {
      this.v$.$reset();
      this.resetFieldEmpity();
      this.isAddModalVisible = false;
    },
    addOrderPage() {
      // this.isAddModalVisible = true;
      this.$router.push({ name: "AddNewOrder" });
    },
    // async updateOrder() {
    //   this.v$.$validate();
    //   if (!this.v$.$error) {
    //     this.isLoading = true;
    //     try {
    //       const response = await apiClient.put(
    //         `/api/orders/${this.order.id}`,
    //         this.order
    //       );
    //       if (response.status === 200) {
    //         const editedIndex = this.orders.findIndex((order) => {
    //           return this.order.id === order.id;
    //         });
    //         this.orders[editedIndex] = response.data;
    //         ///
    //       } else throw "";
    //     } catch (e) {
    //       this.alertMessage = "Faild to update order";
    //       this.isAlertVisible = true;
    //       this.dismissAlert();
    //     } finally {
    //       this.isLoading = false;
    //       this.closeAddModal();
    //       this.forUpdate = false;
    //     }
    //   }
    // },
    async changeStatus() {
      this.isLoading = true;
      try {
        const response = await apiClient.post(
          "/api/set_order_status/" + this.orderForChangeStatus.id,
          { status: this.orderForChangeStatus.order_status }
        );
        if (response.status === 200) {
          // this.orders.push(response.data);
          let index = this.orders.findIndex(
            (order) => order.id === this.orderForChangeStatus.id
          );
          this.orders[index].order_status =
            this.orderForChangeStatus.order_status;
        } else throw "";
      } catch (e) {
        this.isAlertVisible = true;
        this.alertMessage = "Faild to change order status";
        this.dismissAlert();
      } finally {
        this.isLoading = false;
        this.closeChangeStatusModal();
      }
    },
    async addNewOrder() {
      // if (this.forUpdate) {
      //   this.updateOrder();
      //   return;
      // }

      this.v$.$validate();
      if (!this.v$.$error) {
        this.isLoading = true;
        try {
          const response = await apiClient.post("/api/orders", this.order);
          if (response.status === 201) {
            this.orders.push(response.data);
          } else throw "";
        } catch (e) {
          this.isAlertVisible = true;
          this.alertMessage = "Faild to add a new order";
          this.dismissAlert();
        } finally {
          this.isLoading = false;
          this.closeAddModal();
        }
      }
    },
    // async deleteOrder() {
    //   this.isLoading = true;
    //   try {
    //     const response = await apiClient.delete(
    //       `/api/orders/${this.orderForDelete.id}`
    //     );
    //     if (response.status === 200) {
    //       const deletedIndex = this.orders.findIndex((order) => {
    //         return order.id === this.orderForDelete.id;
    //       });
    //       this.orders.splice(deletedIndex, 1);
    //     }
    //   } catch (e) {
    //     this.isAlertVisible = true;
    //     this.alertMessage = "Faild to delete a new order";
    //     this.dismissAlert();
    //   } finally {
    //     this.isLoading = false;
    //     this.closeDeleteModal();
    //   }
    // },
    async fetchOrders(filterQuery) {
      try {
        this.$store.commit("setIsLoading", true);
        const response = await apiClient.get(`/api/orders?filter=${filterQuery}&&page=${this.pageNo}&&per_page=${this.perPage}`);
        if (response.status === 200) {
          this.orders = response.data.data;
          this.perPage = response.data.meta.per_page;
          this.pageNo = response.data.meta.current_page;
          this.totalPage = response.data.meta.last_page;
          this.filterString=filterQuery
        }
      } catch (e) {
        //
      } finally {
        this.$store.commit("setIsLoading", false);
      }
    },
    //paginations
    fetchByPageNo(no) {
      this.pageNo = no;
      this.fetchOrders(this.filterString);
    },
    handlePerPage() {
      this.fetchOrders(this.filterString);
    },
  },
  created() {
    this.fetchOrders('all');
  },
  beforeUnmount() {
    clearTimeout(this.timeout);
  },
  validations() {
    return {
      order: {
        title: {
          required: helpers.withMessage("order title is required", required),
        },
        description: {
          required: helpers.withMessage(
            "order description is required",
            required
          ),
        },
      },
    };
  },
};
</script>
