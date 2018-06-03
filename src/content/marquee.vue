<template>
  <div>
    <marquee behavior="scroll" direction="left" v-if="!collapse">
      <div v-for="crypto in cryptos">
        <a :href="cmLink(crypto)" target="_blank">
          {{crypto.symbol}} <span :class="crypto.percent_change_1h > 0 ? 'green':''">
            <span v-if="useUSD">${{myPrice(crypto)}} </span>
            <span v-else> B{{crypto.price_btc}} </span>
          </span>
        </a>
      </div>
    </marquee>
    <div class="actions" @mouseover="hover=true" @mouseleave="hover=false">
      <img class="btm-icon" src="https://lh3.googleusercontent.com/ODk2BOfKLGabkhgkvOdDnhmMcZVk850BN8AmCjkpp1EC_MsIGDp7KiAMgf5P-xQU6JKbyZz6=w26-h26-e365"/>
      <template v-if="hover">
        <i class="el-icon-caret-right" v-if="!collapse" @click="handleToggle"></i>
        <i class="el-icon-caret-left" v-if="collapse" @click="handleToggle"></i>
        <a href="#" @click="cancelMarquee"><i class="el-icon-close"></i></a>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['cryptos', 'useUSD', 'useRedUp', 'currencyDisplay', 'currencyLowerCase'],
    data: () => ({
      collapse: false,
      hover: false
    }),
    computed: {
    },
    created () {
      document.body.className += ' ' + 'bitome'
      this.$gtm.trackView('marquee', '/marquee.html')
    },
    mounted () { },
    methods: {
      handleToggle () {
        this.collapse = !this.collapse
        this.$emit('collapseContainer', this.collapse)
      },
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
      background-color: white;
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
    background: rgba(255, 255, 255, 0.8);
    .hide & {
      border-radius: 25px 0 0 25px;
      padding-left: 2px;
    }
    color: #09c0e8;
    a {
      color: #09c0e8;
    }
  }
  .bitome {
    nav, header, .header,
    #facebook ._-kb div {
      margin-top: 18px !important;
    }
  }
  .btm-icon{
    width: 16px;
  }

</style>
