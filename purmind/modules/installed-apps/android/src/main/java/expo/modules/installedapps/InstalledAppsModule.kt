package expo.modules.installedapps

import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import java.io.ByteArrayOutputStream

class InstalledAppsModule : Module() {
  // Função auxiliar para verificar se um aplicativo deve ser incluído
  private fun shouldIncludeApp(appInfo: ApplicationInfo, packageManager: PackageManager): Boolean {
    try {
      // Verificar se o app pode ser iniciado (tem uma activity principal)
      val intent = packageManager.getLaunchIntentForPackage(appInfo.packageName)
      
      // Incluir o app se:
      // 1. Não é um app de sistema OU é um app de sistema atualizável (como YouTube, Chrome, etc)
      // 2. Pode ser iniciado (tem uma activity principal)
      // 3. Não é o próprio app
      return (
        ((appInfo.flags and ApplicationInfo.FLAG_SYSTEM) == 0 || 
         (appInfo.flags and ApplicationInfo.FLAG_UPDATED_SYSTEM_APP) != 0) &&
        intent != null &&
        appInfo.packageName != appContext.currentActivity?.packageName
      )
    } catch (e: Exception) {
      return false
    }
  }

  // Função auxiliar para converter Drawable para Base64
  private fun drawableToBase64(drawable: Drawable): String {
    try {
      // Converter Drawable para Bitmap
      val bitmap = when (drawable) {
        is BitmapDrawable -> drawable.bitmap
        else -> {
          val width = drawable.intrinsicWidth.takeIf { it > 0 } ?: 48
          val height = drawable.intrinsicHeight.takeIf { it > 0 } ?: 48
          val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
          val canvas = Canvas(bitmap)
          drawable.setBounds(0, 0, canvas.width, canvas.height)
          drawable.draw(canvas)
          bitmap
        }
      }

      // Converter Bitmap para Base64
      val byteArrayOutputStream = ByteArrayOutputStream()
      bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream)
      val byteArray = byteArrayOutputStream.toByteArray()
      return Base64.encodeToString(byteArray, Base64.DEFAULT)
    } catch (e: Exception) {
      android.util.Log.e("InstalledAppsModule", "Erro ao converter ícone para Base64", e)
      return ""
    }
  }

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
        
        // Usar a nova lógica de filtragem
        val userApps = installedApps.filter { app ->
          shouldIncludeApp(app, packageManager)
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
          
          // Obter o ícone do aplicativo
          val icon = try {
            val drawable = packageManager.getApplicationIcon(appInfo)
            drawableToBase64(drawable)
          } catch (e: Exception) {
            android.util.Log.e("InstalledAppsModule", "Erro ao obter ícone para $packageName", e)
            ""
          }
          
          android.util.Log.d("InstalledAppsModule", "App processado: $appName ($packageName)")
          
          // Criar objeto com as informações do aplicativo
          mapOf(
            "packageName" to packageName,
            "appName" to appName,
            "versionName" to versionName,
            "icon" to icon
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
