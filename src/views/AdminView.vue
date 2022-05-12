<template>
  <div class="page">
    <div
      v-if="!currentUserLogged"
      class="flex sm md12 xl6"
    >
      <va-card>
        <va-card-title><h1 class="display-5">Login</h1></va-card-title>

        <va-card-actions align="stretch" vertical>
          <va-form
            ref="form"
          >
            <va-input
              class="mb-4"
              label="Email"
              v-model="email"
              placeholder="email"
              :rules="inputRules"
            />
            <va-input
              class="mb-4"
              label="Password"
              type="password"
              placeholder="password"
              v-model="password"
              :rules="passRules"
            />
          </va-form>

          <va-button
            class="mb-4"
            @click="loginSubmit"
          >
            Submit
          </va-button>

          <va-alert v-if="validation !== null" class="mt-3" border="left">
            <span>
              Validate form:
              <va-chip>{{ validation }}</va-chip>
            </span>
          </va-alert>
        </va-card-actions>
      </va-card>
    </div>
    <div v-else>
      <h1 class="display-1">Admin panel</h1>
      <va-button
        class="mt-4"
        color="danger"
        @click="deleteAll"
      >
        Reset Poll
      </va-button>
      <va-button
        class="mt-4 ml-4"
        @click="logout"
      >
        Logout
      </va-button>

      <va-card class="mt-5">
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
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getFirestore, collection, getDocs } from "firebase/firestore";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import app from "@/firebase";

const email = ref("");
const password = ref("");
const validation = ref(null);
const router = useRouter();
const currentUserLogged = ref(null);
const db = ref(null);
const allAnswers = ref([]);

const inputRules = [value => value === "admin@gmail.com"];
const passRules = [value => value === "admin12"];

onMounted(async () => {
  onAuthStateChanged(getAuth(app), (user) => {
    currentUserLogged.value = !!user;
  });
  db.value = getFirestore(app);

  const querySnapshot = await getDocs(collection(db.value, "test"));

  querySnapshot.forEach((doc) => {
    const answer = JSON.stringify(doc.data());
    allAnswers.value.push(JSON.parse(answer));
  });
});

const getArrayOfAnswers = computed({
  get () {
    let arrayOfAnswers = [];

    allAnswers.value.forEach((item) => {
      const obj = {
        counter: -1,
        question: item.question,
        order: 0
      };

      allAnswers.value.forEach((innerItem) => {
        if (item.question === innerItem.question) {
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

const logout = async () => {
  try {
    const authInstance = getAuth(app);
    const data = await signOut(authInstance);
    currentUserLogged.value = false;
    console.log(data, "data");
    router.replace({ name: "home" });
  } catch (err) {
    console.log(err, "err signOut");
  }
};

// const deleteAll = async () => {
//   const deletedDocs = await deleteDoc(doc(db.value, "test", "DC"));
//   console.log(deletedDocs, "deletedDocs");
//   // firebase1.firestore().collection(path).listDocuments().then(val => {
//   //   val.map((val) => {
//   //     val.delete();
//   //   });
//   // });
// };

const loginSubmit = async () => {
  try {
    console.log(app, "AITH");
    const auth = getAuth(app);
    // eslint-disable-next-line max-len
    await signInWithEmailAndPassword(auth, email.value, password.value);
    // const auth = firebaseConfigConst.firebase;
    // this.$router.replace({ name: "secretView" });
    console.log(router, "rotuer");
  } catch (err) {
    console.log(err, "err");
  }
};

</script>
