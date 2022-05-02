<template>
  <div class="home">
    <h1 class="title" v-show="!disable && !editar">Crear Factura</h1>
    <h1 class="title" v-show="disable && !editar">Ver Factura</h1>
    <h1 class="title" v-show="!disable && editar">Editar Factura</h1>
    <form class="form" @submit="onSubmit">
      <div class="row">
        <div class="col-md-6">
          <label for="number_invoice">Numero de factura</label>
          <input
            id="number_invoice"
            type="Number"
            class="form-control"
            v-model="invoice.number_invoice"
            required
            placeholder="Numero de factura"
            :disabled="disable"
          />
        </div>
        <div class="col-md-6">
          <label for="date_invoice">Fecha de factura</label>
          <h5>{{ this.invoice.date }}</h5>
        </div>
        <div class="buyer">
          <h3>Comprador</h3>
          <div class="row">
            <div class="col-md-6">
              <label for="buyer_name">Nombre Comprador</label>
              <input
                id="buyer_name"
                type="text"
                class="form-control"
                v-model="buyer.name"
                required
                placeholder="Nombre Comprador"
                :disabled="disable"
              />
            </div>
            <div class="col-md-6">
              <label for="buyer_nit">Nit Comprador</label>
              <input
                id="buyer_nit"
                type="text"
                class="form-control"
                v-model="buyer.nit"
                required
                placeholder="Nit Comprador"
                :disabled="disable"
              />
            </div>
          </div>
        </div>

        <div class="buyer" v-for="index in items" :key="index">
          <h3>Items</h3>
          <div class="row">
            <div class="col-md-6">
              <label for="description">Descripcion</label>
              <input
                id="description"
                type="text"
                class="form-control"
                required
                v-model="item.description[index - 1]"
                placeholder="Descripcion"
                :disabled="disable"
              />
            </div>
            <div class="col-md-2">
              <label for="quantity">Cantidad</label>
              <input
                id="quantity"
                type="Number"
                class="form-control"
                required
                v-model="item.quantity[index - 1]"
                placeholder="Cantidad"
                :disabled="disable"
                @change="
                  calculateFullValue(
                    item.unit_value[index - 1],
                    item.quantity[index - 1],
                    index
                  )
                "
              />
            </div>
            <div class="col-md-4">
              <label for="unit_value">Valor unitario</label>
              <input
                id="unit_value"
                type="Number"
                required
                v-model="item.unit_value[index - 1]"
                class="form-control"
                placeholder="Valor unitario"
                :disabled="disable"
                @change="
                  calculateFullValue(
                    item.unit_value[index - 1],
                    item.quantity[index - 1],
                    index
                  )
                "
              />
            </div>
            <div class="col-md-6">
              <label for="full_value">Valor total</label>
              <input
                id="full_value"
                type="Number"
                required
                class="form-control"
                v-model="item.full_value[index - 1]"
                placeholder="Valor total"
                disabled
              />
            </div>
          </div>
        </div>
        <div class="col-md-5">
          <label for="vat_before_value">Valor antes de iva</label>
          <input
            id="vat_before_value"
            type="text"
            class="form-control"
            disabled
            v-model="invoice.vat_before_value"
            placeholder="Valor antes de iva"
          />
        </div>
        <div class="col-md-1">
          <label for="vat_value">Iva</label>
          <input
            id="vat_value"
            type="text"
            class="form-control"
            v-model="vat_value"
            disabled
            placeholder="Iva"
          />
        </div>
        <div class="col-md-6">
          <label for="value_to_pay">Valor a pagar</label>
          <input
            id="value_to_pay"
            type="text"
            class="form-control"
            v-model="invoice.value_invoice"
            disabled
            placeholder="Valor a pagar"
          />
        </div>
      </div>
      <br />
      <button
        v-show="!disable && !editar"
        type="button"
        class="btn btn-secondary"
        @click="items++"
      >
        Agregar item
      </button>
      <button
        type="button"
        class="btn btn-danger"
        v-show="items > 1 && !disable && !editar"
        @click="deleteItem"
      >
        Eliminar item
      </button>
      <button
        v-show="!disable && !editar"
        type="submit"
        class="btn btn-primary"
      >
        Crear Factura
      </button>
      <button
        v-show="disable"
        type="button"
        @click="editarForm"
        class="btn btn-primary"
      >
        Editar
      </button>
      <button
        v-show="editar"
        type="button"
        @click="editarInfo"
        class="btn btn-primary"
      >
        Guardar
      </button>
      <b-alert
        class="message"
        :show="dismissCountDown"
        dismissible
        :variant="type_alert"
        @dismissed="dismissCountDown = 0"
        @dismiss-count-down="countDownChanged"
      >
        {{ message }}
      </b-alert>
    </form>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "HomeForm",
  data() {
    return {
      id: this.$route.params.id,
      dismissSecs: 3,
      dismissCountDown: 0,
      type_alert: null,
      message: null,
      vat_value: null,
      buyer: {
        id: null,
        name: null,
        nit: null,
      },

      invoice: {
        id: null,
        number_invoice: null,
        date: null,
        vat_before_value: null,
        value_invoice: null,
        vat_id: null,
      },

      item: {
        id: [],
        description: [],
        quantity: [],
        unit_value: [],
        full_value: [],
      },

      items: 1,
      disable: false,
      editar: false,
    };
  },
  created() {
    this.vatValue();
    this.invoice.date = new Date().toLocaleString();
    if (this.$route.params.id !== null) {
      this.getInvoice(this.$route.params.id);
    }
  },
  methods: {
    /**
     * @method onSubmit
     * method in charge of creating the invoices
     */
    onSubmit() {
      event.preventDefault();
      const data = {
        invoice: this.invoice,
        item: this.item,
        buyer: this.buyer,
      };
      axios.post("v1/invoice/invoice", data).then((response) => {
        if (response.data.error === undefined) {
          this.dismissCountDown = this.dismissSecs;
          this.message = response.data.message;
          this.type_alert = "success";
        } else {
          this.dismissCountDown = this.dismissSecs;
          this.message = response.data.message;
          this.type_alert = "danger";
        }
      });
    },

    /**
     * @method onSubmit
     * method in charge of querying the invoice by id
     * @param id id of invoice
     */
    getInvoice(id) {
      axios.get(`v1/invoice/invoices/${id}`).then((response) => {
        this.disable = true;
        this.invoice.id = response.data.id;
        this.invoice.number_invoice = response.data.invoice_number;
        this.invoice.date = new Date(response.data.created_at).toLocaleString();
        this.invoice.vat_before_value = response.data.vat_before_value;
        this.invoice.value_invoice = response.data.value_to_pay;

        this.buyer.id = response.data.buyer.id;
        this.buyer.name = response.data.buyer.name;
        this.buyer.nit = response.data.buyer.nit;
        let count = 0;

        response.data.items.forEach((element) => {
          this.item.id[count] = element.id;
          this.item.description[count] = element.description;
          this.item.quantity[count] = element.quantity;
          this.item.unit_value[count] = element.unit_value;
          this.item.full_value[count] = element.full_value;
          count++;
        });

        this.items = count;
      });
    },

    /**
     * @method editarForm
     * method in charge of activating the variables to edit the information of the invoice
     */
    editarForm() {
      this.disable = false;
      this.editar = true;
    },

    /**
     * @method editarInfo
     * method in charge of editing the information of the invoice
     */
    editarInfo() {
      event.preventDefault();
      const data = {
        invoice: this.invoice,
        item: this.item,
        buyer: this.buyer,
      };
      axios
        .put(`v1/invoice/updateinvoice/${this.invoice.id}`, data)
        .then((response) => {
          if (response.data.error === undefined) {
            this.dismissCountDown = this.dismissSecs;
            this.message = response.data.message;
            this.type_alert = "success";
            this.editar = false;
            this.disable = true;
          } else {
            this.dismissCountDown = this.dismissSecs;
            this.message = response.data.message;
            this.type_alert = "danger";
            this.editar = false;
            this.disable = true;
          }
        });
    },

    /**
     * @method countDownChanged
     * method in charge of making the countdown of the alert
     */
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },

    /**
     * @method calculateFullValue
     * method in charge of calculating the total value per unit
     */
    calculateFullValue(unit_value, quantity, index) {
      this.item.full_value.splice(index - 1, 1, unit_value * quantity);
      this.calculateValuesInvoice();
    },

    /**
     * @method calculateValuesInvoice
     * method in charge of calculating the value before taxes of the invoice
     */
    calculateValuesInvoice() {
      this.invoice.vat_before_value = this.item.full_value.reduce(
        (a, b) => a + b,
        0
      );
    },

    /**
     * @method deleteItem
     * method in charge of eliminating the variables when an item is eliminated
     */
    deleteItem() {
      this.item.full_value.pop();
      this.item.unit_value.pop();
      this.item.quantity.pop();
      this.item.description.pop();
      this.items--;
      this.calculateValuesInvoice();
    },

    /**
     * @method vatValue
     * method in charge of bringing the VAT value
     */
    vatValue() {
      axios
        .get("v1/vatvalue/vatvalue")
        .then((response) => {
          this.vat_value = response.data[0].vat_value;
          this.invoice.vat_id = response.data[0].id;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  /**
   * calculation of the value to pay of the invoice
   */
  updated() {
    if (!Number.isNaN(this.invoice.vat_before_value)) {
      this.invoice.value_invoice =
        this.invoice.vat_before_value * (this.vat_value / 100) +
        this.invoice.vat_before_value;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  padding: 2rem;
}
.title {
  text-align: center;
}
.form {
  margin: 3rem auto;
  width: 70%;
  min-width: 350px;
  max-width: 100%;
  border-radius: 5px;
  padding: 40px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}
.buyer {
  margin: 1rem auto;
  width: 100%;
  min-width: 350px;
  max-width: 100%;
  border-radius: 5px;
  padding: 40px;
  border: 1px solid rgb(0 0 0 / 30%);
}
.message {
  bottom: 5px;
  right: 2%;
  width: 40%;
  position: fixed;
}
</style>
