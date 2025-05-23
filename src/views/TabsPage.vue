<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <div v-if="synchroniseDialog" style="position:absolute;bottom:0px;left:0px;background-color:rgba(0,0,0, 0.8);width:100%;padding:10px">
        <ion-textarea placeholder="Hasło" v-model="password" type="text"></ion-textarea>
        <ion-button @click="synchronise">Potwierdź</ion-button>
      </div>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="homeOutline" />
          <ion-label>Home</ion-label>
        </ion-tab-button>
        <ion-tab-button @click="syncUp">
          <ion-icon aria-hidden="true" :icon="arrowUpOutline" />
          <ion-label>Sync Up</ion-label>
        </ion-tab-button>
        <ion-tab-button @click="syncDown" >
          <ion-icon aria-hidden="true" :icon="arrowDownOutline" />
          <ion-label>Sync Down</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, toastController, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, IonButton, IonTextarea } from '@ionic/vue';
import { ellipse, square, triangle, homeOutline, arrowUpOutline, arrowDownOutline } from 'ionicons/icons';
import { useGlobalStore } from '@/pinia';

const piniaStore = useGlobalStore();
import { ref } from 'vue';

const password = ref('');
const synchroniseDialog = ref(false);
let lastClicked = "none"
const syncDown = () =>{
  if (lastClicked == "syncDown") {
    synchroniseDialog.value = false
    lastClicked = "none"
    return
  }
  lastClicked = "syncDown"
  synchroniseDialog.value = true
  console.log("sync down")
}
const syncUp = () =>{
  if (lastClicked == "syncUp") {
    synchroniseDialog.value = false
    lastClicked = "none"
    return
  }
  lastClicked = "syncUp"
  synchroniseDialog.value = true
  console.log("sync up")
}

const synchronise = async() =>{
  const upOrDown = lastClicked == "syncUp" ? "up" : "down"
  if (upOrDown == "up") {
      try{
        const res = await fetch('https://akupunkturaigla.pl/api/sync/up?param='+password.value, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            base: piniaStore.users,
          })
        });
        if (!res.ok) {
          presentToast("Wystąpił błąd podczas synchronizacji")
        } else {
          presentToast("Synchronizacja zakończona")
        }
      }catch (error) {
        presentToast("Wystąpił błąd podczas synchronizacji")
        console.error('Error:', error);
      }
  }else{
      try{
        const res = await fetch('https://akupunkturaigla.pl/api/sync/down?param='+password.value, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        console.log(JSON.parse(data.base).base)
        piniaStore.setUsers(JSON.parse(data.base).base)
        if (res.ok) {
          presentToast("Synchronizacja zakończona")
        } else {
          presentToast("Wystąpił błąd podczas synchronizacji")
        }
      }catch (error) {
        presentToast("Wystąpił błąd podczas synchronizacji")
        console.error('Error:', error);
      }
  }
  synchroniseDialog.value = false
}
const presentToast = async(message:string) =>{
    const toast = await toastController.create({
      message: message,
      duration: 1500,
      position: "bottom",
    });
    await toast.present();
}
</script>
