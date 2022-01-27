//Add a description to the data object with the value "A pair of warm, fuzzy socks". Then display the description using an expression in an p element, underneath the h1.
var eventBus = new Vue();

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        },
    },
    template: `
      <div class="product">
            <div class="product-image">
                <img v-bind:src="image" />
            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In Stock</p>
                <p v-else :class="{noStock: !inStock}">Out of Stock</p>
                <p>{{sale}}</p>
                  <info-tabs :details="details" :shipping="shipping" ></info-tabs>
                <div>
                    <ul>
                        <li v-for="size in sizes">{{size}}</li>
                    </ul>
                </div>
                <div v-for="(variant,index) in variants" :key="variant.variantId" class="color-box" :style="{ backgroundColor:variant.variantColor }" @mouseover="updateProduct(index)"></div>
                <div class="cartButtons">
                    <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock } ">
							Add To Cart
						</button>    
                </div>
                <div class="cartButtons">
                    <button v-on:click="removeFromCart ">Remove From Cart</button>
                </div>
               
            </div>
            <product-tabs :reviews="reviews"></product-tabs>
        </div>`,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            selectedVariant: 0,
            details: ['100% Cotton', 'Gender-neutral'],
            variants: [{
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: './vmSocks-green-onWhite.jpg',
                    variantQuantity: 100,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: './vmSocks-blue-onWhite.png',
                    variantQuantity: 10,
                },
            ],
            sizes: ['S', 'M', 'L', 'XL'],

            onSale: true,
            reviews: [],
        };
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
        removeFromCart() {
            this.$emit(
                'remove-from-cart',
                this.variants[this.selectedVariant].variantId
            );
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' are on sale.';
            }
            return this.brand + ' ' + this.product + ' are not on sale.';
        },
        shipping() {
            if (this.premium) {
                return 'Free';
            }
            return 2.99;
        },
    },
    mounted() {
        eventBus.$on('review-submitted', (productReview) => {
            this.reviews.push(productReview);
        });
    },
});

Vue.component('info-tabs', {
    props: {
        shipping: {
            required: true,
        },
        details: {
            type: Array,
            required: true,
        },
    },
    template: `
    <div>
        <ul>
        <span class="tab" 
              :class="{ activeTab: selectedTab === tab }"
              v-for="(tab, index) in tabs"
              @click="selectedTab = tab"
              :key="tab"
             >{{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Details'">
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
        </div>
          <div v-show="selectedTab === 'Shipping'">
        <p> {{ shipping }} </p>
        </div>
    </div>`,
    data() {
        return {
            tabs: ['Details', 'Shipping'],
            selectedTab: 'Details',
        };
    },
});

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true,
        },
    },
    template: `
    <div>
    <div>
    <span class="tab"       
          :class="{ activeTab: selectedTab === tab }"
          v-for="(tab, index) in tabs" :key="index"         
          @click="selectedTab = tab">
    {{ tab }}
    </span>
    </div>
     <div v-show="selectedTab === 'Reviews'">
                 <p v-if="!reviews.length">There are no reviews yet.</p>
              <ul v-else>
                  <li v-for="(review, index) in reviews" :key="index">
                    <p>Name: {{ review.name }}</p>
                    <p>Rating:{{ review.rating }}</p>
                    <p>Review: {{ review.review }}</p>
                    <p>Recommended: {{review.recommend}}</p>

                  </li>
              </ul>
          </div>
          
          <product-review v-show="selectedTab === 'Make a Review'"></product-review>
          
          </div>`,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews',
        };
    },
});

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
        <p class="error" v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
       <p>Would you recommend this product?</p>
         <label>Yes</label>
      <input type="radio" value="Yes" v-model="recommend"/>
      <label>No</label>
     <input type="radio" value="No" v-model="recommend"/>
            
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>`,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: [],
        };
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend,
                };
                eventBus.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommend = null;
            } else {
                if (!this.name) this.errors.push('Name required.');
                if (!this.review) this.errors.push('Review required.');
                if (!this.rating) this.errors.push('Rating required.');
                if (!this.recommend) this.errors.push('Recommendation required.');
            }
        },
    },
});
Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true,
        },
    },
    template: `
    <div>
        <ul>
            <li v-for="detail in details">{{detail}}</li>
        </ul>
    </div>`,
});

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        details: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeItem(id) {
            for (var i = this.cart.length - 1; i >= 0; i--) {
                if (this.cart[i] === id) {
                    this.cart.pop(i, 1);
                }
            }
        },
    },
});