 <template>
  <div id="app">
    <el-form style="display:inline-block;float:left;width: 40%;margin-left: 5%; height:600px; padding-top: 120px;" ref="dynamicValidateForm" :model="dataFrom" label-width="200px">
      <el-row>
        <el-col :span="22">
          <el-form-item label="打卡文件:" prop="upload">
            <input type="file" ref="upload" accept=".xls,.xlsx" class="outputlist_upload" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="节假日文件:" prop="download">
            <input type="file" ref="download" accept=".xls,.xlsx" class="outputlist_upload" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item style="margin-left: -200px">
            <el-button style="width: 140px;float: left;margin-left: 120px" size="small" type="primary" plain @click="getFinalReport">提 交 数 据</el-button>
            <el-button style="width: 140px;float: left;margin-left: 20px" size="small" type="warning" plain @click="getF">刷 新 页 面</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <ul style="border-style: dashed;margin-left: 80px; border-width: 0 0 1px 0; border-color: #e0e0e0;padding: 20px 40px 60px 30px;text-align: left; font-size:14px">
          <li>
            <div style="width: 50px; display: inline-block;">
              <img class="picture" src="../N.jpg">
            </div>
            <div style="  display: inline-block;padding-bottom: 10px">
              <span style="font-weight: bold; font-size: 15px;">小贴士&nbsp;</span>
              <div style="border-radius:5px;background-color: #2c2825;width: 47px;height: 80%;display: inherit;"> <span style="color: #DFBA84;letter-spacing:2px; font-size: 12px">&nbsp;&nbsp;VIP</span> </div>
              <br />
              <span class="time">{{gettimeChange}}</span>
            </div>
            <p class="comment">
              1.请点击对应按钮分别上传<span style="color: red"> 加班Excel文件 </span>与
              <span style="color: red"> 节假日Excel文件 </span>。
            </p>
          </li>
          <li>
            <div style="width: 50px; display: inline-block;">
              <img class="picture" src="../N.jpg">
            </div>
            <div style="  display: inline-block;padding-bottom: 10px">
              <span style="font-weight: bold; font-size: 15px;">小贴士&nbsp;</span>
             <br />
              <span class="time">{{gettime}}</span>
            </div>
            <p class="comment">
              2.确认文件无误后点击提交按钮。对应加班时长记录将展示在右侧表格中。
            </p>
          </li>
          <li>
            <div style="width: 50px; display: inline-block;">
              <img class="picture" src="../N.jpg">
            </div>
            <div style="  display: inline-block;padding-bottom: 10px">
              <span style="font-weight: bold; font-size: 15px;">小贴士&nbsp;</span>
              <br />
              <span class="time">{{gettime}}</span>
            </div>
            <p class="comment">
              <span style="color: red"> 注</span>：节假日文件为目录中的<span style="color: red">法定加班日.xls</span>文件。现已记录2019年全年法定加班日和法定节日。如需计算范围更广的加班时长，请在N.excel文件中添加对应时间的
              <span style="color: red">法定加班日</span>和<span style="color: red">法定节日</span>
            </p>
          </li>
          <li>
            <div style="width: 50px; display: inline-block;">
              <img class="picture" src="../N.jpg">
            </div>
            <div style="  display: inline-block;padding-bottom: 10px">
              <span style="font-weight: bold; font-size: 15px;">小贴士&nbsp;</span>
               <br />
              <span class="time">{{gettime}}</span>
            </div>
            <p class="comment" >
              <span style="color: red;display: inline-block">节假日文件添加规则</span>：<br/>
              <span>月份中输入格式为：2019/9</span><br/>
              <span>法定节日中输入格式为：1、5-9(间隔时间用'、'，连续时间用'-')</span><br/>
              <span>法定加班同法定节日格式</span><br/>
              <span style="color: red;">不得修改Excel表头且需按格式输入新数据。否则影响计算。</span><br/>
            </p>
          </li>
        </ul>
      </el-row>
    </el-form>
    <div style="display:inline-block;float:right;width: 40%;margin-right: 5%;height:600px;padding-top: 120px;">
      <el-table :data="workingDay" height="600" style="width: 100%;">
        <el-table-column prop="date" label="上班日期" width="180">
        </el-table-column>
        <el-table-column prop="time" label="下班时间" width="180">
        </el-table-column>
        <el-table-column prop="week" label="星期">
      </el-table-column>
        <el-table-column prop="first" label="一口径时长">
          <template slot-scope="scope">
            <span v-if="scope.row.first !== '-' && parseInt(scope.row.first/60)">{{parseInt(scope.row.first/60) + '小时'}}</span>
            <span v-if="scope.row.first !== '-' && scope.row.first%60">{{scope.row.first%60 + '分钟'}}</span>
            <span v-if="scope.row.first === '-'">{{scope.row.first}}</span>
          </template>
      </el-table-column>
        <el-table-column prop="second" label="二口径时长">
            <template slot-scope="scope">
              <span v-if="scope.row.second !== '-' && parseInt(scope.row.second/60)">{{parseInt(scope.row.second/60) + '小时'}}</span>
              <span v-if="scope.row.second !== '-' && scope.row.second%60">{{scope.row.second%60 + '分钟'}}</span>
              <span v-if="scope.row.second === '-'">{{scope.row.second}}</span>
            </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import {generateFun}  from './api/timeFrame'
