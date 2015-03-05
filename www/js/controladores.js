
angular.module('starter')

	.controller("principalController",function($scope, $cordovaSQLite, $http, $location, $ionicSideMenuDelegate, $rootScope,$ionicPopover){

		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

		Object.toparams = function ObjecttoParams(obj) {
	        var p = [];
	        for (var key in obj) p.push(key + '=' + encodeURIComponent(obj[key]));
	        return p.join('&');
	    };

	    $scope.mensajeErrorCorreo = "";

		$scope.registrarUsuario = function (){
			alert("entre aqui");
			alert($scope.correoregistrar);
			$http({
		      method: "post",
		      url: "http://192.168.1.102:3000/usuarios/crear",
		      data: Object.toparams({'nombre':$scope.nombreregistrar,'correo':$scope.correoregistrar, 'clave': $scope.claveregistrar, 'fechanac': 'nil'})
		    }).success(function(res){
		    	alert(res);
		    	if (res.nombre == "Correo existente") $scope.mensajeErrorCorreo = "El correo ya existe";
		    	else{ 
		    		$scope.mensajePopover = "El usuario fue creado exitosamente"
		    		var template = '<ion-popover-view><ion-header-bar> <h1 class="title">Prueba</h1> </ion-header-bar> <ion-content> lala</ion-content></ion-popover-view>';

					  $scope.popover = $ionicPopover.fromTemplate(template, {
					    scope: $scope,
					  });
		    		$location.path("/");
		    	}
		    });
	    }

	    $scope.iniciarSesion = function (){

	    	//alert("inicio sesion");
		    myobject = {'correo':$scope.correoinicio,'clave':$scope.claveinicio};
		    //alert("antes de abrir la BD");
		   // var db = $cordovaSQLite.openDB({ name: "my.db" }); //se usa cuando se va a probar en un dispositivo movil
		   // alert("despues de abrir la BD");
		    $http({
		      method: "post",
		      url: "http://192.168.1.102:3000/usuarios/autenticar",
		      data: Object.toparams(myobject)
		    }).success(function(res){
		    	//alert("llame al api");
		      if (res.nombre!="Error en los datos"){
		      	$rootScope.token = res.token;
		        $rootScope.id_usuario_verdadero = res.id_usuario;
		      	$location.path("/menu/principal");
			 	/*$cordovaSQLite.execute(db, "SELECT * FROM usuario").then(function (res) {
				   	if(res.rows.length > 0){
				        for (i = 0; i < res.rows.length; i++){
				        	$cordovaSQLite.execute(db, "DELETE FROM usuario where id="+res.rows.item(i).id).then(function (res) {
				        		$cordovaSQLite.execute(db, "DELETE FROM tratamiento").then(function (res4) {
				        			$cordovaSQLite.execute(db, "DELETE FROM recordatorio").then(function (res5) {
				        		
						        	},function (err){
						        		console.error(err);
						        	});
					        	},function (err){
					        		console.error(err);
					        	});
				        	},function (err){
				        		console.error(err);
				        	});
				        }
				        //alert("boore usuarios en la bd");
				    }else{
				    	//alert("No results found");
				    }*

			    }, function (err) {
			        alert("error");
			        console.error(err);
			    });
			    //alert(res.token);
		        var query = "INSERT INTO usuario (id, clave, token, correo, id_verdadero) values (?, ?, ?, ?, ?)";
		        var query2 = "";
		        var arreglo_tratamiento = [];
		        $cordovaSQLite.execute(db, query, [null, res.clave, res.token, res.correo, res.id_usuario]).then(function(res){
		        	$scope.id_usuario_local = res.insertId;
		        	$http({
				      method: "post",
				      url: "http://192.168.1.102:3000/tratamientos/listar_recordatorio/",
				      data: Object.toparams({"id_usuario":$rootScope.id_usuario_verdadero, "token": $rootScope.token})
				    }).success(function(res2){
				    	
				    	for(var n=0; n<res2.length; n++){
				    		//alert("soy el tratamiento con n="+n+" me llamo"+res2[n].nombre);
					    	query2 = "INSERT INTO tratamiento (id_tratamiento, nombre, nombre_medico, fechatrata, usuario_id, lunes, martes, miercoles, jueves, viernes, sabado, domingo, dias, contador, contado_at, fecha_ultima_modificacion, id_verdadero,borrado) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
					    	arreglo_tratamiento.push({"id_tratamiento": null, "nombre":res2[n].nombre, "nombre_medico": res2[n].nombre_medico, "fechatrata":res2[n].fechatrata, "usuario_id": $rootScope.id_usuario_verdadero, "lunes" :res2[n].lunes, "martes":res2[n].martes, "miercoles":res2[n].miercoles, "jueves":res2[n].jueves, "viernes":res2[n].viernes, "sabado":res2[n].sabado, "domingo":res2[n].domingo, "dias":res2[n].dias, "contador":null, "contador_at":null, "fecha_ultima_modificacion":res2[n].fecha_ultima_modificacion, "id_verdadero":res2[n].id_tratamiento, "borrado": null});
						    $cordovaSQLite.execute(db, query2, [null, res2[n].nombre, res2[n].nombre_medico, res2[n].fechatrata, $rootScope.id_usuario_verdadero, res2[n].lunes, res2[n].martes, res2[n].miercoles, res2[n].jueves, res2[n].viernes, res2[n].sabado, res2[n].domingo, res2[n].dias, null, null, res2[n].fecha_ultima_modificacion, res2[n].id_tratamiento,null]).then(function (res10){
						    	//alert("se ejecuto bien el query de tratamientos");
						    }, function (err) {
						      console.error(err);
						      alert("Existe un error en el tratamiento "+ n);
						    });
				    	}
				    	alert("voy al for de  recordatorios");
				    	for (var x=0; x<arreglo_tratamiento.length; x++){

				    		for(m=01; m<arreglo_tratamiento[x].numero_recordatorio; m++){
				    			//alert("entre al for de recordatorio");	
				    			var query= "INSERT INTO recordatorio (id_recordatorio, hora, tomado, tomado_at, tratamiento_id, fecha_ultima_modificacion, id_verdadero) values (?, ?, ?, ?, ?, ?, ?)";
						        $cordovaSQLite.execute(db, query, [null, arreglo_tratamiento[x].recordatorios[m].hora, arreglo_tratamiento[x].recordatorios[m].tomado, null, arreglo_tratamiento[x].id_tratamiento, arreglo_tratamiento[x].fecha_ultima_modificacion, null]).then(function(res){
						        	//alert("se ejecuto bien el query de recordatorios");
						        }, function (err) {
						          console.error(err);
						          alert("Existe un error en recordatorio en la posicion"+ m);
						        });
				    		}
				    			
				    	}
				    });

		        	$location.path("/menu/principal");
		        }, function (err) {
		          console.error(err);
		          alert("Existe un error");
		        });*/
		      }else{
		       alert("Existe un error en los datos");
		      }
		    });
		  };

		  $scope.recordarContrasena = function (){
		    myobject = {'correo':$scope.correocontrasena};
		    $http({
		      method: "post",
		      url: "http://192.168.1.102:3000/usuarios/olvidar_contrasena",
		      data: Object.toparams(myobject)
		    }).success(function(res){
		      alert(res.mensaje);
		    });
		  };

		  /********* IONIC *********************/
		  $scope.toggleLeft = function() {
		    $ionicSideMenuDelegate.toggleLeft();
		  };
	})

	.controller("tratamientoController",function($scope, $cordovaNetwork, $cordovaSQLite, $http, $location, $ionicSideMenuDelegate, $rootScope, $ionicActionSheet, $q){
		$scope.lunescreart = $scope.martescreart = $scope.miercolescreart = $scope.juevescreart = $scope.viernescreart = $scope.sabadocreart = $scope.domingocreart = false;

		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
		Object.toparams = function ObjecttoParams(obj) {
		        var p = [];
		        for (var key in obj) {
		            p.push(key + '=' + encodeURIComponent(obj[key]));
		        }
		        return p.join('&');
		};

		$scope.showMenu = function () { $ionicSideMenuDelegate.toggleLeft(); };
	  	$scope.showRightMenu = function () { $ionicSideMenuDelegate.toggleRight(); };

		$scope.crearmes= function(mes){
			if (mes=="Jan") return ("01");
			else if (mes=="Feb") return ("02");
			else if (mes=="Mar") return ("03");
			else if (mes=="Apr") return ("04");
			else if (mes=="May") return ("05");
			else if (mes=="Jun") return ("06");
			else if (mes=="Jul") return ("07");
			else if (mes=="Aug") return ("08");
			else if (mes=="Sep") return ("09");
			else if (mes=="Oct") return ("10");
			else if (mes=="Nov") return ("11");
 			else if (mes=="Dec") return ("12");
		};

		$scope.crearTratamiento= function(){
			var fecha= $scope.fechacreart.toString().split(" ");
			var mes= $scope.crearmes(fecha[1]);
			var trata= fecha[3]+"-"+mes+"-"+fecha[2];
			var st= "http://192.168.1.102:3000/tratamientos/crear?usuario_id="+$rootScope.id_usuario_verdadero+"&token="+$rootScope.token+"&nombre="+$scope.nombrecreart+"&nombre_medico="+$scope.nombremedicocreart+"&fecha_trata="+trata+"&lunes="+$scope.lunescreart+"&martes="+$scope.martescreart+"&miercoles="+$scope.miercolescreart+"&jueves="+$scope.juevescreart+"&viernes="+$scope.viernescreart+"&sabado="+$scope.sabadocreart+"&domingo="+$scope.domingocreart+"&dias="+$scope.diascreart+"&horas="+$scope.horascreart;
			for (i=0;i<$scope.horascreart;i++){
				st= st + "&hora"+(i+1)+"=";
				st= st+$scope.horasinput[i].nombre;
			}
			alert(st);
			var query = "INSERT INTO tratamiento (id_tratamiento, nombre, nombre_medico, fechatrata, usuario_id, lunes, martes, miercoles, jueves, viernes, sabado, domingo, dias, contador, contado_at, fecha_ultima_modificacion, id_verdadero) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		    $cordovaSQLite.execute(db, query, [null, $scope.nombrecreart, $scope.nombremedicocreart, trata, $rootScope.id_usuario_verdadero, $scope.lunescreart, $scope.martescreart, $scope.miercolescreart, $scope.juevescreart, $scope.viernescreart, $scope.sabadocreart, $scope.domingocreart, $scope.diascreart, null, null, null, null]).then(function (res){
		    	for (i=0; i< $scope.horascreart; i++){
		    		var hora= $scope.horasinput[i].nombre.toString().split(" ");
					var query= "INSERT INTO recordatorio (id_recordatorio, hora, tomado, tomado_at, tratamiento_id, fecha_ultima_modificacion, id_verdadero) values (?, ?, ?, ?, ?, ?, ?)";
			        $cordovaSQLite.execute(db, query, [null, hora[4], null, null, res.insertId, null, null]).then(function(res){
			        	alert(" cree un recordatorio");
			        }, function (err) {
			          console.error(err);
			          alert("Existe un error");
			        });
				}

		    }, function (err) {
		      console.error(err);
		      alert("Existe un error");
		    });

		    $http({
		      method: "post",
		      url: st,
		      //data: Object.toparams({'usuario_id':$rootScope.id_usuario_verdadero,'token':$rootScope.token,'nombre':$scope.nombrecreart, 'nombre_medico': $scope.nombremedicocreart, 'fechatrata': $scope.fechacreart, 'lunes':$scope.lunescreart, 'martes': $scope.martescreart, 'miercoles': $scope.miercolescreart, 'jueves': $scope.juevescreart, 'viernes': $scope.viernescreart, 'sabado': $scope.sabadocreart, 'domingo': $scope.domingocreart, 'dias': $scope.diascreart, 'horas': $scope.horascreart, 'hora1': $scope.hora1creart})
		    }).success(function(res){
		    	alert(res.nombre);
		    });
		    $location.path("/menu/principal");

		};

		$scope.llenar_arreglo = function (){
			$scope.horasinput = [];
			for (i=0;i<$scope.horascreart;i++)
				$scope.horasinput.push({"nombre": "hora"+i});
			
		};

		$scope.cerrar_sesion = function (){ $location.path("/home"); };

		$scope.cambiarClave= function(){
			myobject = {'id':$rootScope.id_usuario_verdadero,'token':$rootScope.token, 'claveact': $scope.claveactualc, 'clavenueva': $scope.clavenueva};
			if ($scope.clavenueva == $scope.clavenueva2){
				$http({
			      method: "post",
			      url: "http://192.168.1.102:3000/usuarios/cambiar_clave",
			      data: Object.toparams(myobject)
			    }).success(function(res){
			    	alert(res.mensaje);
			    });
			}else{
				alert("Las nuevas contraseñas deben coincidir");
			}
			$location.path("/menu/principal");
		};

		$scope.verificarClave = function (){
			if ($scope.clavenueva != $scope.clavenueva2)
				$scope.mensajeError = "Las claves no coinciden";
			else
				$scope.mensajeError = "";
		};

		$scope.listarUsuario = function (){
		 	$cordovaSQLite.execute(db, "SELECT * FROM usuario").then(function (res) {
		 		//alert(res.rows.item(0).correo);
			   	$scope.correoeditar = {"val": res.rows.item(0).correo.toString()};
			   	//alert($scope.correoeditar.val);
		    }, function (err) {
		        alert("error");
		        console.error(err);
		    });
		};

		$scope.editarCuenta = function(){
			myobject = {'id':$rootScope.id_usuario_verdadero,'token':$rootScope.token, 'correo': $scope.correoeditar.val, 'nombre': null};
			$cordovaSQLite.execute(db, "UPDATE usuario SET correo='"+$scope.correoeditar.val+"'").then(function (res){
				$http({
			      method: "post",
			      url: "http://192.168.1.102:3000/usuarios/editar",
			      data: Object.toparams(myobject)
			    }).success(function(res){
			    	alert(res.mensaje);
			    });
			}, function (err){
				alert("error");
			});

		};

		$scope.listarTratamientos = function(){
			$scope.tratamientoslistar=[];
		 	$cordovaSQLite.execute(db, "SELECT * FROM tratamiento").then(function (res) {
		 		alert(res.rows.item(0).nombre);
			   	if(res.rows.length > 0){
			        for (i = 0; i < res.rows.length; i++){
			        	if (res.rows.item(i).borrado != 1)
			        		$scope.tratamientoslistar.push({"nombre": res.rows.item(i).nombre, "id": res.rows.item(i).id_tratamiento});
			        } 
			    }else{
			    	alert("No results found");
			    }

		    }, function (err) {
		        alert("error");
		        console.error(err);
		    });
			
		};

		$scope.mostrarActionSheet= function(id_tratamiento,posicion) {
			$ionicActionSheet.show({
				buttons:[
				{text: "Editar"},
				{text: "Visualizar"}
				],
				destructiveText: "Eliminar",
				cancelText: "Cancelar",
				buttonClicked: function(index){
					$rootScope.tratamiento_a_editar = id_tratamiento;
					if (index ==0)
						$location.path("/editartratamiento");
					else
						$location.path("/vertratamiento");
					
					return true;

					
				},
				destructiveButtonClicked: function(index){
					$cordovaSQLite.execute(db, "UPDATE tratamiento SET borrado='1' where id_tratamiento="+id_tratamiento).then(function (res) {			   
						$cordovaSQLite.execute(db, "SELECT * FROM recordatorio where tratamiento_id="+id_tratamiento).then(function (res) {
				   			if(res.rows.length > 0){
						        for (i = 0; i < res.rows.length; i++){
						        	$cordovaSQLite.execute(db, "UPDATE recordatorio set borrado='1' where id_recordatorio="+res.rows.item(i).id_recordatorio).then(function (res) {
					        		
						        	},function (err){
						        		console.error(err);
						        	});
						        } 
						    }else{
						    	alert("No hay recordatorio");
						    }

					    }, function (err) {
					        alert("error");
					        console.error(err);
					    });
				    }, function (err) {
				        alert("error");
				        console.error(err);
				    });
					
					delete $scope.tratamientoslistar[ posicion ];
					return true;

				}
			});
		};

		$scope.llenar_arreglo_act = function(){
			alert("hola");
			$scope.horasactarray = [];
			for (i=0;i<$scope.horasact.val;i++)
				$scope.horasactarray.push({"nombre": "hora"+i});
		};

		$scope.llenarformedit= function(){
			alert($rootScope.tratamiento_a_editar);
			$cordovaSQLite.execute(db, "SELECT * FROM tratamiento where id_tratamiento="+$rootScope.tratamiento_a_editar).then(function (res) {
			   	if(res.rows.length > 0){
			        for (i = 0; i < res.rows.length; i++){
			        	$scope.nombreactrat= {"val":res.rows.item(i).nombre};
						$scope.nombreactmedi= {"val":res.rows.item(i).nombre_medico};
						var fecha = res.rows.item(i).fechatrata.toString().split("-");
						$scope.fechactrata= {"val":new Date(fecha[2]+"/"+fecha[1]+"/"+fecha[0])};
						$scope.diasactrata= {"val":res.rows.item(i).dias};
						$scope.lunesact = false;
						$scope.martesact = false;
						$scope.miercolesact = false;
						$scope.juevesact = false;
						$scope.viernesact = false;
						$scope.sabadoact = false;
						$scope.domingoact = false;
			        } 
			    }else{
			    	alert("No results found");
			    }

		    }, function (err) {
		        alert("error");
		        console.error(err);
		    });

		    $cordovaSQLite.execute(db, "SELECT * FROM recordatorio where tratamiento_id="+$rootScope.tratamiento_a_editar).then(function (res) {
			   	if(res.rows.length > 0){
			   		$scope.horasact = {"val":res.rows.length};
			   		$scope.horasactarray = [];
			        for (i = 0; i < res.rows.length; i++){
			        	var hora = res.rows.item(i).hora.toString().split(":");
			        	$scope.horasactarray.push({"nombre":new Date('2015','02','01',hora[0],hora[1])});
			        } 

			    }else{
			    	alert("No results found");
			    }

		    }, function (err) {
		        alert("error");
		        console.error(err);
		    });   
		};

		$scope.editarTratamiento = function(){
			var today= new Date();
			var dd = today.getDate();
			var mm = parseInt(today.getMonth())+1;
			var yyyy = today.getFullYear();
			if(dd<10) dd='0'+dd
			if(mm<10) mm='0'+mm
			
			today = (yyyy+'-'+mm+'-'+dd).toString();
			
			var fecha= $scope.fechactrata.val.toString().split(" ");
			var mes= $scope.crearmes(fecha[1]);
			var trata= fecha[3]+"-"+mes+"-"+fecha[2];
			$cordovaSQLite.execute(db, "UPDATE tratamiento SET nombre='"+$scope.nombreactrat.val+"' , nombre_medico='"+$scope.nombreactmedi.val+"', fechatrata='"+trata+"', lunes='"+$scope.lunesact+"', martes='"+$scope.martesact+"', miercoles='"+$scope.miercolesact+"' , jueves='"+$scope.juevesact+"', viernes='"+$scope.vienesact+"', sabado='"+$scope.sabadoact+"', domingo='"+$scope.domingoact+"', dias='"+$scope.diasactrata.val+"', fecha_ultima_modificacion='"+today+"' WHERE id_tratamiento="+$rootScope.tratamiento_a_editar).then(function (res) {

			   	$cordovaSQLite.execute(db, "SELECT * FROM recordatorio where tratamiento_id="+$rootScope.tratamiento_a_editar).then(function (res) {
				   	if(res.rows.length > 0){
				        for (i = 0; i < res.rows.length; i++){
				        	$cordovaSQLite.execute(db, "DELETE FROM recordatorio where id_recordatorio="+res.rows.item(i).id_recordatorio).then(function (res) {
			        		
				        	},function (err){
				        		console.error(err);
				        	});
				        } 
				    }else{
				    	alert("No results found");
				    }

			    }, function (err) {
			        alert("error");
			        console.error(err);
			    });
			   	var parametros = "http://192.168.1.102:3000/tratamientos/editar?id="+$rootScope.tratamiento_a_editar+"&usuario_id="+$rootScope.id_usuario_verdadero+"&token="+$rootScope.token+"&nombre="+$scope.nombreactrat.val+"&nombre_medico="+$scope.nombreactmedi.val+"&fechatrata="+$scope.fechactrata.val+"&lunes="+$scope.lunesact+"&martes="+$scope.martesact+"&miercoles="+$scope.miercolesact+"&jueves="+$scope.juevesact+"&viernes="+$scope.vienesact+"&sabado="+$scope.sabadoact+"&domingo="+$scope.domingoact+"&dias="+$scope.horasact.val+"&fecha_ultima_modificacion="+today+"&horas="+$scope.horasact.val;
			   	for (i=0; i< $scope.horasact.val ; i++){
					parametros += "&hora"+(i+1)+"="+$scope.horasactarray[i].nombre;
					var query= "INSERT INTO recordatorio (id_recordatorio, hora, tomado, tomado_at, tratamiento_id, fecha_ultima_modificacion, id_verdadero) values (?, ?, ?, ?, ?, ?, ?)";
			        $cordovaSQLite.execute(db, query, [null, $scope.horasactarray[i].nombre, null, null, $rootScope.tratamiento_a_editar,today, null]).then(function(res){
			        	alert(" cree un recordatorio");
				    }, function (err) {
				          console.error(err);
				          alert("Existe un error");
				    });
			    }

			   /*	$http({
			      method: "put",
			      url: parametros
			    }).success(function(res){
			    	alert(res.mensaje);
			    });*/

			    $location.path("/listatratamientos");

		    }, function (err) {
		        alert("error");
		        console.error(err);
		    });
		};

		$scope.listar_recordatorios = function(){
			
			$scope.arreglo_recordatorio = [];
			var nombre_tratamiento = "";
			$cordovaSQLite.execute(db, "select * from tratamiento where usuario_id="+$rootScope.id_usuario_verdadero).then(function(res){
				alert("existen "+res.rows.length+" tratamientos");
				for (i=0;i<res.rows.length;i++){
					
					nombre_tratamiento = res.rows.item(i).nombre;
		        	$cordovaSQLite.execute(db, "select * from recordatorio where tratamiento_id="+res.rows.item(i).id_tratamiento).then(function(res2){
		        		for (j=0;j<res2.rows.length;j++){
		        			if (res2.rows.item(j).tomado!=1)
		        				$scope.arreglo_recordatorio.push({"nombre":nombre_tratamiento, "hora":res2.rows.item(j).hora,"id":res2.rows.item(j).id_recordatorio});
		        		}
				    }, function (err) {
				         // alert("Existe un error");
				    });
	        	}	

	         for (i=0;i<$scope.arreglo_recordatorio.length;i++){
	         	alert($scope.arreglo_recordatorio[i].nombre);
	         }
		    }, function (err) {
		          console.error(err);
		          alert("Existe un error");
		    });

		}

		$scope.verificarcheck = function(id,index){
			$cordovaSQLite.execute(db, "update recordatorio set tomado=1 where id_recordatorio="+id).then(function(res){
		        alert("el tratamiento fue tomado");
		        delete $scope.arreglo_recordatorio[index];
		    }, function (err) {
		         // alert("Existe un error");
		    });
			
		};

		$scope.checkConnection = function(){
          alert($cordovaNetwork.getNetwork());
          alert($cordovaNetwork.isOnline());
          alert($cordovaNetwork.isOffline());
        };

		$scope.busquedabin = function (data, id_item_list_selected){
			var lista = data;
			var indiceABuscar = id_item_list_selected;
			var tamLista = (data.length - 1);
			var posInf = 0, posCentral, posSup = tamLista;
			var contar = 1;

			while(posInf <= posSup){
				posCentral = parseInt( (posSup + posInf)/2 );
				//console.log(‘inter[‘ + contar + ‘] – Posicion central: ‘ + posCentral);
				if (parseInt(lista[posCentral].id_tratamiento) == indiceABuscar) return posCentral;
				else if (indiceABuscar < lista[posCentral].id_tratamiento ) posSup = posCentral - 1; // redefine el limite superior
				else  posInf = posCentral + 1; // redefine el limite inferior
				contar++;
			}

			return -1;
		}
						  

       $scope.sincronizar = function(){
       		//var deferred= $q.defer();
       		$rootScope.urlCalls= [];
       		$rootScope.trats= [];
       		var st="";
        	alert("entre en el sincronizar con "+$rootScope.id_usuario_verdadero+" "+$rootScope.token);
        	//if ($cordovaNetwork.isOnline()) {
			    $http({
			      method: "get",
			      url: "http://192.168.1.102:3000/tratamientos/listar_recordatorio?id_usuario="+$rootScope.id_usuario_verdadero+'&token='+$rootScope.token
			    }).success(function(res){
			    	if ((res[0].nombre!="Vacio") && (res[0].nombre!="Rechazado")){
			    		$cordovaSQLite.execute(db, "SELECT * FROM tratamiento where usuario_id="+$rootScope.id_usuario_verdadero).then(function (res2){
			    			for(i=0; i< res2.rows.length; i++){
			    				alert("voy por el tratamiento "+res2.rows.item(i).nombre);
			    				$cordovaSQLite.execute(db, "SELECT * FROM recordatorio where tratamiento_id="+res2.rows.item(i).id_tratamiento).then(function (resr){
			    					$rootScope.trats.push({"usuario_id":$rootScope.id_usuario_verdadero,"token":$rootScope.token,"nombre":res2.rows.item(i).nombre,"nombre_medico":res2.rows.item(i).nombre_medico,"fecha_trata":res2.rows.item(i).fechatrata,"lunes":res2.rows.item(i).lunes,"martes":res2.rows.item(i).martes,"miercoles":res2.rows.item(i).miercoles,"jueves":res2.rows.item(i).jueves,"viernes":res2.rows.item(i).viernes,"sabado":res2.rows.item(i).sabado,"domingo":res2.rows.item(i).domingo,"dias":res2.rows.item(i).dias});
			    					for (j=0; j< resr.rows.length; j++){
			    						alert("voy por el recordatorio "+resr.rows.item(j).hora);
			    					}
			    				}, function (err) {
								    alert("error");
								    console.error(err);
								});
			    			}
			    		}, function (err) {
					      console.error(err);
					      alert("Existe un error");
					    });
			    	}else{
						alert("No tiene tratamiento o permiso");
					}	
			    });
			//}
        }

        $scope.llamarapi = function(){
        	alert("antes de llamar al for de urls con tamaño "+$rootScope.urlCalls.length);
			for (i=0; i < $rootScope.urlCalls.length; i++){
				alert("Soy la url a la q hay q llamar  " + $rootScope.urlCalls[i].url+" soy el metodo al que hay que llamar "+$rootScope.urlCalls[i].metodo);
			}	
			alert("Despues del for de Urls"); 	
        };


	})




