<template>
  <div class="p-3">
    <div class="fw-bold fs-5">Product Details</div>
    <div>
      In the product section, you will review and manage all products with their
      details. You can view and edit many information such as product name,
      description, stock, price and more.
    </div>
    <ul class="nav mt-4">
      <li class="nav-item-tab">
        <a
          class="nav-link text-black"
          :class="{
            'border-bottom border-dark border-2': filterString == 'all',
          }"
          role="button"
          @click="fetchByFilter('all')"
        >
          All Products
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link text-black"
          role="button"
          :class="{
            'border-bottom border-dark border-2': filterString == 'outstock',
          }"
          @click="fetchByFilter('outstock')"
        >
          Out Stock
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link text-black"
          role="button"
          :class="{
            'border-bottom border-dark border-2': filterString == 'instock',
          }"
          @click="fetchByFilter('instock')"
        >
          In stock
        </a>
      </li>

      <li class="nav-item">
        <a
          class="nav-link text-black"
          role="button"
          :class="{
            'border-bottom border-dark border-2': filterString == 'active',
          }"
          @click="fetchByFilter('active')"
        >
          Active
        </a>
      </li>

      <li class="nav-item">
        <a
          class="nav-link text-black"
          role="button"
          :class="{
            'border-bottom border-dark border-2': filterString == 'inactive',
          }"
          @click="fetchByFilter('inactive')"
        >
          In Active
        </a>
      </li>

      <!-- <li class="nav-item">
   <a  class="nav-link text-black " role="button" @click="fetchProducts('pending')">
         Pending
   </a>  
   </li> -->
    </ul>

    <hr class="mt-0" />
    <div class="d-flex justify-content-between p-2 selection-bar">
      <!-- <div class="d-flex  border rounded">
      <input type="text" v-model="searchQuery" class="form-control search-input" placeholder="Search" aria-label="search" aria-describedby="basic-addon2"/>
        <span role="button"  class="input-group-text search rounded-0" id="basic-addon2" @click="searchProduct()">
            <i class="fas fa-search"></i>
        </span>           
   </div> -->
      <div class="position-relative w-50 me-2">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="searchProduct"
          class="form-control rounded-pill pe-5"
          placeholder="Search by name"
          aria-label="Recipient's username"
          aria-describedby="basic-add"
        />
        <span @click="searchProduct" role="button" class="position-absolute end-0 top-0 p-2 me-2"
          ><i class="fas fa-search"></i
        ></span>
      </div>
      <div class="d-flex">
        <div class="me-2">
          <select
            class="form-select"
            aria-label="selectFilterRegion"
            v-model.number="filteredCat"
            @change="fetchProductByCategory()"
          >
            <option value="">Filter</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.title }}
            </option>
          </select>
        </div>
        <div>
          <button @click="downloadCSV()" class="btn border">Export</button>
        </div>
        <!-- <div>
        <button class="btn bg-white border ms-2">
          <span class=""> <i class="fa-solid fa-file-export"></i> </span>  
          Export
        </button>

      </div> -->
      </div>
    </div>
    <!-- Table -->
    <table class="mt-2">
      <tr>
        <th>No</th>
        <th>Model</th>
        <th>Image</th>
        <th>Name</th>
        <th>Category</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Status</th>
        <th><span class="sr-only">Action</span></th>
      </tr>
      <tr v-for="(product, index) in products" :key="product.id">
        <td>{{pageNo * perPage - perPage + index + 1 }}</td>
        <td style="white-space: nowrap">{{ product.model }}</td>
        <td>
          <img
            :src="product.images?.path"
            width="80"
            height="70"
            alt="product image"
          />
        </td>
        <td>{{ product.name }}</td>
        <td>{{ product.category?.title }}</td>
        <td>{{ product.price }}</td>
        <td>{{ product.qty }}</td>
        <td style="white-space: nowrap">
          {{ product.qty > 0 ? "In Stock" : "Out Stock" }}
        </td>
        <td>
          <span
            class="me-2"
            @click="
              $router.push({
                name: 'ProductDetail',
                params: { id: product.id },
              })
            "
            role="button"
            ><i class="far fa-eye"></i
          ></span>
        </td>
      </tr>
    </table>
  <div v-if="!products.length" class="text-center">No record</div>
     <!-- pagination -->
  <div v-if="!isSearch" class="d-flex mt-2 justify-content-end mb-3 me-2">
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

  <!-- <add-product-modal :isAddModalVisible="isAddModalVisible" @closeAddModal="closeAddModal"/> -->
