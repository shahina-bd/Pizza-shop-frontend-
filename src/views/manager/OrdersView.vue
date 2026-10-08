<template>
    <ManagerMaster>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="mb-0">
                                <i class="fas fa-shopping-cart me-2 text-success"></i>
                                Order Management
                            </h4>
                        </div>
                        <div class="card-body">
                            <p class="text-muted">Manage orders here. Connect to orders API endpoint for full functionality.</p>
                            <div class="alert alert-info">
                                Manager can view and manage orders assigned to them with restrictions based on backend permissions.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ManagerMaster>
</template>

<script setup>
import ManagerMaster from '@/components/manager/ManagerMaster.vue'
</script>
