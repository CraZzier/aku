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
            <ion-fab slot="fixed" vertical="top" horizontal="end" :edge="true">
                <ion-fab-button size="small" color="dark">
                    <ion-icon :icon="barChartOutline"></ion-icon>
                </ion-fab-button>
                <ion-fab-list side="bottom">
                    <ion-fab-button  @click="changeSortTo('asc')">
                        <ion-icon :icon="swapHorizontalOutline"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button color="secondary" @click="changeSortTo('desc')">
                        <ion-icon :icon="swapHorizontalOutline"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button color="primary" @click="changeSortTo('diagnosis')">
                        <ion-icon :icon="accessibilityOutline"></ion-icon>
                    </ion-fab-button>
                    <ion-fab-button color="danger" @click="deleteUser">
                        <ion-icon :icon="trashOutline"></ion-icon>
                    </ion-fab-button>
                </ion-fab-list>
            </ion-fab>
            <ion-card>
                <img :src="'https://picsum.photos/80/80?random=' + 1" alt="avatar" height="80" width="100%" />
                <ion-item atyle="overflow:auto">
                    <ion-card-header>
                        <ion-card-title >{{selectedUser?.name}} {{ selectedUser?.surname }}</ion-card-title>
                        <ion-card-subtitle>{{ selectedUser?.email }} {{ selectedUser?.phone }}</ion-card-subtitle>
                        <ion-card-subtitle>{{ selectedUser?.age }} lat</ion-card-subtitle>
                    </ion-card-header>
                </ion-item>
                <ion-item>
                    <ion-toolbar>
                        <ion-buttons >
                            <ion-searchbar v-model="searchText" placeholder=""></ion-searchbar>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-item>
                <div v-for="(examination, id) in examinationsFilteredAndSorted" :key="generateId()">
                    <ion-item class="header">
                        <div style="font-size:12px;padding-right:10px">Wizyta -  {{ formatDate(examination.date) }}</div>
                        <ion-button  slot="end" color="info" @click="manageExamination(examination.id)">
                            <ion-icon :icon="createOutline"></ion-icon>
                        </ion-button>
                        <ion-button slot="end" color="danger" @click="deleteExamination(examination.id)">
                            <ion-icon :icon="trashOutline"></ion-icon>
                        </ion-button>
                    </ion-item>
                    <ion-item class="header-1">
                            <div>Diagnoza</div>
                    </ion-item>
                    <ion-item>
                            <div style="font-size:14px;margin-left:6px">{{examination.diagnosis || 'Brak danych'}}</div>
                    </ion-item>
                    <ion-item class="header-1">
                            <div>Leczenie</div>
                    </ion-item>
                    <div style="padding-left: 12px; padding-bottom: 12px">
                        <div v-for="treatment in examination.treatments" style="margin-top: 5px; margin-left:4px">
                            <div v-if="treatment.isChecked" style="border-bottom:1px solid rgba(0,0,0,0.3); width:100%; padding:6px;color:black">
                                {{treatment.name}}
                            </div>
                            <div v-if="treatment.description" style="margin-left: 12px;margin-top:12px; width:100%;padding:6px">
                                {{treatment.description}}
                            </div>
                        </div>
                    </div>

                </div>
            </ion-card>
            <ion-fab horizontal="end" vertical="bottom" slot="fixed">
                <ion-fab-button @click="navigateToManageExamination">
                <ion-icon :icon="add"></ion-icon>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>
  
  
<script setup lang="ts">
import { IonItem,IonPage, IonFab, IonFabList, IonFabButton, IonIcon,IonSearchbar, IonContent, IonBackButton, IonButtons, IonButton, IonHeader, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonCard, IonToolbar, IonAvatar, IonGrid, IonRow, IonCol} from '@ionic/vue';
import { onMounted, ref, computed} from 'vue';
import { caretBack, swapHorizontalOutline } from 'ionicons/icons';
import { useGlobalStore } from '@/pinia';
import { useRoute, useRouter } from 'vue-router';
import { trashOutline, add, createOutline, document, colorPalette, globe, accessibilityOutline, barChartOutline } from 'ionicons/icons';
import { Examination } from '@/model';

const piniaStore = useGlobalStore();
const selectedUser = computed(() => piniaStore.users.find(user => user.id === route.params.id));
const sorting = ref<string>("");
const examinationsFilteredAndSorted = computed(() => {
    return selectedUser.value?.examinations?.filter(examination => {
        return (examination.diagnosis.toLowerCase().includes(searchText.value.toLowerCase()) ||
        examination.treatments.some(treatment => treatment.name.toLowerCase().includes(searchText.value.toLowerCase()) && treatment.isChecked) ||
        examination.treatments.some(treatment => treatment.description.toLowerCase().includes(searchText.value.toLowerCase()) && treatment.isChecked) || 
        examination.symptoms.some(symptom => symptom.name.toLowerCase().includes(searchText.value.toLowerCase()) && symptom.isChecked) || 
        examination.notes.toLowerCase().includes(searchText.value.toLowerCase()) ||
        examination.date.toLowerCase().includes(searchText.value.toLowerCase()));
    }).sort((a, b) => {
        if (sorting.value === "") {
            return 0;
        }
        if (sorting.value === "asc") {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sorting.value === "desc") {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sorting.value === "diagnosis") {
            return a.diagnosis.localeCompare(b.diagnosis);
        }
        return 0;
    });
});
const changeSortTo = (sort: string) => {
    if (sorting.value === sort) {
        sorting.value = "";
        return;
    }
    sorting.value = sort;
};
const route = useRoute();
const router = useRouter();
const searchText = ref("");
const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(date).toLocaleDateString('pl-PL', options);
};

onMounted(async () => {
})
const deleteUser = () => {
    piniaStore.removeUser(selectedUser.value?.id!);
    router.push({ path: '/' });
};
const navigateToManageExamination = () => {
    router.push({ path: `/manageExamination/${selectedUser.value?.id}` });
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
const manageExamination = (examinationId : string) => {
    router.push({ path: `/manageExamination/${selectedUser.value?.id}`, query: { examinationId: examinationId } });
};
const deleteExamination = (examinationId:string) => {
    piniaStore.deleteExamination(examinationId, selectedUser.value?.id!);
};
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
.header{
    --background: rgba(0,0,0,0.15);
    --color: black;
}
.header-1{
    --background: rgba(0,0,0,0.05) ;
    --color: black;
}
</style>
  