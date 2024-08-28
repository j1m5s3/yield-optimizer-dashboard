<template>
  <div>
      <b-table 
      striped 
      hover 
      bordered 
      small
      dark
      :items="active_bots" 
      :fields="fields" 
      :busy="isBusy" 
      class="mt-3 mx-auto" 
      outlined>
        <template #cell(actions)="row">
            <BotStopButton :botId="row.item.bot_id" />
        </template>
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
      </b-table>
  </div>
</template>

<script>
import { getDeployedBotsStatus } from '../../utils/apis/BotApi';
import BotStopButton from './BotStopButton.vue';

export default {
  components: {
    BotStopButton,
  },
  data() {
    return {
      active_bots_status: {},
      active_bots: [],
      fields: [
        { key: 'bot_id', label: 'Bot ID' },
        { key: 'created_at', label: 'Created At' },
        { key: 'status', label: 'Status' },
        { key: 'asset_id', label: 'Asset ID' },
        { key: 'order_cash_amount', label: 'Order Cash Amount' },
        { key: 'fixed_order_size', label: 'Fixed Order Size' },
        { key: 'buy_only', label: 'Buy Only' },
        { key: 'sell_only', label: 'Sell Only' },
        { key: 'accumulate_asset', label: 'Accumulate Asset' },
        { key: 'accumulate_cash', label: 'Accumulate Cash' },
        { key: 'actions', label: 'Actions' },
      ],
      isBusy: false,
    };
  },
  computed: {},
  async mounted() {
    this.isBusy = true;
    let active_records = await this.fetchData();
    for (let key in active_records) {
      this.active_bots.push({
        bot_id: key,
        created_at: active_records[key].created_at,
        status: active_records[key].status,
        asset_id: active_records[key].user_config['ASSET-ID'],
        order_cash_amount: active_records[key].user_config['BUY-ORDER-CASH'],
        fixed_order_size: active_records[key].user_config['FIXED-ORDER-SIZE'],
        buy_only: active_records[key].user_config['BUY-ONLY'],
        sell_only: active_records[key].user_config['SELL-ONLY'],
        accumulate_asset: active_records[key].user_config['ACCUMULATE-ASSET'],
        accumulate_cash: active_records[key].user_config['ACCUMULATE-CASH'],
      });
    }
    console.log(this.active_bots);
    this.isBusy = false;
  },
  methods: {
    async fetchData() {
      // Fetch data from API
      const response = await getDeployedBotsStatus();
      this.active_bots_status = response.active;

      return response.active;
    },
  },
};
</script>

