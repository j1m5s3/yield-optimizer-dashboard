<template>
    <div class="container">
        <VueLoadingButton aria-label="Stop Bot" class="button" @click.native="stopBot" :loading="isLoading">
            Stop
        </VueLoadingButton>
    </div>
</template>

<script>
import { deleteKillBot } from '../../utils/apis/BotApi';
import VueLoadingButton from 'vue-loading-button';

export default {
    components: {
      VueLoadingButton,
    },
    props: {
      botId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        isLoading: false,
      };
    },
    methods: {
      async stopBot() {
        try {
          // Fetch data from API
          this.isLoading = true;
          setTimeout(async () => {
            const response = await deleteKillBot({ bot_id: this.botId });
            if (response.killed) {
              console.log('Bot stopped');
            }
            else {
              console.log('Bot stop failed');
            }
            this.isLoading = false;
            window.location.reload();
          }, 3000);
        } catch (error) {
          console.error('Error killing bot:', error);
        }
      },
    },
}

</script>