<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button text="Cofnij" :icon="caretBack"></ion-back-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-card>
                <img :src="'https://picsum.photos/80/80?random=' + 1" alt="avatar" height="80" width="100%" />
                <ion-item>
                    <ion-card-header>
                        <ion-card-title >{{selectedUser?.name}} {{ selectedUser?.surname }}</ion-card-title>
                        <ion-card-subtitle>{{ selectedUser?.email }} {{ selectedUser?.phone }}</ion-card-subtitle>
                        <ion-card-subtitle>{{ selectedUser?.age }} lat</ion-card-subtitle>
                    </ion-card-header>
                </ion-item>
                <ion-item>
                    <ion-toolbar>
                        <ion-buttons slot="end">
                            <ion-searchbar v-model="searchText" placeholder=""></ion-searchbar>
                            <ion-button  color="info">
                                <ion-icon :icon="swapHorizontalOutline"></ion-icon>
                            </ion-button>
                            <ion-button  color="danger">
                                <ion-icon :icon="trashOutline"></ion-icon>
                            </ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-item>
                <ion-card-content>
                Here's a small text description for the card content. Nothing more, nothing less.
                </ion-card-content>
            </ion-card>
            <ion-fab horizontal="end" vertical="bottom" slot="fixed">
                <ion-fab-button @click="navigateToAddExamination">
                <ion-icon :icon="add"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>
  
  
<script setup lang="ts">
import { IonItem,IonPage, IonFab, IonFabButton, IonIcon,IonSearchbar, IonContent, IonBackButton, IonButtons, IonButton, IonHeader, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonCard, IonToolbar, IonAvatar, IonGrid, IonRow, IonCol} from '@ionic/vue';
import { onMounted, ref} from 'vue';
import { caretBack, swapHorizontalOutline } from 'ionicons/icons';
import { useGlobalStore } from '@/pinia';
import { useRoute, useRouter } from 'vue-router';
import { trashOutline, add} from 'ionicons/icons';

const piniaStore = useGlobalStore();
const route = useRoute();
const router = useRouter();
const selectedUser = ref();
const searchText = ref("");

onMounted(() => {
    selectedUser.value = piniaStore.users.find(user => user.id === route.params.id);
});

const navigateToAddExamination = () => {
    router.push({ path: `/addExamination/${selectedUser.value.id}` });
};
function generateId(length = 15) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charsLength = chars.length;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return result;
}
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
ion-button {
    --background: #b7f399;
    --background-activated: #87d361;
    --background-hover: #a3e681;
    --border-radius: 15px;
    --box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    --color: black;
}
</style>
  