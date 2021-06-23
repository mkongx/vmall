<template>
  <div class="tab-control">
    <slot>
      <div class="tab-control-item"
           v-for="(item,index) in titles"
           :class="{active:index===currentIndex}"
           v-bind:key="item"
           @click="itemClick(index)">
        <span>{{ item }}</span>
      </div>
    </slot>
  </div>
</template>

<script>
export default {
  name: "TabControl",
  props: {
    titles: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      currentIndex: 0,
    }
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index
      this.$emit('tabClick',index)
    }
  }
}
</script>

<style scoped>
.active {
  color: var(--color-high-text);
}

.active span {
  border-bottom: 3px solid var(--color-tint);
}

.tab-control {
  display: flex;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
}

.tab-control-item {
  flex: 1;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}
</style>
