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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import app from "@/firebase";
import { getFirestore, deleteDoc, doc } from "firebase/firestore";

const email = ref("");
const password = ref("");
const validation = ref(null);
const router = useRouter();
const currentUserLogged = ref(null);
const db = ref(null);

const inputRules = [value => value === "admin@gmail.com"];
const passRules = [value => value === "admin12"];

onMounted(() => {
  onAuthStateChanged(getAuth(app), (user) => {
    currentUserLogged.value = !!user;
  });
  db.value = getFirestore(app);
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

const deleteAll = async () => {
  const deletedDocs = await deleteDoc(doc(db.value, "test", "DC"));
  console.log(deletedDocs, "deletedDocs");
  // firebase1.firestore().collection(path).listDocuments().then(val => {
  //   val.map((val) => {
  //     val.delete();
  //   });
  // });
};

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