</template>

<script>
import apiClient from "../resources/baseUrl";
import Paginate from "vuejs-paginate-next";
import exportFromJSON from "export-from-json"
// import {useStore} from 'vuex'
export default {
  components:{
    Paginate
  },
  data() {
    return {
      products: [],
      categories: "",
      filteredCat: "",
      searchQuery: "",
      filterString: "all",
       isSearch:false,
      //paginate
      perPage: 10,
      pageNo: 1,
      totalPage: 0,
    };
  },

  methods: {
      downloadCSV(){
        const data = this.products;
      const fileName = "my shop products";
      const exportType = exportFromJSON.types.csv;
      if (data) exportFromJSON({ data, fileName, exportType });
    },
    async fetchProducts(query) {
      try {
        this.$store.commit("setIsLoading", true);
        const response = await apiClient.get(
          `/api/shop_products?filter=${query}&&page=${this.pageNo}&&per_page=${this.perPage}`
        );
        if (response.status === 200) {
          this.products = response.data.data;
           this.perPage = response.data.meta.per_page;
          this.pageNo = response.data.meta.current_page;
          this.totalPage = response.data.meta.last_page;
          this.filterString=query
          this.isSearch=false
        }
      } catch (e) {
        //
      } finally {
        this.$store.commit("setIsLoading", false);
      }
    },

    async fetchProductByCategory() {
      try {
        this.$store.commit("setIsLoading", true);
        const response = await apiClient.get(
          `/api/categories/${this.filteredCat}`
        );
        if (response.status === 200) {
          this.products = response.data.data;
        }
      } catch (e) {
        //
      } finally {
        this.$store.commit("setIsLoading", false);
      }
    },

    async searchProduct() {
      // alert(this.searchQuery)
      if(this.searchQuery=='')
      return this.fetchProducts('all')
      try {
        this.$store.commit("setIsLoading", true);
        const response = await apiClient.get(
          `/api/search_shop_products?search=${this.searchQuery}`
        );
        if (response.status === 200) {
          this.products = response.data.data;
           this.filterString=''
           this.isSearch= true          
        }
      } catch (e) {
        //
      } finally {
        this.$store.commit("setIsLoading", false);
      }
    },
    async fetchCategories() {
      try {
        this.$store.commit("setIsLoading", true);
        const response = await apiClient.get("/api/categories");
        if (response.status === 200) {
          this.categories = response.data;
          console.log("categories" + this.categories);
        }
      } catch (e) {
        //
      } finally {
        this.$store.commit("setIsLoading", false);
      }
    },

     fetchByFilter(filter){
      this.pageNo=1
     this.fetchProducts(filter)
    },
    //paginations
    fetchByPageNo(no) {
      this.pageNo = no;
      this.fetchProducts(this.filterString);
    },
    handlePerPage() {
      this.fetchProducts(this.filterString);
    },
  },

  created() {
    this.fetchProducts("all");
    this.fetchCategories();
  },
};
</script>

<style>
.search-input {
  border-bottom-right-radius: 0 !important;
  border-top-right-radius: 0 !important;
}
.selection-bar {
  background-color: rgb(250, 250, 250);
}
.input-group {
  padding: 0 !important;
  margin: 0 !important;
}
table {
  border-collapse: collapse;
  width: 100%;
}
/* new design change start*/
tr:last-child {
  border-bottom: 2px solid #f1f1f1;
}
th {
  text-align: left;
  padding: 8px;
}
tr {
  border-bottom: 2px solid #f1f1f1;
}
td {
  text-align: left;
  padding: 8px;
  vertical-align: top;
}
.text-dark-blue {
  color: #2f4587;
}
.btn-bg-primary {
  background-color: #ff7e00;
}
.warining input,
.warining textarea {
  border: 1px red solid;
}
.warining span {
  display: inline;
  color: red;
  font-size: 14px;
}
</style>
