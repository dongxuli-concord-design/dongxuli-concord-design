class _XcServerTask {
  constructor({ws, taskType, request = null, maxTime = 1000 * 60 * 30}) {
    this.taskID = uuidv4();
    this.ws = ws;
    this.taskType = taskType;
    this.request = request;
    this.processor = null;
    this.result = null;
    this.isClaimed = false;
    this.maxTime = maxTime;
  }
}

class _XcServerTaskProcessor {
  constructor({ws, taskType}) {
    this.ws = ws;
    this.taskType = taskType;
  }
}

class XcServerWebSocketTaskServer {
  static taskPool = [];
  static taskProcessorPool = [];

  static * run() {
    const {ws, message} = yield;
    try {
      const messageObject = JSON.parse(message);
      if (!messageObject.messageType) {
        ws.close();
        console.error('Invalid request.');
        return;
      }
    } catch (error) {
      console.error('Internal error.');
      if (ws) {
        ws.close();
      }
    }
  }


  static #assignTask() {
    const updatedTaskProcessorPool = [];

    for (const taskProcessor of XcServerWebSocketTaskServer.taskProcessorPool) {
      const isTaskProcessorUsed = false;

      for (const task of XcServerWebSocketTaskServer.taskPool) {
        if (!task.isClaimed && (task.taskType === taskProcessor.taskType)) {
          taskProcessor.ws.send(JSON.stringify({taskID: task.taskID, request: task.request}), (error) => {
            if (!error) {
              task.processor = taskProcessor;
              task.isClaimed = true;

              setTimeout(() => {
                if (task && task.processor && task.processor.ws) {
                  task.isClaimed = false;
                  task.processor = null;
                }
              }, task.maxTime);
            } else {
              taskProcessor.ws.close();
            }
          });

          isTaskProcessorUsed = true;
          break;
        }
      }

      if (!isTaskProcessorUsed) {
        updatedTaskProcessorPool.push(taskProcessor);
      }
    }

    XcServerWebSocketTaskServer.taskProcessorPool = updatedTaskProcessorPool;
  }

  static #addTask(task) {
    XcServerWebSocketTaskServer.taskPool.push(task);
  }

  static #addTaskProcessor(processor) {
    XcServerWebSocketTaskServer.taskProcessorPool.push(processor);
  }

  static processWebsocketMessage(ws, message) {
    const messageObject = JSON.parse(message);
    if (!messageObject.messageType) {
      console.error('Invalid request.');
      return;
    }

    if (messageObject.messageType == 'newTask') {
      if (!messageObject.taskType) {
        console.error('Invalid taskType');
        return;
      }

      ws.on('close', function close() {
        // Remove tasks and it's processor if task requester closes.
        for (let i = XcServerWebSocketTaskServer.taskPool.length - 1; i >= 0; i -= 1) {
          const task = XcServerWebSocketTaskServer.taskPool[i];
          if (task.ws === ws) {
            XcServerWebSocketTaskServer.taskPool.splice(i, 1);
          }
        }
      });

      const newTask = new _XcServerTask({
        ws: ws,
        taskType: messageObject.taskType,
        request: messageObject.request,
        maxTime: messageObject.maxTime
      });

      XcServerWebSocketTaskServer.#addTask(newTask);
      XcServerWebSocketTaskServer.#assignTask();
    } else if (messageObject.messageType == 'newProcessor') {
      if (!messageObject.taskType) {
        console.error('Invalid request. Expect taskType.');
        return;
      }

      ws.on('close', function close() {
        // Remove the processors and make it's task as unclaimed if it closes
        for (let i = XcServerWebSocketTaskServer.taskProcessorPool.length - 1; i >= 0; i -= 1) {
          const processor = XcServerWebSocketTaskServer.taskProcessorPool[i];
          if (processor.ws === ws) {
            XcServerWebSocketTaskServer.taskProcessorPool.splice(i, 1);
          }
        }

        for (let i = XcServerWebSocketTaskServer.taskPool.length - 1; i >= 0; i -= 1) {
          const task = XcServerWebSocketTaskServer.taskPool[i];
          if (task.processor && (task.processor.ws === ws)) {
            task.isClaimed = false;
            task.processor = null;
          }
        }

        XcServerWebSocketTaskServer.#assignTask();
      });

      const newTaskProcessor = new _XcServerTaskProcessor({
        ws: ws,
        taskType: messageObject.taskType
      });

      XcServerWebSocketTaskServer.#addTaskProcessor(newTaskProcessor);
      XcServerWebSocketTaskServer.#assignTask();
    } else if (messageObject.messageType == 'taskDone') {
      if (!messageObject.taskID) {
        console.error('Invalid taskID.');
        return;
      }

      const result = messageObject.result;
      const taskID = messageObject.taskID;
      const taskIndex = XcServerWebSocketTaskServer.taskPool.findIndex((task)=>{return task.taskID === taskID;});
      if (taskIndex !== -1) {
        const task = XcServerWebSocketTaskServer.taskPool[taskIndex];
        task.ws.send(JSON.stringify({result}), (error) => {
          if (error) {
            console.error('cannot send result back to client.', error);

            task.ws.close();
          }
        });

        XcServerWebSocketTaskServer.taskPool.splice(taskIndex, 1);
      }
    } else {
      console.error('Invalid request.');
    }
  }
}
