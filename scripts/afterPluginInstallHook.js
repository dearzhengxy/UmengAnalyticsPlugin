var path = require('path');
var fs = require('fs');
var configPath = "";

const {
  appConfig,
  ctxEnvConfig,
  umengConfig
} = require("../app.conf");


console.log("afterPluginInstallHook Called");

//向安卓平台添加代码
replaceStringInFile('platforms/android/app/src/main/java/com/goldrock/xyd/MainActivity.java',"android");

//向IOS平台添加代码
replaceStringInFile('platforms/ios/小银袋/Classes/AppDelegate.m',"ios");

function replaceStringInFile(fileAbsolutePath, platform) {

  if (fs.existsSync(fileAbsolutePath)) {
    //检查文件是否存在
    var checkdata = fs.readFileSync(fileAbsolutePath, 'utf8');

    if (platform == "ios") {
      if (checkdata.match(umengConfig['iosCodePart1']) == null) {
         //之前没有添加过，就去添加
        replace_string_in_file(fileAbsolutePath, "\\[\\[MainViewController alloc\\] init\\];", umengConfig['iosCode']);
        replace_string_in_file(fileAbsolutePath, '#import "AppDelegate.h"', umengConfig['iosImport']);
      }
    } else if (platform == "android") {
      if (checkdata.match(umengConfig['androidCodePart1']) == null) {
        //之前没有添加过，就去添加
        replace_string_in_file(fileAbsolutePath, "loadUrl\\(launchUrl\\);", umengConfig['androidCode']);
        replace_string_in_file(fileAbsolutePath, /CordovaActivity\s*\{/gi, umengConfig['androidMethod']);

        replace_string_in_file(fileAbsolutePath, /package\s*com.goldrock.xyd;/gi, "package com.goldrock.xyd;\n"+umengConfig['androidImport']);

      }
    }
  } else {
    console.log("missing: " + fileAbsolutePath);
  }
}

function replace_string_in_file(filename, to_replace, replace_with) {
  var data = fs.readFileSync(filename, 'utf8');
  var result = data.replace(data.match(to_replace)[0], replace_with);
  fs.writeFileSync(filename, result, 'utf8');
}