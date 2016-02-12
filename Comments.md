Generate Facebook Hashkey
"E:\apps\Java\jdk1.7.0_67\bin\keytool.exe" -exportcert -alias miybndMobile -keystore "E:\apps\keystore\miybndMobile" | "E:\Miada\Utility\bin\openssl.exe" sha1 -binary | "E:\Miada\Utility\bin\openssl.exe" base64



Facebook tutorial
https://ionicthemes.com/tutorials/about/native-facebook-login-with-ionic-framework

Phonegap Facebook Plugin

cordova -d plugin add E:\apps\projetos\miybndMobile\phonegap-facebook-plugin --variable APP_ID="162584200776112" --variable APP_NAME="MIYBND - Test1"
