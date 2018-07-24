"use strict";

const xmlHelper = require('./lib/xmlHelper.js');

var pluginPath  ='config.xml';

var configData = xmlHelper.readXmlAsJson(pluginPath,true);
var plugins=configData['plugin'];

var umenganalytics="";
var umengkey="";

for (var i = plugins.length - 1; i >= 0; i--) {
  
  if (plugins[i]['name']=="cordova-plugin-jb-umenganalytics") {

     //执行的命令行是cordova platform add ...,会进这里

      umenganalytics=plugins[i];
      umengkey=umenganalytics['variable']['value'];
  }
}

if (umenganalytics=="") {
 //umenganalytics为空说明执行的命令行是cordova plugin add cordova-plugin-jb-umenganalytics,还没写入到config.xml中
   umengkey=process.argv[6].split("=")[1].trim();
}

exports.umengConfig = {

  androidCode:'loadUrl(launchUrl);\n PGCommonSDK.setLogEnabled(true); \n PGCommonSDK.init(this,'+'"' +umengkey+'"'+',"Umeng",UMConfigure.DEVICE_TYPE_PHONE,"");\n MobclickAgent.setSessionContinueMillis(1000);\n MobclickAgent.setScenarioType(this, MobclickAgent.EScenarioType.E_DUM_NORMAL);' ,
  androidMethod:'CordovaActivity\n{\n @Override \n public void onResume() { \n super.onResume(); \n MobclickAgent.onResume(this);} \n\n @Override \n protected void onPause() { \n super.onPause(); \n MobclickAgent.onPause(this);} ' ,
  androidImport:'import com.umeng.analytics.MobclickAgent; \n import com.umeng.commonsdk.UMConfigure; \n import com.umeng.plugin.PGCommonSDK;' ,

  androidCodePart1:'PGCommonSDK.setLogEnabled\\(true\\);' ,


  iosCode:'[[MainViewController alloc] init]; \n [UMConfigure setLogEnabled:YES];\n [UMCommonModule initWithAppkey:@'+'"'+umengkey+'"'+'channel:@"Umeng"]; \n [MobClick setScenarioType:E_UM_NORMAL];' ,
  iosImport:'#import "AppDelegate.h" \n #import "UMCommonModule.h" \n #import <UMCommon/UMCommon.h> \n #import <UMAnalytics/MobClick.h>' ,
  iosCodePart1:'\\[UMConfigure setLogEnabled\\:YES\\];' 

}