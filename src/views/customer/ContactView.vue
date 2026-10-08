<template>
    <CustomerMaster>
        <!-- Hero Banner Section -->
        <section class="contact-hero-section">
            <div class="container text-center">
                <span class="contact-accent">Get In Touch</span>
                <h1 class="contact-title">Contact Us</h1>
                <div class="contact-separator"></div>
            </div>
        </section>

        <!-- Contact Form & Details Section -->
        <section class="pizza-section">
            <div class="container">
                <div class="row g-5">
                    <!-- Contact Details Side -->
                    <div class="col-lg-5">
                        <div class="pizza-section-title text-start mb-4">
                            <span class="accent">Details</span>
                            <h2>Reach Out To Us</h2>
                        </div>
                        <p class="pizza-about-text mb-4">
                            Have a question, feedback, or a large event order? We would love to hear from you.
                            Give us a call, send an email, or stop by one of our cozy pizzeria locations.
                        </p>

                        <div class="contact-info-list">
                            <div class="contact-info-item">
                                <div class="info-icon"><i class="fas fa-map-marker-alt"></i></div>
                                <div class="info-content">
                                    <h4>Our Location</h4>
                                    <p>198 West 21th Street, Suite 721, New York NY 10016</p>
                                </div>
                            </div>

                            <div class="contact-info-item">
                                <div class="info-icon"><i class="fas fa-phone"></i></div>
                                <div class="info-content">
                                    <h4>Phone Number</h4>
                                    <p>+1 392 3929 210 / +1 392 3929 211</p>
                                </div>
                            </div>

                            <div class="contact-info-item">
                                <div class="info-icon"><i class="fas fa-envelope"></i></div>
                                <div class="info-content">
                                    <h4>Email Address</h4>
                                    <p>info@pizzadelicious.com</p>
                                </div>
                            </div>

                            <div class="contact-info-item">
                                <div class="info-icon"><i class="fas fa-clock"></i></div>
                                <div class="info-content">
                                    <h4>Open Hours</h4>
                                    <p>Mon - Sat: 11:00 AM - 11:00 PM <br> Sunday: 12:00 PM - 10:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Form Side -->
                    <div class="col-lg-7">
                        <div class="contact-form-card">
                            <h3 class="form-title mb-4">Send Us A Message</h3>

                            <div v-if="contactSuccess" class="alert pizza-contact-alert-success">
                                <i class="fas fa-check-circle me-2"></i>
                                Thank you! Your message has been sent successfully. We will get back to you shortly.
                            </div>

                            <div v-if="contactError" class="alert pizza-contact-alert-error">
                                <i class="fas fa-exclamation-circle me-2"></i>
                                {{ contactError }}
                            </div>

                            <form @submit.prevent="handleContactSubmit">
                                <div class="row g-4">
                                    <div class="col-md-6">
                                        <label class="pizza-form-label">First Name</label>
                                        <input
                                            type="text"
                                            class="pizza-form-control"
                                            v-model="contactForm.first_name"
                                            required
                                        />
                                    </div>

                                    <div class="col-md-6">
                                        <label class="pizza-form-label">Last Name</label>
                                        <input
                                            type="text"
                                            class="pizza-form-control"
                                            v-model="contactForm.last_name"
                                            required
                                        />
                                    </div>

                                    <div class="col-12">
                                        <label class="pizza-form-label">Message</label>
                                        <textarea
                                            class="pizza-form-control"
                                            rows="5"
                                            v-model="contactForm.message"
                                            required
                                            placeholder="Write your thoughts here..."
                                        ></textarea>
                                    </div>

                                    <div class="col-12">
                                        <button
                                            type="submit"
                                            class="btn btn-pizza-primary w-100"
                                            :disabled="isContactSubmitting"
                                        >
                                            <i class="fas fa-paper-plane me-2" v-if="!isContactSubmitting"></i>
                                            {{ isContactSubmitting ? 'Sending Message...' : 'Send Message' }}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Embedded Map Section -->
        <section class="map-section">
            <iframe
                class="contact-map"
                title="Pizza Delicious Location"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=198+West+21th+Street,+New+York,+NY+10016&output=embed"
            ></iframe>
        </section>
    </CustomerMaster>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/axios'
import CustomerMaster from '@/components/customer/CustomerMaster.vue'
import { useCustomerAuthStore } from '@/stores/customerAuth'

const customerAuthStore = useCustomerAuthStore()
const isContactSubmitting = ref(false)
const contactSuccess = ref(false)
const contactError = ref('')

