import { defineStore } from "pinia";

export const useProgressStore = defineStore("progress", {
  state: () => ({
    percentage: 0,
    lastUpdate: "-"
  }),
  actions: {
    setProgress(val, date) {
      this.percentage = val;
      this.lastUpdate = date;
    }
  }
});
