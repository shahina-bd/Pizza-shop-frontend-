<template>
    <CustomerMaster>
        <!-- Hero Banner Section -->
        <section class="about-hero-section">
            <div class="container text-center">
                <span class="about-accent">Discover Our Story</span>
                <h1 class="about-title">About Us</h1>
                <div class="about-separator"></div>
            </div>
        </section>

        <!-- Our Story Section -->
        <section class="pizza-section">
            <div class="container">
                <div class="row align-items-center g-5">
                    <div class="col-lg-6">
                        <div class="pizza-section-title text-start mb-4">
                            <span class="accent">Heritage</span>
                            <h2>Crafting Joy Since 2011</h2>
                        </div>
                        <p class="pizza-about-text mb-4">
                            At Pizza Delicious, we craft every pizza with passion using the finest
                            ingredients — hand-stretched dough, rich tomato sauce, premium mozzarella,
                            and fresh organic basil. Our wood-fired ovens bring out the authentic Italian
                            flavor you crave.
                        </p>
                        <p class="pizza-about-text">
                            Starting as a small family pizzeria, we have grown into a local legend,
                            cherished for our secret dough recipe rested for 24 hours to achieve the
                            ultimate crispy outside and soft inside.
                        </p>
                    </div>
                    <div class="col-lg-6">
                        <div class="about-img-wrap">
                            <img
                                src="https://images.unsplash.com/photo-1579751626657-72bc17010498?w=600&auto=format&fit=crop"
                                alt="Pizza making process"
                                class="img-fluid about-main-img"
                                @error="onImageError"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Mission & Values Section -->
        <section class="pizza-section bg-wood-pattern">
            <div class="container">
                <div class="row g-4">
                    <div class="col-md-4">
                        <div class="value-card">
                            <div class="value-icon"><i class="fas fa-heart"></i></div>
                            <h3>Passion for Quality</h3>
                            <p>We source only premium local vegetables and certified Italian meats to ensure peak flavor.</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="value-card">
                            <div class="value-icon"><i class="fas fa-leaf"></i></div>
                            <h3>Fresh & Natural</h3>
                            <p>No preservatives or artificial coloring. Just 100% natural, fresh dough and ingredients.</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="value-card">
                            <div class="value-icon"><i class="fas fa-shipping-fast"></i></div>
                            <h3>Fast & Friendly</h3>
                            <p>Delivered piping hot with a friendly smile to keep the crunch and cheese stretch perfect.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Milestones Stats Section -->
        <section class="pizza-section stats-section">
            <div class="container">
                <div class="row text-center g-4">
                    <div class="col-6 col-md-3">
                        <div class="stat-box">
                            <span class="stat-number">15+</span>
                            <span class="stat-label">Years Experience</span>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="stat-box">
                            <span class="stat-number">40+</span>
                            <span class="stat-label">Pizza Varieties</span>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="stat-box">
                            <span class="stat-number">150k+</span>
                            <span class="stat-label">Happy Customers</span>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="stat-box">
                            <span class="stat-number">12</span>
                            <span class="stat-label">Expert Chefs</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Our Team Section -->
        <section class="pizza-section">
            <div class="container">
                <div class="pizza-section-title">
                    <span class="accent">Masters</span>
                    <h2>Meet Our Chefs</h2>
                    <p>The culinary artists behind every signature dough and topping combination.</p>
                </div>

                <div class="row g-4">
                    <div class="col-md-4" v-for="chef in chefs" :key="chef.name">
                        <div class="chef-card text-center">
                            <div class="chef-avatar">
                                <img :src="chef.image" :alt="chef.name" @error="onChefImageError" />
                            </div>
                            <h4 class="text-white mt-3 mb-1">{{ chef.name }}</h4>
                            <span class="chef-role">{{ chef.role }}</span>
                            <p class="chef-bio mt-2">{{ chef.bio }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </CustomerMaster>
</template>

<script setup>
import CustomerMaster from '@/components/customer/CustomerMaster.vue'

const chefs = [
    {
        name: 'Mario Salteri',
        role: 'Head Pizzaiolo',
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop',
        bio: 'Over 20 years of crafting Neapolitan-style wood-fired pizzas with secrets passed down from his grandfather.'
    },
    {
        name: 'Luigi Rossi',
        role: 'Executive Chef',
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop',
        bio: 'Dough perfectionist who believes the maturation process of the yeast is the soul of any pizza.'
    },
    {
        name: 'Sofia Moretti',
        role: 'Sous Chef & Topping Specialist',
        image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&auto=format&fit=crop',
        bio: 'Artisan flavor curator responsible for our award-winning vegetarian combinations and special sauces.'
    }
]

const onImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop'
}

const onChefImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop'
}
</script>

<style scoped>
.about-hero-section {
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                url('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&auto=format&fit=crop') center/cover no-repeat;
    padding: 6.5rem 0;
    border-bottom: 1px solid rgba(250, 197, 100, 0.15);
}

.about-accent {
    font-family: var(--pizza-script);
    color: var(--pizza-gold);
    font-size: 2.2rem;
    display: block;
    margin-bottom: 0.5rem;
}

.about-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    color: var(--pizza-white);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
}

.about-separator {
    width: 60px;
    height: 3px;
    background: var(--pizza-gold);
    margin: 1.5rem auto 0;
}

.about-img-wrap {
    position: relative;
    border: 1px solid rgba(250, 197, 100, 0.15);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
    overflow: hidden;
}

.about-main-img {
    transition: transform 0.6s ease;
}

.about-img-wrap:hover .about-main-img {
    transform: scale(1.04);
}

.bg-wood-pattern {
    background: linear-gradient(135deg, #161616 0%, #22150c 100%);
    border-top: 1px solid rgba(250, 197, 100, 0.05);
    border-bottom: 1px solid rgba(250, 197, 100, 0.05);
}

.value-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.04);
    padding: 2.5rem 1.8rem;
    text-align: center;
    transition: all 0.3s ease;
    height: 100%;
}

.value-card:hover {
    transform: translateY(-5px);
    border-color: rgba(250, 197, 100, 0.25);
    background: rgba(250, 197, 100, 0.02);
}

.value-icon {
    font-size: 2.5rem;
    color: var(--pizza-gold);
    margin-bottom: 1.25rem;
}

.value-card h3 {
    color: var(--pizza-white);
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
}

.value-card p {
    color: var(--pizza-muted);
    font-size: 0.88rem;
    line-height: 1.6;
    margin: 0;
}

.stats-section {
    background: #0b0b0b;
}

.stat-box {
    padding: 1.5rem 1rem;
}

.stat-number {
    font-size: 3rem;
    font-weight: 800;
    color: var(--pizza-gold);
    display: block;
    line-height: 1;
    margin-bottom: 0.5rem;
}

.stat-label {
    color: var(--pizza-white);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.chef-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 2.25rem 1.5rem;
    transition: all 0.3s ease;
}

.chef-card:hover {
    transform: translateY(-5px);
    border-color: rgba(250, 197, 100, 0.35);
}

.chef-avatar {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    margin: 0 auto;
    overflow: hidden;
    border: 3px solid var(--pizza-gold);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.chef-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.chef-role {
    color: var(--pizza-gold);
    font-size: 0.82rem;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.chef-bio {
    color: var(--pizza-muted);
    font-size: 0.85rem;
    line-height: 1.6;
}
</style>
