<template>
  <div class="container-fuild px-4 mt-2">
    <div class="row g-3">
      <div class="col-lg-8">
        <div class="bg-white rounded p-3">
          <div class="fs-5">Products</div>
          <div class="position-relative w-5 my-2 me-2">
            <input
              type="text"
              v-model="searchQuery"
              @keyup.enter="searchProduct"
              class="form-control rounded-pill pe-5"
              placeholder="Search"
              aria-label="Recipient's username"
              aria-describedby="basic-add"
            />
            <span @click="searchProduct" role="button" class="position-absolute end-0 top-0 p-2 me-2"
              ><i class="fas fa-search"></i
            ></span>
          </div>

          <!-- the products should be active products -->
          <!-- Table -->
          <div style="overflow-x: auto">
            <table class="mt-2">
              <tr>
                <td></td>
                <th>No</th>
                <th>Model</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th><span class="sr-only">Action</span></th>
              </tr>
              <tr v-for="(product, index) in products" :key="product.id">
                <td>
                  <input
                    class="form-check-input fs-5"
                    type="checkbox"
                    v-model="selectedItems"
                    @change="updateCart(product)"
                    :value="product"
                    :id="product.id"
                  />
                </td>
                <td>{{pageNo * perPage - perPage + index + 1 }}</td>
                <td>{{ product.model }}</td>
                <td>
                  <img
                    :src="product.images?.path"
                    width="100"
                    height="100"
                    alt="product image"
                  />
                </td>
                <td>{{ product.name }}</td>
                <td>{{ product.category?.title }}</td>
                <td>{{ product.qty }}</td>
                <td>{{ product.price }}</td>
              </tr>
            </table>
          <div v-if="!products.length" class="text-center">No record</div>

          <!-- pagination -->
          <div
            v-if="!isSearch"
            class="d-flex mt-2 justify-content-end mb-3 me-2"
          >
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
        </div>
      </div>
      <div class="col-lg-4">
        <div class="bg-white rounded p-2">
          <div class="fs-5">Cart Items</div>
          <div style="overflow-x: auto">
            <table class="mt-2">
              <tr>
                <th>No</th>
                <th>Model</th>
                <th>Image</th>
                <th>Price</th>
                <th>Qty</th>

                <th><span class="sr-only">Action</span></th>
              </tr>
              <tr v-for="(product, index) in cart" :key="product.id">
                <td>{{ index + 1 }}</td>
                <td>{{ product.model }}</td>
                <td>
                  <img
                    :src="product.img"
                    width="50"
                    height="50"
                    alt="product image"
                  />
                </td>
                <td>{{ product.price }}</td>
                <td>
                  <div>
                    <input
                      v-model="product.qty"
                      size="2"
                      type="text"
                      name=""
                      id=""
                    />
                  </div>
                </td>
              </tr>
              <!-- <tr v-if="cart.length">
              <td colspan="4">Total Qty</td>
              <td>{{ totalQty }}</td>
            </tr>
            <tr v-if="cart.length">
              <td colspan="4">Total Cost</td>
              <td>{{totalPrice}}</td>
            </tr> -->
            </table>
          </div>
          <div v-if="cart.length" class="d-flex justify-content-between">
            <span colspan="4">Total Qty</span>
            <span>{{ totalQty }}</span>
          </div>
          <div v-if="cart.length" class="d-flex justify-content-between">
            <span colspan="4">Total Cost</span>
            <span>{{ totalPrice }}</span>
          </div>
          <div v-if="!cart.length" class="text-center">
            Product isn't added to cart yet!
          </div>
        </div>
        <BaseButton
          v-if="cart.length"
          class="mt-2"
          @submit="checkout"
          title="Checkout"
        ></BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import Paginate from "vuejs-paginate-next";
import apiClient from "../resources/baseUrl";
export default {
  components: {
    Paginate,
  },
  data() {
    return {
      searchQuery: "",
      selectedItems: [],
      products: [],
      cart: [],
      isSearch: false,
      //paginate
      perPage: 10,
      pageNo: 1,
      totalPage: 0,
    };
  },
  computed: {
    // filteredProduct() {
    //   if (this.searchQuery == "") {
    //     return this.products;
    //   }
    //   return this.products.filter((product) =>
    //     product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    //   );
    // },
    totalQty() {
      return this.cart.reduce(function (sum, item) {
        if (isNaN(parseInt(item.qty))) return sum;
        return parseInt(sum) + parseInt(item.qty);
      }, 0);
    },
    totalPrice() {
      return this.cart.reduce(function (sum, item) {
        if (isNaN(parseInt(item.qty))) return sum;
        return parseInt(sum) + parseInt(item.price) * parseInt(item.qty);
      }, 0);
    },
  },
  methods: {
    checkout() {
      this.$emit("checkout", { cart: this.cart, totalPrice: this.totalPrice });
    },
    updateCart(product) {
      // remove item
      let index = this.selectedItems.findIndex((item) => item.id == product.id);
      if (index == -1) {
        let index = this.cart.findIndex((item) => item.id == product.id);
        this.cart.splice(index, 1);
      }

      // add item
      else
        this.cart.push({
          id: product.id,
          model: product.model,
          qty: 1,
          price: product.price,
          img: product.images?.path,
        });
    },
   async searchProduct() {
      if(this.searchQuery=='')
      return this.fetchProducts()
      try {
        this.$store.commit("setIsLoading", true);
        const response = await apiClient.get(
          `/api/search_shop_products?search=${this.searchQuery}`
        );
        if (response.status === 200) {
          this.products = response.data.data;
           this.isSearch= true          
        }
      } catch (e) {
        //
      } finally {
        this.$store.commit("setIsLoading", false);
      }
    },
    async fetchProducts() {
      try {
        this.$store.commit("setIsLoading", true);
        const response = await apiClient.get(
          `/api/shop_products?filter=active&&page=${this.pageNo}&&per_page=${this.perPage}`
        );
        if (response.status === 200) {
          this.products = response.data.data;
          this.perPage = response.data.meta.per_page;
          this.pageNo = response.data.meta.current_page;
          this.totalPage = response.data.meta.last_page;
          this.isSearch=false
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
      this.fetchProducts();
    },
    handlePerPage() {
      this.fetchProducts();
    },
  },
  created() {
    this.fetchProducts();
  },
};
</script>

<style></style>
