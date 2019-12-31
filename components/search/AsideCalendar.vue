<template>

  <div class="calendar">
    <div class="week is-hidden-desktop">
      <ul class="week-items">
        <li v-for="(week, idw) in calendar.weekdaysMin" :key="week.id">{{week}}</li>
      </ul>
    </div>
    <ul class="body">
      <li v-for="(item, idx) in calendar.items" :key="item.id" v-show="modeType(idx)"><!--  "flagMonth == idx"  -->
        <div class="title is-hidden-touch">
          <button type="button" class="prev" @click="prevMonth(idx)" v-if="flagMonth == idx"></button>
          <p v-else></p>
          <h5>{{item.title}}</h5>
          <button type="button" class="next" @click="nextMonth(idx)" v-if="(flagMonth+1) == idx"></button>
          <p v-else></p>
        </div>
        <div class="main">
          <div class="week is-hidden-touch">
            <ul class="week-items">
              <li v-for="(week, idw) in calendar.weekdaysMin" :key="week.id">{{week}}</li>
            </ul>
          </div>
          <div class="days">
            <h5 class="is-hidden-desktop">{{item.title}}</h5>
            <ul class="days-items">
              <li class="" v-for="(prev, ids) in item.startDay" :key="prev.id"></li>
              <li class="" v-for="(days, id) in item.itemDay" :key="days.id"
                  @click="getSelectDate(idx, days, item.year, item.month, id+1)" :class="days.style">
                <span class="date">{{id+1}}</span>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>

</template>

