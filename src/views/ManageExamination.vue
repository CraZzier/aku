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
      <ion-list style="border-bottom: solid 1px rgba(0, 0, 0, 0.2)">
        <ion-item>
          <ion-label>Data wizyty</ion-label>
          <ion-datetime-button datetime="datetime"></ion-datetime-button>
          <ion-modal :keep-contents-mounted="true">
            <ion-datetime id="datetime"></ion-datetime>
          </ion-modal>
        </ion-item>
      </ion-list>
      <ion-accordion-group style="border-bottom: solid 1px rgba(0, 0, 0, 0.2)">
        <ion-accordion value="first">
          <ion-item slot="header" color="light">
            <ion-label>Objawy</ion-label>
          </ion-item>
          <ion-checkbox-group slot="content">
            <ion-item v-for="(item, index) in symptoms" :key="index">
              <ion-label>{{ item.name }}</ion-label>
              <ion-checkbox
                v-model="item.isChecked"
                slot="start"
              ></ion-checkbox>
            </ion-item>
            <ion-item>
              <ion-input
                v-model="customSymptom"
                label-placement="stacked"
                type="text"
                placeholder="Inne"
              ></ion-input>
              <ion-button slot="end" fill="clear" @click="addCustomSymptom()">
                <ion-icon :icon="add"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-checkbox-group>
        </ion-accordion>
      </ion-accordion-group>
      <ion-accordion-group style="border-bottom: solid 1px rgba(0, 0, 0, 0.2)">
        <ion-accordion value="first">
          <ion-item slot="header" color="light">
            <ion-label>Test mięśniowy</ion-label>
          </ion-item>
          <ion-checkbox-group slot="content">
            <div v-for="(item, index) in muscleTestObjects" :key="index">
              <ion-item>
                <ion-checkbox
                  v-model="item.isChecked"
                  slot="start"
                ></ion-checkbox>
                <ion-label>{{ item.name }}</ion-label>
              </ion-item>
              <ion-item v-if="item.isChecked">
                <ion-textarea
                  :label="'Rezultat dla ' + item.name"
                  label-placement="stacked"
                  v-model="item.result"
                  type="text"
                ></ion-textarea>
              </ion-item>
            </div>
          </ion-checkbox-group>
        </ion-accordion>
      </ion-accordion-group>
      <ion-accordion-group style="border-bottom: solid 1px rgba(0, 0, 0, 0.2)">
        <ion-accordion value="first">
          <ion-item slot="header" color="light">
            <ion-label>Puls</ion-label>
          </ion-item>
          <ion-item slot="content">
            <ion-button slot="end" fill="clear" @click="clearCanvas()">
                <ion-icon :icon="closeCircleOutline"></ion-icon>
            </ion-button>
          </ion-item>
          <ion-item slot="content">
            <canvas ref="canvas" id="canvas"></canvas>
          </ion-item>
        </ion-accordion>
      </ion-accordion-group>
      <ion-accordion-group style="border-bottom: solid 1px rgba(0, 0, 0, 0.2)">
        <ion-accordion>
            <ion-item slot="header" color="light">
                <ion-label>Diagnoza</ion-label>
            </ion-item>
            <ion-item slot="content">
                <ion-textarea
                    :label="'Diagnoza'"
                    label-placement="stacked"
                    v-model="diagnosis"
                    type="text"
                ></ion-textarea>
            </ion-item>
        </ion-accordion>
      </ion-accordion-group>
      <ion-accordion-group style="border-bottom: solid 1px rgba(0, 0, 0, 0.2)">
        <ion-accordion>
            <ion-item slot="header" color="light">
                <ion-label>Leczenie</ion-label>
            </ion-item>
            <ion-checkbox-group slot="content">
                <div v-for="(item, index) in treatments" :key="index">
                    <ion-item>
                        <ion-label>{{ item.name }}</ion-label>
                        <ion-checkbox
                            v-model="item.isChecked"
                            slot="start"
                        ></ion-checkbox>
                    </ion-item>
                    <ion-item v-if="item.isChecked && item.expandable">
                        <ion-textarea
                        :label="'opis dla ' + item.name"
                        label-placement="stacked"
                        v-model="item.description"
                        type="text"
                        ></ion-textarea>
                    </ion-item>
                </div>
                <ion-item>
                    <ion-input
                        v-model="customTreatment"
                        label-placement="stacked"
                        type="text"
                        placeholder="Inne"
                    ></ion-input>
                    <ion-button slot="end" fill="clear" @click="addCustomTreatment()">
                        <ion-icon :icon="add"></ion-icon>
                    </ion-button>
                </ion-item>
            </ion-checkbox-group>
        </ion-accordion>
      </ion-accordion-group><ion-accordion-group style="border-bottom: solid 1px rgba(0, 0, 0, 0.2)">
        <ion-accordion>
            <ion-item slot="header" color="light">
                <ion-label>Informacje dodatkowe</ion-label>
            </ion-item>
            <ion-item slot="content">
                <ion-textarea
                    :label="'Informacje dodatkowe'"
                    label-placement="stacked"
                    v-model="notes"
                    type="text"
                ></ion-textarea>
                <ion-button slot="end" fill="clear" @click="pickImage()">
                    <ion-icon :icon="add"></ion-icon>
                </ion-button>
            </ion-item>
            <ion-item slot="content">
                <a v-if="selectedImage" :href="selectedImage" target="_blank">
                    <img :src="selectedImage" alt="Selected Image" />
                </a>
            </ion-item>
        </ion-accordion>
      </ion-accordion-group>
      <ion-button expand="full" @click="saveExamination">Zapisz</ion-button>
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
import { caretBack, add, pulse, closeCircleOutline } from "ionicons/icons";
import { useGlobalStore } from "@/pinia";
import { Examination, MuscleTest, Symptom, Treatment } from "@/model";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useRoute } from "vue-router";
import router from "@/router";
const diagnosis = ref<string>(""); 
const notes = ref<string>("");
let treatments = reactive<Treatment[]>(
    [
        "myo-fascia",
        "GT",
        "dai mai",
        "humidity",
        "diabetes",
        "OT depression",
        "OT PC",
        "OT consumer",
        "OT mental",
        "OT bone",
        "OT muscle",
        "weight loss",
        "quitting smoking",
        "fertility",
        "trauma removal",
    ].map((name) => {
        return {
            name: name,
            isChecked: false,
            expandable: name === "myo-fascia" ? true : false,
            description: "",
        };
    })
);

