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