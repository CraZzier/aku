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
            <ion-list>
                <ion-item >
                    <ion-input
                    label="Imię"
                    label-placement="stacked"
                    v-model="userData.name"
                    type="text"
                    placeholder="Imię"
                    ></ion-input>
                </ion-item>
                <ion-item >
                    <ion-input
                    label="Nazwisko"
                    label-placement="stacked"
                    v-model="userData.surname"
                    type="text"
                    placeholder="Nazwisko"
                    ></ion-input>
                </ion-item>
                <ion-item >
                    <ion-input
                    label="Wiek"
                    label-placement="stacked"
                    v-model="userData.age"
                    type="number"
                    placeholder="Wiek"
                    ></ion-input>
                </ion-item>
                <ion-item>
                    <ion-input
                    label="Email"
                    label-placement="stacked"
                    v-model="userData.email"
                    type="email"
                    placeholder="Email"
                    ></ion-input>
                </ion-item>
                <ion-item>
                    <ion-input
                    label="Telefon"
                    label-placement="stacked"
                    v-model="userData.phone"
                    type="tel"
                    placeholder="Telefon"
                    ></ion-input>
                </ion-item>
            </ion-list>
            <ion-button expand="full" @click="saveUser">Zapisz</ion-button>
        </ion-content>
    </ion-page>
</template>
  
  
<script setup lang="ts">
import { IonInput,IonPage, IonContent, IonItem, IonList, IonButton, IonBackButton, IonButtons, IonHeader, IonToolbar} from '@ionic/vue';
import { reactive, onMounted } from 'vue';
import { caretBack } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { useGlobalStore } from '@/pinia';

const piniaStore = useGlobalStore();
const router = useRouter();
const route = useRoute();
const userData = reactive({
    name: '',
    surname: '',
    age: 0,
    email: '',
    phone: ''
});

const saveUser = async () => {
    const id = route.query.id;
    if (id) {
        const user = piniaStore.users.find(user => user.id === id);
        if (user) {
            user.name = userData.name;
            user.surname = userData.surname;
            user.age = userData.age;
            user.email = userData.email;
            user.phone = userData.phone;
        }
    } else {
        const user = {
            id: generateId(),
            name: userData.name,
            surname: userData.surname,
            age: userData.age,
            email: userData.email,
            phone: userData.phone
        };
        piniaStore.addUser(user);
    }
    router.push({ path: '/' });
};

onMounted(() => {
    const id = route.query.id;
    if (id) {
        const user = piniaStore.users.find(user => user.id === id);
        if (user) {
            userData.name = user.name || '';
            userData.surname = user.surname || '';
            userData.age = user.age || 0;
            userData.email = user.email || '';
            userData.phone = user.phone || '';
        }
    }
});
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
ion-button {
    --background: #b7f399;
    --background-activated: #87d361;
    --background-hover: #a3e681;
    --border-radius: 15px;
    --box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    --color: black;
}
</style>
  