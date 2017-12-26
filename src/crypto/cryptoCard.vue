<template>
  <li @click="showMe">
    <el-row :gutter="10" class='first'>
      <el-col :xs="10">
        <i class="cc" :class="namefix(symbol)" :title="symbol" :data-name="name"></i>
        <span>{{symbol}}</span>
      </el-col>
      <el-col :xs="14">
        <span v-if="useUSD"> ${{price_usd}}</span>
        <span v-else> {{price_btc}} BTC</span>
      </el-col>
    </el-row>
    <el-row :gutter="10" v-show="isShow">
        <el-card class="box-card" >
        <div slot="header" class="clearfix">
          <span>Card name</span>
        </div>
        <div class="text item">
          me
        </div>
      </el-card>
    </el-row>
  </li>
</template>
<script>
  export default {
    data: () => ({
      fixname: {
        MIOTA: `IOTA`
      },
      justShow: false
    }),
    computed: {
      isShow () {
        return this.detail_show || this.justShow
      }
    },
    props: ['symbol', 'name', 'price_usd', 'price_btc', 'detail_show', 'useUSD'],
    methods: {
      showMe () {
        this.justShow = !this.justShow
        this.$emit('show')
      },
      namefix (value) { return value in this.fixname ? this.fixname[value] : value }
    }
  }
</script>
<style lang="scss" scoped>
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
  .el-row.first{
    border: 1px solid #e0eaf3ee;
    border-radius: 3px;
  }
</style>
