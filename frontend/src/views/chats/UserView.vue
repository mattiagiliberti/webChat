<template>
  <v-main>
        <v-container>
          <v-row>
            <v-col>
              <v-card>
                <v-card-title>
                  Informazioni utente
                </v-card-title>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      :disabled="true"
                      v-model="other.image"
                      label="Immagine (URL)"
                    ></v-text-field>
                    <v-text-field
                      :disabled="true"
                      v-model="other.username"
                      label="Username"
                    ></v-text-field>
                    <v-text-field
                      :disabled="true"
                      v-model="other.bio"
                      label="Biografia"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                  <v-card-actions>
                    <v-btn @click="chatWithUser" color="primary">Inizia la chat</v-btn>
                  </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
</template>


<script>
import api from "@/services/api";
import { useRouter } from "vue-router";
export default{
  name: "UserView",
  data(){
    return{
      other: {
        image: "",
        username: "",
        bio: "",
      },
    };
  },
  setup() {
    const router = useRouter();
    const serverUrl = import.meta.env.VITE_SERVER_HOSTNAME;

    const chatWithUser = () => {
      router.push("/chats"); // Reindirizza alla pagina di chat
    };

    return { chatWithUser };
  },

  async mounted() {
    console.log(this.$route);
    console.log(this.$route.params.id);
    const userid = this.$route.params.id;
    
    await api.getUserProfile(userid).then((response) => {
      console.log(response.data);
      this.other = response.data;
    });
  },
  props: {
    searchUser: {
      type: Object,
      default: null
    }
  },
  watch: {
    searchUser() {
      console.log("bebebbebebebi");
    }
  }
  


}
</script>