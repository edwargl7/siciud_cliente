<template>
  <DxTagBox
    :data-source="dataSource"
    :value="currentValue"
    :show-selection-controls="true"
    :max-displayed-tags="3"
    :show-multi-tag-only="false"
    :on-value-changed="(e) => onValueChanged(e.value)"
    :on-selection-changed="onSelectionChanged"
    :search-enabled="true"
    value-expr="id"
    display-expr="name"
    apply-value-mode="instantly"
  />
</template>
<script>
import DxTagBox from "devextreme-vue/tag-box";

export default {
  components: { DxTagBox },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    onValueChanged: {
      type: Function,
      default: () => function () {},
    },
    dataSource: {
      type: Object,
      default: () => {},
    },
    dataGridComponent: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentValue: this.value,
    };
  },
  methods: {
    onSelectionChanged() {
      this.dataGridComponent.updateDimensions();
    },
  },
};
</script>
