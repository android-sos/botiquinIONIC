
angular.module('starter')

	.controller("principalController",function($scope, $cordovaSQLite, $http, $location, $ionicSideMenuDelegate, $rootScope,$ionicModal, $q){
		$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

		Object.toparams = function ObjecttoParams(obj) {
	        var p = [];
	        for (var key in obj) p.push(key + '=' + encodeURIComponent(obj[key]));
	        return p.join('&');
	    };

	    //modal
	    $ionicModal.fromTemplateUrl('templates/modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() { $scope.modal.show(); };
        $scope.closeModal = function() { $scope.modal.hide(); };

	    $scope.mensajeErrorCorreo = "";

		$scope.registrarUsuario = function (){
			$http({
		      method: "post",
		      url: "http://192.168.1.102:3000/usuarios/crear",
		      data: Object.toparams({'nombre':$scope.nombreregistrar,'correo':$scope.correoregistrar, 'clave': $scope.claveregistrar, 'fechanac': 'nil'})
		    }).success(function(res){
		    	if (res.nombre == "Correo existente") $scope.mensajeErrorCorreo = "El correo ya existe";
		    	else{ 
		    		$scope.mensajeModal = "El usuario fue creado exitosamente, por favor inicie sesión"
					$scope.openModal();
		    		$location.path("/");
		    	}
		    });
	    }

	    insertarTratamientos = function (tratamiento){
	    	var query = "INSERT INTO tratamiento (id_tratamiento, nombre, nombre_medico, fechatrata, usuario_id, lunes, martes, miercoles, jueves, viernes, sabado, domingo, dias, contador, contado_at, fecha_ultima_modificacion, id_verdadero, borrado) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		    return $cordovaSQLite.execute(db, query, [null, tratamiento.nombre, tratamiento.nombre_medico, tratamiento.fechatrata, $rootScope.id_usuario_verdadero, tratamiento.lunes, tratamiento.martes, tratamiento.miercoles, tratamiento.jueves, tratamiento.viernes, tratamiento.sabado, tratamiento.domingo, tratamiento.dias, tratamiento.contador, tratamiento.contado_at, tratamiento.fecha_ultima_modificacion, tratamiento.id_tratamiento, tratamiento.borrado]).then(function (rest){
		    	for (j=0; j< tratamiento.recordatorios.length; j++){
		    		$rootScope.queries2.push(insertarRecordatorios(tratamiento.recordatorios[j],rest.insertId));
				}
				$q.all($rootScope.queries2).then( function (result){
				}, function(error) {
				}); 
		    }, function (err) {
		      console.error(err);
		      return err
		    });
	    }

	    insertarRecordatorios = function (recordatorio, id_tratamiento){
	    	var query= "INSERT INTO recordatorio (id_recordatorio, hora, tomado, tomado_at, tratamiento_id, fecha_ultima_modificacion, id_verdadero, borrado) values (?, ?, ?, ?, ?, ?, ?, ?)";
	        return $cordovaSQLite.execute(db, query, [null, recordatorio.hora, recordatorio.tomado, recordatorio.tomado_at, id_tratamiento, recordatorio.fecha_ultima_modificacion, recordatorio.id_recordatorio, recordatorio.borrado]).then(function (res){
	        }, function (err) {
	          console.error(err);
	          return err;
	        });
	    }

		$scope.iniciarSesion = function (){
		    myobject = {'correo':$scope.correoinicio,'clave':$scope.claveinicio};
		    $http({
		      method: "post",
		      url: "http://192.168.1.102:3000/usuarios/autenticar",
		      data: Object.toparams(myobject)
		    }).success(function(res){
		      if (res.nombre!="Error en los datos"){
		      	$rootScope.token = res.token;
		        $rootScope.id_usuario_verdadero = res.id_usuario;
		        var query = "INSERT INTO usuario (id, clave, token, correo, id_verdadero) values (?, ?, ?, ?, ?)";
		        var query2 = "";
		        $rootScope.queries2 = [];
		        $rootScope.queriest = [];
		        $cordovaSQLite.execute(db, query, [null, res.clave, res.token, res.correo, res.id_usuario]).then(function(res){
		        	$http({
				      method: "get",
				      url: "http://192.168.1.102:3000/tratamientos/listar_recordatorio?id_usuario="+$rootScope.id_usuario_verdadero+'&token='+$rootScope.token
				    }).success(function(res){
				    	if ((res[0].nombre!="Vacio") && (res[0].nombre!="Rechazado")){
				    		for (i=0; i< res.length; i++){
				    			$rootScope.queriest.push(insertarTratamientos(res[i]));
				    		}
			    			$q.all($rootScope.queriest).then( function (result){
							}, function(error) {
								$scope.mensajeModal = "Existe un error, por favor intentelo nuevamente"
								$scope.openModal();
							}); 	 	
				    	}else{
							$scope.mensajeModal = "Existe un error, por favor intentelo nuevamente"
							$scope.openModal();
						}	
				    });
			    	$scope.correoinicio = $scope.claveinicio = "";
		        	$location.path("/menu/principal");
		        }, function (err) {
		          console.error(err);
		          //COlocar el mensaje con el popup
		        });
		      }else{
		       	$scope.mensajeModal = "Existe un error con sus datos, por favor intentelo nuevamente"
				$scope.openModal();
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
		    	if(res.mensaje=="Correo no existente")
		    		$scope.mensajeErrorCorreo = "Correo no existente"
		    	else{
		    		$scope.mensajeErrorCorreo = $scope.correocontrasena ="";
		    		$scope.mensajeModal = "La nueva contraseña fue enviada a su correo"
					$scope.openModal();
					$location.path("/");
		    	}
		    });
		  };

		  /********* IONIC *********************/
		  $scope.toggleLeft = function() {
		    $ionicSideMenuDelegate.toggleLeft();
		  };
	})

	.controller("tratamientoController",function($scope, $cordovaNetwork, $cordovaSQLite, $http, $location, $ionicSideMenuDelegate, $rootScope, $ionicActionSheet, $ionicModal, $q){
		$scope.lunescreart = $scope.martescreart = $scope.miercolescreart = $scope.juevescreart = $scope.viernescreart = $scope.sabadocreart = $scope.domingocreart = false;
		$scope.tratamientoslistar = [];

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

	  	 //modal
	    $ionicModal.fromTemplateUrl('templates/modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() { $scope.modal.show(); };
        $scope.closeModal = function() { $scope.modal.hide(); };

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
			var st= "http://192.168.0.106:3000/tratamientos/crear?usuario_id="+$rootScope.id_usuario_verdadero+"&token="+$rootScope.token+"&nombre="+$scope.nombrecreart+"&nombre_medico="+$scope.nombremedicocreart+"&fecha_trata="+trata+"&lunes="+$scope.lunescreart+"&martes="+$scope.martescreart+"&miercoles="+$scope.miercolescreart+"&jueves="+$scope.juevescreart+"&viernes="+$scope.viernescreart+"&sabado="+$scope.sabadocreart+"&domingo="+$scope.domingocreart+"&dias="+$scope.diascreart+"&horas="+$scope.horascreart;
			for (i=0;i<$scope.horascreart;i++){
				st= st + "&hora"+(i+1)+"=";
				st= st+$scope.horasinput[i].nombre;
			}
			var query = "INSERT INTO tratamiento (id_tratamiento, nombre, nombre_medico, fechatrata, usuario_id, lunes, martes, miercoles, jueves, viernes, sabado, domingo, dias, contador, contado_at, fecha_ultima_modificacion, id_verdadero,borrado) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
		    $cordovaSQLite.execute(db, query, [null, $scope.nombrecreart, $scope.nombremedicocreart, trata, $rootScope.id_usuario_verdadero, $scope.lunescreart, $scope.martescreart, $scope.miercolescreart, $scope.juevescreart, $scope.viernescreart, $scope.sabadocreart, $scope.domingocreart, $scope.diascreart, null, null, null, null,0]).then(function (res){
		    	for (i=0; i< $scope.horascreart; i++){
		    		var hora= $scope.horasinput[i].nombre.toString().split(" ");
					var query= "INSERT INTO recordatorio (id_recordatorio, hora, tomado, tomado_at, tratamiento_id, fecha_ultima_modificacion, id_verdadero) values (?, ?, ?, ?, ?, ?, ?)";
			        $cordovaSQLite.execute(db, query, [null, hora[4], null, null, res.insertId, null, null]).then(function(res){
			        
			        }, function (err) {
			          console.error(err);
			          alert("Existe un error");
			        });
				}

		    }, function (err) {
		      console.error(err);
		      alert("Existe un error");
		    });

		    
		    $scope.nombrecreart = $scope.nombremedicocreart = $scope.lunescreart= $scope.martescreart = $scope.miercolescreart=$scope.juevescreart = $scope.viernescreart = $scope.sabadocreart = $scope.domingocreart = $scope.diascreart = "";

		    
			$scope.mensajeModal = "El tratamiento ha sido creado exitosamente";
			$scope.openModal();
		    
		    $location.path("/menu/principal");

		};

		$scope.llenar_arreglo = function (){			
			$scope.horasinput = [];
			for (i=0;i<$scope.horascreart;i++)
				$scope.horasinput.push({"nombre": "hora"+i});
		};

		
		$scope.cerrar_sesion = function (){ 
			$cordovaSQLite.execute(db, "DELETE FROM usuario").then(function (res) {
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
        	$scope.mensajeModal = "Ha cerrado sesion exitosamente";
			$scope.openModal();
			$location.path("/home"); 
		};

		$scope.cambiarClave= function(){
			if ($scope.clavenueva == $scope.clavenueva2){
				$http({
			      method: "post",
			      url: "http://192.168.1.102:3000/usuarios/cambiar_clave",
			      data: Object.toparams({'id':$rootScope.id_usuario_verdadero,'token':$rootScope.token, 'claveact': $scope.claveactualc, 'clavenueva': $scope.clavenueva})
			    }).success(function(res){
			    	if (res.mensaje == "Clave no coincide"){
			    		$scope.ErrorclaveActual = "La clave no coincide con su clave actual";
			    	}else{
			    		$scope.ErrorclaveActual ="";
			    		if (res.mensaje == "Rechazado"){
			    			$scope.mensajeModal = "Ha ocurrido un error, porfavor intentelo nuevamente";
							$scope.openModal();
			    		}else{
			    			$scope.mensajeErrorCorreo = $scope.claveactualc = $scope.clavenueva = $scope.clavenueva2 ="";
			    			$scope.mensajeModal = "La contraseña fue cambiada exitosamente";
							$scope.openModal();
			    			$location.path("/menu/principal");
			    		}
			    	}
			    	
			    });
			}
			
		};

		$scope.verificarClave = function (){
			if ($scope.clavenueva != $scope.clavenueva2)
				$scope.mensajeErrorClave = "Las claves no coinciden";
			else
				$scope.mensajeErrorClave = "";
		};

		$scope.listarUsuario = function (){
		 	$cordovaSQLite.execute(db, "SELECT * FROM usuario").then(function (res) {
			   	$scope.correoeditar = {"val": res.rows.item(0).correo.toString()};
		    }, function (err) {
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
			    	if(res.mensaje=="Correo existente"){
			    		$scope.mensajeErrorCorreo = "Correo existente";
			    	}else{
			    		if (res.mensaje =="Datos no actualizados"){
			    			$scope.mensajeModal = "Ha ocurrido un error, por favor intentelo nuevamente";
							$scope.openModal();
			    		}else{
			    			$scope.mensajeErrorCorreo = $scope.correoeditar.val ="";
			    			$scope.mensajeModal = "Los datos han sido actualizados exitosamente";
							$scope.openModal();
							$location.path("/menu/principal");
			    		}
			    	}
			    	
			    });
			}, function (err){
				alert("error");
			});

		};

		$scope.listarTratamientos = function(){
		 	$scope.tratamientoslistar =[];
		 	$cordovaSQLite.execute(db, "SELECT * FROM tratamiento").then(function (res) {
			   	if(res.rows.length > 0){
			        for (i = 0; i < res.rows.length; i++){
			        	if (res.rows.item(i).borrado==0  || res.rows.item(i).borrado=="false")
			        		$scope.tratamientoslistar.push({"nombre": res.rows.item(i).nombre, "id": res.rows.item(i).id_tratamiento});
			        } 
			    }else{
			    	alert("No results found");
			    }

		    }, function (err) {
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
					        		$scope.mensajeModal = "El tratamiento ha sido borrado exitosamente";
									$scope.openModal();
						        	},function (err){
						        		console.error(err);
						        	});
						        } 
						    }

					    }, function (err) {
					        alert("error");
					        console.error(err);
					    });
				    }, function (err) {
				        alert("error");
				        console.error(err);
				    });
					$scope.tratamientoslistar.splice(posicion, 1 );
					return true;
				}
			});
		};

		$scope.llenar_arreglo_act = function(){
			$scope.horasactarray = [];
			for (i=0;i<$scope.horasact.val;i++)
				$scope.horasactarray.push({"nombre": "hora"+i});
		};

		$scope.llenarformedit= function(){
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

			    for (i=0; i< $scope.horasactarray.length ; i++){
        			var horas = $scope.horasactarray[i].nombre.toString().split(" ");
					var query= "INSERT INTO recordatorio (id_recordatorio, hora, tomado, tomado_at, tratamiento_id, fecha_ultima_modificacion, id_verdadero) values (?, ?, ?, ?, ?, ?, ?)";
			        $cordovaSQLite.execute(db, query, [null,horas[4] , null, null, $rootScope.tratamiento_a_editar,today, null]).then(function(res){
				    }, function (err) {
				          console.error(err);
				    });
			    }
			   	
			    $scope.mensajeModal = "El tratamiento ha sido editado exitosamente";
				$scope.openModal();

			    $location.path("/listatratamientos");

		    }, function (err) {
		        alert("error");
		        console.error(err);
		    });
		};

		obternerRecordatorios2 = function (id_tratamiento,nombretrata) {
			return $cordovaSQLite.execute(db,"SELECT * FROM recordatorio where tratamiento_id="+id_tratamiento).then(function (resr) {
				for (j=0; j < resr.rows.length; j++){
					if (resr.rows.item(j).borrado!="true" && resr.rows.item(j).borrado!="1" && resr.rows.item(j).tomado!="true" && resr.rows.item(j).tomado!="1")
						$rootScope.arreglo_recordatorio.push({"nombre_tratamiento": nombretrata,"id_recordatorio":resr.rows.item(j).id_recordatorio, "hora":resr.rows.item(j).hora, "tratamiento_id":id_tratamiento, "tomado": resr.rows.item(j).tomado, "id_verdadero": resr.rows.item(j).id_verdadero, "borrado": resr.rows.item(j).borrado });
				}
			}, function (error) {
				return error;
			});
		}

		$scope.listar_recordatorios = function(){
			$rootScope.querieslistar= [];
			$rootScope.arreglo_recordatorio = [];
			var nombre_tratamiento = "";
			$cordovaSQLite.execute(db, "SELECT * FROM tratamiento where usuario_id="+$rootScope.id_usuario_verdadero).then(function (res2){
				for(i=0; i< res2.rows.length; i++){
					$rootScope.querieslistar.push(obternerRecordatorios2(res2.rows.item(i).id_tratamiento,res2.rows.item(i).nombre));
				}
				$q.all($rootScope.querieslistar).then( function (result){
			    }, function (err) {
			         // alert("Existe un error");
			    });	
		    }, function (err) {
		          console.error(err);
		          
		    });

		    $scope.sincronizar();

		};

		$scope.verificarcheck = function(id,index){
			var today= new Date();
			var dd = today.getDate();
			var mm = parseInt(today.getMonth())+1;
			var yyyy = today.getFullYear();
			if(dd<10) dd='0'+dd
			if(mm<10) mm='0'+mm
			today = (yyyy+'-'+mm+'-'+dd).toString();
			$cordovaSQLite.execute(db, "update recordatorio set tomado=1 where id_recordatorio="+id).then(function(res){
		        delete $rootScope.arreglo_recordatorio[index];
		        $scope.mensajeModal = "El tratamiento ha sido tomado exitosamente";
				$scope.openModal();
		    }, function (err) {
		         // alert("Existe un error");
		    });
			$cordovaSQLite.execute(db,"SELECT * FROM recordatorio where id_recordatorio="+id).then(function (res2){
				id_tratamiento= res2.rows.item(0).tratamiento_id;
	        	$cordovaSQLite.execute(db, "UPDATE tratamiento set fecha_ultima_modificacion='"+today+"' where id_tratamiento="+id_tratamiento).then(function (rest){
	        	}, function (err){

	        	});
	        }, function (err){
	        	//alert("Existe un error");
	        });
		};

		$scope.checkConnection = function(){
          alert($cordovaNetwork.getNetwork());
          alert($cordovaNetwork.isOnline());
          alert($cordovaNetwork.isOffline());
        };

        insertarIdTratamiento = function (id_verdadero, id_tratamiento){
			return $cordovaSQLite.execute(db,"UPDATE tratamiento set id_verdadero="+id_verdadero+" where id_tratamiento="+id_tratamiento).then(function (res){
			}, function (err){
				return err;
			});
		}

		obternerRecordatorios = function (id_tratamiento) {
			return $cordovaSQLite.execute(db,"SELECT * FROM recordatorio where tratamiento_id="+id_tratamiento).then(function (resr) {
				for (j=0; j < resr.rows.length; j++){
					$rootScope.recs.push({"id_recordatorio":resr.rows.item(j).id_recordatorio, "hora":resr.rows.item(j).hora, "tratamiento_id":id_tratamiento, "tomado": resr.rows.item(j).tomado, "id_verdadero": resr.rows.item(j).id_verdadero, "borrado": resr.rows.item(j).borrado });
				}
			}, function (error) {
				return error;
			});
		}


		$scope.busquedabin2 = function (data, id_item_list_selected){
			var arreglo= [];
			indiceABuscar= id_item_list_selected;
			for(i=0;i<data.length;i++){
				if (parseInt(data[i].tratamiento_id) == indiceABuscar){ 
					arreglo.push(i);
				}
			}
			return arreglo;
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
       		for (i=0;i<$scope.horascreart;i++){
				$scope.horasinput[i].nombre = "";
			}
			$scope.horascreart = "";
       		$rootScope.queries= [];
       		$rootScope.trats= [];
       		$rootScope.recs= [];
       		$rootScope.queries2= [];
       		$rootScope.queriesact= [];
       		$scope.rt= [];
       		var id_trat;
       		var st="";
       		$rootScope.urlCalls= [];
        	//if ($cordovaNetwork.isOnline()) {
			    $http({
			      method: "get",
			      url: "http://192.168.1.102:3000/tratamientos/listar_recordatorio?id_usuario="+$rootScope.id_usuario_verdadero+'&token='+$rootScope.token
			    }).success(function (res){
			    	if (res[0].nombre!="Rechazado"){
			    		$cordovaSQLite.execute(db, "SELECT * FROM tratamiento where usuario_id="+$rootScope.id_usuario_verdadero).then(function (res2){
			    			for(i=0; i< res2.rows.length; i++){
			    				$rootScope.trats.push({"id_tratamiento": res2.rows.item(i).id_tratamiento,"usuario_id":$rootScope.id_usuario_verdadero,"token":$rootScope.token,"nombre":res2.rows.item(i).nombre,"nombre_medico":res2.rows.item(i).nombre_medico,"fechatrata":res2.rows.item(i).fechatrata,"lunes":res2.rows.item(i).lunes,"martes":res2.rows.item(i).martes,"miercoles":res2.rows.item(i).miercoles,"jueves":res2.rows.item(i).jueves,"viernes":res2.rows.item(i).viernes,"sabado":res2.rows.item(i).sabado,"domingo":res2.rows.item(i).domingo,"dias":res2.rows.item(i).dias, "fecha_ultima_modificacion": res2.rows.item(i).fecha_ultima_modificacion, "id_verdadero": res2.rows.item(i).id_verdadero, "borrado": res2.rows.item(i).borrado});
			    				$rootScope.queries.push(obternerRecordatorios(res2.rows.item(i).id_tratamiento));
			    			}
			    			$q.all($rootScope.queries).then( function (result){
			    				var st="";
			    				var today= new Date();
								var dd = today.getDate();
								var mm = parseInt(today.getMonth())+1;
								var yyyy = today.getFullYear();
								if(dd<10) dd='0'+dd
								if(mm<10) mm='0'+mm
								today = (yyyy+'-'+mm+'-'+dd).toString();
								var posiciones= [];
								var posicion;
								for (j=0; j < $rootScope.trats.length; j++){
									st="";
									posicion= $scope.busquedabin(res,$rootScope.trats[j].id_verdadero);
									posiciones = $scope.busquedabin2($rootScope.recs,$rootScope.trats[j].id_tratamiento);
									var fecha_ultima_modificacion= $rootScope.trats[j].fecha_ultima_modificacion;
									if ($rootScope.trats[j].id_verdadero == null){ // EL TRATAMIENTO ES NUEVO
										st= "http://192.168.1.102:3000/tratamientos/crear?usuario_id="+$rootScope.id_usuario_verdadero+"&token="+$rootScope.token+"&nombre="+$rootScope.trats[j].nombre+"&nombre_medico="+$rootScope.trats[j].nombre_medico+"&fecha_trata="+$rootScope.trats[j].fechatrata+"&lunes="+$rootScope.trats[j].lunes+"&martes="+$rootScope.trats[j].martes+"&miercoles="+$rootScope.trats[j].miercoles+"&jueves="+$rootScope.trats[j].jueves+"&viernes="+$rootScope.trats[j].viernes+"&sabado="+$rootScope.trats[j].sabado+"&domingo="+$rootScope.trats[j].domingo+"&dias="+$rootScope.trats[j].dias+"&id_local="+$rootScope.trats[j].id_tratamiento+"&horas="+posiciones.length;
										for(k=0; k < posiciones.length; k++){
											st += "&hora"+(k+1)+"="+$rootScope.recs[posiciones[k]].hora;
										}
										$rootScope.urlCalls.push($http.post(st, {})
											.success( function (data){
												$rootScope.queriesact.push(insertarIdTratamiento(data.id_tratamiento,data.id_local));
											})
										); //Coloco en el arreglo la peticion del crear
									}else{
										if ($rootScope.trats[j].borrado==1){ // EL TRATAMIENTO ESTA BORRADO
											st = "http://192.168.1.102:3000/tratamientos/eliminar?id="+$rootScope.trats[j].id_verdadero+"&id_usuario="+$rootScope.id_usuario_verdadero+"&token="+$rootScope.token;
										   	$rootScope.urlCalls.push($http.put(st, {})); 
										}else{ //Hay que verificar si el tratamiento cambió
											if (res[posicion].fecha_ultima_modificacion != fecha_ultima_modificacion){
												st= "http://192.168.1.102:3000/tratamientos/editar?id="+$rootScope.trats[j].id_verdadero+"&usuario_id="+$rootScope.id_usuario_verdadero+"&token="+$rootScope.token+"&nombre="+$rootScope.trats[j].nombre+"&nombre_medico="+$rootScope.trats[j].nombre_medico+"&fecha_trata="+$rootScope.trats[j].fechatrata+"&lunes="+$rootScope.trats[j].lunes+"&martes="+$rootScope.trats[j].martes+"&miercoles="+$rootScope.trats[j].miercoles+"&jueves="+$rootScope.trats[j].jueves+"&viernes="+$rootScope.trats[j].viernes+"&sabado="+$rootScope.trats[j].sabado+"&domingo="+$rootScope.trats[j].domingo+"&dias="+$rootScope.trats[j].dias+"&fecha_ultima_modificacion="+$rootScope.trats[j].fecha_ultima_modificacion+"&borrado="+$rootScope.trats[j].borrado+"&horas="+posiciones.length;
										    	for(k=0; k < posiciones.length; k++){
													st += "&hora"+(k+1)+"="+$rootScope.recs[posiciones[k]].hora+"&tomado"+(k+1)+"="+$rootScope.recs[posiciones[k]].tomado;
												}
												$rootScope.urlCalls.push($http.put(st, {}));
											}
										}
									}
								}	
								$q.all($rootScope.urlCalls).then(function (result){
									$q.all($rootScope.queriesact).then(function (result){
									}, function (err){
									});
								}, function (err){
								});
							}, function(error) {
								$scope.mensajeModal = "Disculpe, ha ocurrido un error, intentelo nuevamente";
								$scope.openModal();
							}); 	 	
			    		}, function (err) {
					      console.error(err);
					      	$scope.mensajeModal = "Disculpe, ha ocurrido un error, intentelo nuevamente";
							$scope.openModal();
					    });
			    	}else{
						$scope.mensajeModal = "Disculpe, ha ocurrido un error, intentelo nuevamente";
						$scope.openModal();
					}	
			    });
			//}
        }


	})




