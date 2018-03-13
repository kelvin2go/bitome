<template>
  <li>
    <el-row :gutter="10" class='first' :class="isShow?'showContainer':''">
      <div v-if="!isShow" @click="showMe">
        <el-col :xs="10" class="title">
          <i class="cc" :class="namefix(symbol)" :title="symbol" :data-name="name"></i>
          <span >{{symbol}}</span>
        </el-col>
        <el-col :xs="14" :class="percent_change_1h > 0 ^ useRedUp? 'green':'red'" >
          <span v-if="useUSD"> ${{myPrice}}</span>
          <span v-else> {{price_btc}}</span>
        </el-col>
      </div>

      <div v-else class="showExtra">
        <el-row :gutter="10" class="title">
          <el-col :xs="24" class="showTitle" >
            <a :href="cmLink" target="_blank"> 
              <i class="cc" :class="namefix(symbol)" :title="symbol" :data-name="name"></i>
              <span >{{name}}</span>
            </a>
            <el-button type="text" size="mini"><i @click="carretShow" class="el-icon-arrow-up"></i></el-button>
          </el-col>
          <el-col :xs="10">
            <span v-if="useUSD">{{currencyDisplay}} </span>
            <span v-else> BTC </span>
          </el-col>
          <el-col :xs="14" :class="percent_change_1h > 0 ^ useRedUp? 'green':'red'" >
            <span v-if="useUSD"> ${{myPrice}}</span>
            <span v-else>{{price_btc}}</span>
          </el-col>
        </el-row>

        <el-col :xs="7">
          last 1h
        </el-col>
        <el-col :xs="17" :class="percent_change_1h > 0 ^ useRedUp? 'green':'red'">
          {{ percent_change_1h }} %
        </el-col>

        <el-col :xs="7">
          last 24h
        </el-col>
        <el-col :xs="17" :class="percent_change_24h > 0 ^ useRedUp? 'green':'red'">
          {{ percent_change_24h }} %
        </el-col>

        <el-row :gutter="10"  v-if="isConvertCurrency" >
          <el-col :xs="6">
            <el-input :placeholder="symbol" size="mini" v-model="numCrypto"></el-input>
          </el-col>
          <el-col :xs="2">
            <el-button type="text" size="mini"> <font-awesome-icon icon="exchange-alt" @click="changeConvertType"/> </el-button>
          </el-col>
          <el-col :xs="16">
            <span> {{currencyDisplay}} {{ numCrypto * myPrice }} </span>
          </el-col>
        </el-row>

        <el-row :gutter="10" v-else>
          <el-col :xs="24">
            <span> {{symbol}} {{ numCurrency / myPrice }} </span>
          </el-col>
          <el-col :xs="2">
            <el-button type="text" size="mini"> <font-awesome-icon icon="exchange-alt" @click="changeConvertType"/> </el-button>
          </el-col>
          <el-col :xs="11">
            <el-input :placeholder="currencyDisplay" size="mini" v-model="numCurrency"></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-show="haveRemove">
          <el-col :xs="24" style="float:right">
            <el-button type="text" size="mini" @click="removeMyCrypto"> <font-awesome-icon icon="trash" /> </el-button>
          </el-col>
        </el-row>

      </div>
    </el-row>

  </li>
</template>
<script>
  export default {
    data: () => ({
      numCrypto: null,
      numCurrency: null,
      fixname: {
        MIOTA: `IOTA`
      },
      isConvertCurrency: true,
      justShow: false
    }),
    computed: {
      myPrice () {
        if (this.currencyDisplay !== 'USD') {
          return this.currency_price || `USD ${this.price_usd}`
        }
        return this.price_usd
      },
      isShow () {
        return this.detail_show || this.justShow
      },
      cmLink () {
        return `https://coinmarketcap.com/currencies/${this.name.toLowerCase()}`
      }
    },
    props: ['symbol', 'name', 'price_usd', 'price_btc', 'detail_show', 'useUSD', 'percent_change_24h', 'percent_change_1h', 'haveRemove', 'useRedUp', 'currencyDisplay', 'currency_price'],
    methods: {
      showMe () {
        if (!this.justShow) {
          this.justShow = true
          this.$emit('show')
        }
      },
      removeMyCrypto () {
        this.$emit('removeMyCrypto')
      },
      carretShow () {
        this.justShow = !this.justShow
        this.$emit('show')
      },
      changeConvertType () {
        this.isConvertCurrency = !this.isConvertCurrency
      },
      namefix (value) { return value in this.fixname ? this.fixname[value] : value }
    }
  }
</script>
<style lang="scss">
  li {
    div {
      margin: 0;
    }
  }
  i {
    font-size: 20px;
  }
  .el-col {
    height: 25px;
    line-height: 25px;
  }
  .el-row.first {
    border: 1px solid #e0eaf3ee;
    border-radius: 3px;
  }

  .showContainer{
    margin-top: 15px;
    margin-bottom: 17px;
    margin-left: 0px !important;
  }

  .showExtra{
    .title{
      font-size: 20px;
      .el-button--mini{
        float: right;
        padding: 0;
      }
    }
    .showTitle{
      width: 98%;
      border-bottom: 1px solid grey;
      a {
        > span{
          padding-left: 26px;
        }
        .cc {
          font-size: 40px;
          position: absolute;
          top: -10px;
          left: -10px;
        }
        text-decoration: none;
        &:link {
          color: #09c0e8;
        }
        /* visited link */
        &:visited {
          color: #6ab3bf;
        }

        /* mouse over link */
        &:hover {
          color: #a9dfea;
        }
      }
    }
    .el-row{
      margin: 0;
    }
  }
  .el-input--mini .el-input__inner {
    height: 20px;
    padding: 0 3px;
  }
  .green {
    color: #67C23A;
  }
  .red {
    color: #F56C6C;
  }
</style>
