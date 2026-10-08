<template>
    <CustomerMaster>
        <section class="pizza-section">
            <div class="container">
                <div class="pizza-section-title">
                    <span class="accent">Blog</span>
                    <h2>Recent Blog</h2>
                    <p>News, recipes, and stories from Pizza Delicious.</p>
                </div>

                <div class="row g-4">
                    <div class="col-md-6 col-lg-4" v-for="post in posts" :key="post.id">
                        <article class="pizza-card h-100">
                            <img :src="post.image" :alt="post.title" class="card-img-top" />
                            <div class="card-body d-flex flex-column">
                                <p class="card-category mb-2">{{ post.date }} • {{ post.author }}</p>
                                <h5 class="card-title mb-3">{{ post.title }}</h5>
                                <p class="pizza-about-text mb-4">{{ post.excerpt }}</p>
                                <button class="btn btn-pizza-primary mt-auto align-self-start">Read More</button>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    </CustomerMaster>
</template>

<script setup>
import CustomerMaster from '@/components/customer/CustomerMaster.vue'

const posts = [
    {
        id: 1,
        title: 'How We Make Our Signature Dough',
        date: 'June 6, 2026',
        author: 'Admin',
        image: '/images/slider1.jpg',
        excerpt: 'Our dough is rested for 24 hours to get the perfect texture and flavor in every slice.',
    },
    {
        id: 2,
        title: 'Top 5 Pizza Toppings You Should Try',
        date: 'May 29, 2026',
        author: 'Admin',
        image: '/images/slider2.jpg',
        excerpt: 'From classic margherita to spicy chicken, here are our customer favorites this month.',
    },
    {
        id: 3,
        title: 'Behind The Scenes In Our Kitchen',
        date: 'May 20, 2026',
        author: 'Admin',
        image: '/images/slider3.jpg',
        excerpt: 'Take a quick tour of the team, ovens, and process that bring your orders to life.',
    },
]
</script>