const contactForm = ref({
    first_name: '',
    last_name: '',
    message: '',
})

const prefillContactForm = () => {
    if (!customerAuthStore.isAuthenticated) {
        return
    }

    const fullName = (customerAuthStore.user?.name ?? '').trim()
    if (fullName) {
        const [firstName, ...rest] = fullName.split(' ')
        contactForm.value.first_name = firstName ?? ''
        contactForm.value.last_name = rest.join(' ')
    }
}

const handleContactSubmit = async () => {
    contactSuccess.value = false
    contactError.value = ''
    isContactSubmitting.value = true

    try {
        await api.post('v1/contact', contactForm.value)
        contactSuccess.value = true
        // Keep name, clear message
        contactForm.value.message = ''
    } catch (error) {
        contactError.value =
            error.response?.data?.message || 'Failed to send message. Please try again later.'
    } finally {
        isContactSubmitting.value = false
    }
}

onMounted(() => {
    prefillContactForm()
})
</script>

<style scoped>
.contact-hero-section {
    background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&auto=format&fit=crop') center/cover no-repeat;
    padding: 6.5rem 0;
    border-bottom: 1px solid rgba(250, 197, 100, 0.15);
}

.contact-accent {
    font-family: var(--pizza-script);
    color: var(--pizza-gold);
    font-size: 2.2rem;
    display: block;
    margin-bottom: 0.5rem;
}

.contact-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    color: var(--pizza-white);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
}

.contact-separator {
    width: 60px;
    height: 3px;
    background: var(--pizza-gold);
    margin: 1.5rem auto 0;
}

.contact-info-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 2.5rem;
}

.contact-info-item {
    display: flex;
    gap: 1.25rem;
    align-items: flex-start;
}

.info-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(250, 197, 100, 0.08);
    border: 1px solid rgba(250, 197, 100, 0.25);
    color: var(--pizza-gold);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
    transition: all 0.3s ease;
}

.contact-info-item:hover .info-icon {
    background: var(--pizza-gold);
    color: var(--pizza-black);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(250, 197, 100, 0.3);
}

.info-content h4 {
    color: var(--pizza-white);
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.info-content p {
    color: var(--pizza-muted);
    font-size: 0.88rem;
    line-height: 1.6;
    margin: 0;
}

.contact-form-card {
    background: #0d0d0d;
    border: 1px solid rgba(255, 255, 255, 0.04);
    padding: 3rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.form-title {
    color: var(--pizza-white);
    font-size: 1.5rem;
    font-weight: 600;
}

.map-section {
    height: 450px;
    width: 100%;
    border-top: 1px solid rgba(250, 197, 100, 0.1);
}

.contact-map {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
}

.pizza-form-label {
    display: block;
    color: var(--pizza-white);
    font-size: 0.82rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    letter-spacing: 0.3px;
}

.pizza-form-control {
    width: 100%;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--pizza-white);
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    border-radius: 0;
    transition: all 0.3s ease;
}

.pizza-form-control::placeholder {
    color: rgba(255, 255, 255, 0.3);
}

.pizza-form-control:focus {
    outline: none;
    border-color: var(--pizza-gold);
    background: rgba(250, 197, 100, 0.02);
    box-shadow: 0 0 8px rgba(250, 197, 100, 0.15);
}

.pizza-contact-alert-success {
    background: rgba(40, 167, 69, 0.1);
    border: 1px solid rgba(40, 167, 69, 0.25);
    color: #8fd9a0;
    border-radius: 0;
    font-size: 0.9rem;
}

.pizza-contact-alert-error {
    background: rgba(220, 53, 69, 0.1);
    border: 1px solid rgba(220, 53, 69, 0.25);
    color: #f5a5ad;
    border-radius: 0;
    font-size: 0.9rem;
}

.btn-pizza-primary {
    background: var(--pizza-gold);
    border: 1px solid var(--pizza-gold);
    color: var(--pizza-black);
    font-weight: 700;
    padding: 0.75rem 1.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-radius: 0;
    transition: all 0.3s ease;
}

.btn-pizza-primary:hover:not(:disabled) {
    background: var(--pizza-gold-hover);
    border-color: var(--pizza-gold-hover);
    box-shadow: 0 4px 15px rgba(250, 197, 100, 0.3);
}

@media (max-width: 991px) {
    .contact-form-card {
        padding: 2rem 1.5rem;
    }
    .map-section {
        height: 320px;
    }
}
</style>
