<template>
  <div class="nav">
    <!--  分页器 -->
    <nav class="pagination is-centered" role="navigation" aria-label="pagination">
      <ul class="pagination-list">
        <li v-for="(item, idx) in paginationList" :key="item.id">
          <a :class="[(flagItem == item) ? 'is-current': '', 'pagination-link']" aria-label=""
             @click="toggleNavItem(idx, item)" v-if="item > 0">{{item}}</a>
          <!--<span class="pagination-ellipsis" @click="" v-else>&hellip;</span>-->
          <a class="pagination-link" @click="toggleNavItem(idx, item)" v-else>&hellip;</a>
        </li>
      </ul>
      <a class="pagination-previous" @click="prevNavItem"></a>
      <a class="pagination-next" @click="nextNavItem"></a>
    </nav>
  </div>
</template>

<script>
  export default {
    name: "app-navigation",
    data() {
      return {
        paginationList: [1,2,3,4,5,0,20],
        flagItem: 1
      }
    },
    created(){

    },
    methods: {
      //  上一页
      prevNavItem(){
        if(this.flagItem > 1){
          this.flagItem --;
          if(!this.paginationList.includes(this.flagItem)){
            this.paginationList[this.paginationList.length-2] && (this.paginationList[this.paginationList.length-2] = 0);
            if((this.flagItem-2) <= 1){
              this.paginationList =  [1,2,3,4,5,0,this.paginationList[this.paginationList.length-1]]
            }else {
              this.paginationList.splice(2, 3, this.flagItem-2, this.flagItem-1, this.flagItem);
            }
          }
        }

        this.$emit('update-data');
      },
      //  下一页
      nextNavItem(){
        if(this.flagItem < this.paginationList[this.paginationList.length-1]){
          this.flagItem ++;
          if(!this.paginationList.includes(this.flagItem)){
            this.paginationList[1] && (this.paginationList[1] = -1);
            let _selfPaginationIndex = this.paginationList.length-1;
            if((this.flagItem+2) >= this.paginationList[_selfPaginationIndex]){
              this.paginationList = [1,-1,this.paginationList[_selfPaginationIndex]-4,this.paginationList[_selfPaginationIndex]-3,this.paginationList[_selfPaginationIndex]-2,this.paginationList[_selfPaginationIndex]-1,this.paginationList[_selfPaginationIndex]];
            }else{
              this.paginationList.splice(2, 3, this.flagItem, this.flagItem+1, this.flagItem+2);
            }
          }
        }

        this.$emit('update-data');
      },
      //  切换分页
      toggleNavItem(idx, item){
        if(item > 0){
          this.flagItem = item
        }else if(item < 0){
          this.paginationList[this.paginationList.length-2] && (this.paginationList[this.paginationList.length-2] = 0);

          let _selfEndRound = this.paginationList[idx+1];
          if((_selfEndRound-3) <= 1){
            this.paginationList =  [1,2,3,4,5,0,this.paginationList[this.paginationList.length-1]]
          }else {
            this.paginationList.splice(2, 3, _selfEndRound-3, _selfEndRound-2, _selfEndRound-1);
          }
          this.flagItem = this.paginationList[4]

        }else if(item == 0){
          this.paginationList[1] && (this.paginationList[1] = -1);

          let _selfBeginRound = this.paginationList[idx-1];
          let _selfPaginationIndex = this.paginationList.length-1;
          if((_selfBeginRound+3) >= this.paginationList[_selfPaginationIndex]){
            this.paginationList = [1,-1,this.paginationList[_selfPaginationIndex]-4,this.paginationList[_selfPaginationIndex]-3,this.paginationList[_selfPaginationIndex]-2,this.paginationList[_selfPaginationIndex]-1,this.paginationList[_selfPaginationIndex]];
          }else{
            this.paginationList.splice(2, 3, _selfBeginRound+1, _selfBeginRound+2, _selfBeginRound+3);
          }
          this.flagItem = this.paginationList[2]
        }

        this.$emit('update-data');

      },
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  @media screen and #{$touch-width}{
    .nav{
      .pagination{
        .pagination-list{
          width: 100%;
        }
      }
    }
  }

  .nav{
    margin-top: 24px;
    padding: 24px 8px;
    .pagination{
      justify-content: flex-start;
      .pagination-previous{
        background-color: $b1;
        @include bg-image('~assets/image/icon/global_icon_list_left.png', 6px, 12px, center);
        &:hover{
          border-color: $t4;
        }
      }
      .pagination-list{
        flex-grow: 0;
      }
      .pagination-next{
        background-color: $b1;
        @include bg-image('~assets/image/icon/global_icon_list_arrow.png', 6px, 12px, center);
        &:hover{
          border-color: $t4;
        }
      }
    }
  }
  .pagination-link{
    background-color: $b1;
    border-color: $b1;
    color: $t2;
    &:hover{
      border-color: $t4;
    }
  }
  .is-current{
    background-color: $t4;
    border-color: $t4;
    color: $t1;
  }
</style>
