package expo.modules.installedapps

import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise

class InstalledAppsModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module.
    // The module will be accessible from `requireNativeModule('InstalledApps')` in JavaScript.
    Name("InstalledApps")

    // Implementação da função assíncrona getInstalledApps
    AsyncFunction("getInstalledApps") { promise: Promise ->
      try {
        android.util.Log.d("InstalledAppsModule", "Iniciando getInstalledApps")
        
        // Acessando o PackageManager do contexto do aplicativo
        val packageManager = appContext.currentActivity?.packageManager
        
        if (packageManager == null) {
          promise.reject("ERROR_NO_PACKAGE_MANAGER", "Não foi possível acessar o PackageManager", null)
          return@AsyncFunction
        }
        
        // Obtendo a lista de aplicativos instalados
        val installedApps = packageManager.getInstalledApplications(PackageManager.GET_META_DATA)
        
        android.util.Log.d("InstalledAppsModule", "Total de apps encontrados: ${installedApps.size}")
        
        // Filtrar apenas aplicativos não-sistema (instalados pelo usuário)
        val userApps = installedApps.filter { app ->
          (app.flags and ApplicationInfo.FLAG_SYSTEM) == 0
        }
        
        android.util.Log.d("InstalledAppsModule", "Apps de usuário filtrados: ${userApps.size}")
        
        // Mapear os aplicativos para o formato esperado pelo JavaScript
        val result = userApps.map { appInfo ->
          val packageName = appInfo.packageName
          val appName = packageManager.getApplicationLabel(appInfo).toString()
          
          // Obter a versão do aplicativo, se disponível
          val versionName = try {
            packageManager.getPackageInfo(packageName, 0).versionName ?: "Desconhecido"
          } catch (e: Exception) {
            "Desconhecido"
          }
          
          android.util.Log.d("InstalledAppsModule", "App processado: $appName ($packageName)")
          
          // Criar objeto com as informações do aplicativo
          mapOf(
            "packageName" to packageName,
            "appName" to appName,
            "versionName" to versionName
          )
        }
        
        android.util.Log.d("InstalledAppsModule", "Retornando ${result.size} apps")
        
        // Retornar a lista de aplicativos para o JavaScript
        promise.resolve(result)
      } catch (e: Exception) {
        android.util.Log.e("InstalledAppsModule", "Erro ao carregar aplicativos", e)
        promise.reject("ERROR_LOADING_APPS", "Erro ao carregar aplicativos: ${e.message}", e)
      }
    }
  }
}
