set JAVA_HOME=%CD%\tools\jdk-21.0.2
set ANDROID_HOME=%CD%\tools\android-sdk
set PATH=%JAVA_HOME%\bin;%PATH%

echo y | tools\android-sdk\cmdline-tools\latest\bin\sdkmanager.bat --licenses
call tools\android-sdk\cmdline-tools\latest\bin\sdkmanager.bat "platform-tools" "platforms;android-34" "build-tools;34.0.0"

cd android
call gradlew.bat assembleDebug
cd ..

copy android\app\build\outputs\apk\debug\app-debug.apk JanAushadhi-Finder.apk
