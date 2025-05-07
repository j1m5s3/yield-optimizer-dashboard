<script>
export default {
    props: {
        contractAddress: String,
        subFee: String,
    },
    data() {
        return {
            contractAddress: this.contractAddress,
            subFee: this.subFee,
        };
    },
}
</script>

<template>
    <div id="manager-admin-view">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label for="subFee">Manager Subscription Fee (USDC)</label>
                        <label id="USDC-units">
                            <input type="text" class="form-control" id="subFee" v-model="subFee" readonly>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#manager-admin-view {
    color: var(--text-primary);
}

#manager-admin-view label {
    color: var(--text-primary);
    font-weight: 500;
    margin-bottom: 0.75rem;
    display: block;
}

#manager-admin-view .form-control {
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    font-size: 1rem;
    padding: 0.75rem;
    margin-top: 0.5rem;
}

.form-group {
    margin-bottom: 2rem;
}
</style>