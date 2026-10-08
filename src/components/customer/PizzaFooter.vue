<template>
    <footer class="pizza-footer">
        <div class="container">
            <div class="row g-4 pizza-footer-top">
                <div class="col-md-6 col-lg-3">
                    <h6 class="pizza-footer-title">ABOUT US</h6>
                    <p class="pizza-footer-text">
                        Far far away, behind the word mountains, far from the countries Vokalia and
                        Consonantia, there live the blind texts.
                    </p>

                    <div class="pizza-footer-social">
                        <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>

                <div class="col-md-6 col-lg-3">
                    <h6 class="pizza-footer-title">RECENT BLOG</h6>

                    <div class="pizza-footer-blog">
                        <div class="pizza-footer-blog-item">
                            <div class="pizza-footer-blog-thumb">
                                <img src="/images/slider1.jpg" alt="Blog" loading="lazy" />
                            </div>
                            <div class="pizza-footer-blog-body">
                                <p class="pizza-footer-blog-title">Even the all-powerful Pointing has no control about</p>
                                <p class="pizza-footer-blog-meta">
                                    <span><i class="far fa-calendar-alt me-1"></i>Sept 15, 2026</span>
                                    <span class="mx-2">•</span>
                                    <span><i class="far fa-user me-1"></i>Admin</span>
                                    <span class="mx-2">•</span>
                                    <span><i class="far fa-comment me-1"></i>3</span>
                                </p>
                            </div>
                        </div>

                        <div class="pizza-footer-blog-item">
                            <div class="pizza-footer-blog-thumb">
                                <img src="/images/slider2.jpg" alt="Blog" loading="lazy" />
                            </div>
                            <div class="pizza-footer-blog-body">
                                <p class="pizza-footer-blog-title">Even the all-powerful Pointing has no control about</p>
                                <p class="pizza-footer-blog-meta">
                                    <span><i class="far fa-calendar-alt me-1"></i>Sept 15, 2026</span>
                                    <span class="mx-2">•</span>
                                    <span><i class="far fa-user me-1"></i>Admin</span>
                                    <span class="mx-2">•</span>
                                    <span><i class="far fa-comment me-1"></i>3</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col-lg-2">
                    <h6 class="pizza-footer-title">SERVICES</h6>
                    <ul class="pizza-footer-list">
                        <li>Cooked</li>
                        <li>Deliver</li>
                        <li>Quality Foods</li>
                        <li>Mixed</li>
                    </ul>
                </div>

                <div class="col-md-6 col-lg-4">
                    <h6 class="pizza-footer-title">HAVE A QUESTIONS?</h6>
                    <ul class="pizza-footer-contacts">
                        <li>
                            <i class="fas fa-map-marker-alt"></i>
                            <span>203 Fake St. Mountain View, San Francisco, California, USA</span>
                        </li>
                        <li>
                            <i class="fas fa-phone"></i>
                            <span>+2 392 3929 210</span>
                        </li>
                        <li>
                            <i class="fas fa-envelope"></i>
                            <span>info@yourdomain.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="pizza-footer-bottom">
                <p class="pizza-footer-copyright">
                    Copyright ©{{ year }} All rights reserved | This template is made with ♥ by Colorlib
                </p>
            </div>
        </div>
    </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
