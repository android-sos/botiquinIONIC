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
			    		$cordovaSQLite.execute(db, "SELECT * FROM tratamiento where usuario_id="+$rootScope.id_usuario_verdadero).then(function (res2) {
			    			for(i=0; i< res2.rows.length; i++){
			    				alert("voy por el tratamiento "+res2.rows.item(i).nombre);
								/*st="";
									
								if (res2.rows.item(i).id_verdadero == null){ // EL TRATAMIENTO ES NUEVO
									st= "http://192.168.1.102:3000/tratamientos/crear?usuario_id="+$rootScope.id_usuario_verdadero+"&token="+$rootScope.token+"&nombre="+res2.rows.item(i).nombre+"&nombre_medico="+res2.rows.item(i).nombre_medico+"&fecha_trata="+res2.rows.item(i).fechatrata+"&lunes="+res2.rows.item(i).lunes+"&martes="+res2.rows.item(i).martes+"&miercoles="+res2.rows.item(i).miercoles+"&jueves="+res2.rows.item(i).jueves+"&viernes="+res2.rows.item(i).viernes+"&sabado="+res2.rows.item(i).sabado+"&domingo="+res2.rows.item(i).domingo+"&dias="+res2.rows.item(i).dias+"&horas=";*/
									$rootScope.trats.push({"usuario_id":$rootScope.id_usuario_verdadero,"token":$rootScope.token,"nombre":res2.rows.item(i).nombre,"nombre_medico":res2.rows.item(i).nombre_medico,"fecha_trata":res2.rows.item(i).fechatrata,"lunes":res2.rows.item(i).lunes,"martes":res2.rows.item(i).martes,"miercoles":res2.rows.item(i).miercoles,"jueves":res2.rows.item(i).jueves,"viernes":res2.rows.item(i).viernes,"sabado":res2.rows.item(i).sabado,"domingo":res2.rows.item(i).domingo,"dias":res2.rows.item(i).dias});
									$cordovaSQLite.execute(db, "SELECT * FROM recordatorio where tratamiento_id="+res2.rows.item(i).id_tratamiento).then(function (resr){
										//st += resr.rows.length;
								    	for (j=0; j< resr.rows.length; j++){ 
								    		alert("voy por el recordatorio "+resr.rows.item(j).hora);

								    		
								    		//st += "&hora"+(j+1)+"="+resr.rows.item(j).hora;
								    	}
								    //alert("voy a agregar al arreglo un tratamiento a crear");
								    //$rootScope.urlCalls.push({"url": st, "metodo":"post"});
									}, function (err) {
								        alert("error");
								        console.error(err);
								    });
								/*	
								}else{
									st="";
									alert("Soy el tratamiento a actualizar o borrado");
									var today= new Date();
									var dd = today.getDate();
									var mm = parseInt(today.getMonth())+1;
									var yyyy = today.getFullYear();
									if(dd<10) dd='0'+dd
									if(mm<10) mm='0'+mm
									today = (yyyy+'-'+mm+'-'+dd).toString();
									posicion= $scope.busquedabin(res,res2.rows.item(i).id_verdadero);

									$cordovaSQLite.execute(db, "SELECT * FROM recordatorio where tratamiento_id="+res2.rows.item(i).id_tratamiento).then(function (resr){
										
										if (res2.rows.item(i).borrado==1){ // EL TRATAMIENTO ESTA BORRADO
											var parametros = "http://192.168.1.102:3000/eliminar?id="+res2.rows.item(i).id_verdadero+"&id_usuario="+$rootScope.id_usuario_verdadero+"&token="+$rootScope.token;
										   $scope.urlCalls.push({"url": parametros,"metodo":"put"});
										   
										}else{ // HAY QUE VERIFICAR SI EL TRATAMIENTO CAMBIO 
											if (posicion!=-1){
												if (res[posicion].fecha_ultima_modificacion != res2.rows.item(i).fecha_ultima_modificacion){
													st= "http://192.168.1.102:3000/tratamientos/editar?id="+res.rows.item(i).id_verdadero+"usuario_id="+$rootScope.id_usuario_verdadero+"&token="+$rootScope.token+"&nombre="+res2.rows.item(i).nombre+"&nombre_medico="+res2.rows.item(i).nombre_medico+"&fecha_trata="+res2.rows.item(i).fecha_ultima_modificacion+"&lunes="+res2.rows.item(i).lunes+"&martes="+res2.rows.item(i).martes+"&miercoles="+res2.rows.item(i).miercoles+"&jueves="+res2.rows.item(i).jueves+"&viernes="+res2.rows.item(i).viernes+"&sabado="+res2.rows.item(i).sabado+"&domingo="+res2.rows.item(i).domingo+"&dias="+res2.rows.item(i).dias+"&fecha_ultima_modificacion="+res2.rows.item(i).fecha_ultima_modificacion+"&borrado="+res2.rows.item(i).borrado+"&horas=";
													st += resr.rows.length;
											    	for (i=0; i< resr.rows.length; i++){
											    	 st += "&hora"+(i+1)+"="+resr.rows.item(i).hora;
											    	}
													$rootScope.urlCalls.push({"url":st,"metodo":"put"});
													//alert( urlCalls[urlCalls.length-1] );
												} 
											}
										}

										for(k=0;k<resr.length; k++){
											if (resr.rows.item(k).tomado==1){
												$scope.urlCalls.push({"url":"http://192.168.1.102:3000/tratamientos/tomar_tratamiento?id_usuario="+$rootScope.id_usuario_verdadero+"&token="+$rootScope.token+"&id_recordatorio="+resr.rows.item(k).id_recordatorio, "metodo": "put"});
											}
										}

									}, function (err) {
								        alert("error");
								        console.error(err);
								    });
								    	if (res2.rows.item(i).borrado==1){ // EL TRATAMIENTO ESTA BORRADO
											var parametros = "http://192.168.1.102:3000/eliminar?id="+res2.rows.item(i).id_verdadero+"&id_usuario="+$rootScope.id_usuario_verdadero+"&token="+$rootScope.token;
										   $rootScope.urlCalls.push({"url": parametros,"metodo":"put"});
										   
										}else{ // HAY QUE VERIFICAR SI EL TRATAMIENTO CAMBIO 
											if (posicion!=-1){
												if (res[posicion].fecha_ultima_modificacion != res2.rows.item(i).fecha_ultima_modificacion){
													st= "http://192.168.1.102:3000/tratamientos/editar?id="+res.rows.item(i).id_verdadero+"usuario_id="+$rootScope.id_usuario_verdadero+"&token="+$rootScope.token+"&nombre="+res2.rows.item(i).nombre+"&nombre_medico="+res2.rows.item(i).nombre_medico+"&fecha_trata="+res2.rows.item(i).fecha_ultima_modificacion+"&lunes="+res2.rows.item(i).lunes+"&martes="+res2.rows.item(i).martes+"&miercoles="+res2.rows.item(i).miercoles+"&jueves="+res2.rows.item(i).jueves+"&viernes="+res2.rows.item(i).viernes+"&sabado="+res2.rows.item(i).sabado+"&domingo="+res2.rows.item(i).domingo+"&dias="+res2.rows.item(i).dias+"&fecha_ultima_modificacion="+res2.rows.item(i).fecha_ultima_modificacion+"&borrado="+res2.rows.item(i).borrado+"&horas=";
													st += resr.rows.length;
											    	for (i=0; i< resr.rows.length; i++){ st += "&hora"+(i+1)+"="+resr.rows.item(i).hora;}
													$rootScope.urlCalls.push({"url":st,"metodo":"put"});
													//alert( urlCalls[urlCalls.length-1] );
												} 
											}	

										}

								}
			    			}
			    			alert('Antes de llamar al api'); 
							setTimeout((function() {
							    $scope.llamarapi();
							}),1500);*/
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