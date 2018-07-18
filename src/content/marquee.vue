<template>
  <div>
    <marquee behavior="scroll" direction="left" v-if="!collapse">
      <div class="crypto" v-for="crypto in cryptos">
        <a :href="cmLink(crypto)" target="_blank">
          {{crypto.symbol}} <span :class="crypto.percent_change_1h > 0 ^ useRedUp ? 'green':''">
            <span v-if="useUSD">${{myPrice(crypto)}} </span>
            <span v-else> B{{crypto.price_btc}} </span>
          </span>
        </a>
      </div>
    </marquee>
    <div class="bitoActions">
      <div>
        <img class="btm-icon" src="https://lh3.googleusercontent.com/ODk2BOfKLGabkhgkvOdDnhmMcZVk850BN8AmCjkpp1EC_MsIGDp7KiAMgf5P-xQU6JKbyZz6=w26-h26-e365"/>
      </div>
      <div class="hoverc">
        <span v-if="!collapse" @click="handleToggle"> > </span>
        <span v-if="collapse" @click="handleToggle"> < </span>
        <a href="#" @click="cancelMarquee">X</a>
      </div>
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
<style lang="scss">
  marquee {
    font-size: 16px !important;
    height: 18px !important;
    line-height: 18px !important;
    a {
      text-decoration: none !important;
      color: black !important;
    }
  }
  .crypto {
    font-size: 16px !important;
    height: 18px !important;
    line-height: 18px !important;
    display: inline-block;
    span {
      background-color: white;
      padding-right: 8px;
      color: #f34146;
      &.green {
        color: #81c14f !important;
        span {
          color: #81c14f !important;
        }
      }
    }
  }
  .bitoActions{
    position: fixed !important;
    top: 0 !important;
    right: 0 !important;
    height: 18px !important;
    background: rgba(255, 255, 255, 0.9);
    font-size: 18px !important;
    line-height: 18px !important;
    color: #09c0e8;

    img {
      vertical-align: baseline;
    }
    div {
      float: left;
      height: 18px !important;
    }
    &:hover {
      .hoverc {
        display: inline-block;
      }
    }
    .hoverc {
      display: none;
      font-size: 16px;
      text-align: center;
      a {
        color: #09c0e8;
        text-decoration: none;
      }
      i {
        line-height: 18px;
      }
    }
    .hidebar & {
      border-radius: 25px 0 0 25px;
      padding-left: 2px;
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
    display: inline-block;
  }
</style>
