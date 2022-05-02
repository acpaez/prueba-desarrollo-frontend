<template>
  <div class="login">
    <h1 class="title">Login</h1>
    <b-form class="form" @submit.prevent="Sendlogin">
      <b-form-group id="input-email-group" label="Correo" label-for="email">
        <b-form-input
          id="email"
          v-model="login.email"
          type="email"
          placeholder="Correo"
          required
        >
        </b-form-input>
      </b-form-group>
      <br />
      <b-form-group
        id="input-password-group"
        label="Contraseña"
        label-for="password"
      >
        <b-form-input
          id="password"
          v-model="login.password"
          type="password"
          placeholder="Contraseña"
          required
        >
        </b-form-input>
      </b-form-group>
      <br />
      <b-button type="submit" variant="primary">Enviar</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "LoginForm",

  data() {
    return {
      login: {
        email: null,
        password: null,
      },
    };
  },

  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },

  created() {
    if (this.loggedIn) {
      this.$router.push("/");
    }
  },

  methods: {
    /**
     * @method Sendlogin
     * method in charge of authenticating the user using vuex
     */
    Sendlogin() {
      const user = {
        email: this.login.email,
        password: this.login.password,
      };
      this.$store.dispatch("auth/login", user).then(
        () => {
          this.$router.push("/");
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
        }
      );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  padding: 2rem;
}
.title {
  text-align: center;
}
.form {
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 20%;
  min-width: 350px;
  max-width: 100%;
  border-radius: 5px;
  padding: 40px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}
</style>