let muscleTestObjects = reactive<MuscleTest[]>(
  [
    "Hallusis",
    "Digitorium",
    "Tibialis Anterior",
    "Fibularis Longus",
    "Gastronimius & Soelus",
    "Rectus Femoralis + Fasciae Latae Tensor",
    "Vastus Intermedialis",
    "Vastus Medialis",
    "Vastus Lateralis",
    "Adductor Brevis",
    "Adductor Longus",
    "Adductor Magnus",
    "Pectineus",
    "Gracilis & Sartorius",
    "Psoas",
    "Semitendinosus + BS",
    "Semimembranosus + BL",
    "Sciatic Nerve",
    "Gluteus Maximus",
    "Gluteus Medius",
    "Piriformis",
    "Quadratus Lumborum",
    "Longissimus Thorasic",
    "Romboid",
    "Trapezius",
    "Splenious",
    "Scalenus",
    "Scapula elevator",
    "Supraspinatus",
    "Infraspinatus",
    "Subscapularis",
    "Deltoid Anterior",
    "Deltoid Midial",
    "Deltoid Posterior",
    "Teres Major & Minor",
    "Pectoralis",
    "Masseter",
    "Coracobrachialis",
    "Tenis elbow",
    "Golf elbow",
  ].map((name) => ({
    name,
    result: "",
    isChecked: false,
  }))
);
let symptoms = reactive<Symptom[]>(
  [
    "Kaszel",
    "Gorączka",
    "Ból głowy",
    "Ból brzucha",
    "Biegunka",
    "Wymioty",
    "Ból pleców",
    "Ból stawów",
    "Zawroty głowy",
    "Duszność",
  ].map((name) => ({
    name,
    isChecked: false,
  }))
);
const imgSaved = ref();
const route = useRoute();
const selectedImage = ref<string | undefined>(undefined);
const canvas = ref<HTMLCanvasElement | null>();
let isDrawing = false;
const customSymptom = ref<string>("");
const customTreatment = ref<string>("");
const pickImage = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos, // 👈 or CameraSource.Prompt to let user choose camera/gallery
    });

    selectedImage.value = image.dataUrl;
  } catch (error) {
    console.error('Image picking cancelled or failed', error);
  }
};
const saveExamination = async () => {
  const id = route.query.examinationId || generateId();
  const examination: Examination = {
    id: id as string,
    date: new Date().toISOString(),
    symptoms: toRaw(symptoms),
    muscleTests: toRaw(muscleTestObjects),
    pulseImage: imgSaved.value,
    diagnosis: diagnosis.value,
    treatments: toRaw(treatments),
    notes: notes.value,
    notesImage: selectedImage.value as string,
  };
  piniaStore.addExamination(examination, route.params.userId as string);
  router.push('/userDetails/' + route.params.userId);
};
const addCustomTreatment = () => {
  if (
    customTreatment.value.trim() !== "" &&
    !treatments.find((treatment) => treatment.name === customTreatment.value)
  ) {
    treatments.push({
      name: customTreatment.value,
      isChecked: true,
      expandable: false,
      description: "",
    });
    customTreatment.value = "";
  }
};
const addCustomSymptom = () => {
  if (
    customSymptom.value.trim() !== "" &&
    !symptoms.find((symptom) => symptom.name === customSymptom.value)
  ) {
    symptoms.push({
      name: customSymptom.value,
      isChecked: true,
    });
    customSymptom.value = "";
  }
};
const piniaStore = useGlobalStore();
const ctx = ref<CanvasRenderingContext2D | null>(null);

