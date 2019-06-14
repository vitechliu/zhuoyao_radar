/*
 * @Author:
 * @Date: 2019-05-11 10:33:56
 * @Last Modified time: 2019-05-11 10:34:28
 * @Desc: task模块，根据搜索中心点坐标和搜索范围，创建需要搜索的单元格列表，每个单元格为一个任务
 * task status:
 *    open: 开启，没有完成的
 *    wait: 正在执行的
 *    close: 已完成的
 */
class RadarTasks {
  constructor(opts) {
    let defaults = {
      lng_range: 0.01795, // 单次查询经度偏移量
      lat_range: 0.013754, // 单次查询纬度偏移量
      lng: null, // 中心点经度
      lat: null, // 中心点维度
      range: 0 // 搜索范围
    };

    this.opts = Object.assign({}, defaults, opts);

    this.LINE_MAX_UNIT = this.opts.range * 2 + 1; // 经纬方向单元格最大数

    this.tasks = [];

    this.initTasks();
    return this;
  }
  /**
   * 初始化
   */
  initTasks() {
    for (let i_lat = 0; i_lat < this.LINE_MAX_UNIT; i_lat++) {
      for (let i_lng = 0; i_lng < this.LINE_MAX_UNIT; i_lng++) {
        let _lat = (i_lat - this.opts.range) * this.opts.lat_range;
        let _lng = (i_lng - this.opts.range) * this.opts.lng_range;

        this.tasks.push({
          taskIndex: this.tasks.length,
          status: 'open',
          taskId: [i_lat, i_lng],
          longitude: this.opts.lng + _lng,
          latitude: this.opts.lat + _lat
        });
      }
    }

    console.log('tasks初始化...', this.tasks);
  }
  /**
   * 获取下一个open状态的任务
   */
  getNextTask() {
    let _task = this.tasks.find(t => {
      return t.status === 'open';
    });
    if (_task) {
      // 将列表中最前面的一个open状态的任务变成wait
      app.buildSearchboxMarker(_task.latitude,_task.longitude,false);
      _task.status = 'wait';
      console.log(`task.${_task.taskIndex} 被领取`, _task);
    }

    return _task;
  }
  /**
   * 重新打开任务
   * @param {*} index
   */
  reopenTask(index) {
    let _task = this.tasks[index];
    if (_task) {
      _task.status = 'open';
      this.tasks[index] = _task;
      console.log(`task.${index} 被重新打开`);
    }
  }
  /**
   * 完成并关闭任务
   * @param {*} index
   */
  finishTask(index) {
    let _task = this.tasks[index];
    if (_task) {
      _task.status = 'close';
      this.tasks[index] = _task;
      console.log(`task.${index} 已完成`);
    }
  }
  /**
   * 是否全部完成
   */
  isComplete() {
    let _task = this.tasks.find(t => {
      return t.status !== 'close';
    });
    console.log('isComplete', _task);

    return !_task;
  }
}

export default RadarTasks;
