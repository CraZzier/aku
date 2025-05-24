<template>
  <ion-page>
    <ion-header>
        <ion-label>
            <div style="padding:20px;">
                <div style="font-size: 20px">Lista pacjentów</div>
            </div>
        </ion-label>
    </ion-header>
    <ion-content fixed-slot-placement="before">
      <ion-fab slot="fixed" vertical="top" horizontal="end" :edge="true">
          <ion-fab-button size="small" color="dark">
              <ion-icon :icon="barChartOutline"></ion-icon>
          </ion-fab-button>
          <ion-fab-list side="bottom">
              <ion-fab-button  @click="changeSortTo('alphabetToggle')">
                  <ion-icon :icon="atOutline"></ion-icon>
              </ion-fab-button>
              <ion-fab-button color="secondary" @click="changeSortTo('lastVisitToggle')">
                  <ion-icon :icon="calendarNumberOutline"></ion-icon>
              </ion-fab-button>
              <ion-fab-button color="primary" @click="changeSortTo('createdToggle')">
                  <ion-icon :icon="footstepsOutline"></ion-icon>
              </ion-fab-button>
          </ion-fab-list>
      </ion-fab>
      <ion-searchbar v-model="searchText" style="margin-top:20px"></ion-searchbar>
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
  IonFabList,
  IonIcon,
  IonPage,
  IonItem,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonLabel,
  IonList,
} from "@ionic/vue";
import { ref, onMounted, computed } from "vue";
import { User } from "@/model"
import { add,accessibilityOutline,swapHorizontalOutline, barChartOutline, atOutline, calendarNumberOutline, footstepsOutline  } from "ionicons/icons";
import { useRouter } from "vue-router";
import { useGlobalStore } from "@/pinia";

const searchText = ref("");
const router = useRouter();
const piniaStore = useGlobalStore();
const sorting = ref<string>("");
const navigateToAddUser = () => {
  router.push("/manageUser");
};
const navigateToUserDetails = (id: string) => {
  if (!id) {
    console.error("User ID is undefined");
    return;
  }
  router.push({ path: `/userDetails/${id}` });
};  

const changeSortTo = (sortOpt: string) =>{
  if (sortOpt === "alphabetToggle") {
    if (sorting.value === "alphabetAsc") {
      sorting.value = "alphabetDesc";
    }else{
      sorting.value = "alphabetAsc";
    }
  }

  if (sortOpt === "lastVisitToggle") {
    if (sorting.value === "lastVisitAsc") {
      sorting.value = "lastVisitDesc";
    }else{
      sorting.value = "lastVisitAsc";
    }
  }
  if (sortOpt === "createdToggle") {
    if (sorting.value === "createdAsc") {
      sorting.value = "createdDesc";
    }else{
      sorting.value = "createdAsc";
    }
  }
  if (sorting.value === sortOpt) {
    sorting.value = "";
    return;
  }
}
const filteredUsers = computed(() => {
  console.log(piniaStore.fetchUsers)
  return piniaStore.fetchUsers?.filter((user) => {
    console.log(user);
    return (
      user?.name?.toLowerCase().includes(searchText.value.toLowerCase()) ||
      user?.surname?.toLowerCase().includes(searchText.value.toLowerCase()) ||
      user?.examinations?.some(examination => 
        examination.diagnosis.toLowerCase().includes(searchText.value.toLowerCase()) ||
        examination.treatments.some(treatment => treatment.name.toLowerCase().includes(searchText.value.toLowerCase()) && treatment.isChecked) ||
        examination.muscleTests.some(muscleTest => muscleTest.name.toLowerCase().includes(searchText.value.toLowerCase()) && muscleTest.isChecked) ||
        examination.muscleTests.some(muscleTest => muscleTest.result.toLowerCase().includes(searchText.value.toLowerCase()) && muscleTest.isChecked) ||
        examination.treatments.some(treatment => treatment.description.toLowerCase().includes(searchText.value.toLowerCase()) && treatment.isChecked) || 
        examination.symptoms.some(symptom => symptom.name.toLowerCase().includes(searchText.value.toLowerCase()) && symptom.isChecked) || 
        examination.notes.toLowerCase().includes(searchText.value.toLowerCase()) ||
        examination.date.toLowerCase().includes(searchText.value.toLowerCase())
      )
    );
  }).sort((a, b) => {
    const lastVisitA = new Date(a.examinations?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date || "").getTime();
    const lastVisitB = new Date(b.examinations?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date || "").getTime();
    if (sorting.value === "alphabetAsc") {
      return a.name?.localeCompare(b.name || "") || 0;
    } else if (sorting.value === "alphabetDesc") {
      return b.name?.localeCompare(a.name || "") || 0;
    } else if (sorting.value === "lastVisitAsc") {
      return lastVisitA - lastVisitB;
    } else if (sorting.value === "lastVisitDesc") {
      return lastVisitB - lastVisitA;
    } else if (sorting.value === "createdAsc") {
      return new Date(a.created || "").getTime() - new Date(b.created || "").getTime();
    } else if (sorting.value === "createdDesc") {
      return new Date(b.created || "").getTime() - new Date(a.created || "").getTime();
    }
    return 0;
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