export default {
  data () {
    return {
      gettime:'',
      gettimeChange:'',//当前时间
      dataFrom: {
        download: '',
        upload: '',
      },
      workingAllDay: {},  // 一个月工作
      holidaysList: [],
      tripleWageDate:[], // 节假日加班
      workingDay:[], // 工作日加班
      count: 1,
      upHolidays: [],
      holidays: [],
    }
  },
  mounted () {
    this.$refs.upload.addEventListener('change', e => {
      this.readUpExcel(e)
    })
    this.$refs.download.addEventListener('change', e => {
      this.readDownExcel(e)
    })

  },
  created() {
    this.currentTime();
    this.getTime()
  },
  methods: {
    getF(){
      this.$router.go(0)
    },
    currentTime(){
      setInterval(this.getTimeC,500)
    },
    getTime:function(){
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth()+1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
      _this.gettime = yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss;
    },
    getTimeC:function(){
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth()+1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
      _this.gettimeChange = yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss;
    },
    getWeek(date){
      // 标准时间 Wed Jul 31 2019 00:00:00 GMT+0800 (中国标准时间)
      var _date = new Date(date);

      // getDay() 返回表示星期的某一天
      var num = _date.getDay(_date),
        week;
      switch (num) {
        case 0:
          week = "周日";
          break;
        case 1:
          week = "周一";
          break;
        case 2:
          week = "周二"
          break;
        case 3:
          week = "周三"
          break;
        case 4:
          week = "周四"
          break;
        case 5:
          week = "周五"
          break;
        case 6:
          week = "周六"
          break;
        default:
          break;
      };
      return week;
    },
    getholidaysList() {
      //得出节假日数组
      this.holidaysList = this.holidays
      //  排除节假日加班记录
      let objectData = JSON.parse(JSON.stringify(this.workingAllDay))
      let arrayData = this.holidaysList
      let objectDataEX = {}
      Object.keys(this.workingAllDay).forEach(function(key){
        for (var i = 0; i < arrayData.length; i++) {
          if (key === arrayData[i]) {
            objectDataEX[key] = objectData[key]
            delete objectData[key]
          }
        }
      })
      this.tripleWageDate = objectDataEX
      var dataA = []
      var allTime = 0
      var littleTime = 0
      Object.keys(objectData).forEach(function(key){
        var hour = objectData[key].split(':')[0]
        var minute = objectData[key].split(':')[1]
        var time1, time2
        hour = parseInt(hour)
        minute = parseInt(minute)
        if (hour >= 19) {
          time1 = (hour - 19) * 60 + minute
          allTime = allTime + time1
        } else {
          time1 = '-'
        }
        if (hour > 19) {
          time2 = (hour - 19) * 60 + parseInt(minute / 30) * 30
          littleTime = littleTime + time2
        } else {
          time2 = '-'
        }
        dataA.push({date: key, time: objectData[key], first: time1, second: time2})
      })
      for (var i = 0; i < dataA.length; i++) {
        dataA[i]['week'] = this.getWeek(dataA[i]['date'])
        if (dataA[i]['week'] === '周六' || dataA[i]['week'] === '周日') {
          if (this.upHolidays.indexOf(dataA[i]['date'])) {
            dataA[i]['first'] === '-' ? dataA[i]['first'] = 480 : dataA[i]['first'] = 480 + dataA[i]['first']
            dataA[i]['second'] === '-' ? dataA[i]['second'] = 480 : dataA[i]['second'] = 480 + dataA[i]['second']
            allTime = allTime + dataA[i]['first']
            littleTime = littleTime + dataA[i]['second']
          }
        }
      }
      dataA.unshift({date: '总计', time: '-', first: allTime, second: littleTime, week: '-'})
      this.workingDay = dataA

    },
    getFinalReport () {
      this.getholidaysList()
    },
    //处理天
    p(data){
      if (parseInt(data)<10){
        return '0'+data.toString()
      } else {
        return data.toString()
      }
    },
    //处理月
    q(data){
      var a = data.split('/')
      return a[0].toString() + '-' + this.p(a[1]).toString()
    },
    //上班
    readUpExcel(e){
      const files = e.target.files;
      if(files.length<=0){
        return false;
      }else if(!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())){
        this.$Message.error('上传格式不正确，请上传xls或者xlsx格式');
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: 'binary'
          });
          const wsname = workbook.SheetNames[0];//取第一张表
          var persons = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容

        } catch (e) {

          return false;
        }
        let timeData = []
        //获取 工作日期
        for (var timeIndex =0 ;timeIndex<persons.length;timeIndex++){
          if (timeData.indexOf(persons[timeIndex]['刷卡日期']) === -1) {
            timeData.push(persons[timeIndex]['刷卡日期'])
          }
        }
        var para = {}
        for (var day=0;day<timeData.length;day++){
          para[timeData[day]] = []
          for (var j =0 ;j<persons.length;j++)  {
            if (persons[j]['刷卡日期'] === timeData[day]) {
              para[timeData[day]].push(persons[j]['刷卡时间'])
            }
          }
        }
        //取当天最后一次打卡记录为下班时间。（陈先生说不考虑加班至凌晨情况，万岁）
        var finalTimeEveyDay = {}
        for(let key  in para){
          finalTimeEveyDay[key] = para[key][para[key].length-1]
        }
        this.workingAllDay = finalTimeEveyDay
      };
      fileReader.readAsBinaryString(files[0]);
    },
    //节假
    readDownExcel(e) {
      var that = this;
      const files = e.target.files;
      if(files.length<=0){//如果没有文件名
        return false;
      }else if(!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())){
        this.$Message.error('上传格式不正确，请上传xls或者xlsx格式');
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: 'binary'
          });
          const wsname = workbook.SheetNames[0];//取第一张表
          var persons = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
          this.holidaysList = persons
          this.upHolidays = []
          for (var timeIndex =0 ;timeIndex<persons.length;timeIndex++){
            //拼接法定节日
            if (persons[timeIndex]['法定节日']){
              // console.log(persons[timeIndex]['月份']+persons[timeIndex]['法定节日'].toString(),'法定节日')
              if (persons[timeIndex]['法定节日'].indexOf('、') !== -1){
                //  判断是否有1、3-5类型数据
                let arrayOnce = []
                arrayOnce = persons[timeIndex]['法定节日'].split('、')
                for (let Once = 0; Once<arrayOnce.length;Once++){
                  if (arrayOnce[Once].indexOf('-') !== -1){
                    // 3-5类型数据拆分，且拼接
                    let time = generateFun(new Date(this.q(persons[timeIndex]['月份']) + '-' + this.p(arrayOnce[Once].split('-')[0])), new Date(this.q(persons[timeIndex]['月份']) + '-' + this.p(arrayOnce[Once].split('-')[1])));
                    time.push(this.q(persons[timeIndex]['月份']) + '-' + this.p(arrayOnce[Once].split('-')[0]))
                    this.holidays = this.holidays.concat(time)
                  }else {
                    //  1、类型数据拼接
                    this.holidays.push(this.q(persons[timeIndex]['月份']) + '-' + this.p(arrayOnce[Once]))
                  }
                }
              }
              //只有连贯日期
              else if (persons[timeIndex]['法定节日'].indexOf('-') !== -1) {
                // 3-5类型数据拆分，且拼接
                let time = generateFun(new Date(this.q(persons[timeIndex]['月份']) + '-' + this.p(persons[timeIndex]['法定节日'].split('-')[0])), new Date(this.q(persons[timeIndex]['月份']) + '-' + this.p(persons[timeIndex]['法定节日'].split('-')[1])));
                time.push(this.q(persons[timeIndex]['月份']) + '-' + this.p(persons[timeIndex]['法定节日'].split('-')[0]))
                this.holidays = this.holidays.concat(time)
              }else {
                this.holidays.push(this.q(persons[timeIndex]['月份']) + '-' + this.p(persons[timeIndex]['法定节日']))
              }
            }

            //拼接法定加班日
            if (persons[timeIndex]['法定加班']){
              if (persons[timeIndex]['法定加班'].indexOf('、') !== -1){
              //  判断是否有1、3-5类型数据
                var arrayOnce = []
                arrayOnce = persons[timeIndex]['法定加班'].split('、')
                for (var Once = 0; Once<arrayOnce.length;Once++){
                  if (arrayOnce[Once].indexOf('-') !== -1){
                    // 3-5类型数据拆分，且拼接
                    let time = generateFun(new Date(this.q(persons[timeIndex]['月份']) + '-' + this.p(arrayOnce[Once].split('-')[0])), new Date(this.q(persons[timeIndex]['月份']) + '-' + this.p(arrayOnce[Once].split('-')[1])));
                    time.push(this.q(persons[timeIndex]['月份']) + '-' + this.p(arrayOnce[Once].split('-')[0]))
                    this.upHolidays = this.upHolidays.concat(time)
                  }else {
                  //  1、类型数据拼接
                    this.upHolidays.push(this.q(persons[timeIndex]['月份']) + '-' + this.p(arrayOnce[Once]))
                  }
                }
              }
              //只有连贯日期
              else if (persons[timeIndex]['法定加班'].indexOf('-') !== -1) {
                // 3-5类型数据拆分，且拼接
                let time = generateFun(new Date(this.q(persons[timeIndex]['月份']) + '-' + this.p(persons[timeIndex]['法定加班'].split('-')[0])), new Date(this.q(persons[timeIndex]['月份']) + '-' + this.p(persons[timeIndex]['法定加班'].split('-')[1])));
                time.push(this.q(persons[timeIndex]['月份']) + '-' + this.p(persons[timeIndex]['法定加班'].split('-')[0]))
                this.upHolidays = this.upHolidays.concat(time)
              }else {
                this.upHolidays.push(this.q(persons[timeIndex]['月份']) + '-' + this.p(persons[timeIndex]['法定加班']))
              }

            }
          }
          this.holidaysList = this.holidays
        //  拼接节假日数据

        } catch (e) {

          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    }
  }
}
</script>

<style>
  #app {
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
    margin: 0 auto;
    /*background: url("./assets/background.jpg") 0 bottom repeat-x ;*/
    /*background-color: darkgray;*/
  }
  html, body {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  ul {
    list-style-type: none;
  }
  .time{
    color: #999;
    vertical-align: top;
    display: inline-block;
    margin-top: 2px
  }
  .comment{
   margin-top: 5px;
    margin-bottom: 25px;
    padding-left: 50px;
  }
  .picture{
    width: 40px;
    height: 40px;
    border-radius:50%
  }
</style>
