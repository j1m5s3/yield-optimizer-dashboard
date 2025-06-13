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
        <div class="form-container">
            <div class="form-group">
                <div class="d-flex align-items-center mb-2">
                    <label for="subFee" class="mb-0">Manager Subscription Fee (USDC)</label>
                    <button 
                        class="btn btn-link btn-sm ms-2 help-btn" 
                        data-bs-toggle="tooltip" 
                        data-bs-placement="right"
                        title="The subscription fee required to access the SMA management features. This fee is charged in USDC and covers the costs of active portfolio management."
                        @click.stop
                    >
                        <img 
                            src="../../../../assets/info-circle.svg" 
                            class="info-icon" 
                            alt="Info"
                        />
                    </button>
                </div>
                <label id="USDC-units">
                    <input type="text" class="form-control" id="subFee" v-model="subFee" readonly>
                </label>
            </div>
        </div>
    </div>
</template>

<style scoped>
#manager-admin-view {
    color: var(--text-primary);
    padding: 1rem;
}

.form-container {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

#manager-admin-view label {
    color: var(--text-primary);
    font-weight: 500;
    margin-bottom: 0.75rem;
    display: block;
    font-size: 0.875rem;
}

#manager-admin-view .form-control {
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    font-size: 0.875rem;
    padding: 0.75rem;
    margin-top: 0.5rem;
    height: 42px;
}

#manager-admin-view .form-control:read-only {
    background-color: var(--card-background);
    color: var(--text-primary);
}

.form-group {
    margin-bottom: 1.5rem;
}

.help-btn {
    padding: 0.25rem 0.5rem;
    min-width: 32px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.help-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-icon {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
}

@media (max-width: 768px) {
    .form-container {
        max-width: 600px;
    }

    #manager-admin-view label {
        font-size: 0.8125rem;
    }

    #manager-admin-view .form-control {
        font-size: 0.8125rem;
        height: 38px;
        padding: 0.625rem;
    }
}

@media (max-width: 480px) {
    .form-container {
        max-width: 100%;
    }

    #manager-admin-view label {
        font-size: 0.75rem;
    }

    #manager-admin-view .form-control {
        font-size: 0.75rem;
        height: 36px;
        padding: 0.5rem;
    }
}
</style>