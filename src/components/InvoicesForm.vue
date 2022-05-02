<template>
  <div>
    <h1>Invoices</h1>
    <b-row>
      <b-col lg="6" class="my-1">
        <b-form-group
          label="Filter"
          label-for="filter-input"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="Type to Search"
            ></b-form-input>

            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''"
                >Clear</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col lg="6" class="my-1">
        <b-form-group
          label=""
          label-for="filter-input"
          label-cols-sm="4"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <button type="button" class="btn btn-primary" @click="createInvoice">
            Crear Factura
          </button>
        </b-form-group>
      </b-col>
    </b-row>
    <b-table
      id="table"
      striped
      hover
      responsive
      :busy="isBusy"
      :sort-desc.sync="sortDesc"
      :filter="filter"
      :items="items"
      :fields="fields"
    >
      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <i class="fa fa-spinner fa-spin"></i>
          <strong>Cargando...</strong>
        </div>
      </template>
      <template v-slot:cell(acciones)="row">
        <div>
          <a
            @click="verInvoice(row.item.id)"
            class="btn btn-info btn-sm"
            target="_blank"
          >
            <b-icon icon="eye-fill" style="color: white"></b-icon>
          </a>
        </div>
      </template>
    </b-table>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "InvoicesForm",
  data() {
    return {
      filter: null,
      sortDesc: false,
      isBusy: false,
      items: [],
      fields: [
        {
          key: "invoice_number",
          label: "Numero de Factura",
          sortable: true,
        },
        {
          key: "vat_before_value",
          label: "Valor antes de iva",
          sortable: true,
        },
        {
          key: "value_to_pay",
          label: "Valor a pagar",
          sortable: true,
        },
        {
          key: "user.name",
          label: "Emisor",
          sortable: true,
        },
        {
          key: "buyer.name",
          label: "Comprador",
          sortable: true,
        },
        {
          key: "acciones",
          label: "Acciones",
          sortable: true,
        },
      ],
    };
  },
  created() {
    this.getInvoces();
  },
  methods: {
    /**
     * @method verInvoice
     * metodo encargado de traer lasfacturas
     */
    getInvoces() {
      this.isBusy = true;
      axios.get("v1/invoice/invoices").then((response) => {
        this.items = response.data;
        this.isBusy = false;
      });
    },

    /**
     * @method verInvoice
     * method in charge of redirecting to create invoices
     */
    createInvoice() {
      this.$router.push({ name: "invoice", params: { id: null } });
    },

    /**
     * @method verInvoice
     * method in charge of redirecting to detail of the invoice
     * @param id_invoice id of invoice
     */
    verInvoice(id_invoice) {
      this.$router.push({ name: "invoice", params: { id: id_invoice } });
    },
  },
};
</script>
<style scoped>
.margin {
  margin-bottom: 0 !important;
}
</style>
