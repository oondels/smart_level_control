<template>
  <!-- Alerta de Erros Técnicos -->
  <div v-if="technicalError && errorName" class="sensor-error d-flex justify-content-center align-items-center">
    <div
      class="message-error-container position-relative d-flex flex-column align-items-center p-4 bg-amber-darken-1 rounded-lg"
    >
      <i
        @click="() => (technicalError = !technicalError)"
        role="button"
        class="mdi mdi-close-box fs-3 text-danger position-absolute m-0 p-0"
        style="top: 0; right: 0"
      ></i>

      <div class="border border-2 m-2 p-1 rounded mr-4">
        <v-icon large class="mr-2 text-white">mdi-alert-circle</v-icon>
        <!-- Atualizar para Informações reais -->
        <span class="fs-5">Erro: {{ errors[errorName].title }}</span>
      </div>

      <div class="fs-6 mt-2">
        {{ errors[errorName].message }}
      </div>
    </div>
  </div>

  <div class="diesel-container">
    <div class="contianer-fluid p-2">
      <div class="row p-2">
        <!-- Informações -->
        <div :class="`${alert ? 'col-md-2' : 'col-md-3'}`" class="p-1 border shadow rounded-lg bg-primary">
          <div class="h-100">
            <v-expansion-panels>
              <!-- Últimas Medições -->
              <v-expansion-panel>
                <v-expansion-panel-title>Últimas Medições</v-expansion-panel-title>

                <v-expansion-panel-text>
                  <div
                    class="col-12 rounded border border-2 p-1 px-1 mt-1"
                    v-for="(measure, measureId) in lastMeasures"
                    :key="measureId"
                  >
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <span>{{ measure.nivel }} L</span> <v-icon class="mdi mdi-water fs-4 text-info"></v-icon>
                      </div>
                      <span class="text-muted">{{ formateDate(measure.data_medicao) }}</span>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Últimos Abastecimentos -->
              <v-expansion-panel>
                <v-expansion-panel-title>Abastecimentos</v-expansion-panel-title>

                <v-expansion-panel-text>
                  <div v-for="supply in lastSupplyes" :key="supply.id">
                    <div class="col-12 rounded border border-2 p-1 px-1 mt-1">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <span>{{ supply.quantidade }} L</span> <v-icon class="mdi mdi-water fs-4 text-info"></v-icon>
                        </div>
                        <span class="text-muted">{{ formateDate(supply.data_abastecimento) }}</span>
                      </div>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <!-- Avisos -->
              <v-expansion-panel>
                <v-expansion-panel-title>Avisos</v-expansion-panel-title>

                <v-expansion-panel-text>
                  <div>
                    <h6>Em desenvolvimento...</h6>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>

        <!-- Dados Gerais e Gráfico -->
        <div :class="`${alert ? 'col-md-7' : 'col-md-9'}`">
          <div class="row p-2">
            <div class="col-12 rounded-lg mb-2 cards-info-diesel d-flex align-items-center">
              <div class="info-content row w-100">
                <div class="d-flex align-items-center col-md-5">
                  <i class="mdi mdi-barrel fs-3 text-success mr-2"></i>
                  <span>Nível Atual: {{ currentNivel }} L</span>
                </div>

                <div class="d-flex align-items-center col-md-7">
                  <i class="mdi mdi-clock fs-3 text-primary mr-2"></i>
                  <span>Horas Úteis: -- horas e -- minutos</span>
                </div>
              </div>
            </div>

            <div class="col-12 border shadow rounded-lg">
              <v-container class="gauge d-flex flex-column align-items-center">
                <v-progress-circular
                  :model-value="progressValue()"
                  :rotate="180"
                  :size="300"
                  :width="70"
                  :color="chartColor"
                >
                  <span>{{ currentNivel }} L</span>
                </v-progress-circular>
                <p v-if="lastMeasureDate" class="p-2 mt-2 text-center rounded shadow bg-primary">
                  Última atualização: {{ formateDate(lastMeasureDate) }}
                </p>
              </v-container>
            </div>
          </div>
        </div>

        <!-- Alerta -->
        <div v-if="alert" class="col-md-3 p-2 border shadow rounded-lg text-white bg-danger">
          <div class="h-100 alert-container">
            <div class="d-flex align-items-center bg-red-lighten-1 p-2 m-1 rounded-lg">
              <i class="mdi mdi-alert-circle-outline fs-4 mr-2"></i>
              <span class="fs-5">Nível de Diesel Baixo</span>
            </div>

            <p class="bg-red-lighten-1 p-2 m-1 rounded-lg mt-2">
              O nível atual de diesel está abaixo do recomendado. Por favor, realize o abastecimento o quanto antes.
            </p>

            <div class="d-flex flex-column justify-content-center mt-2">
              <!-- <v-btn prepend-icon="mdi mdi-email-arrow-right" variant="flat" color="warning">
                Solicitar Compra!
              </v-btn> -->

              <v-btn
                @click="toggleAlert"
                class="mt-2"
                prepend-icon="mdi mdi-close-circle"
                variant="outlined"
                color="grey-lighten-5"
              >
                Fechar
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botão Alerta -->
    <div>
      <span
        v-if="!alert && alertIcon"
        @click="toggleAlert"
        role="button"
        class="alert-icon fs-3 text-white material-symbols-outlined"
      >
        warning
      </span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { io } from "socket.io-client";