const image = new Image();
image.src = "/puls.jpg";
onMounted(() => {
  console.log(route.query.examinationId, route.params.userId);
  if (route.query.examinationId && route.params.userId){
    const user = piniaStore.users.find(
      (user) => user.id === route.params.userId
    );
    console.log(user, piniaStore.users);
    if (user) {
      console.log(user);
      const examination = user.examinations?.find(
        (examination) => examination.id === route.query.examinationId
      );
      if (examination) {
        console.log(examination);
        diagnosis.value = examination.diagnosis;
        symptoms = examination.symptoms;
        muscleTestObjects = examination.muscleTests;
        imgSaved.value = examination.pulseImage;
        image.src = examination.pulseImage || "/puls.jpg";
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


  canvas.value.addEventListener("mousedown", startDrawing);
  canvas.value.addEventListener("mousemove", draw);
  canvas.value.addEventListener("mouseup", stopDrawing);
  canvas.value.addEventListener("mouseleave", stopDrawing);

  // Touch support
  canvas.value.addEventListener("touchstart", (e) =>
    startDrawing(e.touches[0])
  );
  canvas.value.addEventListener("touchmove", (e) => {
    e.preventDefault();
    draw(e.touches[0]);
  });
  canvas.value.addEventListener("touchend", stopDrawing);
});
const clearCanvas = () => {
  if (ctx.value) {
    image.src = "/puls.jpg";
    imgSaved.value = canvas.value!.toDataURL();
    ctx.value!.drawImage(image, 0, 0)
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
const getPos = (e: any) => {
  const rect = canvas.value!.getBoundingClientRect();
  let scale = image.width / canvas.value!.clientWidth;
  let obj = {
    x: (e.clientX - rect.left) * scale,
    y: (e.clientY - rect.top) * scale,
  };
  return obj;
};

// Drawing functions
const startDrawing = (e: any) => {
  isDrawing = true;
  console.log(e);
  const pos = getPos(e);
  ctx.value!.beginPath();
  ctx.value!.moveTo(pos.x, pos.y);
};

const draw = (e: any) => {
  if (!isDrawing) return;

  ctx.value!.lineWidth = 5;
  ctx.value!.strokeStyle = "red";
  ctx.value!.lineCap = "round";
  const pos = getPos(e);
  ctx.value!.lineTo(pos.x, pos.y);
  ctx.value!.stroke();
  ctx.value!.beginPath();
  ctx.value!.moveTo(pos.x, pos.y);
};

const stopDrawing = () => {
  isDrawing = false;
  ctx.value!.beginPath();
  imgSaved.value = canvas.value!.toDataURL();
  console.log(imgSaved.value);
};
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
</style>
