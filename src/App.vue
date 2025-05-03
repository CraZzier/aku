<template>
  <ion-app>
      <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, IonPage } from '@ionic/vue';
import { inject, onMounted } from 'vue';
import { useGlobalStore } from '@/pinia';

onMounted(async () => {
  const piniaStore = useGlobalStore();
  if (!piniaStore) {
    console.error('Pinia store not found');
    return;
  }
  await piniaStore.getUsers();
});
</script>
