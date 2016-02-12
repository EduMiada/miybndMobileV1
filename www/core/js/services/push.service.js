//factory for processing push notifications.
angular.module('miybndMobile.services')
   .factory('PushProcessingService', function(User) {
        
        function onDeviceReady() {
            console.info('NOTIFY  Device is ready.  Registering with GCM server');
            //register with google GCM server
            var pushNotification = window.plugins.pushNotification;
            pushNotification.register(gcmSuccessHandler, gcmErrorHandler, {'senderID':'543966572181','ecb':'onNotificationGCM'});
        }
        function gcmSuccessHandler(result) {
            console.info('NOTIFY  pushNotification.register succeeded.  Result = '+result)
        //    alert('notify sucess' + result);
        }
        function gcmErrorHandler(error) {
            console.error('NOTIFY  '+error);
          //  alert('notify error' + error);
        }
        return {
            initialize : function () {
              //  alert('initialize');
               // console.log('NOTIFY  initializing');
                //var pushNotification = window.plugins.pushNotification;
                //pushNotification.register(gcmSuccessHandler, gcmErrorHandler, {'senderID':'miybnd','ecb':'onNotificationGCM'});
                
                //alert(pushNotification);
                document.addEventListener('deviceready', onDeviceReady, false);
            },
            registerID : function (id) {
                //Insert code here to store the user's ID on your notification server.
                //You'll probably have a web service (wrapped in an Angular service of course) set up for this.
                //For example:
                User.setPushDeviceID(id);
               // alert('this is my ID:' + id);
                
                
                //MyService.registerNotificationID(id).then(function(response){
                //    if (response.data.Result) {
                //        console.info('NOTIFY  Registration succeeded');
                //    } else {
                //        console.error('NOTIFY  Registration failed');
                //    }
                //});
            },
            //unregister can be called from a settings area.
            unregister : function () {
                console.info('unregister')
                var push = window.plugins.pushNotification;
                if (push) {
                    push.unregister(function () {
                        console.info('unregister success')
                    });
                }
            } 
        }

 
 
});

 
onNotificationGCM = function(e){
              //  alert('onGCM index: ' + e.event);
                switch( e.event )
                {
                    case 'registered':
                        if ( e.regid.length > 0 )
                        {
                           //call back to web service in Angular
                                var elem = angular.element(document.querySelector('[ng-app]'));
                                var injector = elem.injector();
                                var myService = injector.get('PushProcessingService');
                                myService.registerID(e.regid);
                        }
                    break;

                    case 'message':
                      // this is the actual push notification. its format depends on the data model from the push server
                      alert('message = '+e.message+' msgcnt = '+e.msgcnt);
                    break;

                    case 'error':
                      alert('GCM error = '+e.msg);
                    break;

                    default:
                      alert('An unknown GCM event has occurred');
                      break;
                }
            }     