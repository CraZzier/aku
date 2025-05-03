<template>
  <ion-page>
    <ion-content fixed-slot-placement="before">
      <ion-searchbar v-model="searchText"></ion-searchbar>
      <ion-fab horizontal="end" vertical="bottom" slot="fixed">
        <ion-fab-button @click="navigateToAddUser">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <ion-list>
        <ion-item v-for="(item, index) in filteredUsers" button @click="navigateToUserDetails(item.id)" :key="index">
          <ion-avatar slot="start">
            <img
              :src="'https://picsum.photos/80/80?random=' + index"
              alt="avatar"
            />
          </ion-avatar>
          <ion-label>{{ item.name }} {{ item.surname }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonSearchbar } from "@ionic/vue";
import {
  IonAvatar,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonPage,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/vue";
import { ref, onMounted, computed } from "vue";
import { User } from "@/model"
import { add } from "ionicons/icons";
import { useRouter } from "vue-router";
import { useGlobalStore } from "@/pinia";

const searchText = ref("");
const router = useRouter();
const piniaStore = useGlobalStore();

const navigateToAddUser = () => {
  router.push("/addUser");
};
const navigateToUserDetails = (id: string) => {
  if (!id) {
    console.error("User ID is undefined");
    return;
  }
  router.push({ path: `/userDetails/${id}` });
};  

const filteredUsers = computed(() => {
  return piniaStore.users.filter((user) => {
    console.log(user);
    return (
      user?.name?.toLowerCase().includes(searchText.value.toLowerCase()) ||
      user?.surname?.toLowerCase().includes(searchText.value.toLowerCase())
    );
  });
});

onMounted(() => {
});
</script>

<style>
ion-fab-button {
  --background: #b7f399;
  --background-activated: #87d361;
  --background-hover: #a3e681;
  --border-radius: 15px;
  --box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.3),
    0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  --color: black;
}
</style>
