<script>
import { ref } from 'vue'

export default {
    name: 'Dashboard',
    components: {},
    setup() {

        const sidebarOpen = ref(false)

        return {
            sidebarOpen,
        }
    }
}
</script>


<template>
    <div id="dashboard">
        <b-row class="dashboard-row" cols="2">
            <b-col class="mb-3 mx-3" :md="4">
                <b-card title="Deploy SMA" class="rounded" bg-variant="dark">
                    PLACEHOLDER
                </b-card>
            </b-col>
        </b-row>
        <b-row class="bot-status-row">
            <b-col class="mb-3 mx-3" >
                <b-card title="Active Bots" class="rounded" bg-variant="dark">
                   PLACEHOLDER
                </b-card>
            </b-col>
        </b-row>
    </div>
</template>