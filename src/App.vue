<template>
  <ion-app v-if="ready">
      <ion-router-outlet :key="$route.fullPath"/>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, IonPage } from '@ionic/vue';
import { inject, onBeforeMount, onMounted, ref } from 'vue';
import { useGlobalStore } from '@/pinia';
import { Storage } from '@ionic/storage';

const storage:Storage|undefined = inject('storage');
const ready = ref(false);
onBeforeMount(async () => {
  console.log('App mounted');
  if (!storage) {
    console.error('Storage not found');
    return;
  }
  await storage.create();
  const piniaStore = useGlobalStore();
  if (!piniaStore) {
    console.error('Pinia store not found');
    return;
  }
  await piniaStore.getUsers();
  console.log('Users loaded:', piniaStore.users);
  ready.value = true;
});
</script>