<script>
  import { mapState } from 'vuex'
  import dayjs from 'dayjs'

  const locale = {
    name: 'zh-cn',
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    ordinal: n => `${n}日`,
    relativeTime: {
      future: '%s内',
      past: '%s前',
      s: '几秒',
      m: '1 分钟',
      mm: '%d 分钟',
      h: '1 小时',
      hh: '%d 小时',
      d: '1 天',
      dd: '%d 天',
      M: '1 个月',
      MM: '%d 个月',
      y: '1 年',
      yy: '%d 年'
    }
  };

  export default {
    name: "aside-calendar",
    props:{
      i18n: {
        type: Object,
        request: true,
        default: () => locale
      },
    },
    data(){
      return{
        //  当前日历显示的月份（对应下标）
        flagMonth:0,

        /**
         *  选中的起始日期（私有）
         * */
        beginDate: {
          monthId: undefined,
          dayId: undefined,
          date:undefined
        },
        endDate: {
          monthId: undefined,
          dayId: undefined,
          date:undefined
        },

        /**
         * 日历信息
         * */
        calendar:{
          weekdaysMin:this.i18n.weekdaysMin,
          nowYear:undefined, //  当前年份
          nowMonth:undefined,  //  当前月份
          nowDate:undefined, //  当前日期
          // nowDay:undefined,    // 当前星期

          //  日历详情对象
          items:[]
        },

      }
    },
    watch: {

    },
    created(){
      dayjs.locale(this.i18n, null, true);
      this.calendar.nowYear = dayjs().year();
      this.calendar.nowMonth = dayjs().month()+1;
      this.calendar.nowDate = dayjs().date();
      // this.calendar.nowDay = dayjs().day();

    },
    mounted(){
      this.setCalendar();
    },
    computed: {
      ...mapState({
        deviceType: 'deviceType'
      }),
    },
    methods: {
      modeType(idx) {
        if(this.deviceType.type == 3){
          if(this.flagMonth == idx || (this.flagMonth+1) == idx){
            return true
          }
        }else if(this.deviceType.type == 4 || this.deviceType.type == 5){
          return true
        }
        return false
      },
      //  生成一年的日历
      setCalendar(){
        let [_selfCalendar, _selfYear, _selfMonth] = [[], this.calendar.nowYear, this.calendar.nowMonth];
        let itemsArr = new Array(12).fill({});
        for(let [idx, value] of itemsArr.entries()){

          value = {
            year: _selfYear,
            month: _selfMonth,
            title : `${_selfYear}年${_selfMonth}月`,
            startDay : dayjs(`${_selfYear}-${_selfMonth}-${1}`).day(),  //  该月第一天是周几
            totalDay : dayjs(`${_selfYear}-${_selfMonth}`).daysInMonth(), //  该月总天数
            itemDay : []
          };

          let dayArr = new Array(value.totalDay);
          for(let [ids, item] of dayArr.entries()){

            item = {
              style: undefined,
              day: undefined
            };
            if(idx == 0 && ids+1 < this.calendar.nowDate){
              item.style = 'disable';
              item.day = {}
            }
            value.itemDay.push(item)
          }
          _selfCalendar.push(value);

          //  遍历日历
          _selfMonth ++ ;

          if(_selfMonth > 12){
            _selfYear++;
            _selfMonth -= 12
          }
        }
        this.calendar.items = _selfCalendar;
      },
      //  上个月
      prevMonth(idx) {
        idx && this.flagMonth --
      },
      //  下个月
      nextMonth(idx) {
        (idx < 11) && this.flagMonth ++
      },
      //  选择时间
      getSelectDate(idx, days, year, month, date) {
        let { style, day } = days;
        if(style !='disable' && style !='forbidden'){
          let _selfSelectDate = `${year}-${month}-${date}`;
          _selfSelectDate = dayjs(_selfSelectDate).format('YYYY-MM-DD');

          //  当前时间为结束时间
          if(this.beginDate.date && !this.endDate.date && dayjs(_selfSelectDate).isAfter(dayjs(this.beginDate.date)) ){
            this.endDate = {
              monthId: idx,
              dayId: date-1,
              date: _selfSelectDate
            };
            //  选择了同一个月份
            if(this.beginDate.monthId == this.endDate.monthId){
              let _selfLength = this.endDate.dayId-this.beginDate.dayId;
              let _selfItemsArr = new Array(_selfLength);
              for (let index of _selfItemsArr.keys()) {
                if(index > 0){
                  this.calendar.items[this.beginDate.monthId].itemDay[this.beginDate.dayId+index].style = 'item-select-round';
                }
              }
            }else{  //  选择了不同月份

              //  当前开始月份剩余的天数
              for (let [index, elem] of this.calendar.items[this.beginDate.monthId].itemDay.entries()) {
                if(index > this.beginDate.dayId){
                  elem.style = 'item-select-round';
                }
              }
              for (let [indexMonth, itemsMonth] of this.calendar.items.entries()) {
                if(this.beginDate.monthId < indexMonth && this.endDate.monthId > indexMonth){
                  for (let elem of itemsMonth.itemDay.values()) {
                    elem.style = 'item-select-round';
                  }
                }
              }
              //  当前结束月份剩余的天数
              for (let [index, elem] of this.calendar.items[this.endDate.monthId].itemDay.entries()) {
                if(index < this.endDate.dayId){
                  elem.style = 'item-select-round';
                }
              }

            }
            this.calendar.items[this.beginDate.monthId].itemDay[this.beginDate.dayId].style = 'item-select-left';

            this.calendar.items[this.endDate.monthId].itemDay[this.endDate.dayId].style = 'item-select-right';

            let _selfDayCount = `共${dayjs(this.endDate.date).diff(dayjs(this.beginDate.date), 'day')}晚`;
            this.$emit('check-in-date', this.beginDate.date, this.endDate.date, _selfDayCount);

          }else{  //  当前时间为起始时间

            //  当前选中时间在上次开始时间之前
            if(this.beginDate.date && dayjs(_selfSelectDate).isBefore(dayjs(this.beginDate.date))){
              this.calendar.items[this.beginDate.monthId].itemDay[this.beginDate.dayId].style = undefined;
            }

            //  选择了同一个月份
            if(this.endDate.date){
              if(this.beginDate.monthId == this.endDate.monthId){
                let _selfLength = this.endDate.dayId-this.beginDate.dayId+1;
                let _selfItemsArr = new Array(_selfLength);
                for (let index of _selfItemsArr.keys()) {
                  this.calendar.items[this.beginDate.monthId].itemDay[this.beginDate.dayId+index].style = undefined;
                }
              }else{  //  选择了不同月份

                //  当前开始月份剩余的天数
                for (let [index, elem] of this.calendar.items[this.beginDate.monthId].itemDay.entries()) {
                  if(index >= this.beginDate.dayId){
                    elem.style = undefined;
                  }
                }
                for (let [indexMonth, itemsMonth] of this.calendar.items.entries()) {
                  if(this.beginDate.monthId < indexMonth && this.endDate.monthId > indexMonth){
                    for (let elem of itemsMonth.itemDay.values()) {
                      elem.style = undefined;
                    }
                  }
                }
                //  当前结束月份剩余的天数
                for (let [index, elem] of this.calendar.items[this.endDate.monthId].itemDay.entries()) {
                  if(index <= this.endDate.dayId){
                    elem.style = undefined;
                  }
                }
              }
            }

            this.beginDate = {
              monthId: idx,
              dayId: date-1,
              date: _selfSelectDate
            };
            this.endDate = {
              monthId: undefined,
              dayId: undefined,
              date: undefined
            };
            this.calendar.items[this.beginDate.monthId].itemDay[this.beginDate.dayId].style = 'item-select';

            this.$emit('check-in-date', this.beginDate.date, this.endDate.date, undefined);

            //  限制最短入住天数
          }
        }
      },
      //  清除日历选中样式
      clearDayStyle(){
        if(this.beginDate.date && this.endDate.date){ //  同时选中了起始和结束时间
          if(this.beginDate.monthId == this.endDate.monthId){ //  月份相同
            let _selfLength = this.endDate.dayId-this.beginDate.dayId+1;
            let _selfItemsArr = new Array(_selfLength);
            for (let index of _selfItemsArr.keys()) {
              this.calendar.items[this.beginDate.monthId].itemDay[this.beginDate.dayId+index].style = undefined;
            }
          }else{  //  月份不同
            //  当前开始月份剩余的天数
            for (let [index, elem] of this.calendar.items[this.beginDate.monthId].itemDay.entries()) {
              if(index >= this.beginDate.dayId){
                elem.style = undefined;
              }
            }
            for (let [indexMonth, itemsMonth] of this.calendar.items.entries()) {
              if(this.beginDate.monthId < indexMonth && this.endDate.monthId > indexMonth){
                for (let elem of itemsMonth.itemDay.values()) {
                  elem.style = undefined;
                }
              }
            }
            //  当前结束月份剩余的天数
            for (let [index, elem] of this.calendar.items[this.endDate.monthId].itemDay.entries()) {
              if(index <= this.endDate.dayId){
                elem.style = undefined;
              }
            }
          }

          this.beginDate = {
            monthId: undefined,
            dayId: undefined,
            date: undefined
          };
          this.endDate = {
            monthId: undefined,
            dayId: undefined,
            date: undefined
          };
        }else{  //  只选中了起始时间
          this.calendar.items[this.beginDate.monthId].itemDay[this.beginDate.dayId].style = undefined;
          this.beginDate = {
            monthId: undefined,
            dayId: undefined,
            date: undefined
          };
        }
      }
    },

  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  @media screen and #{$desktop-width}{
    .calendar {
      .body{
        display: flex;
      }
      .title {
        display: flex;
        justify-content: space-between;
        >button{
          width: 36px;
          height: 36px;
        }
        .prev{
          @include bg-image('~assets/image/icon/global_icon_swiper_arrow_left.png', 36px, 36px)
        }
        .next{
          @include bg-image('~assets/image/icon/global_icon_swiper_arrow_right.png', 36px, 36px)
        }
        >h5{
          @include font-style(18px, 36px)
        }
      }
      .main {
        display: flex;
        flex-direction: column;
        .days {
          .days-items {
            > li {
              width: 48px !important;
              height: 48px !important;
              &:hover {
                cursor: pointer;
              }
              /*  不可选 */
              &.disable {
                &:hover {
                  cursor: default;
                }
              }
              &.forbidden {
                &:hover {
                  cursor: default;
                }
              }
            }
          }
        }
      }
      .week{
        .week-items{
          margin-bottom: 16px;
          >li{
            width: 48px;
            text-align: center;
          }
        }
      }
    }

  }



  @media screen and #{$touch-width}{
    .calendar{
      height: calc(100vh - 179px);
      .body{
        overflow-y: scroll;
        .main{
        }
      }
      .week{
        border-bottom: 1px solid $b3;
        .week-items{
          padding: 1rem 0;
        }
      }
    }
  }

  .calendar{
    display: flex;
    flex-direction: column;
    .main{
    }
    .week{
      .week-items{
        display: flex;
        justify-content: space-around;
        >li{
          @include font-style(14px, $color:$t2)
        }
      }
    }
    .body{
      .main{
        .days{
          >h5{
            padding: 0 16px;
          }
          .days-items{
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 24px;
            >li{
              position: relative;
              width: calc(100% / 7);
              height: 0;
              padding-bottom: calc(100% / 7);
              margin: 2px 0;
              >span{
                left: 50%;
                transform: translateX(-50%);
                position: absolute;
                display: inline-block;
                &.activity{
                  top: 2px;
                  padding: 2px;
                  background-color: $t5;
                  white-space:nowrap;
                  border-radius: 2px;
                  @include font-style(8px, 10px, $color:$b0);
                }
                &.date{
                  top: 18px;
                  @include font-style(14px);
                }
                &.price{
                  bottom: 6px;
                  @include font-style(8px, 10px);
                }
              }
              /*  不可选 */
              &.disable{
                >span{
                  color: $t3 !important;
                }
              }
              &.forbidden{
                >span{
                  text-decoration: line-through;
                  text-decoration-color:$t3;
                  color: $t3 !important;
                }
              }
              &.item-select{
                border-radius: 50%;
                background-color: $t4;
              }
              &.item-select-left{
                border-top-left-radius: 50%;
                border-bottom-left-radius: 50%;
                background-color: $t4;
              }
              &.item-select-right{
                border-top-right-radius: 50%;
                border-bottom-right-radius: 50%;
                background-color: $t4;
              }
              &.item-select-round{
                background-color: $t4-0;
              }
            }

          }
        }
      }
    }
  }
</style>

