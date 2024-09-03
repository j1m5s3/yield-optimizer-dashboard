<script>
import { ref } from 'vue'
import SMAFactory from './items/forms/SMAFactory.vue';

export default {
    name: 'Dashboard',
    components: {SMAFactory},
    data() {
        return {
            activeBots: [],
            isBusy: false,
        }
    },
}
</script>


<template>
    <div id="dashboard">
        <div class="row">
            <div class="col" >
                <div class="card" title="Deploy SMA">
                    <SMAFactory />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#dashboard {
    margin: 20px;
    border-radius: 10px;
}

.card {
  border: 10px solid #000; /* Black border */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Drop shadow */
  font-weight: bold; /* Bold text */
}
</style>