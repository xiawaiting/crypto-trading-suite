// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
import { exec } from 'shelljs'
import { Result, ResultWithData } from 'src/types'
/***
 * import Docker from 'dockerode';
 * `dockerode`库的导出方式是CommonJS方式，
 * 而ES6语法需要使用`export default`导出，因此需要修改导入方式
 */
import * as Docker from 'dockerode'
import { DockerContainer } from 'src/code-engine/docker.types'
import { success, fail } from './constant'
import {
  ImageType,
  RunningDockerContainersType,
} from 'src/code-engine/code-engine.types'

/*
注意，`silent`参数设置为`true`以禁用命令输出到控制台。

docker inspect -f '{{.State.Status}}' 173063551e6f

- `docker inspect`：用于查看 Docker 容器的详细信息。
- `-f`：用于指定输出格式，即使用格式化字符串输出指定信息。
- `{{.State.Status}}`：格式化字符串，表示输出容器的状态信息。

具体解释如下：
- `{{.State.Status}}`：表示输出容器状态的信息，其中 `.` 表示当前正在查看的对象，即容器对象；
`State` 表示容器状态信息；`Status` 表示容器的状态，
包括：created（已创建）、restarting（重启中）、running（运行中）、paused（已暂停）、exited（已停止）等。
*/

/*
docker inspect -f '{{.State.Status}}' zealous_wozniak
docker inspect -f '{{.State.Status}}' b051cd8df3d969b9d024c92e9c9788ba644503e333fe17019eb651c2d8686910
* */
export function checkContainerStatus(containerName: string): string