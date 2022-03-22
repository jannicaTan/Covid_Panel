// 引入图表
// 使用立即执行函数防止变量污染
(function() {
    // 1实例化对象
    var myChart = echarts.init(document.querySelector(".bar .chart"));
    // 2. 指定配置项和数据
    var option = {
      color: ["#2f89cf"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "line" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      // 修改图表的大小
      grid: {
        left: "0%",
        top: "10px",
        right: "0%",
        bottom: "4%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          data: [
            "旅游行业",
            "教育培训",
            "游戏行业",
            "医疗行业",
            "电商行业",
            "社交行业",
            "金融行业"
          ],
          axisTick: {
            alignWithLabel: true
          },
          // 修改刻度标签 相关样式
          axisLabel: {
            color: "rgba(255,255,255,.6) ",
            fontSize: "12"
          },
          // 不显示x坐标轴的样式
          axisLine: {
            show:false
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          // 修改刻度标签 相关样式
          axisLabel: {
            color: "rgba(255,255,255,.6) ",
            fontSize: 12
          },
          // y轴的线条改为了 2像素
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)",
              width: 3
            }
          },
          // y轴 分割线 的颜色
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)"
            }
          }
        }
      ],
    //   修改圆柱样式
      series: [
        {
          name: "直接访问",
          type: "bar",
          barWidth: "35%",//圆柱宽度
          data: [200, 300, 300, 900, 1500, 1200, 600],
          itemStyle: {
            // 修改柱子圆角
            barBorderRadius: 5
          }
        }
      ]
    };
    // 3. 把配置项给实例对象
    myChart.setOption(option);
    // // 4. 让图表跟随屏幕自动的去适应
    // window.addEventListener("resize", function() {
    //   myChart.resize();
    // });
    window.addEventListener('resize',function(){
        myChart.resize();
    })
  })();