import ip from "@/ip";
import axios from "axios";

export default {
  name: "NivelDieselDois",
  components: {},
  props: {},

  setup() {
    const socket = io(`http://${ip}:3021`);

    const alert = ref(false);
    const alertIcon = ref(false);

    const maxNivel = ref(20000);
    const minNivel = ref(0);
    const currentNivel = ref(0);
    const lastMeasures = ref([]);
    const lastMeasureDate = ref(null);
    const chartColor = ref(null);

    const updateNivel = (data) => {
      if (data.nivel) {
        if (data.nivel > 20000) {
          data.nivel = 20000;
        }

        if (data.nivel <= 2500) {
          alertIcon.value = true;
        } else {
          alertIcon.value = false;
          alert.value = false;
        }

        currentNivel.value = data.nivel;
        lastMeasureDate.value = data.data_medicao;
      }
    };

    // Pesquisando a cada 4 minutos
    setInterval(() => {
      socket.emit("diesel_update", (data) => {
        updateNivel(data);
      });
      socket.emit("diesel_last_measures");
    }, 180000);

    socket.on("diesel_update", (data) => {
      updateNivel(data);
    });

    // Erros banco de dados
    socket.on("error", (data) => {
      if (data) {
        technicalError.value = true;
        errorName.value = "database";
      } else {
        technicalError.value = false;
      }
    });

    // Erro email
    socket.on("email_error", (data) => {
      if (data) {
        technicalError.value = true;
        errorName.value = "mail";
      } else {
        technicalError.value = false;
      }
    });

    const workingHours = () => {
      axios
        .get(`http://${ip}:3021/diesel-consumption`)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(`Erro ao buscar horas de trabalho: ${error}`);
        });
    };
    workingHours();

    const lastSupplyes = ref([]);
    onMounted(() => {
      // Erros sensor
      socket.emit("check_connection");
      socket.on("check_connection", (data) => {
        if (data) {
          technicalError.value = true;
          errorName.value = "sensor";
        } else {
          technicalError.value = false;
        }
      });

      // Busca Dados
      socket.emit("diesel_update", (data) => {
        updateNivel(data);
      });

      // Busca abastecimentos
      socket.emit("diesel_supply");
      socket.on("diesel_supply", (data) => {
        if (data) {
          lastSupplyes.value = data;
        }
      });

      // Busca 5 Últimas medições
      socket.emit("diesel_last_measures");
      socket.on("diesel_last_measures", (data) => {
        if (data) {
          lastMeasures.value = data;
        }
      });

      socket.on("last_measures_error", (data) => {
        console.log(`Error: ${data}`);
      });
    });

    const formateDate = (date) => {
      return new Date(date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const technicalError = ref(false);
    const errorName = ref(null);
    const errors = ref({
      database: {
        title: "Erro no Banco de Dados",
        message:
          "Erro ao atualizar informações das medições de diesel realizadas. Por favor entre em contato com o suporte técnico. Este erro interfere na comunicação com o sensor.",
      },
      sensor: {
        title: "Erro no Sensor de Nível",
        message:
          "Erro ao ler informações do sensor de nível de diesel. Por favor entre em contato com o suporte técnico. Este erro interfere na comunicação com o sensor.",
      },
      mail: {
        title: "Erro ao Enviar E-mail",
        message:
          "Erro ao enviar e-mail de aviso de nível baixo. Por favor entre em contato com o suporte técnico. Este erro interfere na comunicação com o sensor.",
      },
    });

    const progressValue = () => {
      const percentage = ((currentNivel.value - minNivel.value) / (maxNivel.value - minNivel.value)) * 100;

      if (percentage > 0 && percentage <= 20) {
        chartColor.value = "red";
      }
      if (percentage > 20 && percentage <= 35) {
        chartColor.value = "orange";
      }
      if (percentage > 35 && percentage <= 40) {
        chartColor.value = "blue";
      }
      if (percentage > 40 && percentage <= 100) {
        chartColor.value = "green";
      }

      return percentage;
    };

    const toggleAlert = () => {
      alert.value = !alert.value;
    };

    return {
      alert,
      alertIcon,
      technicalError,
      errorName,
      errors,

      progressValue,
      chartColor,
      currentNivel,
      lastMeasures,
      lastMeasureDate,
      lastSupplyes,
      toggleAlert,
      formateDate,
    };
  },
};
</script>

<style scoped>
.sensor-error {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.message-error-container {
  width: 50%;
}

.diesel-container {
  position: relative;
}

.alert-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  padding: 8px;
  background-color: red;
  border-radius: 50%;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.cards-info-diesel {
  background-color: #34495e;
  color: #fff;
  min-height: 80px;
}
</style>
