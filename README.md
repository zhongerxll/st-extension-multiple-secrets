# st-extension-multiple-secrets

[SillyTavern](https://github.com/SillyTavern/SillyTavern)的客户端第三方扩展，用于同时使用多个密钥，在每次发送消息后自动在给定的密钥列表中切换一次

# 看不懂的，嫌麻烦的，用喵喵脚本的人直接看这个傻瓜式命令，全自动安装

用喵喵脚本的，记得先输入0退出脚本，再输入命令，这个命令会自动寻找酒馆安装路径进行安装，包括服务端插件和客户端扩展，客户端扩展将为现有全部用户进行安装，一行搞定，主打傻瓜式
```bash
cd $(find $PREFIX/.. -type d -name "SillyTavern" -exec bash -c 'git -C {} remote get-url origin | grep -q SillyTavern/SillyTavern && echo {}' \; 2>/dev/null) && sed -i 's@^.*enableServerPlugins.*$@enableServerPlugins: true@' ./config.yaml && cd ./plugins/ && rm -rf ./st-plugin-multiple-secrets && git clone https://github.com/zhongerxll/st-plugin-multiple-secrets && cd .. && find ./data/ -maxdepth 1 -mindepth 1 -type d ! -name '_uploads' ! -name '_storage' -exec bash -c "cd {}/extensions/ && rm -rf st-extension-multiple-secrets && git clone https://github.com/zhongerxll/st-extension-multiple-secrets" \;
```

# 正常安装方法

直接在扩展界面点击安装扩展并填写该链接保存即可，记得配合最下方服务端插件使用
```
https://github.com/zhongerxll/st-extension-multiple-secrets
```

# 需要配合该服务端插件使用

https://github.com/zhongerxll/st-plugin-multiple-secrets
