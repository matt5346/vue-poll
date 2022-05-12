<template>
  <div class="page">
    <div
      class="flex xs12 sm12 md12 xl6"
      v-if="!isAlreadyAnswered"
    >
      <va-card>
        <va-card-title><h1 class="display-5">Все ответы:</h1></va-card-title>

        <va-card-actions align="stretch" vertical>
          <div
            class="md12 xl12"
            v-if="getArrayOfAnswers"
          >
            <div
              v-for="item in getArrayOfAnswers"
              :class="['chip', {
                'biggest': item.order === 0,
                'medium': item.order !== 0 || item.order !== getArrayOfAnswers.length - 1,
                'smallest': item.order === getArrayOfAnswers.length - 1,
              }]"
              :key="item"
            >
              {{item.question}} <span>+{{item.counter}}</span>
            </div>
          </div>
        </va-card-actions>
      </va-card>
      <va-card v-if="urlQuestion">
        <va-card-title><h1 class="display-5">{{urlQuestion}}</h1></va-card-title>

        <va-card-actions align="stretch" vertical>
          <va-form
            ref="form"
            @validation="validation = $event"
          >
            <va-input
              class="mb-4"
              label="Введите ответ"
              v-model="inputValue"
            />
          </va-form>

          <va-button
            class="mb-4"
            :disabled="isAlreadyAnswered || !urlQuestion"
            @click="submitForm"
          >
            Подтвердить
          </va-button>
        </va-card-actions>
      </va-card>
      <div
        v-else
      >
        <va-card>
          <va-card-title><h1 class="display-5 card-title">Вопрос отсутствует</h1></va-card-title>
        </va-card>
      </div>
    </div>
    <div v-else-if="isAlreadyAnswered">
      <va-card>
        <va-card-title><h1 class="display-5">Все ответы:</h1></va-card-title>

        <va-card-actions align="stretch" vertical>
          <div
            class="md12 xl12"
            v-if="getArrayOfAnswers"
          >
            <div
              v-for="item in getArrayOfAnswers"
              :class="['chip', {
                'biggest': item.order === 0,
                'medium': item.order !== 0 || item.order !== getArrayOfAnswers.length - 1,
                'smallest': item.order === getArrayOfAnswers.length - 1,
              }]"
              :key="item"
            >
              {{item.question}} <span>+{{item.counter}}</span>
            </div>
          </div>
        </va-card-actions>
      </va-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed, ref as vueRef } from "vue";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getDatabase, ref, set, onValue } from "firebase/database";
import firebaseConfig from "@/firebase";

const inputValue = vueRef("");
const urlQuestion = vueRef(null);
const allAnswers = vueRef([]);
let db = reactive(null);
let realTimeDB = reactive(null);
const isAlreadyAnswered = vueRef(false);

onMounted(async () => {
  db = getFirestore(firebaseConfig);
  const params = new URLSearchParams(window.location.search);
  console.log(params.get("title"), "PARAMS");
  urlQuestion.value = params.get("title");

  await loadAllAnswers();
  isAlreadyAnswered.value = sessionStorage.getItem("isVoted");
});

const getArrayOfAnswers = computed({
  get () {
    let arrayOfAnswers = [];

    console.log(allAnswers.value, "allAnswers.value");
    Object.entries(allAnswers.value).forEach((item) => {
      console.log(item, "ITEMS");
      const obj = {
        counter: -1,
        question: item[1],
        order: 0
      };

      Object.entries(allAnswers.value).forEach((innerItem) => {
        if (item[1] === innerItem[1]) {
          obj.counter++;
        }
      });

      if (arrayOfAnswers && arrayOfAnswers.length) {
        const answerPushed = arrayOfAnswers.find((item) => item.question === obj.question);
        if (answerPushed) return;
      }

      arrayOfAnswers.push(obj);
    });

    if (arrayOfAnswers && arrayOfAnswers.length) {
      arrayOfAnswers = arrayOfAnswers.sort(function (a, b) {
        return b.counter - a.counter;
      });

      arrayOfAnswers = arrayOfAnswers.map((item, index) => {
        console.log(index, "arrayOfAnswers");
        return { ...item, order: index };
      });
    }
    console.log(arrayOfAnswers, "arrayOfAnswers");

    return arrayOfAnswers;
  }
});

const loadAllAnswers = async () => {
  realTimeDB = getDatabase(firebaseConfig);

  const questData = ref(realTimeDB, "/questions");
  onValue(questData, (snapshot) => {
    const data = snapshot.val();
    allAnswers.value = data;
  });
};

const submitForm = async () => {
  try {
    const getDb = getDatabase();
    const docRef = await addDoc(collection(db, "test"), {
      question: inputValue.value
    });
    set(ref(getDb, "questions/" + Date.now()), inputValue.value);
    sessionStorage.setItem("isVoted", true);
    isAlreadyAnswered.value = true;
    await loadAllAnswers();
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
</script>

<style lang="scss">
.chip {
  position: relative;
  display: inline-block;
  padding: 10px;
  border-radius: 20px;
  background: rgba(44, 130, 224, .7);
  color: #fff;
  margin: 0 5px;
  font-size: 16px;

  &.biggest {
    background: rgb(44, 130, 224);
    font-size: 25px;
    padding: 10px 15px;
  }

  &.smallest {
    font-size: 14px;
    padding: 8px;
    background: rgba(44, 130, 224, .5);
    span {
      font-size: 12px;
    }
  }

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  span {
    position: absolute;
    top: -10px;
    right: -10px;
    padding: 4px;
    font-size: 14px;
    border-radius: 20px;
    background: #6cc26c;
  }
}

.card-title {
  display: flex;
  width: 100%;
  justify-content: center;
  text-align: center;
}
</style>
