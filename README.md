2020.03.05 晴

代码基本已经完善了，平常就修修改改，偶尔替换替换接口参数，增加点小功能

不用太花时间去维护了

这一轮下来，总结下来就是，学有所成！

---------------------------------------------
2020.02.17 晴

到公司开工第一天，把远程办公修改的代码提交一下

主要就是redis操作界面 把公共事件的增删改查重新做了一版

用表格方式进行展示

---------------------------------------------

2020.2.11 小雨

开工第二天，更新一下之前一个比较严重的性能问题： 查询数据过大导致浏览器性能消耗过大，渲染直接将浏览器卡死

主要问题点是 将太多的处理函数写到了表格 单元格 cellstyle中，导致每个单元格都要执行一轮好几个循环

打印console.log 发现查个几十条数据 要执行好几万 十几万次 那个函数 性能不出问题才怪 - -！

现在只有修改之后只有if语句，不再有 for 循环的嵌套

巨大幅度提升了性能，查1K条数据也非常简单

------------------------------------------------
2020.01.21 小雨

赶在春节前把vue-cli 搭建完成了，过程很曲折！但是收获也很多

把之前的功能都完整的移植了上去

脚手架还是蛮好用的，配置清晰，只要搞懂了一些配置项以及它本身的一些设置

后面写vue文件，就变得简单了

代码之前也是vue版本，直接替换到对应的文件夹也就完成移植工作啦

等过完年回来 发布到线上看看效果，以及后续还有一些优化吧，那都是后事了~

之后可能要重新回去学习Test相关的技术了，比如一些自动化的方面

希望能越来越强吧~ 共勉

------------------------------------------------
2020.01.19 晴

尝试使用Vue-Cli方式构建前端功能

依然使用的UI框架还是ElementUI

通过几天的调试和学习 （脚手架配置也太多了，晕）

暂时把登录界面给调通了！后面的继续努力！！！

另外，因为插件库node_modules里的文件太多了，就不上传了 - -
