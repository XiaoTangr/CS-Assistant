## CS Assistant

如你所见，这玩意可以方便你处理一些和CS有关的问题。


### 一、安全性

本软件完全开源，不收集任何用户数据（PS：本软件连在线数据都放在github上）

本软件不对 CS 和 steam 的软件（包括bin和动态链接库）进行任何修改，软件内部展现的steam用户数据和cs数据均从本机获取。

本软件不需要任何steam账号权限，无需为本软件授权。


### 三、自行构建

1. 所需环境：
    - node.js >= 18.0.0
    - pnpm
    - rust 
    - msvc C++ x86_64 build tools

2. 克隆项目
    ``` bash
    git clone https://github.com/XiaoTangr/CS-Assistant.git

    # 切换到Dev分支（可选，提供最新代码）
    git branch Dev origin/Dev

    cd cs-assistant

    ```

3. 依赖安装
    ``` bash
    pnpm install
    ```

4. 构建
   1. 仅构建软件
    ``` bash
    cd ./apps/app
    pnpm run tauri build
    ```

   2. 构建软件和文档
   
    ``` bash
    # 项目根目录
    pnpm run turbo build
    ```


构建产物位于
