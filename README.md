<center>

![linux](https://img.shields.io/badge/linux-01226?logo=linux&logoColor=white)
![windows](https://img.shields.io/badge/windows-0078D6?logo=windows&logoColor=white)

![GitHub Stars](https://img.shields.io/github/stars/XiaoTangr/CS-Assistant)
![GitHub License](https://img.shields.io/github/license/XiaoTangr/CS-Assistant)
![GitHub release](https://img.shields.io/github/v/release/XiaoTangr/CS-Assistant)
![Github Action](https://github.com/XiaoTangr/CS-Assistant/actions/workflows/Dev_build.yaml/badge.svg?branch=Dev)
<!-- ![Github Action](https://github.com/XiaoTangr/CS-Assistant/actions/workflows/Release_build.yaml/badge.svg?branch=Release) -->

<!-- ![VSCode](https://img.shields.io/badge/VSCode-007ACC?logo=visual-studio-code&logoColor=white) -->
![Rust](https://img.shields.io/badge/Rust-000000.svg?logo=rust&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC.svg?logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-43853D.svg?logo=node.js&logoColor=white)
![VueJS](https://img.shields.io/badge/Vue.js-35495e.svg?logo=vue.js&logoColor=4FC08D)
![sqlite](https://img.shields.io/badge/sqlite-07405e.svg?logo=sqlite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26.svg?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6.svg?logo=css3&logoColor=white)

</center>


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

   - 构建指定应用,其中appname为应用名

        此处为app 或者 doc

    ``` bash
    pnpm turbo run build --filter = $appName
    ```

   - 构建全部

    ``` bash
    # 项目根目录
    pnpm run turbo build
    ```

构建产物参阅对应应用的`Readme.mc`
