<template>
  <div>
    <marquee behavior="scroll" direction="left">
      <div v-for="crypto in cryptos">
        <a :href="cmLink(crypto)" target="_blank">
          {{crypto.symbol}} <span :class="crypto.percent_change_1h > 0 ? 'green':'red'">
            <span v-if="useUSD">${{myPrice(crypto)}} </span>
            <span v-else> B{{crypto.price_btc}} </span>
          </span>
        </a>
      </div>
    </marquee>
    <div class="actions">
      <a href="#" @click="cancelMarquee"><i class="el-icon-close"></i></a>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['cryptos', 'useUSD', 'useRedUp', 'currencyDisplay', 'currencyLowerCase'],
    data: () => ({
    }),
    computed: {
    },
    created () {
      document.body.className += ' ' + 'bitome'
    },
    mounted () { },
    methods: {
      cmLink (crypto) {
        return `https://coinmarketcap.com/currencies/${crypto.name.toLowerCase()}`
      },
      myPrice (crypto) {
        if (this.currencyDisplay !== 'USD') {
          return crypto[`price_${this.currencyLowerCase}`] || `USD ${crypto.price_usd}`
        }
        return crypto.price_usd
      },
      cancelMarquee () {
        this.$emit('cancelMarquee', false)
      }
    }
  }
</script>
<style lang="scss" scoped>
  marquee {
    font-size: 16px !important;
    height: 18px !important;
    line-height: 18px !important;
    a {
      text-decoration: none !important;
      color: black !important;
    }
  }

  div {
    font-size: 16px !important;
    height: 18px !important;
    line-height: 18px !important;
    display: inline-block;
    span {
      padding-right: 8px;
      color: #f34146 !important;
      &.green {
        color: #81c14f !important;
      }
    }
  }
  .actions{
    position: fixed;
    top: 0;
    right: 0;
    background: white;
  }
  .bitome {
    nav, header, .header,
    #facebook ._-kb div {
      margin-top: 18px !important;
    }
  }
</style>
