/* eslint-disable no-unused-vars */
// 202005070848: https://stackoverflow.com/a/48458134
// 202005071437: https://vuex.vuejs.org/guide/modules.html
// 202005071338: https://appdividend.com/2018/05/08/vuex-axios-get-request-tutorial-with-example
import vue from "vue";
import vuex from "vuex";
// 202009091146: How to use Vue plugin in Store
// https://stackoverflow.com/a/52998442
import global from "../assets/js/global";
import api from "./api";
vue.use(vuex);

vue.use(global);

// Store
const store = {
	namespaced: true,
	state: {
		items: [],
	},
	actions: {
		all({ commit, state, rootState }, callback) {
			if (state.items.length <= 0) {
				console.log("rootState", rootState);
				// TODO: 202009240908: Ajustar al tener tokens integrados
				let u = rootState.auth.user;
				let uType = typeof u === "string" ? JSON.parse(u).type : u.type;
				let imp = uType === "local" || uType === "impersonated";
				// 202010220138: Si es local usa el json local
				// 202010211342: En 'api' se valida la presencia de un token local
				// api(imp ? "local" : "oas")
				// 	.get(imp ? "facultadProyecto" : "/oikos_crud_api/v2/dependencia_padre/FacultadesConProyectos")
				api("oas")
					.get("/oikos_crud_api/v2/dependencia_padre/FacultadesConProyectos")
					.then((r) => {
						// console.log("response", r);
						r.data.forEach((element) => {
							element.Nombre = this._vm.$titleCase(element.Nombre);
							element.Opciones.forEach((element) => {
								element.Nombre = this._vm.$titleCase(element.Nombre);
							});
						});
						this._vm.$objectSort(r.data, "Nombre");
						commit("SetData", r.data);
						if (this._vm.$isFunction(callback)) callback;
					});
			} else {
				if (this._vm.$isFunction(callback)) callback;
			}
		},
	},
	mutations: {
		SetData(state, data) {
			state.items = data;
		},
	},
	getters: {
		items: (state, getters) => {
			return state.items;
		},
		item: (state, getters) => (id) => {
			if (state.items.length > 0) {
				let item = state.items.find((o) => o.id.toString() === id.toString());
				return item;
			}
		},
	},
};

export default store;
