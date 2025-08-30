<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button ref="back-button" text="Cofnij" :icon="caretBack"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <div>
            {{  }}
        </div>
      <ion-list style="border-bottom: solid 1px rgba(0, 0, 0, 0.2)">
        <div class="summary-title">Objawy</div>
        <div v-for="obj in symptoms" style="padding-left: 10px">
            <span v-if="obj.isChecked" style="font-size:14px;margin-left:6px">{{obj.name}}</span>
        </div>
       <div class="summary-title">Test mięśniowy</div>
        <div v-for="obj in muscleTestObjects" style="padding-left: 10px">
            <span v-if="obj.isChecked" style="font-size:14px;margin-left:6px">{{obj.name}}</span>
            <span v-if="obj.isChecked" style="font-size:14px;margin-left:6px">{{obj.result}}</span>
        </div>
        <div class="summary-title">Diagnoza</div>
        <div  style="padding-left: 10px">
            <span  style="font-size:14px;margin-left:6px">{{diagnosis}}</span>
        </div>
        <div class="summary-title">Leczenie</div>
        <div v-for="obj in treatments" style="padding-left: 10px">
            <span v-if="obj.isChecked" style="font-size:14px;margin-left:6px">{{obj.name}}</span>
            <span v-if="obj.isChecked" style="font-size:14px;margin-left:6px">{{obj.description}}</span>
        </div>
        <div class="summary-title">Informacja dodatkowe</div>
        <div style="padding-left: 10px">
            <span style="font-size:14px;margin-left:6px">{{notes}}</span>
        </div>
        <div>
            <img v-if="selectedImage" :src="selectedImageContent" style="width: 100%; height: auto; margin-top: 10px" />
        </div>
        <canvas ref="canvas" style="border: 1px solid black; margin-top: 10px"></canvas>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonAccordion,
  IonAccordionGroup,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonLabel,
  IonCheckbox,
  IonTextarea,
  IonInput,
  IonPage,
  IonContent,
  IonItem,
  IonList,
  IonButton,
  IonBackButton,
  IonButtons,
  IonHeader,
  IonToolbar,
} from "@ionic/vue";
import { reactive, onMounted, ref, toRaw } from "vue";
import { caretBack, add, pulse } from "ionicons/icons";
import { useGlobalStore } from "@/pinia";
import { Examination, MuscleTest, Symptom, Treatment } from "@/model";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useRoute } from "vue-router";
import router from "@/router";
const diagnosis = ref<string>(""); 
const notes = ref<string>("");
const imgSaved = ref();
const route = useRoute();
const selectedImageContent = ref<string | undefined>(undefined);
const selectedImage = ref<string | undefined>(undefined);
const canvas = ref<HTMLCanvasElement | null>();
let symptoms = reactive<Symptom[]>([]);
let muscleTestObjects = reactive<MuscleTest[]>([]);
let treatments = reactive<Treatment[]>([]);
let isDrawing = false;

const piniaStore = useGlobalStore();
const ctx = ref<CanvasRenderingContext2D | null>(null);

const image = new Image();
image.src = "/puls.jpg";
onMounted(async() => {
  console.log(route.params.examinationId, route.params.userId);
  console.log(piniaStore.users);
  if (route.params.examinationId && route.params.userId){
    const user = piniaStore.users.find(
      (user) => user.id === route.params.userId
    );
    console.log(user, piniaStore.users);
    if (user) {
      console.log(user);
      const examination = user.examinations?.find(
        (examination) => examination.id === route.params.examinationId
      );
      if (examination) {
        console.log(examination);
        diagnosis.value = examination.diagnosis;
        symptoms = examination.symptoms;
        muscleTestObjects = examination.muscleTests;
        imgSaved.value = examination.pulseImage;
        image.src = await getImageByKey(imgSaved.value) || "/puls.jpg";
        treatments=examination.treatments;
        notes.value = examination.notes;
        selectedImage.value = examination.notesImage;
      }
    }
  }
  if (!canvas.value) {
    console.error("Canvas element is not available");
    return;
  }
  ctx.value = canvas.value.getContext("2d")!;
  image.onload = () => {
    canvas.value!.width = image.width;
    canvas.value!.height = image.height;
    ctx.value!.drawImage(image, 0, 0);
  };
  if (selectedImage.value) {
    selectedImageContent.value = await getImageByKey(selectedImage.value) || undefined;
  }
});

const getImageByKey = async (key: string) => {
  try {
    const res = await fetch('https://akupunkturaigla.pl/api/sync/image/download?key=' + key, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    return data.content;
  } catch (error) {
    console.error('Error downloading photo:', error);
    return null;
  }
};

function generateId(length = 15) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
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
  --box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.3),
    0px 1px 3px 1px rgba(0, 0, 0, 0.15);
  --color: black;
}
canvas {
  width: 100%;
  height: auto;
}
.summary-title {
  width:96%;
  margin:0 auto;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;
  padding-bottom:10px;
  margin-bottom: 5px;
  padding-left: 4px;
  border-bottom:solid 1px white
}
</style>
