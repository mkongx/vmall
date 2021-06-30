<template>
  <div v-if="Object.keys(paramInfo).length !== 0" class="params-wrap">

<!--    <div v-for="(item, index) in paramInfo.rule" :key="index">-->
<!--      <div v-for="(list, indey) in item" class="flex" :key="indey">-->
<!--        <div v-for="(listitem, indez) in list" :key="indez" class="rule-list-item">-->
<!--          {{listitem}}-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div v-for="(info, index) in paramInfo.info" :key="index" class="flex info-list-wrap">-->
<!--      <div class="info-list-tit">{{info.key}}</div>-->
<!--      <div>{{info.value}}</div>-->
<!--    </div>-->
    <table v-for="(table, index) in paramInfo.sizes"
           class="info-size" :key="index">
      <tr v-for="(tr, indey) in table" :key="indey">
        <td v-for="(td, indez) in tr" :key="indez">{{td}}</td>
      </tr>
    </table>
    <table class="info-param">
      <tr v-for="(info, index) in paramInfo.infos" :key="index">
        <td class="info-param-key">{{info.key}}</td>
        <td class="param-value">{{info.value}}</td>
      </tr>
    </table>

    <div class="info-img" v-if="paramInfo.image.length !== 0">
      <img :src="paramInfo.image" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name:'DetailParamInfo',
  props: {
    paramInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>

<style lang="less" scoped>
.params-wrap {
  border-top: 4px solid #ececec;
  border-bottom: 4px solid #ececec;
}
.rule-list-item {
  font-size: 12px;
  width: 20%;
  border-bottom: 1px solid #ececec;
  padding: 10px 4px;
}
.info-list-wrap {
  font-size: 14px;;
  border-bottom: 1px solid #ececec;
  padding: 10px 4px;
  line-height: 20px;
  .info-list-tit {
    width: 18%;
  }
}
.param-info {
  padding: 20px 15px;
  font-size: 14px;
  border-bottom: 5px solid #f2f5f8;
}
.param-info table {
  width: 100%;
  /* border-collapse: collapse; */
}
.param-info table tr {
  height: 42px;
}
.param-info table tr td {
  border-bottom: 1px solid rgba(100,100,100,.1);
}
.info-param-key {
  /*当value的数据量比较大的时候, 会挤到key,所以给一个固定的宽度*/
  width: 80px;
}
.param-value {
  color: #eb4868
}
.info-img img {
  width: 100%;
}
</style>
