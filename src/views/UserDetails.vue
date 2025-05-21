<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button  @click="router.push('/')" style="height:30px;width:100px">
                        <ion-icon :icon="caretBack"></ion-icon>
                        Wróc
                    </ion-button>
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
                    <ion-item class="header" @click="showExaminationSummary(examination.id)">
                        <div style="font-size:12px;padding-right:10px">Wizyta -  {{ formatDate(examination.date) }}</div>
                        <ion-button  slot="end" color="secondary" @click="manageExamination($event,examination.id)">
                            <ion-icon :icon="createOutline"></ion-icon>
                        </ion-button>
                        <ion-button slot="end" color="danger" @click="deleteExamination($event,examination.id)">
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
                            <div v-if="treatment.isChecked" style="border-bottom:1px solid rgba(0,0,0,0.3); width:100%; padding:6px;">
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
            <ion-modal ref="modal" :isOpen="deleteExaminationModalOpen">
                <ion-header>
                    <ion-toolbar>
                    <ion-buttons slot="start">
                        <ion-button @click="cancel()">Cancel</ion-button>
                    </ion-buttons>
                    <ion-buttons slot="end">
                        <ion-button :strong="true" @click="confirm()">Usuń</ion-button>
                    </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    Czy na pewno chcesz usunąć wizytę?
                </ion-content>
            </ion-modal>
            <ion-modal ref="modal" :isOpen="deleteUserModalOpen">
                <ion-header>
                    <ion-toolbar>
                    <ion-buttons slot="start">
                        <ion-button @click="cancelUser()">Cancel</ion-button>
                    </ion-buttons>
                    <ion-buttons slot="end">
                        <ion-button :strong="true" @click="confirmUser()">Usuń</ion-button>
                    </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    Czy na pewno chcesz usunąć użytkownika?
                </ion-content>
            </ion-modal>
        </ion-content>
    </ion-page>
</template>
  
  
<script setup lang="ts">
import { IonItem,IonPage, IonFab, IonFabList, IonFabButton,IonModal, IonIcon,IonSearchbar, IonContent, IonBackButton, IonButtons, IonButton, IonHeader, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonCard, IonToolbar, IonAvatar, IonGrid, IonRow, IonCol} from '@ionic/vue';
import { onMounted, ref, computed} from 'vue';
import { caretBack, musicalNote, swapHorizontalOutline } from 'ionicons/icons';
import { useGlobalStore } from '@/pinia';
import { useRoute, useRouter } from 'vue-router';
import { trashOutline, add, createOutline, document, colorPalette, globe, accessibilityOutline, barChartOutline } from 'ionicons/icons';
import { Examination } from '@/model';

const deleteExaminationModalOpen = ref(false);
const deleteUserModalOpen = ref(false);
const piniaStore = useGlobalStore();
const selectedUser = computed(() => piniaStore.users.find(user => user.id === route.params.id));
const sorting = ref<string>("");
const examinationsFilteredAndSorted = computed(() => {
    return selectedUser.value?.examinations?.filter(examination => {
        return (examination.diagnosis.toLowerCase().includes(searchText.value.toLowerCase()) ||
        examination.treatments.some(treatment => treatment.name.toLowerCase().includes(searchText.value.toLowerCase()) && treatment.isChecked) ||
        examination.muscleTests.some(muscleTest => muscleTest.name.toLowerCase().includes(searchText.value.toLowerCase()) && muscleTest.isChecked) ||
        examination.muscleTests.some(muscleTest => muscleTest.result.toLowerCase().includes(searchText.value.toLowerCase()) && muscleTest.isChecked) ||
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
const showExaminationSummary = (examinationId: string) => {
    router.push({ path: `/examinationSummary/${selectedUser.value?.id}/${examinationId}` });
};
onMounted(async () => {
})
const deleteUser = () => {
    deleteUserModalOpen.value = true;
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
const manageExamination = (event:any, examinationId : string) => {
    event.stopPropagation();
    router.push({ path: `/manageExamination/${selectedUser.value?.id}`, query: { examinationId: examinationId } });
};
const selectedExamnationId = ref<string>("");
const deleteExamination = (event:any, examinationId:string) => {
    event.stopPropagation();
    deleteExaminationModalOpen.value = true;
    selectedExamnationId.value = examinationId;
};
const confirm = () => {
    piniaStore.deleteExamination(selectedExamnationId.value, selectedUser.value?.id!);
    deleteExaminationModalOpen.value = false;
    selectedExamnationId.value = "";
};
const cancel = () => {
    deleteExaminationModalOpen.value = false;
    selectedExamnationId.value = "";
};
const confirmUser = () => {
    piniaStore.removeUser(selectedUser.value?.id!);
    deleteUserModalOpen.value = false;
    router.push({ path: '/' });
};
const cancelUser = () => {
    deleteUserModalOpen.value = false;
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

}
.header-1{

}
</style>
  