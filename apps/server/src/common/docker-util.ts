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
export function checkContainerStatus(containerName: string): string {
  if (!containerName) {
    return 'NoSuchObject'
  }
  const command = `docker inspect -f '{{.State.Status}}' ${containerName}`
  const result = exec(command, { silent: true })
  if (result.code !== 0) {
    console.error(`Error executing command: ${result.stderr}`)
    return 'NoSuchObject'
  }

  console.log(`Container ${containerName} is ${result.stdout.trim()}`)
  return result.stdout.trim()
}

export async function writeCodeFile(
  path: string,
  data: string,
): Promise<Result> {
  console.log('final path:', path)
  try {
    await fs.promises.writeFile(path, data)
    console.log(`File ${path} has been written successfully.`)
    return {
      code: success,
      msg: `File ${path} has been written successfully.`,
    }
  } catch (error) {
    console.error(`Error writing file: ${error}`)
    return {
      code: fail,
      msg: `Error writing file: ${error}`,
    }
  }
}

/*
筛选出名称为`containerName`的Docker容器，如果容器正在运行，则输出字符串`"running"`，否则输出字符串`"stopped"`。
1. `-q`选项：只返回容器ID，而不是完整的容器信息。
2. `-f "id=containerName"`选项：筛选出名称为`containerName`的容器。
3. `|`管道符：将上一步的结果输出到下一步的命令中。
4. `grep -q .`：使用grep命令查找结果中是否存在任何字符。`-q`选项表示只返回状态码，不输出匹配的结果。
5. `&&`逻辑运算符：如果上一步的命令返回状态码为0（即存在字符），则执行下一条命令。
6. `echo "running"`：输出字符串`"running"`。
7. `||`逻辑运算符：如果上一步的命令返回状态码不为0（即不存在字符），则执行下一条命令。
8. `echo "stopped"`：输出字符串`"stopped"`。
*/
export function isDockerContainerStopped(containerName: string): boolean {
  const cmd = `docker ps -q -f "id=${containerName}" | grep -q . && echo "running" || echo "stopped"`
  const result = exec(cmd, { silent: true })
  return result.stdout.trim() === 'stopped'
}

export function getRunningDockerContainers(): RunningDockerContainersType[] {
  const runningContainers = exec(
    'docker ps --format "{{.ID}}|{{.Names}}|{{.Image}}"',
    { silent: true },
  )
    .stdout.trim()
    .split('\n')

  const containers = []

  runningContainers.forEach((container) => {
    const [id, name, image] = container.split('|')
    containers.push({
      id,
      name,
      image,
    })
  })

  return containers
}

/*
docker stop zealous_wozniak
* */
export function stopDockerContainer(containerId: string): boolean {
  if (!containerId) {
    console.log('Docker container is null')
    return false
  }

  const result = exec(`docker stop ${containerId}`)
  console.log('stopDockerContainer-1:', result)
  console.log('stopDockerContainer-2:', result.code)

  if (result.code !== 0) {
    console.log(`Error stopping Docker container ${containerId}`)
    console.log(result.stderr)
    return false
  }

  console.log(`Docker container ${containerId} stopped`)
  return true
}

// 启动已有容器
export function startContainer(containerId: string): boolean {
  if (!containerId) {
    console.log('Docker container is null')
    return false
  }

  const result = exec(`docker start ${containerId}`)
  console.log('startContainer-result:', result, '--', result.code)
  if (result.code !== 0) {
    console.error('Error: Container start failed.')
    return false
  } else {
    console.log('Container started successfully.')
    return true
  }
}

// Use Image
export async function startC