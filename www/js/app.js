// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova','ngSanitize'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    //$cordovaSQLite.deleteDB("my4.db");
    //alert("antes de abrir la BD");
    //db= $cordovaSQLite.openDB({ name: "my.db" });
    
    db= window.openDatabase("my1.db", "1.0", "my1.db", 10000);
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS usuario (id integer primary key, clave text , token text, correo text, id_verdadero integer)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS tratamiento (id_tratamiento integer primary key, nombre text , nombre_medico text, fechatrata text, usuario_id integer, lunes integer, martes integer, miercoles integer , jueves integer, viernes integer, sabado integer, domingo integer, dias integer, contador integer, contado_at integer, fecha_ultima_modificacion text, id_verdadero integer, borrado integer)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS recordatorio (id_recordatorio integer primary key , hora text, tomado integer, tomado_at text, tratamiento_id integer, fecha_ultima_modificacion text, id_verdadero integer, borrado integer)");
    
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/')
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl : 'templates/home.html',
      controller: 'principalController'
    })

    .state('popover', {
      url: '/verpop',
      templateUrl : 'templates/popover.html',
      controller: 'principalController'
    })
   

    .state('sesion', {
      url: '/sesion',
      templateUrl: 'templates/sesion.html',
      controller: 'principalController'
    })

    .state('contrasena', {
      url: '/recordar_contrasena',
      templateUrl: 'templates/olvidar_contrasena.html',
      controller: 'principalController'
    })

    .state('registrar', {
      url: '/registrar',
      templateUrl: 'templates/registrar_usuario.html',
      controller: 'principalController'
        
    })

    .state('menu-contenido', {
      url : '/menu',
      abstract: true,
      templateUrl : 'templates/menu.html',
      controller : 'tratamientoController'
    })


    .state('menu-contenido.principal', {
      url: '/principal',
      views: {
        'tratamientos-tomar': {
          templateUrl: 'templates/lista_recordatorios.html',
          controller : 'tratamientoController'
        }
      }
    })

    .state('crear-tratamiento', {
      url: '/creartratamiento',
      templateUrl: 'templates/crear_tratamiento.html',
      controller : 'tratamientoController'
    })

    .state('cambiar-clave', {
      url: '/cambiarclave', 
      templateUrl: 'templates/cambiar_clave.html',
      controller : 'tratamientoController'
       
    })

    .state('editar-cuenta', {
      url: '/editarcuenta', 
      templateUrl: 'templates/editar_cuenta.html',
      controller : 'tratamientoController'
       
    })

    .state('lista-tratamiento', {
      url: '/listatratamientos', 
      templateUrl: 'templates/lista_tratamientos.html',
      controller : 'tratamientoController'
       
    })

    .state('editar-tratamiento', {
      url: '/editartratamiento', 
      templateUrl: 'templates/editar_tratamiento.html',
      controller : 'tratamientoController'
    })

    .state('ver-tratamiento', {
      url: '/vertratamiento', 
      templateUrl: 'templates/ver_tratamiento.html',
      controller : 'tratamientoController'
    })

})
