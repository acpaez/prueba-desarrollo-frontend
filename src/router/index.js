import VueRouter from 'vue-router'
import HomeForm from '../components/HomeForm.vue'
import LoginForm from '../components/LoginForm.vue'
import InvoiceForm from '../components/InvoicesForm.vue'


/**
 * compendium of routes
 */

const routes = [{
        path: '/login',
        name: 'login',
        component: LoginForm
    },
    {
        path: '/invoice/:id',
        name: 'invoice',
        component: HomeForm,
        meta: {
            auth: true
        },
    },
    {
        path: '/',
        name: 'invoices',
        component: InvoiceForm,
        meta: {
            auth: true
        },
    }
]

const router = new VueRouter({
    routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('user');
    if (to.meta.auth) {
        if (loggedIn === null) {
            return next('/login');
        }
    }
    next();
});

export default router