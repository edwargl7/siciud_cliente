<template class="kiki">
	<div class="navbar navbar-expand-md navbar-dark bg-main-600 border-0 navbar-sticky">
		<div class="d-md-none w-100">
			<button type="button" class="navbar-toggler d-flex align-items-center w-100" data-toggle="collapse" data-target="#navbar-navigation">
				<i class="icon-menu-open mr-2"></i>
				NAVEGACIÓN
			</button>
		</div>

		<div class="navbar-collapse collapse" id="navbar-navigation" v-if="user">
			<ul class="navbar-nav navbar-nav-highlight">
				<li class="nav-item">
					<router-link to="/" tag="a" class="navbar-nav-link legitRipple">
						<i class="icon-home2"></i>
						Inicio
					</router-link>
				</li>
				<li class="nav-item">
					<router-link to="/unidad" tag="a" class="navbar-nav-link legitRipple" title="Unidades de Investigación...">
						<i class="icon-books"></i>
						Unidades de Investigación
					</router-link>
				</li>
			</ul>
			<ul class="navbar-nav navbar-nav-highlight ml-md-auto">
				<li class="nav-item dropdown">
					<a href="#" class="navbar-nav-link dropdown-toggle legitRipple" data-toggle="dropdown">
						<i class="icon-cog3"></i>
						<span class="ml-1">Administración</span>
					</a>
					<div class="dropdown-menu dropdown-menu-right">
						<div class="dropdown-header">SEGURIDAD</div>
						<router-link to="/admin/usuarios" tag="a" class="dropdown-item" title="Administrar usuarios..."> <i class="icon-users2"></i> Usuarios </router-link>
						<a href="#" class="dropdown-item"><i class="icon-history"></i> Logs de actividad</a>
						<div class="dropdown-divider"></div>
						<div class="dropdown-header">CLASIFICADORES</div>
						<a href="#" class="dropdown-item"><i class="icon-menu7"></i> Líneas de investigación</a>
					</div>
				</li>
				<li class="nav-item" v-if="!impersonate">
					<a href="#" class="navbar-nav-link legitRipple" @click="menuLogout($event)">
						Cerrar sesión
						<i class="icon-square-right"></i>
					</a>
				</li>
			</ul>
		</div>

		<div class="navbar-collapse collapse" id="navbar-navigation" v-else>
			<ul class="navbar-nav navbar-nav-highlight">
				<li class="nav-item">
					<router-link to="/" tag="a" class="navbar-nav-link legitRipple">
						<i class="icon-home2"></i>
						Inicio
					</router-link>
				</li>
			</ul>
			<ul class="navbar-nav navbar-nav-highlight ml-md-auto" v-if="showLogin">
				<li class="nav-item">
					<router-link to="/login" tag="a" class="navbar-nav-link legitRipple">
						<i class="icon-user-lock"></i>
						Ingresar al sistema
					</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { mapActions } from "vuex";
let $ = window.jQuery;
export default {
	name: "globalMenu",
	components: {},
	methods: {
		...mapActions("auth", ["AuthLogout"]),
		menuLogout(e) {
			let root = this;
			e.preventDefault();
			this.$confirm("¿Realmente desea cerrar la sesión?", function(ok) {
				// 202010220220: 'logOut' en 'main.js'
				if (ok) root.logOut();
			});
		},
	},
	data: () => ({
		showLogin: true,
	}),
	watch: {
		$route(to, from) {
			// console.log("to", to);
			this.showLogin = to.name !== "login";
		},
	},
	computed: {
		impersonate() {
			return window.config.impersonate;
		},
		isValid: function() {
			return true;
		},
	},
};
</script>
