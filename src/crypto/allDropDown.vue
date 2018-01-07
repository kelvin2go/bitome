<template>
  <el-row class="autocomplete">
      <div class="sub-title" v-show="title">{{title}}</div>
      <el-autocomplete
        v-model="pickedCrypto"
        :fetch-suggestions="querySearch"
        placeholder="Crypto Symobol"
        @select="handleSelect"
        clearable
      ><i slot="prefix" class="el-input__icon el-icon-search"></i></el-autocomplete>
  </el-row>
</template>
<script>
  export default {
    data: () => ({
      pickedCrypto: ''
    }),
    computed: {
    },
    mounted () {
    },
    props: ['cryptos', 'title'],
    methods: {
      querySearch (queryString, cb) {
        let cryptoList = this.cryptos
        let results = queryString ? cryptoList.filter(this.createFilter(queryString)) : cryptoList
        // call callback function to return suggestions
        cb(results)
      },
      createFilter (queryString) {
        return (crypto) => {
          return (crypto.symbol.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelect (pickedCrypto) {
        this.$emit('selectedCrypto', pickedCrypto)
      }
    }
  }
</script>
<style lang="scss">

</style>
