<template>

  <el-row :gutter="10" >
    <div v-show="alertCrypto">
      <el-row>
        <el-col :xs="24">
          Setting {{alertCrypto.name }}({{alertCrypto.symbol}}) <font-awesome-icon icon="bell"/>
        </el-col>
      </el-row>

      <el-row >
        <ul :xs="24">
          <CryptoCard
            :key="alertCrypto.id"
            :useUSD="useUSD"
            :symbol="alertCrypto.symbol"
            :name="alertCrypto.name"
            :price_btc="alertCrypto.price_btc"
            :price_usd="alertCrypto.price_usd"
            :percent_change_1h="alertCrypto.percent_change_1h"
            :percent_change_24h="alertCrypto.percent_change_24h"
            :just_show="true"
          />
        </ul>
      </el-row>

      <el-row>
        <el-input placeholder="Alert amount" v-model="alertAmount" class="input-with-select">
          <el-select v-model="selectCondition" slot="prepend" placeholder="+/-">
            <el-option label="Above" value=">"></el-option>
            <el-option label="Below" value="<"></el-option>
          </el-select>
        </el-input>
      </el-row>
      <el-row>
        <el-button @click="addAlert">Set <font-awesome-icon icon="bell"/></el-button>
      </el-row>
    </div>
    <el-row>
      <ul class="alarmList">
        <li v-for="(alarm,index) in displayAlarmList()">
          <el-row>
            <el-col :xs="20">
              {{alarm.name}} {{alarm.condition}} {{alarm.alertAmount}}
            </el-col>
            <el-col :xs="4" style="text-align: right;">
              <el-button type="text" size="mini" @click="removeAlert('PA_'+alarm.name+'_'+alarm.condition+'_'+alarm.alertAmount)"> <font-awesome-icon icon="trash" /> </el-button>
            </el-col>
          </el-row>
        </li>
      </ul>
    </el-row>
  </el-row>
</template>
<script>
  import _forEach from 'lodash/forEach'
  import _isEmpty from 'lodash/isEmpty'
  import Vue from 'vue'
  import API from '../api'
  import store from '../ext/storage'
  import CryptoCard from './cryptoCard.vue'

  const ALERT_DB_NAME = 'alerts'
  export default {
    data: () => ({
      alertAmount: 0,
      selectCondition: '>',
      alarmList: []
    }),
    created () {
      let that = this
      store.get(ALERT_DB_NAME)
        .then((alarmList) => {
          if (!_isEmpty(alarmList[ALERT_DB_NAME])) {
            that.alarmList = alarmList[ALERT_DB_NAME]
          }
        })
      this.alertAmount = this.alertCrypto.price_usd
    },
    props: ['alertCrypto', 'useUSD'],
    methods: {
      addAlert () {
        const condition = this.selectCondition === '>' ? 'above' : 'below'
        const key = `PA_${this.alertCrypto.symbol}_${this.selectCondition}_${this.alertAmount}`
        const msg = `${this.alertCrypto.symbol} has been hit ${condition} ${this.alertAmount} \nPrice at alarm set: ${this.alertCrypto.price_usd}`
        this.setAlarm(key, msg)
      },
      removeAlert (key) {
        if (key in this.alarmList && this.alarmList[key]) {
          Vue.delete(this.alarmList, key)
          API.Notify.remove(key)
          store.set(ALERT_DB_NAME, this.alarmList)
        }
      },
      setAlarm (key, msg) {
        const options = {
          type: 'basic',
          iconUrl: '/icons/48.png',
          title: 'Bitome Price Alert',
          message: msg,
          buttons: [{
            title: 'Remove this alert'
          }]
        }
        this.alarmList = {
          ...this.alarmList,
          [key]: options
        }
        store.set(ALERT_DB_NAME, this.alarmList)
        API.Notify.set(key, options)
      },
      displayAlarmList () {
        let x = []
        _forEach(this.alarmList, (alarm, key) => {
          const [, name, condition, alertAmount] = key.split('_')
          x.push({name, condition, alertAmount})
        })
        return x
      }
    },
    components: {
      CryptoCard
    }
  }
</script>
<style lang="scss" scoped>
  ul {
    list-style: none;
    padding-left: 0px;
  }


</style>
<style lang="scss">
#pane-1{
  .el-row {
    margin-left: 5px;
    margin-right: 5px;
  }
  .el-input-group{
    width: auto;
  }
  .el-input-group__prepend{
    width: auto !important;
    min-width: 60px;
  }
  .alarmList{
    border: 1px solid #e0eaf3ee;
    border-radius: 3px;
  }
}

</style>
